import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { 
  Building2, 
  MapPin, 
  BusFront, 
  Waypoints, 
  CalendarDays, 
  TrendingUp 
} from 'lucide-react';

// Import các services để lấy dữ liệu
import { busOperatorService } from '../services/busOperatorService';
import { busStationService } from '../services/busStationService';
import { busService } from '../services/busService';
import { routeService } from '../services/routeService';
import { tripService } from '../services/tripService';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    operators: 0,
    stations: 0,
    buses: 0,
    routes: 0,
    trips: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Gọi song song tất cả các API để tiết kiệm thời gian
        const [
          operatorsData, 
          stationsData, 
          busesData, 
          routesData, 
          tripsData
        ] = await Promise.all([
          busOperatorService.getAll(),
          busStationService.getAll(),
          busService.getAll(),
          routeService.getAll(),
          tripService.getAll()
        ]);

        // Cập nhật state với số lượng phần tử (length) của từng mảng
        setStats({
          operators: operatorsData?.length || 0,
          stations: stationsData?.length || 0,
          buses: busesData?.length || 0,
          routes: routesData?.length || 0,
          trips: tripsData?.length || 0
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Component hiển thị thẻ thống kê
  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`p-6 rounded-xl border shadow-sm transition hover:shadow-md ${bgColor} ${color.replace('text-', 'border-').replace('600', '200')}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className={`text-3xl font-bold ${color}`}>
            {loading ? '...' : value}
          </h3>
        </div>
        <div className={`p-3 rounded-full bg-white bg-opacity-60`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tổng quan</h2>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <StatCard 
            title="Nhà xe đối tác" 
            value={stats.operators} 
            icon={Building2} 
            color="text-blue-600" 
            bgColor="bg-blue-50" 
          />

          <StatCard 
            title="Bến xe hoạt động" 
            value={stats.stations} 
            icon={MapPin} 
            color="text-green-600" 
            bgColor="bg-green-50" 
          />

          <StatCard 
            title="Đội xe hiện có" 
            value={stats.buses} 
            icon={BusFront} 
            color="text-purple-600" 
            bgColor="bg-purple-50" 
          />

          <StatCard 
            title="Tuyến đường" 
            value={stats.routes} 
            icon={Waypoints} 
            color="text-orange-600" 
            bgColor="bg-orange-50" 
          />

          <StatCard 
            title="Chuyến xe sắp chạy" 
            value={stats.trips} 
            icon={CalendarDays} 
            color="text-indigo-600" 
            bgColor="bg-indigo-50" 
          />

          {/* Thẻ Doanh thu (Ví dụ - Fake data vì chưa có API thống kê tiền) */}
          <StatCard 
            title="Doanh thu hôm nay" 
            value="15.2M" 
            icon={TrendingUp} 
            color="text-rose-600" 
            bgColor="bg-rose-50" 
          />

        </div>

        {/* Recent Activity Section (Placeholder cho đẹp) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Hoạt động gần đây</h3>
          </div>
          <div className="p-6 text-center text-gray-500 py-12">
            Chưa có hoạt động nào được ghi nhận.
          </div>
        </div>
      </div>
    </MainLayout>
  );
};