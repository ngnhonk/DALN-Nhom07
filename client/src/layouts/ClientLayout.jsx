import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Bus, UserCircle, LogOut, User, LayoutDashboard, Edit, Ticket } from 'lucide-react'; // Import Ticket icon
import { useAuth } from '../hooks/useAuth';
import { UserProfileModal } from '../components/client/UserProfileModal';

export const ClientLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Bus className="w-8 h-8" />
            <span>BusGO</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4 md:gap-6">
                {/* Link Admin */}
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/dashboard" 
                    className="hidden md:flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Quản trị
                  </Link>
                )}

                {/* --- MỚI: Link Vé của tôi --- */}
                <Link 
                  to="/my-bookings" 
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium text-sm"
                  title="Lịch sử đặt vé"
                >
                  <Ticket className="w-4 h-4" />
                  <span className="hidden sm:inline">Vé của tôi</span>
                </Link>
                {/* -------------------------- */}

                {/* User Profile Btn */}
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 text-gray-700 font-medium hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all group"
                  title="Chỉnh sửa thông tin"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="hidden sm:block max-w-[150px] truncate">
                    Hi, {user.name || 'User'}
                  </span>
                  <Edit className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Thoát</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                <UserCircle className="w-6 h-6" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Bus Booking System. All rights reserved.</p>
        </div>
      </footer>

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
};