import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Khởi tạo state user ngay từ localStorage (nếu có) để không bị nháy giao diện
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user_info");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Lấy thông tin chi tiết người dùng từ API
  const fetchUserInfo = async () => {
    try {
      const savedUser = localStorage.getItem("user_info");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        return parsed;
      }
    } catch (e) {}
    return null;
  };

  // Tự động kiểm tra token khi vừa mở ứng dụng
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Đính kèm token vào header mặc định của Axios
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      fetchUserInfo().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Hàm đăng xuất: xóa sạch dữ liệu và chuyển về Trang chủ ("/")
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    delete api.defaults.headers.common.Authorization;

    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUserInfo,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
