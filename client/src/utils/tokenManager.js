// src/utils/tokenManager.js

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class TokenManager {
  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  setToken(token) {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setRefreshToken(refreshToken) {
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // --- MỚI: Hàm giải mã Payload từ JWT ---
  getPayload() {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Cấu trúc JWT: Header.Payload.Signature
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Giải mã Base64 và xử lý ký tự đặc biệt (Tiếng Việt)
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  }
}

export const tokenManager = new TokenManager();