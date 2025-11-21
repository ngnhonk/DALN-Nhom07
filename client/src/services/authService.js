import axiosInstance from '../api/axiosInstance';
import { tokenManager } from '../utils/tokenManager';

export const authService = {
  // Đăng ký
  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.responseObject,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại',
      };
    }
  },

  // Đăng nhập
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      if (response.data.success && response.data.responseObject?.token) {
        tokenManager.setToken(response.data.responseObject.token);
      }

      return {
        success: response.data.success,
        message: response.data.message,
        token: response.data.responseObject?.token,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      };
    }
  },

  // Đăng xuất
  logout() {
    tokenManager.clearTokens();
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated() {
    return tokenManager.isAuthenticated();
  },

  // Lấy thông tin user (nếu backend có API)
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};