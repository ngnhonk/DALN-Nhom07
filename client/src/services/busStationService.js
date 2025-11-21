import axiosInstance from '../api/axiosInstance';

export const busStationService = {
  // Lấy danh sách
  async getAll() {
    const response = await axiosInstance.get('/bus_stations');
    return response.data.responseObject;
  },

  // Tạo mới
  async create(data) {
    const response = await axiosInstance.post('/bus_stations', data);
    return response.data;
  },

  // Cập nhật
  async update(id, data) {
    const response = await axiosInstance.patch(`/bus_stations/${id}`, data);
    return response.data;
  },

  // Xóa
  async delete(id) {
    const response = await axiosInstance.delete(`/bus_stations/${id}`);
    return response.data;
  }
};