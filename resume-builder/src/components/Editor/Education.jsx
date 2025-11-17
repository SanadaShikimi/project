// src/components/Editor/Education.jsx
import React from 'react';
import { useResume } from '../../context/ResumeContext';
import './EditorForm.css'; 

let nextId = Date.now();

// --- 1. NHẬN PROPS TỪ EDITOR.JSX ---
const Education = ({ dragHandleProps, title }) => {
  const { resumeData, setResumeData } = useResume();
  const educationList = resumeData.education;

  // --- 2. CÁC HÀM NÀY ĐÃ ĐẦY ĐỦ ---
  const handleChange = (e, id) => {
    const { name, value } = e.target;
    const updatedEducation = educationList.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setResumeData(prevData => ({
      ...prevData,
      education: updatedEducation
    }));
  };

  const handleAddEducation = () => {
    const newId = nextId++;
    const newEducation = {
      id: newId, school: "", degree: "", startDate: "", endDate: ""
    };
    setResumeData(prevData => ({
      ...prevData,
      education: [...prevData.education, newEducation]
    }));
  };

  const handleDeleteEducation = (id) => {
    const updatedEducation = educationList.filter(item => item.id !== id);
    setResumeData(prevData => ({
      ...prevData,
      education: updatedEducation
    }));
  };
  // --- KẾT THÚC HÀM ---

  return (
    // --- 3. THÊM CLASS 'draggable' ---
    <div className="form-section draggable">
      <div className="form-section-header">
        
        {/* --- 4. THÊM TAY CẦM (DRAG HANDLE) --- */}
        <div {...dragHandleProps} className="drag-handle">
          &#x2630;
        </div>
        
        <h3>{title}</h3> {/* --- 5. DÙNG TITLE TỪ PROP --- */}
        
        <button type="button" onClick={handleAddEducation} className="btn-add">
          + Thêm
        </button>
      </div>
      
      {educationList.map((item, index) => (
        <div key={item.id} className="form-group-item">
          {educationList.length > 1 && (
             <button 
               type="button" 
               onClick={() => handleDeleteEducation(item.id)} 
               className="btn-delete"
             >
               &times;
             </button>
          )}
          <div className="form-group">
            <label>Trường/Tổ chức</label>
            <input
              type="text"
              name="school"
              value={item.school}
              onChange={(e) => handleChange(e, item.id)}
              placeholder="Vd: Đại học Bách Khoa"
            />
          </div>
          <div className="form-group">
            <label>Bằng cấp/Chuyên ngành</label>
            <input
              type="text"
              name="degree"
              value={item.degree}
              onChange={(e) => handleChange(e, item.id)}
              placeholder="Vd: Cử nhân Khoa học Máy tính"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Từ</label>
              <input
                type="text"
                name="startDate"
                value={item.startDate}
                onChange={(e) => handleChange(e, item.id)}
                placeholder="Vd: 2016"
              />
            </div>
            <div className="form-group">
              <label>Đến</label>
              <input
                type="text"
                name="endDate"
                value={item.endDate}
                onChange={(e) => handleChange(e, item.id)}
                placeholder="Vd: 2020"
              />
            </div>
          </div>
          {index < educationList.length - 1 && <hr className="item-divider" />}
        </div>
      ))}
    </div>
  );
};

export default Education;