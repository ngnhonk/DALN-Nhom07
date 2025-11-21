import axiosInstance from '../api/axiosInstance';

export const bookingService = {
  // Tạo booking mới (Cũ)
  async createBooking(data) {
    const response = await axiosInstance.post('/bookings', data);
    return response.data;
  },

  // --- MỚI: Lấy danh sách vé của tôi ---
  async getMyBookings() {
    const response = await axiosInstance.get('/bookings/me');
    // Giả định backend trả về list trong responseObject
    return response.data.responseObject;
  },

  // --- MỚI: Hủy vé ---
  async cancelBooking(id) {
    // Dùng method PATCH hoặc POST tùy backend (thường là PATCH để update status)
    const response = await axiosInstance.patch(`/bookings/${id}/cancel`);
    return response.data;
  }
};