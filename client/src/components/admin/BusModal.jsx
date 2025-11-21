// src/components/admin/BusModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const BusModal = ({ isOpen, onClose, onSubmit, initialData, title, operators = [] }) => {
  const [formData, setFormData] = useState({
    operator_id: '',
    plate_number: '',
    bus_type: 'ghe_ngoi',
    seat_count: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Danh sách loại xe
  const BUS_TYPES = [
    { value: 'giuong_nam', label: 'Giường nằm' },
    { value: 'ghe_ngoi', label: 'Ghế ngồi' },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          operator_id: initialData.operator_id,
          plate_number: initialData.plate_number,
          bus_type: initialData.bus_type,
          seat_count: initialData.seat_count
        });
      } else {
        // Reset form
        setFormData({
          operator_id: operators.length > 0 ? operators[0].id : '',
          plate_number: '',
          bus_type: 'giuong_nam',
          seat_count: 40 // Mặc định số ghế phổ biến
        });
      }
      setError('');
    }
  }, [isOpen, initialData, operators]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Convert seat_count to number
    const submitData = {
      ...formData,
      seat_count: Number(formData.seat_count)
    };

    try {
      await onSubmit(submitData);s
      onClose();
    } catch (err) {
      setError('Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
          
          {/* Select Operator */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Thuộc nhà xe</label>
            <select
              name="operator_id"
              value={formData.operator_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">-- Chọn Nhà xe --</option>
              {operators.map(op => (
                <option key={op.id} value={op.id}>{op.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Biển số xe"
            name="plate_number"
            value={formData.plate_number}
            onChange={handleChange}
            placeholder="Vd: 29B-123.45"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Select Bus Type */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại xe</label>
              <select
                name="bus_type"
                value={formData.bus_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {BUS_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <Input
              label="Số ghế"
              name="seat_count"
              type="number"
              value={formData.seat_count}
              onChange={handleChange}
              placeholder="40"
              required
              min="1"
            />
          </div>

          <div className="flex gap-3 pt-4 justify-end border-t mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading} className="w-32">
              Hủy
            </Button>
            <Button type="submit" loading={loading} className="w-32">
              Lưu lại
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};