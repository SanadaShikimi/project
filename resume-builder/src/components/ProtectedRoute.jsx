// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    // Nếu không có token, quay về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu có token, hiển thị component con (Dashboard hoặc Builder)
  return <Outlet />;
};

export default ProtectedRoute;