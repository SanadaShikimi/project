// src/pages/AuthCallback.jsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth(); // <-- Bạn cần sửa AuthContext để export hàm setToken

  useEffect(() => {
    // 1. Lấy token từ URL
    const token = searchParams.get('token');

    if (token) {
      // 2. Lưu token vào localStorage và AuthContext
      localStorage.setItem('token', token);
      setToken(token); // Cập nhật state của context
      
      // 3. Chuyển hướng về trang chủ
      navigate('/');
    } else {
      // 4. Nếu không có token, báo lỗi và về trang login
      alert('Đăng nhập thất bại. Vui lòng thử lại.');
      navigate('/login');
    }
  }, [searchParams, navigate, setToken]);

  // Hiển thị loading... trong khi xử lý
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Đang xử lý đăng nhập...</h2>
    </div>
  );
};

export default AuthCallback;