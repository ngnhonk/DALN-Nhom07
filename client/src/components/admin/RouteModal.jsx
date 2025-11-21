// src/components/admin/RouteModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const RouteModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  title, 
  operators = [], 
  stations = [] 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    operator_id: '',
    start_station_id: '',
    end_station_id: '',
    distance_km: '',
    estimated_hours: '',
    active: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          operator_id: initialData.operator_id,
          start_station_id: initialData.start_station_id,
          end_station_id: initialData.end_station_id,
          distance_km: initialData.distance_km,
          estimated_hours: initialData.estimated_hours,
          active: initialData.active
        });
      } else {
        // Reset form
        setFormData({
          name: '',
          operator_id: operators.length > 0 ? operators[0].id : '',
          start_station_id: stations.length > 0 ? stations[0].id : '',
          end_station_id: stations.length > 1 ? stations[1].id : (stations.length > 0 ? stations[0].id : ''),
          distance_km: '',
          estimated_hours: '',
          active: true
        });
      }
      setError('');
    }
  }, [isOpen, initialData, operators, stations]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate: Bến đi và bến đến không được trùng nhau
    if (formData.start_station_id === formData.end_station_id) {
      setError('Điểm đi và Điểm đến không được trùng nhau!');
      setLoading(false);
      return;
    }
    
    // Convert number fields
    const submitData = {
      ...formData,
      distance_km: Number(formData.distance_km),
      estimated_hours: Number(formData.estimated_hours)
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên tuyến đường"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Vd: Hà Nội - Hải Phòng"
              required
            />
            
            {/* Select Operator */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nhà xe vận hành</label>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Station */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đi</label>
              <select
                name="start_station_id"
                value={formData.start_station_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                {stations.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>

            {/* End Station */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đến</label>
              <select
                name="end_station_id"
                value={formData.end_station_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                {stations.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Khoảng cách (Km)"
              name="distance_km"
              type="number"
              step="0.1"
              value={formData.distance_km}
              onChange={handleChange}
              placeholder="0"
              required
            />
            <Input
              label="Thời gian (Giờ)"
              name="estimated_hours"
              type="number"
              step="0.1"
              value={formData.estimated_hours}
              onChange={handleChange}
              placeholder="0"
              required
            />
            
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 font-medium">Đang hoạt động</span>
              </label>
            </div>
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