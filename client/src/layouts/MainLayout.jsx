// src/layouts/MainLayout.jsx
import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  MapPin, 
  Bus, 
  Menu, 
  LogOut, 
  User,
  Building2,
  Waypoints,
  BusFront,
  Signpost // Icon mới
} from 'lucide-react';

export const MainLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Danh sách các menu item
  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Tổng quan', 
      icon: LayoutDashboard 
    },
    { 
      path: '/admin/provinces', 
      label: 'Quản lý Tỉnh/TP', 
      icon: MapPin 
    },
    { 
      path: '/admin/bus-stations', 
      label: 'Quản lý Bến xe', 
      icon: Bus 
    },
    { 
      path: '/admin/bus-operators', 
      label: 'Quản lý Nhà xe', 
      icon: Building2 
    },
    { 
      path: '/admin/buses', 
      label: 'Quản lý Xe khách', 
      icon: BusFront 
    },
    { 
      path: '/admin/routes', 
      label: 'Quản lý Tuyến đường', 
      icon: Waypoints 
    },
    { 
      path: '/admin/trips',
      label: 'Quản lý Chuyến', 
      icon: Signpost 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* --- SIDEBAR (Desktop & Mobile) --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bus className="w-6 h-6" />
            Manager Panel
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)} // Đóng menu trên mobile khi click
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
                ${isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout (Bottom of Sidebar) */}
        <div className="absolute bottom-0 w-full border-t p-4 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@system.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Header (Mobile Menu Button & Title) */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-gray-800">Quản lý hệ thống</span>
          <div className="w-6"></div> {/* Spacer để căn giữa title */}
        </header>

        {/* Overlay cho Mobile khi mở menu */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};