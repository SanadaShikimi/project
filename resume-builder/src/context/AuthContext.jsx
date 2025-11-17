// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// URL API Backend của bạn (thay đổi khi deploy)
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  // Thêm state cho user nếu cần, ví dụ:
  // const [user, setUser] = useState(null); 

  // Hàm Đăng ký
  const register = async (fullName, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, { fullName, email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      // Bạn có thể fetch thông tin user tại đây
      return true;
    } catch (err) {
      console.error(err.response.data.msg);
      return false;
    }
  };

  // Hàm Đăng nhập
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      return true;
    } catch (err) {
      console.error(err.response.data.msg);
      return false;
    }
  };

  // Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token,setToken, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};