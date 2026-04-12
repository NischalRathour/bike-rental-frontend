import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  /**
   * ✅ SYNC HELPER
   * Updates state and LocalStorage simultaneously to ensure
   * the "Edit Profile" changes reflect across the whole app.
   */
  const updateUserData = (newData) => {
    if (!newData) return;
    const role = newData.role?.toLowerCase() || 'customer';
    const normalizedUser = { ...newData, role };
    
    setUser(normalizedUser);
    localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
    localStorage.setItem('userRole', role);
  };

  /**
   * 🌊 HYDRATE SESSION
   * Checks LocalStorage on refresh and verifies token with Backend
   */
  const hydrateSession = async () => {
    const token = localStorage.getItem('token_ride_roar');
    const cachedUser = localStorage.getItem('userInfo');

    // Step 1: Immediate UI update from cache (Premium UX)
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('userInfo');
      }
    }

    // Step 2: Verify with Backend for data integrity
    if (token) {
      try {
        const res = await api.get('/users/me');
        if (res.data.success) {
          updateUserData(res.data.user);
        }
      } catch (err) {
        // If token is invalid or expired
        if (err.response?.status === 401) {
          setSessionExpired(true);
          logout(false); // Clear data but don't force redirect yet
        }
      }
    }
    setLoading(false);
  };

  /**
   * ⏱️ SESSION WATCHER (JWT Logic)
   * Runs every 15 seconds to check token expiration
   */
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token_ride_roar');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const timeLeft = decoded.exp - currentTime;

        // 🚨 Warning: Show alert if less than 60s remaining
        if (timeLeft > 0 && timeLeft < 60) {
          setShowTimeoutWarning(true);
        } else {
          setShowTimeoutWarning(false);
        }

        // 🚪 Expiry: Auto-logout if token is dead
        if (timeLeft <= 0) {
          setSessionExpired(true);
          logout(false);
        }
      } catch (err) {
        console.error("JWT Decode failed:", err);
      }
    };

    hydrateSession();
    
    const interval = setInterval(checkTokenExpiry, 15000);
    return () => clearInterval(interval);
  }, []);

  /**
   * 🔑 LOGIN HANDLER
   */
  const login = (userData, token) => {
    localStorage.setItem('token_ride_roar', token);
    updateUserData(userData);
    setSessionExpired(false);
    setShowTimeoutWarning(false);
  };

  /**
   * 🚪 LOGOUT HANDLER
   */
  const logout = (shouldRedirect = true) => {
    const role = user?.role || localStorage.getItem('userRole');
    
    localStorage.clear(); // Complete Wipe
    setUser(null);
    setShowTimeoutWarning(false);
    
    if (shouldRedirect) {
      // Redirect based on role for a customized experience
      window.location.href = role === 'admin' ? '/admin-login' : '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: updateUserData, 
      login, 
      logout, 
      loading, 
      showTimeoutWarning,
      sessionExpired,
      setSessionExpired,
      isAuthenticated: !!user,
      isAdmin: (user?.role === 'admin' || localStorage.getItem('userRole') === 'admin'),
      isOwner: (user?.role === 'owner' || localStorage.getItem('userRole') === 'owner')
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);