// src/components/Editor/Skills.jsx
import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import './EditorForm.css';

// --- 1. NHẬN PROPS TỪ EDITOR.JSX ---
const Skills = ({ dragHandleProps, title }) => {
  const { resumeData, setResumeData } = useResume();
  const [newSkill, setNewSkill] = useState("");

  // --- 2. ĐIỀN LẠI CÁC HÀM XỬ LÝ ---
  const handleInputChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleAddSkill = (e) => {
    e.preventDefault(); 
    if (newSkill.trim() !== "" && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prevData => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setResumeData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter(skill => skill !== skillToDelete)
    }));
  };
  // --- KẾT THÚC ĐIỀN LẠI HÀM ---

  return (
    // --- 3. THÊM CLASS 'draggable' ---
    <div className="form-section draggable">
      <div className="form-section-header">
        
        {/* --- 4. THÊM TAY CẦM (DRAG HANDLE) --- */}
        <div {...dragHandleProps} className="drag-handle">
          &#x2630;
        </div>
        
        <h3>{title}</h3> {/* --- 5. DÙNG TITLE TỪ PROP --- */}
        
        {/* Nút Thêm cho Skills nằm bên dưới, 
           nhưng ta thêm 1 cái .btn-add rỗng để giữ layout */}
        <div className="btn-add" style={{ visibility: 'hidden' }}></div>
      </div>

      <form onSubmit={handleAddSkill} className="skill-add-form">
        <input
          type="text"
          value={newSkill}
          onChange={handleInputChange}
          placeholder="Vd: JavaScript"
          className="skill-input"
        />
        <button type="submit" className="btn-add-skill">
          Thêm
        </button>
      </form>

      <div className="skill-tags-container">
        {resumeData.skills.map((skill, index) => (
          <div key={index} className="skill-tag">
            {skill}
            <button 
              type="button" 
              onClick={() => handleDeleteSkill(skill)} 
              className="btn-delete-skill"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;