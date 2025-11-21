// src/components/admin/TripModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const TripModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  title, 
  routes = [], 
  buses = [] 
}) => {
  const [formData, setFormData] = useState({
    route_id: '',
    bus_id: '',
    departure_date: '',
    departure_time: '',
    price: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          route_id: initialData.route_id,
          bus_id: initialData.bus_id,
          departure_date: initialData.departure_date,
          departure_time: initialData.departure_time,
          price: initialData.price
        });
      } else {
        // Reset form
        setFormData({
          route_id: routes.length > 0 ? routes[0].id : '',
          bus_id: buses.length > 0 ? buses[0].id : '',
          departure_date: new Date().toISOString().split('T')[0], // Mặc định hôm nay
          departure_time: '08:00',
          price: 100000
        });
      }
      setError('');
    }
  }, [isOpen, initialData, routes, buses]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = {
      ...formData,
      price: Number(formData.price)
    };

    try {
      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        
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
          
          {/* Select Route */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tuyến đường</label>
            <select
              name="route_id"
              value={formData.route_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">-- Chọn Tuyến --</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Select Bus */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Xe vận hành</label>
            <select
              name="bus_id"
              value={formData.bus_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">-- Chọn Xe --</option>
              {buses.map(b => (
                <option key={b.id} value={b.id}>{b.plate_number} ({b.seat_count} chỗ)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ngày khởi hành"
              name="departure_date"
              type="date"
              value={formData.departure_date}
              onChange={handleChange}
              required
            />
            <Input
              label="Giờ khởi hành"
              name="departure_time"
              type="time"
              step="1"
              value={formData.departure_time}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Giá vé (VNĐ)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="100000"
            required
            min="0"
          />

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