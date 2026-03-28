import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1️⃣ LOADING GUARD: Wait for the app to check if we are logged in
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="#6366f1" />
        <p>Verifying Session...</p>
      </div>
    );
  }

  // 2️⃣ AUTHENTICATION CHECK: If no user, go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3️⃣ ROLE CHECK: Use the role directly from the AuthContext user object
  const userRole = user.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If they are logged in but don't have permission for this specific page, 
    // send them to their own dashboard instead of logging them out.
    const redirectPath = 
      userRole === 'admin' ? '/admin/dashboard' : 
      userRole === 'owner' ? '/owner-dashboard' : 
      '/customer';
      
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ SUCCESS: Allow access to the page
  return children;
};

export default ProtectedRoute;