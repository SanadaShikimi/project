// src/App.jsx
import React, { useRef, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom'; // Thêm Navigate, useParams
import { arrayMove } from '@dnd-kit/sortable';

// Import các component
import Toolbar from './components/Toolbar/Toolbar';
import Editor from './components/Editor/Editor';
import Preview from './components/Preview/Preview';
import Register from './pages/Register';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; 

// Import các component form (để dùng trong config)
import PersonalInfo from './components/Editor/PersonalInfo';
import Experience from './components/Editor/Experience';
import Education from './components/Editor/Education';
import Skills from './components/Editor/Skills';

// Import thư viện PDF (giữ nguyên)
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import Context
import { ResumeProvider } from './context/ResumeContext';

// === 1. DI CHUYỂN BUILDERPAGE LÊN TRÊN ===
// (Component phải được định nghĩa trước khi sử dụng)
const BuilderPage = () => {
  const { cvId } = useParams(); // Lấy ID từ URL

  // Bọc MainLayout trong Provider, và truyền cvId vào
  return (
    <ResumeProvider cvId={cvId}>
      <MainLayout />
    </ResumeProvider>
  );
};

// === 2. CHUYỂN CONFIG RA ĐÂY ===
const sectionsConfig = {
  // Dùng object thay vì mảng để dễ truy cập
  personal: { Component: PersonalInfo, title: 'Thông tin cá nhân' },
  experience: { Component: Experience, title: 'Kinh nghiệm làm việc' },
  education: { Component: Education, title: 'Học vấn' },
  skills: { Component: Skills, title: 'Kỹ năng' },
};

// Thứ tự mặc định
const defaultSectionOrder = ['personal', 'experience', 'education', 'skills'];
// === KẾT THÚC CONFIG ===


const MainLayout = () => {
  const previewRef = useRef(null);

  // === 3. STATE VÀ HANDLER (Giữ nguyên) ===
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex); // Cập nhật state cha
      });
    }
  }
  
  // === 4. HÀM DOWNLOAD PDF (Giữ nguyên) ===
  const handleDownloadPDF = () => {
    const input = previewRef.current; 
    if (!input) {
      console.error("Không tìm thấy component preview!");
      return;
    }

    console.log("Bắt đầu tạo PDF...");
    const options = { scale: 2, useCORS: true };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210; 
      const pdfHeight = 297;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pdfWidth / (canvasWidth / options.scale), pdfHeight / (canvasHeight / options.scale));
      const imgWidth = (canvasWidth / options.scale) * ratio;
      const imgHeight = (canvasHeight / options.scale) * ratio;
      const x = (pdfWidth - imgWidth) / 2;
      const y = 10; 

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('my-resume.pdf');
      console.log("Đã xuất PDF.");
    });
  };

  return (
    <>
      <Toolbar onDownloadPDF={handleDownloadPDF} /> 
      <div className="main-content">
        
        {/* --- ĐÂY LÀ PHẦN ĐÃ SỬA LỖI --- */}
        {/* Bạn đã quên truyền props xuống 2 component này */}
        
        <Editor 
          sectionsConfig={sectionsConfig}
          sectionOrder={sectionOrder}
          onDragEnd={handleDragEnd}
        />
        <Preview 
          ref={previewRef} 
          sectionsConfig={sectionsConfig}
          sectionOrder={sectionOrder}
        />
        
      </div>
    </>
  );
};

// === 5. APP ROUTES (Giữ nguyên) ===
function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Cập nhật route /builder/:cvId để gọi BuilderPage */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:cvId" element={<BuilderPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;