// src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Component này nhận thêm prop 'requiredRole' (tùy chọn)
export const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Đang tải thông tin user (check token) thì chưa làm gì cả (hoặc hiện loading)
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  // 2. Chưa đăng nhập -> Đá về Login
  if (!isAuthenticated) {
    // state={{ from: location }} giúp sau khi login xong tự redirect lại trang cũ
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Đã đăng nhập nhưng Role không đúng yêu cầu
  // Ví dụ: requiredRole là 'ADMIN' nhưng user.role là 'USER'
  if (requiredRole && user?.role !== requiredRole) {
    // Có thể đá về trang chủ hoặc trang thông báo "Không có quyền truy cập"
    // Ở đây mình đá về trang chủ client
    return <Navigate to="/" replace />;
  }

  // 4. Thỏa mãn tất cả -> Cho vào
  return children;
};