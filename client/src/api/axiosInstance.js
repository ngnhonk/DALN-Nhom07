import axios from 'axios';
import { tokenManager } from '../utils/tokenManager';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý error
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Xử lý 401 - Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // --- THÊM ĐOẠN NÀY ---
      // Nếu URL gọi API là login thì KHÔNG làm gì cả (để component tự xử lý lỗi hiển thị)
      if (originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
      }
      // ---------------------

      originalRequest._retry = true;
      
      // Xử lý logout cho các trường hợp khác (hết hạn token khi đang dùng app)
      tokenManager.clearTokens();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;