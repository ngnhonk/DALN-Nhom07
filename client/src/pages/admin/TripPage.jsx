// src/pages/admin/TripPage.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CalendarDays, Search } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { tripService } from '../../services/tripService';
import { routeService } from '../../services/routeService';
import { busService } from '../../services/busService';
import { TripModal } from '../../components/admin/TripModal';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const TripPage = () => {
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Gọi song song 3 API
      const [tripsData, routesData, busesData] = await Promise.all([
        tripService.getAll(),
        routeService.getAll(),
        busService.getAll()
      ]);
      
      setTrips(tripsData);
      setRoutes(routesData);
      setBuses(busesData);
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

  // Helper: Map ID to Name
  const getRouteName = (id) => {
    const r = routes.find(item => item.id === id);
    return r ? r.name : '---';
  };

  const getBusInfo = (id) => {
    const b = buses.find(item => item.id === id);
    return b ? b.plate_number : '---';
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Format ngày tháng (cho đẹp)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Client-side Search
  const filteredTrips = trips.filter(item => {
    const term = searchTerm.toLowerCase();
    const routeName = getRouteName(item.route_id).toLowerCase();
    const busPlate = getBusInfo(item.bus_id).toLowerCase();
    const dateStr = item.departure_date;

    return (
      routeName.includes(term) ||
      busPlate.includes(term) ||
      dateStr.includes(term)
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyến xe này không?')) {
      try {
        await tripService.delete(id);
        setMessage({ type: 'success', text: 'Xóa thành công!' });
        const updatedTrips = await tripService.getAll();
        setTrips(updatedTrips);
      } catch (error) {
        setMessage({ type: 'error', text: 'Xóa thất bại!' });
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await tripService.update(editingItem.id, formData);
        setMessage({ type: 'success', text: 'Cập nhật thành công!' });
      } else {
        await tripService.create(formData);
        setMessage({ type: 'success', text: 'Thêm mới thành công!' });
      }
      const updatedTrips = await tripService.getAll();
      setTrips(updatedTrips);
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
            <CalendarDays className="text-blue-600" /> Quản lý Chuyến xe
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Tìm tuyến, biển số, ngày..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe vận hành</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá vé</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                          {getRouteName(item.route_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-medium">{getBusInfo(item.bus_id)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{item.departure_time}</span>
                            <span className="text-xs">{formatDate(item.departure_date)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(item.price)}
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
                         {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có chuyến xe nào.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <TripModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={editingItem}
          title={editingItem ? 'Cập nhật Chuyến xe' : 'Thêm mới Chuyến xe'}
          routes={routes}
          buses={buses}
        />
      </div>
    </MainLayout>
  );
};