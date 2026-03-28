import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const hydrateSession = async () => {
    const token = localStorage.getItem('token_ride_roar');
    const cachedUser = localStorage.getItem('userInfo');

    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        if (parsed && parsed.role) {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem('userInfo');
      }
    }

    if (token) {
      try {
        const res = await api.get('/users/me');
        if (res.data.success) {
          const freshUserData = res.data.user;
          setUser(freshUserData);
          localStorage.setItem('userInfo', JSON.stringify(freshUserData));
          localStorage.setItem('userRole', freshUserData.role.toLowerCase());
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setSessionExpired(true);
          logout(false); // Logout state but don't redirect yet
        }
      }
    }
    setLoading(false);
  };

  /**
   * ⏱️ SESSION WATCHER
   */
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token_ride_roar');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const timeLeft = decoded.exp - currentTime;

        // 🚨 Warning at 60 seconds
        if (timeLeft > 0 && timeLeft < 60) {
          setShowTimeoutWarning(true);
        } else {
          setShowTimeoutWarning(false);
        }

        // 🚪 Expiry at 0 seconds
        if (timeLeft <= 0) {
          setSessionExpired(true);
          logout(false);
        }
      } catch (err) {
        console.error("Session monitor error:", err);
      }
    };

    hydrateSession();
    
    const interval = setInterval(checkTokenExpiry, 15000);
    return () => clearInterval(interval);
  }, []);

  const login = (userData, token) => {
    if (!userData || !userData.role) return;

    const role = userData.role.toLowerCase();
    const normalizedUser = { ...userData, role };

    localStorage.setItem('token_ride_roar', token);
    localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
    localStorage.setItem('userRole', role); 
    
    setUser(normalizedUser);
    setSessionExpired(false);
    setShowTimeoutWarning(false);
  };

  const logout = (shouldRedirect = true) => {
    const role = user?.role || localStorage.getItem('userRole');
    localStorage.clear();
    setUser(null);
    setShowTimeoutWarning(false);
    
    if (shouldRedirect) {
      window.location.href = role === 'admin' ? '/admin-login' : '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
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