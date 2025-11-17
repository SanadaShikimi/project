// src/components/Editor/Experience.jsx
import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import './EditorForm.css';
import axios from 'axios';

// API Client
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

let nextId = Date.now();

// --- 1. NHẬN PROPS TỪ EDITOR.JSX ---
const Experience = ({ dragHandleProps, title }) => {
  const { resumeData, setResumeData } = useResume();
  const experienceList = resumeData.experience;
  const [aiLoading, setAiLoading] = useState(false);

  // --- 2. ĐIỀN LẠI CÁC HÀM XỬ LÝ ---
  const handleChange = (e, id) => {
    const { name, value } = e.target;
    const updatedExperience = experienceList.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setResumeData(prevData => ({
      ...prevData,
      experience: updatedExperience
    }));
  };

  const handleAddExperience = () => {
    const newId = nextId++; 
    const newExperience = {
      id: newId, company: "", position: "", startDate: "", endDate: "", description: ""
    };
    setResumeData(prevData => ({
      ...prevData,
      experience: [...prevData.experience, newExperience]
    }));
  };

  const handleDeleteExperience = (id) => {
    const updatedExperience = experienceList.filter(item => item.id !== id);
    setResumeData(prevData => ({
      ...prevData,
      experience: updatedExperience
    }));
  };

  const handleAIAssist = async (id, currentText) => {
    if (aiLoading) return;
    if (!currentText || currentText.trim().length < 10) {
      alert("Hãy nhập mô tả công việc (ít nhất 10 ký tự) trước khi dùng AI.");
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Bạn cần đăng nhập để sử dụng tính năng này.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post('/ai/enhance', { text: currentText });
      const { enhancedText } = res.data;
      const updatedExperience = experienceList.map(item =>
        item.id === id ? { ...item, description: enhancedText } : item
      );
      setResumeData(prevData => ({
        ...prevData,
        experience: updatedExperience
      }));
    } catch (err) {
      console.error("Lỗi AI:", err);
      if (err.response && err.response.status === 401) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      } else {
        alert("Đã xảy ra lỗi khi dùng AI. Vui lòng thử lại.");
      }
    } finally {
      setAiLoading(false);
    }
  };
  // --- KẾT THÚC ĐIỀN LẠI HÀM ---

  return (
    <div className="form-section draggable">
      <div className="form-section-header">
        <div {...dragHandleProps} className="drag-handle">
          &#x2630;
        </div>
        <h3>{title}</h3>
        <button type="button" onClick={handleAddExperience} className="btn-add">
          + Thêm
        </button>
      </div>
      
      {experienceList.map((item, index) => (
        <div key={item.id} className="form-group-item">
           {experienceList.length > 1 && (
             <button 
               type="button" 
               onClick={() => handleDeleteExperience(item.id)} 
               className="btn-delete"
             >&times;</button>
          )}
          <div className="form-group">
            <label>Vị trí</label>
            <input
              type="text" name="position" value={item.position}
              onChange={(e) => handleChange(e, item.id)}
              placeholder="Vd: Lập trình viên Front-end"
            />
          </div>
          <div className="form-group">
            <label>Công ty</label>
            <input
              type="text" name="company" value={item.company}
              onChange={(e) => handleChange(e, item.id)}
              placeholder="Vd: Công ty ABC"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Từ ngày</label>
              <input
                type="text" name="startDate" value={item.startDate}
                onChange={(e) => handleChange(e, item.id)}
                placeholder="Vd: 01/2020"
              />
            </div>
            <div className="form-group">
              <label>Đến ngày</label>
              <input
                type="text" name="endDate" value={item.endDate}
                onChange={(e) => handleChange(e, item.id)}
                placeholder="Vd: Hiện tại"
              />
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Mô tả công việc
              <button 
                type="button" 
                className="btn-ai"
                onClick={() => handleAIAssist(item.id, item.description)}
                disabled={aiLoading}
              >
                {aiLoading ? 'Đang xử lý...' : '✨ Hỗ trợ AI'}
              </button>
            </label>
            <textarea
              name="description"
              value={item.description}
              onChange={(e) => handleChange(e, item.id)}
              rows="4" 
              placeholder="Mô tả các công việc chính bạn đã làm... (Nhấn ✨ Hỗ trợ AI để viết lại)"
            />
          </div>
          {index < experienceList.length - 1 && <hr className="item-divider" />}
        </div>
      ))}
    </div>
  );
};

export default Experience;