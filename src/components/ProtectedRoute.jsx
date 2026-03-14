import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
        <p>Ride N Roar: Verifying Kathmandu Session...</p>
      </div>
    );
  }

  const hasToken = localStorage.getItem('token_admin') || localStorage.getItem('token_user');

  // If no user object in memory AND no tokens in storage, redirect to login
  if (!user && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role validation: matches your User model role ["customer", "admin"]
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;