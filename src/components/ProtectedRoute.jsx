import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for the API to confirm who the user is
  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <Loader2 className="animate-spin" size={48} color="#6366f1" />
      </div>
    );
  }

  // 2. If the user isn't logged in, send them to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Strict Role Check
  const userRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  // 🚨 If the user's role is NOT in the allowed list, they get KICKED to their dashboard
  if (!normalizedAllowedRoles.includes(userRole)) {
    console.warn(`Unauthorized Access: ${userRole} tried to enter ${location.pathname}`);
    const fallback = userRole === 'owner' ? '/owner-dashboard' : '/customer';
    return <Navigate to={fallback} replace />;
  }

  // ✅ Success: Render the page
  return children;
};

export default ProtectedRoute;