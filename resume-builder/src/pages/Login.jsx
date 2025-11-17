// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Lấy CSS từ các component khác
import '../components/Editor/EditorForm.css'; 
import '../components/Toolbar/Toolbar.css';
import './Login.css'; // File CSS cho nút Google

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSocialLogin = (provider) => {
    window.location.href = `${SERVER_URL}/api/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/'); 
      } else {
        setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Không thể đăng nhập.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: '50px auto' }}>
      <form onSubmit={handleSubmit} className="form-section">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Đăng Nhập</h2>
        
        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        {/* --- 1. ĐÂY LÀ Ô EMAIL --- */}
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
        
        {/* --- 2. ĐÂY LÀ Ô MẬT KHẨU --- */}
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
        {/* --- KẾT THÚC CÁC Ô INPUT --- */}

        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', padding: '12px' }}
        >
          Đăng Nhập
        </button>

        <div className="divider">
          <span>HOẶC</span>
        </div>

        <button 
          type="button" 
          className="btn-social google"
          onClick={() => handleSocialLogin('google')}
        >
          Đăng nhập với Google
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;