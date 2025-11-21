// src/pages/admin/BusPage.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, BusFront } from 'lucide-react'; // Dùng BusFront để khác icon Bus
import { MainLayout } from '../../layouts/MainLayout';
import { busService } from '../../services/busService';
import { busOperatorService } from '../../services/busOperatorService';
import { BusModal } from '../../components/admin/BusModal';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const BusPage = () => {
  const [buses, setBuses] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Gọi song song API Buses và Operators
      const [busesData, operatorsData] = await Promise.all([
        busService.getAll(),
        busOperatorService.getAll()
      ]);
      
      setBuses(busesData);
      setOperators(operatorsData);
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

  // Helper: Lấy tên nhà xe
  const getOperatorName = (id) => {
    const op = operators.find(o => o.id === id);
    return op ? op.name : '---';
  };

  // Helper: Format loại xe đẹp hơn
  const formatBusType = (type) => {
    const types = {
      'giuong_nam': 'Giường nằm',
      'ghe_ngoi': 'Ghế ngồi',
    };
    return types[type] || type;
  };

  // Search Logic
  const filteredBuses = buses.filter(item => {
    const term = searchTerm.toLowerCase();
    const operatorName = getOperatorName(item.operator_id).toLowerCase();
    return (
      item.plate_number.toLowerCase().includes(term) ||
      operatorName.includes(term) ||
      item.bus_type.replace('_', ' ').toLowerCase().includes(term)
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này không?')) {
      try {
        await busService.delete(id);
        setMessage({ type: 'success', text: 'Xóa thành công!' });
        const updatedBuses = await busService.getAll();
        setBuses(updatedBuses);
      } catch (error) {
        setMessage({ type: 'error', text: 'Xóa thất bại!' });
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await busService.update(editingItem.id, formData);
        setMessage({ type: 'success', text: 'Cập nhật thành công!' });
      } else {
        await busService.create(formData);
        setMessage({ type: 'success', text: 'Thêm mới thành công!' });
      }
      const updatedBuses = await busService.getAll();
      setBuses(updatedBuses);
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
            <BusFront className="text-blue-600" /> Quản lý Xe khách
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Tìm biển số, nhà xe..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biển số xe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà xe sở hữu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại xe</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số ghế</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBuses.length > 0 ? (
                    filteredBuses.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                          {item.plate_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getOperatorName(item.operator_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
                            {formatBusType(item.bus_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          {item.seat_count}
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
                         {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu xe.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <BusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={editingItem}
          title={editingItem ? 'Cập nhật Xe' : 'Thêm mới Xe'}
          operators={operators}
        />
      </div>
    </MainLayout>
  );
};