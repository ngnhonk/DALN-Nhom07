// src/components/client/UserProfileModal.jsx
import { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Save } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Alert } from '../common/Alert';

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true); // Loading khi mới mở modal để lấy data
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Khi mở modal -> Gọi API lấy data mới nhất điền vào form
  useEffect(() => {
    if (isOpen) {
      loadUserData();
      setMessage(null);
    }
  }, [isOpen]);

  const loadUserData = async () => {
    setFetchLoading(true);
    try {
      const data = await userService.getMe();
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải thông tin người dùng' });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await userService.updateProfile(formData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      
      // Cập nhật lại Context để Header hiển thị tên mới ngay lập tức
      await refreshUser();
      
      // Tự động đóng sau 1s
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Cập nhật thất bại, vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5" /> Thông tin cá nhân
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {fetchLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải thông tin...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {message && <Alert type={message.type} message={message.text} />}

              {/* Avatar giả lập */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>

              <Input
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                placeholder="Nhập họ tên của bạn"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                placeholder="user@example.com"
                required
              />

              <Input
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                placeholder="0xxxxxxxxx"
                required
              />

              <div className="pt-2">
                <Button type="submit" loading={loading} className="w-full justify-center">
                  <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};