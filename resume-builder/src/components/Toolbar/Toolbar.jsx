// src/components/Toolbar/Toolbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Toolbar.css';

const Toolbar = ({onDownloadPDF}) => {

  // Logic từ phiên bản Auth (Đăng nhập/Đăng xuất)
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Chuyển về trang login sau khi đăng xuất
  };

  const handleAIAssist = () => {
    // Logic (FR-5) gọi API AI sẽ ở đây
    alert('Logic AI sẽ ở đây!');
  };

  // === 2. KẾT HỢP GIAO DIỆN ===
  return (
    <div className="toolbar">
      {/* Link trang chủ (Lấy từ phiên bản Auth) */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2>Resume Builder</h2>
      </Link>
      
      <div className="toolbar-actions">
        {/* --- Các nút hành động (Lấy từ phiên bản Actions) --- */}
        {/* Chúng ta muốn các nút này luôn hiển thị trên Toolbar */}
        {/*<button onClick={handleAIAssist}>✨ Hỗ trợ AI</button>*/}
        <button onClick={onDownloadPDF} className="btn-primary">
          Tải xuống PDF
        </button>

        {/* Thêm một đường kẻ phân cách cho đẹp mắt */}
        <span 
          style={{
            borderLeft: '1px solid var(--border-color)',
            margin: '0 12px',
          }}
        />
        
        {/* --- Các nút Auth (Lấy từ phiên bản Auth) --- */}
        {/* Logic này sẽ hiển thị Đăng nhập/Đăng ký HOẶC Đăng xuất */}
        {token ? (
          // === ĐÃ ĐĂNG NHẬP ===
          <>
            <span style={{ alignSelf: 'center', marginRight: '10px' }}>
              Chào mừng bạn!
            </span>
            <button onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          // === CHƯA ĐĂNG NHẬP (KHÁCH) ===
          <>
            <Link to="/login">
              <button>Đăng nhập</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary">Đăng ký</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;