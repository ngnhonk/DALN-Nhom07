import axiosInstance from '../api/axiosInstance';

export const busOperatorService = {
  // Lấy danh sách
  async getAll() {
    const response = await axiosInstance.get('/bus_operators');
    return response.data.responseObject;
  },

  // Tạo mới
  async create(data) {
    const response = await axiosInstance.post('/bus_operators', data);
    return response.data;
  },

  // Cập nhật
  async update(id, data) {
    const response = await axiosInstance.patch(`/bus_operators/${id}`, data);
    return response.data;
  },

  // Xóa
  async delete(id) {
    const response = await axiosInstance.delete(`/bus_operators/${id}`);
    return response.data;
  }
};