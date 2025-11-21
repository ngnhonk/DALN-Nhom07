// src/components/admin/RouteStopModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const RouteStopModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  title, 
  routes = [], 
  stations = [] 
}) => {
  const [formData, setFormData] = useState({
    route_id: '',
    station_id: '',
    stop_order: '',
    arrival_time: '',
    departure_time: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          route_id: initialData.route_id,
          station_id: initialData.station_id,
          stop_order: initialData.stop_order,
          arrival_time: initialData.arrival_time || '',
          departure_time: initialData.departure_time || ''
        });
      } else {
        // Reset form
        setFormData({
          route_id: routes.length > 0 ? routes[0].id : '',
          station_id: stations.length > 0 ? stations[0].id : '',
          stop_order: 1,
          arrival_time: '00:00',
          departure_time: '00:00'
        });
      }
      setError('');
    }
  }, [isOpen, initialData, routes, stations]);

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
      stop_order: Number(formData.stop_order)
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

          {/* Select Station */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bến dừng</label>
            <select
              name="station_id"
              value={formData.station_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">-- Chọn Bến --</option>
              {stations.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Thứ tự dừng (Stop Order)"
            name="stop_order"
            type="number"
            value={formData.stop_order}
            onChange={handleChange}
            placeholder="1"
            required
            min="1"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giờ đến (Dự kiến)"
              name="arrival_time"
              type="time"
              step="1" // Cho phép nhập giây
              value={formData.arrival_time}
              onChange={handleChange}
              required
            />
            <Input
              label="Giờ đi (Dự kiến)"
              name="departure_time"
              type="time"
              step="1"
              value={formData.departure_time}
              onChange={handleChange}
              required
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