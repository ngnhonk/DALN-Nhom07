import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { useAuth } from '../../hooks/useAuth';

export const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await register(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Đăng ký thành công!' });
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', password: '' });
          onSuccess?.();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Đăng ký thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message.text && <Alert type={message.type} message={message.text} />}

      <div onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Họ và tên"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            placeholder="Nguyễn Văn A"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            placeholder="user@example.com"
            required
          />

          <Input
            label="Số điện thoại"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={Phone}
            placeholder="0123456789"
            required
          />

          <Input
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            placeholder="Tối thiểu 8 ký tự"
            required
            minLength={8}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />

          <div className="text-sm">
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
              <span className="ml-2 text-gray-600">
                Tôi đồng ý với <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Chính sách bảo mật</a>
              </span>
            </label>
          </div>

          <Button onClick={handleSubmit} loading={loading}>
            Đăng ký tài khoản
          </Button>
        </div>
      </div>
    </div>
  );
};