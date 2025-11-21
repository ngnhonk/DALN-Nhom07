import axiosInstance from '../api/axiosInstance';

export const routeService = {
  // Lấy danh sách
  async getAll() {
    const response = await axiosInstance.get('/routes');
    return response.data.responseObject;
  },

  // Tạo mới
  async create(data) {
    const response = await axiosInstance.post('/routes', data);
    return response.data;
  },

  // Cập nhật
  async update(id, data) {
    const response = await axiosInstance.patch(`/routes/${id}`, data);
    return response.data;
  },

  // Xóa
  async delete(id) {
    const response = await axiosInstance.delete(`/routes/${id}`);
    return response.data;
  },

  async getById(id) {
    const response = await axiosInstance.get(`/routes/${id}`);
    return response.data.responseObject;
  },
};