// src/pages/client/TripSearchPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import { BusFront, Clock, Armchair } from 'lucide-react';

export const TripSearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const params = {
          from_station_id: searchParams.get('from_station_id'),
          to_station_id: searchParams.get('to_station_id'),
          date: searchParams.get('date'),
        };
        const data = await tripService.searchClient(params);
        setTrips(data || []);
      } catch (error) {
        console.error("Lỗi tìm chuyến:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Kết quả tìm kiếm</h2>
      
      {loading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">Không tìm thấy chuyến xe nào phù hợp.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{trip.bus_type}</span>
                   <h3 className="font-bold text-lg">{trip.bus_plate}</h3>
                </div>
                <div className="flex items-center gap-8 text-gray-600 my-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-lg font-semibold text-gray-900">{trip.departure_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4" />
                    <span>{trip.total_seats} ghế</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{trip.route_name}</p>
              </div>

              {/* Price & Action */}
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {trip.price.toLocaleString('vi-VN')}đ
                </div>
                <button 
                  onClick={() => navigate(`/booking/${trip.id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Chọn chuyến
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};