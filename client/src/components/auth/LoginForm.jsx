// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    email: '',
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
      const result = await login(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Đăng nhập thành công!' });
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Đăng nhập thất bại!' });
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
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            placeholder="••••••••"
            required
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Quên mật khẩu?
            </a>
          </div>

          <Button onClick={handleSubmit} loading={loading}>
            Đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
};