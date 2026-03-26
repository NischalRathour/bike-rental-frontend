import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        if (err.response?.status === 401) logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    hydrateSession();
  }, []);

  /**
   * 🔑 LOGIN (The "Loop Killer" Version)
   */
  const login = (userData, token) => {
    if (!userData || !userData.role) {
      return console.error("🚨 LOGIN REJECTED: Missing role.");
    }

    // ✅ 1. Standardize Role (Forces 'admin', 'customer', etc.)
    const role = userData.role.toLowerCase();
    const normalizedUser = { ...userData, role };

    // ✅ 2. IMMEDIATE STORAGE LOCK
    // We save these BEFORE updating state so ProtectedRoute can see them instantly
    localStorage.setItem('token_ride_roar', token);
    localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
    localStorage.setItem('userRole', role); 
    
    // ✅ 3. Update React State
    setUser(normalizedUser);

    console.log(`✅ Vault Access Granted: [${role.toUpperCase()}]`);
  };

  /**
   * 🚪 LOGOUT
   */
  const logout = () => {
    const isAdmin = user?.role === 'admin' || localStorage.getItem('userRole') === 'admin';
    localStorage.clear();
    setUser(null);
    
    // ✅ Use a Hard Redirect to clear all stale memory
    window.location.href = isAdmin ? '/admin-login' : '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated: !!user,
      isAdmin: (user?.role === 'admin' || localStorage.getItem('userRole') === 'admin'),
      isOwner: (user?.role === 'owner' || localStorage.getItem('userRole') === 'owner')
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};