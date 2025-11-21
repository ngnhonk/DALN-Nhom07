// src/pages/client/MyBookingsPage.jsx
import { useState, useEffect } from "react";
import { bookingService } from "../../services/bookingService";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Bus,
  ArrowLeft,
  CreditCard,
  Armchair,
  AlertTriangle,
  Home,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      // Sắp xếp vé mới nhất lên đầu
      const sortedData = (data || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setBookings(sortedData);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể hoàn tác."
      )
    ) {
      try {
        await bookingService.cancelBooking(id);
        alert("Hủy vé thành công!");
        fetchBookings(); // Reload lại danh sách
      } catch (error) {
        alert(error.response?.data?.message || "Hủy vé thất bại");
      }
    }
  };

  // Format tiền tệ (nếu có, hiện tại API mẫu chưa có total_price nên sẽ fallback)
  const formatCurrency = (amount) => {
    if (!amount) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format ngày giờ hiển thị đẹp hơn
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    // dateStr format: 2025-11-21T17:00:00.000Z
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    // timeStr format: 08:00:00
    return timeStr?.slice(0, 5); // Lấy 08:00
  };

  // Helper: Màu sắc và Label trạng thái (Chuẩn hóa chữ thường từ API)
  const getStatusInfo = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "confirmed":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          label: "Đã thanh toán",
          icon: CreditCard,
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          label: "Chờ thanh toán",
          icon: Clock,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          label: "Đã hủy",
          icon: AlertTriangle,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          label: status,
          icon: Ticket,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* --- HEADER --- */}
      <div className="bg-white shadow-sm mb-6">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Ticket className="text-blue-600" /> Quản lý Vé của tôi
          </h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition mb-2"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />Trở về
          </button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu vé...</p>
          </div>
        ) : bookings.length === 0 ? (
          // --- EMPTY STATE ---
          <div className="text-center py-16 bg-white rounded-xl border shadow-sm max-w-2xl mx-auto">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Bạn chưa có chuyến đi nào
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy đặt vé ngay để trải nghiệm những hành trình tuyệt vời!
            </p>
            <Link to="/">
              <Button className="pl-6 pr-6">
                <Home className="w-4 h-4 mr-2" /> Tìm chuyến xe ngay
              </Button>
            </Link>
          </div>
        ) : (
          // --- BOOKING LIST ---
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={booking.id}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                >
                  {/* Card Header: Route & Status */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b bg-gray-50/50">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">
                        Mã vé: #{booking.id}
                      </p>
                      <h3 className="text-lg font-bold text-blue-800">
                        {booking.pickup_station_name} -{" "}
                        {booking.dropoff_station_name}
                      </h3>
                    </div>
                    <div
                      className={`mt-2 md:mt-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Card Body: Details */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cột 1: Thời gian & Địa điểm */}
                    <div className="md:col-span-2 space-y-6">
                      {/* Thời gian */}
                      <div className="flex items-start gap-3">
                        <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">
                            Khởi hành
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatTime(booking.departure_time)}
                            <span className="text-gray-400 font-normal mx-2">
                              |
                            </span>
                            {formatDate(booking.departure_date)}
                          </p>
                        </div>
                      </div>

                      {/* Lộ trình chi tiết (Có địa chỉ) */}
                      <div className="relative pl-4 border-l-2 border-dashed border-gray-300 space-y-8 ml-4">
                        {/* Điểm đón */}
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                          <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                            Điểm đón
                          </p>
                          <p className="font-bold text-gray-800 text-base">
                            {booking.pickup_station_name}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5 flex items-start gap-1">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {booking.pickup_address}
                          </p>
                        </div>

                        {/* Điểm trả */}
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white"></div>
                          <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                            Điểm trả
                          </p>
                          <p className="font-bold text-gray-800 text-base">
                            {booking.dropoff_station_name}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5 flex items-start gap-1">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {booking.dropoff_address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cột 2: Thông tin xe & Giá vé */}
                    <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        {/* Nếu API sau này trả về tên xe/biển số thì hiển thị, tạm thời ẩn hoặc hiển thị placeholder */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Bus className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Xe chất lượng cao</span>
                        </div>

                        {/* Ghế ngồi (Nếu có) */}
                        {booking.seat_numbers && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Armchair className="w-4 h-4 text-gray-400" />
                            <span>Ghế: </span>
                            <span className="font-bold text-blue-600">
                              {booking.seat_numbers}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>
                            Hành khách: {booking.user_id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-200">
                        {booking.total_price && (
                          <>
                            <p className="text-xs text-gray-500 text-right mb-1">
                              Tổng thanh toán
                            </p>
                            <p className="text-2xl font-bold text-orange-600 text-right">
                              {formatCurrency(booking.total_price)}
                            </p>
                          </>
                        )}

                        {booking.status?.toLowerCase() !== "cancelled" && (
                          <Button
                            variant="danger"
                            className="w-full mt-3 text-sm py-2"
                            onClick={() => handleCancel(booking.id)}
                          >
                            Hủy vé
                          </Button>
                        )}
                        {booking.status?.toLowerCase() === "cancelled" && (
                          <div className="mt-3 text-center text-sm text-red-500 font-medium bg-red-50 py-2 rounded border border-red-100">
                            Đã hủy vé
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Timestamp */}
                  <div className="bg-gray-50 px-5 py-3 border-t text-xs text-gray-500 flex justify-between items-center">
                    <span>
                      Ngày đặt:{" "}
                      {new Date(booking.created_at).toLocaleString("vi-VN")}
                    </span>
                    <Link
                      to={`/booking-detail/${booking.id}`}
                      className="text-blue-600 hover:underline hidden"
                    >
                      Xem chi tiết &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
