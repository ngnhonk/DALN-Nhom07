import axiosInstance from '../api/axiosInstance';

export const routeStopService = {
  // Lấy danh sách tất cả (cũ)
  async getAll() {
    const response = await axiosInstance.get('/route_stops');
    return response.data.responseObject;
  },

  // --- MỚI: Lấy danh sách theo Route ID ---
  // Bạn hãy xây dựng API backend khớp với đường dẫn này nhé
  async getByRouteId(routeId) {
    const response = await axiosInstance.get(`/route_stops/route/${routeId}`);
    return response.data.responseObject;
  },

  // Tạo mới
  async create(data) {
    const response = await axiosInstance.post('/route_stops', data);
    return response.data;
  },

  // Cập nhật
  async update(id, data) {
    const response = await axiosInstance.patch(`/route_stops/${id}`, data);
    return response.data;
  },

  // Xóa
  async delete(id) {
    const response = await axiosInstance.delete(`/route_stops/${id}`);
    return response.data;
  }
};