// src/services/userService.js
import axiosInstance from '../api/axiosInstance';

export const userService = {
  // Lấy thông tin user hiện tại
  // GET http://localhost:8080/users/me
  getMe: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data.responseObject;
  },

  // Cập nhật thông tin
  // PATCH /users/information
  updateProfile: async (data) => {
    // data: { name, phone, email }
    const response = await axiosInstance.patch('/users/information', data);
    return response.data;
  }
};