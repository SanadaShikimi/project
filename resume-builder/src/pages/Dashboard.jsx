// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Sẽ tạo file này

// Lấy API client (từ file ResumeContext hoặc định nghĩa lại)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

const Dashboard = () => {
  const [cvs, setCvs] = useState([]); // Lưu danh sách CV
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Tải danh sách CV khi trang được mở
  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const res = await api.get('/cvs/all');
        setCvs(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách CV:", err);
      }
      setLoading(false);
    };
    fetchCvs();
  }, []);

  // 2. Xử lý khi nhấn "Tạo CV mới"
  const handleCreateNew = async () => {
    try {
      // Gọi API để tạo CV mới trên server
      const res = await api.post('/cvs/create');
      const newCv = res.data; // API trả về CV mới (gồm cả _id)
      
      // Chuyển hướng người dùng đến trang builder với ID của CV mới
      navigate(`/builder/${newCv._id}`);
    } catch (err) {
      console.error("Lỗi khi tạo CV mới:", err);
      alert("Không thể tạo CV mới. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <div className="dashboard-container">Đang tải...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Bảng điều khiển</h2>
      <p>Quản lý hồ sơ CV của bạn. Nhấn vào một CV để chỉnh sửa.</p>
      
      <div className="cv-list">
        {/* Nút tạo mới */}
        <button onClick={handleCreateNew} className="cv-card create-new">
          <div className="plus-icon">+</div>
          <div>Tạo CV mới</div>
        </button>

        {/* Lặp qua danh sách CV */}
        {cvs.map(cv => (
          <Link to={`/builder/${cv._id}`} key={cv._id} className="cv-card">
            <h3>{cv.cvName}</h3>
            <p>Cập nhật: {new Date(cv.updatedAt).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;