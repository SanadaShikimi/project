import React from 'react';
import { useResume } from '../../context/ResumeContext';

const PersonalInfo = () => {
  const { resumeData, setResumeData } = useResume();

  // Hàm xử lý khi gõ chữ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prevData => ({
      ...prevData,
      personal: {
        ...prevData.personal,
        [name]: value
      }
    }));
  };

  return (
    <div className="form-section">
      <h3>Thông tin cá nhân</h3>
      <div className="form-group">
        <label>Họ và tên</label>
        <input
          type="text"
          name="fullName"
          value={resumeData.personal.fullName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Vị trí ứng tuyển</label>
        <input
          type="text"
          name="jobTitle"
          value={resumeData.personal.jobTitle}
          onChange={handleChange}
        />
      </div>
      {/* Thêm các input cho email, phone, address... */}
    </div>
  );
};

export default PersonalInfo;