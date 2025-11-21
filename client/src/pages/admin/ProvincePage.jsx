// src/pages/admin/ProvincePage.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Search } from 'lucide-react'; // Import Search
import { MainLayout } from '../../layouts/MainLayout';
import { provinceService } from '../../services/provinceService';
import { ProvinceModal } from '../../components/admin/ProvinceModal';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

export const ProvincePage = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchProvinces = async () => {
    try {
      const data = await provinceService.getAll();
      setProvinces(data);
    } catch (error) {
      console.error('Failed to fetch provinces', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  // --- LOGIC TÌM KIẾM ---
  const filteredProvinces = provinces.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tỉnh này không?')) {
      try {
        await provinceService.delete(id);
        setMessage({ type: 'success', text: 'Xóa thành công!' });
        fetchProvinces();
      } catch (error) {
        setMessage({ type: 'error', text: 'Xóa thất bại!' });
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await provinceService.update(editingItem.id, formData);
        setMessage({ type: 'success', text: 'Cập nhật thành công!' });
      } else {
        await provinceService.create(formData);
        setMessage({ type: 'success', text: 'Thêm mới thành công!' });
      }
      fetchProvinces();
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
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-blue-600" /> Quản lý Tỉnh/Thành phố
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Tìm kiếm tỉnh thành..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã (Code)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Tỉnh/TP</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProvinces.length > 0 ? (
                  filteredProvinces.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
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
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500 text-sm">
                      {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu nào.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <ProvinceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={editingItem}
          title={editingItem ? 'Cập nhật Tỉnh/TP' : 'Thêm mới Tỉnh/TP'}
        />
      </div>
    </MainLayout>
  );
};