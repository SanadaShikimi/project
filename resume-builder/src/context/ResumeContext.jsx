// src/context/ResumeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; // <-- 1. Import AuthContext
import axios from 'axios';

// Tạo Context
const ResumeContext = createContext();

// Dữ liệu CV mặc định (cho cả khách và user mới)
const initialData = {
  personal: {
    fullName: "Nguyễn Văn A",
    jobTitle: "Lập trình viên",
    email: "example@email.com",
    phone: "0123 456 789",
    address: "Q.1, TP. Hồ Chí Minh",
  },
  experience: [
    {
      id: 1,
      company: "Công ty A",
      position: "Lập trình viên Junior",
      startDate: "2020-01",
      endDate: "Hiện tại",
      description: "Phát triển và bảo trì ứng dụng web..."
    },
  ],
  education: [
     {
      id: 1,
      school: "Đại học B",
      degree: "Cử nhân Công nghệ thông tin",
      startDate: "2016",
      endDate: "2020",
    },
  ],
  skills: ["React.js", "Node.js"]
};

// Hàm lấy dữ liệu khách (Guest)
const getGuestResume = () => {
  const savedData = localStorage.getItem('guestResume');
  return savedData ? JSON.parse(savedData) : initialData;
};

// Hàm tạo API client (để tự động đính kèm token)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token; // Gửi token trong header
  }
  return config;
});


// 1. Provider giờ đây nhận 'cvId' từ props
export const ResumeProvider = ({ children, cvId }) => {
  const [resumeData, setResumeData] = useState(initialData);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  // 2. Logic Tải (Load)
  useEffect(() => {
    const loadResume = async () => {
      setLoading(true);
      if (token) {
        // --- NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP ---
        if (!cvId) { // Nếu không có CV ID (ví dụ: lỗi URL)
          console.error("Không có CV ID");
          setLoading(false);
          return;
        }
        
        try {
          localStorage.removeItem('guestResume');
          
          // GỌI API MỚI (có ID)
          const res = await api.get(`/cvs/load/${cvId}`);
          setResumeData(res.data); // Tải CV từ database
        } catch (err) {
          console.error("Lỗi tải CV:", err);
          // (Có thể chuyển hướng về dashboard nếu CV không tồn tại)
        }
      } else {
        // --- CHẾ ĐỘ KHÁCH (VẪN GIỮ NGUYÊN) ---
        setResumeData(getGuestResume());
      }
      setLoading(false);
    };

    loadResume();
  // 3. Phụ thuộc vào token VÀ cvId
  }, [token, cvId]);

  // 4. Logic Lưu (Save)
  useEffect(() => {
    if (loading) return; 

    if (token) {
      // --- NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP ---
      if (!cvId) return; // Không lưu nếu không có ID

      const timer = setTimeout(() => {
        // GỌI API MỚI (có ID)
        api.post(`/cvs/save/${cvId}`, resumeData)
           .then(res => console.log("Đã lưu CV vào database"))
           .catch(err => console.error("Lỗi khi lưu CV:", err));
      }, 1500);
      
      return () => clearTimeout(timer);
      
    } else {
      // --- CHẾ ĐỘ KHÁCH ---
      localStorage.setItem('guestResume', JSON.stringify(resumeData));
    }
  }, [resumeData, token, loading, cvId]); // 5. Thêm cvId vào phụ thuộc

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem' }}>
        Đang tải CV...
      </div>
    );
  }

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  return useContext(ResumeContext);
};