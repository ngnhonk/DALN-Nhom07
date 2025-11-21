// src/layouts/AuthLayout.jsx
export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
        <p className="text-center text-sm text-gray-600 mt-6">
          Cần hỗ trợ? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Liên hệ chúng tôi</a>
        </p>
      </div>
    </div>
  );
};
