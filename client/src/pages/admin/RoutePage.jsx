// src/pages/admin/RoutePage.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Waypoints, Search, ArrowRight, Signpost } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { routeService } from '../../services/routeService';
import { busOperatorService } from '../../services/busOperatorService';
import { busStationService } from '../../services/busStationService';
import { RouteModal } from '../../components/admin/RouteModal';
import { RouteStopManager } from '../../components/admin/RouteStopManager';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const RoutePage = () => {
  const [routes, setRoutes] = useState([]);
  const [operators, setOperators] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  // State cho Modal CRUD Tuyến đường
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // State cho Modal Quản lý Điểm dừng
  const [isStopManagerOpen, setIsStopManagerOpen] = useState(false);
  const [selectedRouteForStops, setSelectedRouteForStops] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [routesData, operatorsData, stationsData] = await Promise.all([
        routeService.getAll(),
        busOperatorService.getAll(),
        busStationService.getAll()
      ]);
      
      setRoutes(routesData || []);
      setOperators(operatorsData || []);
      setStations(stationsData || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      setMessage({ type: 'error', text: 'Lỗi kết nối API!' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStationName = (id) => {
    if (!id) return '---';
    const station = stations.find(s => s.id === id);
    return station ? station.name : 'Unknown ID';
  };

  // --- FIX LỖI CRASH KHI SEARCH ---
  const filteredRoutes = (routes || []).filter(item => {
    const term = searchTerm.toLowerCase();
    const name = (item.name || '').toLowerCase();
    const opName = (item.operator_name || '').toLowerCase();
    
    return name.includes(term) || opName.includes(term);
  });

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tuyến đường này không?')) {
      try {
        await routeService.delete(id);
        setMessage({ type: 'success', text: 'Xóa thành công!' });
        fetchData(); // Reload lại data thay vì set state cục bộ để đảm bảo đồng bộ
      } catch (error) {
        setMessage({ type: 'error', text: 'Xóa thất bại!' });
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await routeService.update(editingItem.id, formData);
        setMessage({ type: 'success', text: 'Cập nhật thành công!' });
      } else {
        await routeService.create(formData);
        setMessage({ type: 'success', text: 'Thêm mới thành công!' });
      }
      fetchData();
    } catch (error) {
      throw error;
    }
  };

  // Hàm mở trình quản lý điểm dừng
  const openStopManager = (route) => {
    setSelectedRouteForStops(route);
    setIsStopManagerOpen(true);
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
            <Waypoints className="text-blue-600" /> Quản lý Tuyến đường
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Tìm tên tuyến, nhà xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Tuyến</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lộ trình</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm dừng</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRoutes.length > 0 ? (
                    filteredRoutes.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500 font-normal">{item.operator_name || '---'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getStationName(item.start_station_id)}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{getStationName(item.end_station_id)}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{item.distance_km} km - {item.estimated_hours} giờ</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => openStopManager(item)}
                            className="inline-flex items-center px-3 py-1 border border-blue-200 text-xs font-medium rounded-full text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                          >
                            <Signpost className="w-3 h-3 mr-1" />
                            Chi tiết
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.active ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Hoạt động
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Tạm dừng
                            </span>
                          )}
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
                         {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có tuyến đường nào.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <RouteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={editingItem}
          title={editingItem ? 'Cập nhật Tuyến đường' : 'Thêm mới Tuyến đường'}
          operators={operators}
          stations={stations}
        />

        {/* Modal Quản lý Điểm dừng */}
        {isStopManagerOpen && (
          <RouteStopManager
            isOpen={isStopManagerOpen}
            onClose={() => setIsStopManagerOpen(false)}
            route={selectedRouteForStops}
            stations={stations}
          />
        )}

      </div>
    </MainLayout>
  );
};