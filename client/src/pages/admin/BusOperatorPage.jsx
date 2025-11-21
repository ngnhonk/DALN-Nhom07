// src/pages/admin/BusOperatorPage.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2, Search } from 'lucide-react'; // Import Search
import { MainLayout } from '../../layouts/MainLayout';
import { busOperatorService } from '../../services/busOperatorService';
import { BusOperatorModal } from '../../components/admin/BusOperatorModal';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const BusOperatorPage = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchOperators = async () => {
    try {
      const data = await busOperatorService.getAll();
      setOperators(data);
    } catch (error) {
      console.error('Failed to fetch operators', error);
      setMessage({ type: 'error', text: 'Lỗi tải dữ liệu!' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  // --- LOGIC TÌM KIẾM ---
  const filteredOperators = operators.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hotline.includes(searchTerm)
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà xe này không?')) {
      try {
        await busOperatorService.delete(id);
        setMessage({ type: 'success', text: 'Xóa thành công!' });
        fetchOperators();
      } catch (error) {
        setMessage({ type: 'error', text: 'Xóa thất bại!' });
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await busOperatorService.update(editingItem.id, formData);
        setMessage({ type: 'success', text: 'Cập nhật thành công!' });
      } else {
        await busOperatorService.create(formData);
        setMessage({ type: 'success', text: 'Thêm mới thành công!' });
      }
      fetchOperators();
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
            <Building2 className="text-blue-600" /> Quản lý Nhà xe
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Tìm tên nhà xe, hotline..."
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Nhà xe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOperators.length > 0 ? (
                  filteredOperators.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.hotline}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={item.description}>
                        {item.description}
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
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 text-sm">
                      {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có nhà xe nào.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <BusOperatorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={editingItem}
          title={editingItem ? 'Cập nhật Nhà xe' : 'Thêm mới Nhà xe'}
        />
      </div>
    </MainLayout>
  );
};