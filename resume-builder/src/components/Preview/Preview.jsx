// src/components/Preview/Preview.jsx
import React from 'react'; // <-- 1. Import React
import { useResume } from '../../context/ResumeContext';
import ModernTemplate from './templates/ModernTemplate';

// 2. Dùng React.forwardRef để bọc component
const Preview = React.forwardRef((props, ref) => {
  const { resumeData } = useResume();
  
  const [template, setTemplate] = React.useState('modern'); 

  return (
    <div className="preview-panel">
      {/* 3. Gắn ref vào div cha mà chúng ta muốn "chụp ảnh" */}
      <div ref={ref}>
        {template === 'modern' && <ModernTemplate data={resumeData} />}
      </div>
    </div>
  );
}); // <-- 4. Kết thúc bọc

export default Preview;