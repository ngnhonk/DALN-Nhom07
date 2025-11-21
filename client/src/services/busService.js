import axiosInstance from '../api/axiosInstance';

export const busService = {
  // Lấy danh sách
  async getAll() {
    const response = await axiosInstance.get('/buses');
    return response.data.responseObject;
  },

  // Tạo mới
  async create(data) {
    const response = await axiosInstance.post('/buses', data);
    return response.data;
  },

  // Cập nhật
  async update(id, data) {
    const response = await axiosInstance.patch(`/buses/${id}`, data);
    return response.data;
  },

  // Xóa
  async delete(id) {
    const response = await axiosInstance.delete(`/buses/${id}`);
    return response.data;
  }
};