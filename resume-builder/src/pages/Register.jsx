// src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // <-- Import Link

// Import CSS để dùng chung
import '../components/Editor/EditorForm.css';
import '../components/Toolbar/Toolbar.css';

const Register = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState(''); // Thêm state cho lỗi
  const { register } = useAuth();
  const navigate = useNavigate();

  const { fullName, email, password } = formData; // Lấy giá trị ra

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset lỗi
    
    // Kiểm tra mật khẩu (ví dụ)
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      const success = await register(fullName, email, password);
      if (success) {
        navigate('/'); // Chuyển về trang chủ (builder)
      } else {
        // Lỗi do API trả về (vd: email trùng)
        setError('Đăng ký thất bại. Email có thể đã tồn tại.');
      }
    } catch (err) {
      // Lỗi hệ thống (vd: sập server)
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: '50px auto' }}>
      <form onSubmit={handleSubmit} className="form-section">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Tạo Tài Khoản</h2>
        
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        {/* --- PHẦN BỊ THIẾU ĐÃ ĐƯỢC THÊM --- */}
        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>
        {/* --- KẾT THÚC PHẦN THÊM --- */}

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', padding: '12px' }}
        >
          Đăng Ký
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;