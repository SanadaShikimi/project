// src/components/Preview/templates/ModernTemplate.jsx
import React from 'react';
import './ModernTemplate.css';

const ModernTemplate = ({ data }) => {
  const { personal, experience, education, skills } = data; // Lấy thêm data

  return (
    <div className="resume-modern">
      <header className="resume-header">
        <h1>{personal.fullName}</h1>
        <h2>{personal.jobTitle}</h2>
        <div className="contact-info">
          <span>{personal.email}</span> | 
          <span>{personal.phone}</span> | 
          <span>{personal.address}</span>
        </div>
      </header>
      
      <main className="resume-body">
        
        {/* === KINH NGHIỆM === */}
        <section className="resume-section">
          <h3>Kinh nghiệm làm việc</h3>
          {experience.map(exp => (
            <div key={exp.id} className="job-item">
              <strong>{exp.position}</strong> - <span>{exp.company}</span>
              <span className="job-dates">{exp.startDate} - {exp.endDate}</span>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
        
        {/* === HỌC VẤN (MỚI) === */}
        <section className="resume-section">
          <h3>Học vấn</h3>
          {education.map(edu => (
            <div key={edu.id} className="education-item"> {/* Đổi tên class */}
              <strong>{edu.degree}</strong>
              <span className="job-dates">{edu.startDate} - {edu.endDate}</span>
              <div>{edu.school}</div>
            </div>
          ))}
        </section>

        {/* === KỸ NĂNG (MỚI) === */}
        <section className="resume-section">
          <h3>Kỹ năng</h3>
          <ul className="skills-list">
            {skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>
        
      </main>
    </div>
  );
};

export default ModernTemplate;