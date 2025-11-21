import axiosInstance from '../api/axiosInstance';

export const tripService = {
  // Lấy danh sách tất cả
  async getAll() {
    const response = await axiosInstance.get('/trips');
    return response.data.responseObject;
  },

  // Tìm kiếm (Server-side filtering)
  // params ví dụ: { from_station_id: 1, to_station_id: 2, date: '2023-12-01' }
  async search(params) {
    const response = await axiosInstance.get('/trips', { params });
    return response.data.responseObject;
  },

  // Tạo mới
  async create(data) {
    const response = await axiosInstance.post('/trips', data);
    return response.data;
  },

  // Cập nhật
  async update(id, data) {
    const response = await axiosInstance.patch(`/trips/${id}`, data);
    return response.data;
  },

  // Xóa
  async delete(id) {
    const response = await axiosInstance.delete(`/trips/${id}`);
    return response.data;
  },

  async getById(id) {
    const response = await axiosInstance.get(`/trips/${id}`);
    // API trả về 1 object chi tiết chuyến xe
    return response.data.responseObject;
  },

  // Tìm kiếm chuyến xe (Client)
  // params: { from_station_id, to_station_id, date }
  async searchClient(params) {
    const response = await axiosInstance.get('/trips', { params });
    return response.data.responseObject;
  }
};