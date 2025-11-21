import axiosInstance from '../api/axiosInstance';

export const provinceService = {
  // Lấy danh sách
  async getAll() {
    const response = await axiosInstance.get('/provinces');
    return response.data.responseObject;
  },

  // Lấy chi tiết (nếu cần dùng sau này)
  async getById(id) {
    const response = await axiosInstance.get(`/provinces/${id}`);
    return response.data.responseObject;
  },

  // Tạo mới
  async create(data) {
    const response = await axiosInstance.post('/provinces', data);
    return response.data;
  },

  // Cập nhật
  async update(id, data) {
    const response = await axiosInstance.patch(`/provinces/${id}`, data);
    return response.data;
  },

  // Xóa
  async delete(id) {
    const response = await axiosInstance.delete(`/provinces/${id}`);
    return response.data;
  }
};