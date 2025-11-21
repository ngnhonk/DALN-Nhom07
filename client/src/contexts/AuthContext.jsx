// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService'; // Import userService
import { tokenManager } from '../utils/tokenManager';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = tokenManager.getToken();
    if (token) {
      const payload = tokenManager.getPayload();
      if (payload) {
        setUser(payload); // Set tạm data từ token
        setIsAuthenticated(true);
        
        // (Option) Gọi thêm API getMe để lấy data mới nhất từ DB nếu cần chính xác 100%
        // refreshUser(); 
      } else {
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  // --- HÀM MỚI: Gọi API lấy thông tin mới nhất và cập nhật state ---
  const refreshUser = async () => {
    try {
      const userData = await userService.getMe();
      // Merge thông tin từ API vào state user hiện tại
      // Vì token chỉ chứa thông tin tĩnh lúc login, còn API trả về data realtime
      setUser(prev => ({ ...prev, ...userData }));
    } catch (error) {
      console.error("Failed to refresh user info", error);
    }
  };

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      const payload = tokenManager.getPayload();
      setUser(payload);
      setIsAuthenticated(true);
    }
    return result;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    refreshUser, // Export hàm này
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};