// src/components/admin/RouteStopManager.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { Button } from '../common/Button';
import { routeStopService } from '../../services/routeStopService';
import { RouteStopModal } from './RouteStopModal';

export const RouteStopManager = ({ isOpen, onClose, route, stations = [] }) => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (isOpen && route) {
      fetchStops();
    }
  }, [isOpen, route]);

  const fetchStops = async () => {
    if (!route?.id) return;
    
    setLoading(true);
    try {
      const data = await routeStopService.getByRouteId(route.id);
      
      // Sắp xếp theo thứ tự dừng (stop_order)
      const sortedData = (data || []).sort((a, b) => a.stop_order - b.stop_order);
      setStops(sortedData);
    } catch (error) {
      console.error("Failed to fetch stops:", error);
      setStops([]);
    } finally {
      setLoading(false);
    }
  };

  const getStationName = (id) => {
    const s = stations.find(st => st.id === id);
    return s ? s.name : '---';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa điểm dừng này?')) {
      try {
        await routeStopService.delete(id);
        fetchStops(); // Reload lại danh sách sau khi xóa
      } catch (error) {
        alert('Xóa thất bại');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await routeStopService.update(editingItem.id, formData);
      } else {
        await routeStopService.create(formData);
      }
      fetchStops(); // Reload lại danh sách sau khi lưu
    } catch (error) {
      alert('Lưu thất bại');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Lộ trình chi tiết</h3>
            <p className="text-sm text-blue-600 font-medium">{route?.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <span className="text-sm text-gray-500">Danh sách các điểm dừng theo thứ tự</span>
          <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="w-auto px-4 py-2 text-sm">
            <Plus className="w-4 h-4 mr-2 inline" /> Thêm điểm dừng
          </Button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Đang tải lộ trình...</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-16">Thứ tự</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bến dừng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ đến / đi</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stops.length > 0 ? (
                    stops.map((stop) => (
                      <tr key={stop.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-center">
                          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mx-auto text-sm border border-blue-200">
                            {stop.stop_order}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900 font-medium">{getStationName(stop.station_id)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="grid grid-cols-2 gap-x-4 w-max">
                            <span className="text-gray-500">Đến:</span> <span className="font-medium text-green-600">{stop.arrival_time}</span>
                            <span className="text-gray-500">Đi:</span> <span className="font-medium text-orange-600">{stop.departure_time}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button onClick={() => { setEditingItem(stop); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 p-1">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(stop.id)} className="text-red-600 hover:text-red-900 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-sm">
                        Chưa có điểm dừng nào. Hãy thêm mới.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <RouteStopModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={editingItem}
          title={editingItem ? 'Sửa điểm dừng' : 'Thêm điểm dừng vào tuyến'}
          routes={[route]} 
          stations={stations}
          fixedRouteId={route?.id}
        />

      </div>
    </div>
  );
};