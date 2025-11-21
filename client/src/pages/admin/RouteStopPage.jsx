// src/pages/admin/RouteStopPage.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Signpost } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { routeStopService } from '../../services/routeStopService';
import { routeService } from '../../services/routeService';
import { busStationService } from '../../services/busStationService';
import { RouteStopModal } from '../../components/admin/RouteStopModal';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const RouteStopPage = () => {
  const [routeStops, setRouteStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Load song song 3 nguồn dữ liệu
      const [stopsData, routesData, stationsData] = await Promise.all([
        routeStopService.getAll(),
        routeService.getAll(),
        busStationService.getAll()
      ]);
      
      // Sort stops: Theo Route ID rồi đến Stop Order
      const sortedStops = (stopsData || []).sort((a, b) => {
        if (a.route_id === b.route_id) {
          return a.stop_order - b.stop_order;
        }
        return a.route_id.localeCompare(b.route_id);
      });

      setRouteStops(sortedStops);
      setRoutes(routesData);
      setStations(stationsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
      setMessage({ type: 'error', text: 'Lỗi tải dữ liệu!' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper Functions
  const getRouteName = (id) => {
    const item = routes.find(r => r.id === id);
    return item ? item.name : '---';
  };

  const getStationName = (id) => {
    const item = stations.find(s => s.id === id);
    return item ? item.name : '---';
  };

  // Search Logic
  const filteredStops = routeStops.filter(item => {
    const term = searchTerm.toLowerCase();
    const routeName = getRouteName(item.route_id).toLowerCase();
    const stationName = getStationName(item.station_id).toLowerCase();
    return (
      routeName.includes(term) ||
      stationName.includes(term)
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa điểm dừng này không?')) {
      try {
        await routeStopService.delete(id);
        setMessage({ type: 'success', text: 'Xóa thành công!' });
        fetchData(); // Refresh list
      } catch (error) {
        setMessage({ type: 'error', text: 'Xóa thất bại!' });
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await routeStopService.update(editingItem.id, formData);
        setMessage({ type: 'success', text: 'Cập nhật thành công!' });
      } else {
        await routeStopService.create(formData);
        setMessage({ type: 'success', text: 'Thêm mới thành công!' });
      }
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Signpost className="text-blue-600" /> Quản lý Điểm dừng (Route Stops)
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Tìm theo tuyến, bến..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              />
            </div>
            
            <div className="w-full md:w-auto">
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2 inline" /> Thêm mới
              </Button>
            </div>
          </div>
        </div>

        {message && (
          <div onClick={() => setMessage(null)} className="cursor-pointer">
            <Alert type={message.type} message={message.text} />
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuyến đường</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ tự</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bến dừng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStops.length > 0 ? (
                    filteredStops.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {getRouteName(item.route_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            {item.stop_order}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getStationName(item.station_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex flex-col text-xs">
                            <span className="text-green-600">Đến: {item.arrival_time}</span>
                            <span className="text-orange-600">Đi: &nbsp;&nbsp;&nbsp;{item.departure_time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500 text-sm">
                         {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có điểm dừng nào.'}
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
          title={editingItem ? 'Cập nhật Điểm dừng' : 'Thêm mới Điểm dừng'}
          routes={routes}
          stations={stations}
        />
      </div>
    </MainLayout>
  );
};