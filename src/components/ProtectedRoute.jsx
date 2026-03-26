import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * 🛡️ RIDE N ROAR - ULTIMATE PROTECTED ROUTE
 * Handles: Loading States, Multi-Source Role Resolution, and Admin Bypasses.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1️⃣ LOADING GUARD: Wait for AuthContext to finish hydrateSession
  if (loading) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', background: '#f8fafc' 
      }}>
        <Loader2 className="animate-spin" size={40} color="#6366f1" />
        <p style={{ marginTop: '15px', color: '#6366f1', fontWeight: '600' }}>
          Securing Kathmandu Session...
        </p>
      </div>
    );
  }

  // 2️⃣ AUTHENTICATION CHECK
  // Verify token exists in storage as a backup to the user state
  const hasToken = localStorage.getItem('token_ride_roar');
  if (!user && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3️⃣ ROLE RESOLUTION (Multi-Source Fix)
  // We check memory, then specific role key, then the cached user object
  const cachedUserInfo = localStorage.getItem('userInfo');
  const parsedUser = cachedUserInfo ? JSON.parse(cachedUserInfo) : null;
  
  const currentUserRole = user?.role || localStorage.getItem('userRole') || parsedUser?.role;

  // 🚨 Integrity Failure: If we have a session but NO role, the data is corrupt
  if (!currentUserRole || currentUserRole === 'undefined') {
    console.error("🚨 SESSION INTEGRITY FAILURE: Role missing. Wiping session...");
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 4️⃣ AUTHORIZATION CHECK (Admin/Owner/Customer Validation)
  if (allowedRoles && !allowedRoles.includes(currentUserRole)) {
    console.warn(`🚨 ACCESS DENIED: Role [${currentUserRole}] attempted to reach [${location.pathname}]`);
    
    // Auto-redirect to the correct Command Center based on identity
    const homeBase = 
      currentUserRole === 'admin' ? '/admin/dashboard' : 
      currentUserRole === 'owner' ? '/owner-dashboard' : 
      '/customer';
      
    return <Navigate to={homeBase} replace />;
  }

  // 5️⃣ VERIFICATION GUARD
  // Force OTP verification ONLY for non-admins who aren't verified yet
  const isVerified = user?.isVerified || parsedUser?.isVerified;
  
  if (currentUserRole !== 'admin' && !isVerified && location.pathname !== '/verify-otp') {
    return <Navigate to="/verify-otp" state={{ email: user?.email || parsedUser?.email }} replace />;
  }

  // ✅ ALL SYSTEMS GO
  return children;
};

export default ProtectedRoute;