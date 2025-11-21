// src/pages/client/BookingPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import { bookingService } from '../../services/bookingService';
import { busStationService } from '../../services/busStationService';
import { routeService } from '../../services/routeService';
import { routeStopService } from '../../services/routeStopService';
import { tokenManager } from '../../utils/tokenManager';
import { CheckCircle } from 'lucide-react';

export const BookingPage = () => {
  const { id } = useParams(); // Trip ID
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [availableStations, setAvailableStations] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({
    pickup_station_id: '',
    dropoff_station_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Load dữ liệu (Giữ nguyên)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripData = await tripService.getById(id);
        setTrip(tripData);

        if (tripData && tripData.route_id) {
          const [routeData, stopsData, allStations] = await Promise.all([
            routeService.getById(tripData.route_id),
            routeStopService.getByRouteId(tripData.route_id),
            busStationService.getAll()
          ]);

          const validStationIds = new Set([
            routeData.start_station_id,
            routeData.end_station_id,
            ...(stopsData?.map(stop => stop.station_id) || [])
          ]);

          const filteredStations = allStations.filter(station => 
            validStationIds.has(station.id)
          );

          setAvailableStations(filteredStations);
        }
      } catch (error) {
        console.error("Error loading booking data:", error);
      }
    };
    fetchData();
  }, [id]);

  // 2. Logic chọn ghế (Giữ nguyên)
  const generateSeats = (total) => {
    return Array.from({ length: total }, (_, i) => `A${i + 1}`);
  };

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // --- [PHẦN SỬA ĐỔI] ---
  const handleBooking = async () => {
    // Validate cơ bản
    if (!bookingInfo.pickup_station_id || !bookingInfo.dropoff_station_id || selectedSeats.length === 0) {
      alert("Vui lòng chọn đầy đủ thông tin (Điểm đón/trả và Ghế)");
      return;
    }

    if (bookingInfo.pickup_station_id === bookingInfo.dropoff_station_id) {
      alert("Điểm đón và điểm trả không được trùng nhau!");
      return;
    }

    // [2] Decode JWT để lấy User ID
    const userInfo = tokenManager.getPayload();
    
    if (!userInfo) {
      alert("Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
      navigate('/login');
      return;
    }

    const userId = userInfo.id;

    try {
      setIsSubmitting(true);
      
      const payload = {
        trip_id: id,
        user_id: userId, // [3] Thêm userId vào payload
        pickup_station_id: bookingInfo.pickup_station_id,
        dropoff_station_id: bookingInfo.dropoff_station_id,
        // Nếu backend cần danh sách ghế, hãy bỏ comment dòng dưới:
        // seat_ids: selectedSeats 
      };

      const res = await bookingService.createBooking(payload);
      
      if (res.success) {
        const displayPrice = res.responseObject?.total_price || (selectedSeats.length * trip.price);
        alert(`Đặt vé thành công! Mã vé: ${res.responseObject.id || 'N/A'}. Tổng tiền: ${displayPrice.toLocaleString()}đ`);
        navigate('/'); 
      }
    } catch (error) {
      alert(error.message || "Đặt vé thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!trip) return <div className="p-8 text-center">Đang tải thông tin chuyến...</div>;

  const totalPrice = selectedSeats.length * trip.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Xác nhận đặt vé</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột Trái: Chọn Ghế */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">1. Chọn ghế</h3>
          <div className="mb-4 flex gap-4 text-sm">
            <div className="flex items-center gap-1"><div className="w-6 h-6 bg-gray-200 rounded"></div> Trống</div>
            <div className="flex items-center gap-1"><div className="w-6 h-6 bg-blue-500 rounded"></div> Đang chọn</div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 max-w-md mx-auto">
            {generateSeats(trip.total_seats || 40).map((seatId) => (
              <button
                key={seatId}
                onClick={() => toggleSeat(seatId)}
                className={`
                  p-2 rounded border text-center font-medium transition
                  ${selectedSeats.includes(seatId) 
                    ? 'bg-blue-500 text-white border-blue-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {seatId}
              </button>
            ))}
          </div>
        </div>

        {/* Cột Phải: Thông tin & Thanh toán */}
        <div className="space-y-6">
          {/* Thông tin chuyến đi - Giữ nguyên */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">2. Thông tin chuyến đi</h3>
            <p className="mb-2"><strong>Tuyến:</strong> {trip.route_name}</p>
            <p className="mb-2"><strong>Xe:</strong> {trip.bus_plate} ({trip.bus_type})</p>
            <p className="mb-2"><strong>Khởi hành:</strong> {trip.departure_time} - {trip.departure_date}</p>
            <p className="text-blue-600 font-bold text-xl mt-4">{trip.price.toLocaleString()}đ / vé</p>
          </div>

          {/* Chọn điểm đón trả - Giữ nguyên */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">3. Điểm đón/trả</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đón</label>
                <select 
                  className="w-full border rounded p-2"
                  value={bookingInfo.pickup_station_id}
                  onChange={(e) => setBookingInfo({...bookingInfo, pickup_station_id: e.target.value})}
                >
                  <option value="">-- Chọn điểm đón --</option>
                  {availableStations.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm trả</label>
                <select 
                  className="w-full border rounded p-2"
                  value={bookingInfo.dropoff_station_id}
                  onChange={(e) => setBookingInfo({...bookingInfo, dropoff_station_id: e.target.value})}
                >
                  <option value="">-- Chọn điểm trả --</option>
                  {availableStations.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nút đặt vé */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
             <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Số lượng ghế:</span>
                <span>{selectedSeats.length}</span>
             </div>
             <div className="flex justify-between items-center mb-6 text-xl font-bold text-red-600">
                <span>Tổng tiền (Tạm tính):</span>
                <span>{totalPrice.toLocaleString()}đ</span>
             </div>
             <button
                onClick={handleBooking}
                disabled={isSubmitting || selectedSeats.length === 0}
                className={`
                  w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2
                  ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                `}
             >
                {isSubmitting ? 'Đang xử lý...' : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Xác nhận Đặt vé
                  </>
                )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};