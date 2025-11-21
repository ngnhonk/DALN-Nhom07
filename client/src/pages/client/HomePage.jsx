// src/pages/client/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { busStationService } from '../../services/busStationService';
import { MapPin, Calendar, Search, Shield, Clock, Coins, Star, ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  
  // State form tìm kiếm
  const [searchData, setSearchData] = useState({
    from_station_id: '',
    to_station_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await busStationService.getAll();
        setStations(data);
      } catch (error) {
        console.error("Lỗi tải bến xe:", error);
      }
    };
    fetchStations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData).toString();
    navigate(`/search?${params}`);
  };

  // Dữ liệu giả lập cho phần "Tuyến đường phổ biến"
  const popularRoutes = [
    { id: 1, from: 'Hà Nội', to: 'Sapa', price: '250.000đ', img: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80' },
    { id: 2, from: 'Sài Gòn', to: 'Đà Lạt', price: '300.000đ', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80' },
    { id: 3, from: 'Đà Nẵng', to: 'Huế', price: '150.000đ', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80' },
    { id: 4, from: 'Sài Gòn', to: 'Nha Trang', price: '220.000đ', img: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="relative bg-gray-50 min-h-screen">
      
      {/* --- HERO BANNER --- */}
      <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10"></div>

        {/* Hero Text */}
        <div className="z-20 text-center text-white px-4 -mt-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Hành trình vạn dặm
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light">
            Đặt vé xe khách trực tuyến nhanh chóng, tiện lợi và an toàn nhất Việt Nam.
          </p>
        </div>
      </div>

      {/* --- SEARCH BOX (Floating) --- */}
      <div className="container mx-auto px-4 -mt-24 relative z-30">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm bg-white/95 border border-white/20">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-blue-600" /> Điểm đi
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-4 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition cursor-pointer"
                  value={searchData.from_station_id}
                  onChange={(e) => setSearchData({...searchData, from_station_id: e.target.value})}
                  required
                >
                  <option value="">Chọn nơi xuất phát</option>
                  {stations.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.province})</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-orange-600" /> Điểm đến
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-4 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition cursor-pointer"
                  value={searchData.to_station_id}
                  onChange={(e) => setSearchData({...searchData, to_station_id: e.target.value})}
                  required
                >
                  <option value="">Chọn nơi đến</option>
                  {stations.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.province})</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                <Calendar className="w-4 h-4 text-green-600" /> Ngày đi
              </label>
              <input 
                type="date"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={searchData.date}
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" /> Tìm chuyến xe
            </button>
          </form>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tại sao chọn BusGO?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Nền tảng đặt vé xe uy tín, mang đến cho bạn những trải nghiệm hành trình an toàn và thoải mái nhất.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 text-center group">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">An toàn tuyệt đối</h3>
            <p className="text-gray-500">Các nhà xe đối tác được xác thực kỹ càng, đảm bảo chất lượng xe và tài xế chuyên nghiệp.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 text-center group">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Đúng giờ</h3>
            <p className="text-gray-500">Cam kết xuất bến đúng giờ. Hệ thống nhắc nhở lịch trình thông minh qua Email/SMS.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 text-center group">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Coins className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Giá cả minh bạch</h3>
            <p className="text-gray-500">Giá vé niêm yết rõ ràng, không phụ phí ẩn. Nhiều ưu đãi hấp dẫn cho thành viên.</p>
          </div>
        </div>
      </div>

      {/* --- POPULAR ROUTES --- */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Tuyến đường phổ biến</h2>
              <p className="text-gray-500 mt-2">Khám phá những điểm đến được yêu thích nhất</p>
            </div>
            <a href="#" className="text-blue-600 font-semibold flex items-center hover:underline">
              Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route) => (
              <div key={route.id} className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer h-80">
                <img 
                  src={route.img} 
                  alt={route.to} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm opacity-90 mb-1">{route.from} &rarr;</p>
                      <h3 className="text-2xl font-bold">{route.to}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80">Từ</p>
                      <p className="font-bold text-yellow-400 text-lg">{route.price}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-md w-fit px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 4.8 (120 đánh giá)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="py-20 bg-blue-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Sẵn sàng cho chuyến đi tiếp theo?</h2>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">Đăng ký thành viên ngay hôm nay để tích điểm và nhận thông báo về các chuyến xe giá rẻ.</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition">
              Đăng ký ngay
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};