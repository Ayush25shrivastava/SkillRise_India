import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to login but save the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
