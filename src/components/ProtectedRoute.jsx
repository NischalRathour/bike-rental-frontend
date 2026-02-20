import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Stay on this screen while AuthContext is talking to the backend
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
        <p>Ride N Roar: Verifying Session...</p>
      </div>
    );
  }

  // 2. Check for tokens in storage if state isn't ready
  const hasToken = localStorage.getItem('token_admin') || localStorage.getItem('token_user');
  if (!user && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Validation based on User model ["admin", "customer"]
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;