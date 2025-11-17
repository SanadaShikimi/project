// src/main.jsx (ĐÃ SỬA)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ResumeProvider } from './context/ResumeContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ResumeProvider>
        <App />
      </ResumeProvider>
    </AuthProvider>
  </BrowserRouter>
);