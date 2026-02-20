import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    const adminToken = localStorage.getItem('token_admin');
    const userToken = localStorage.getItem('token_user');

    // Load from storage immediately to prevent UI flicker
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) setUser(JSON.parse(savedUser));

    if (adminToken || userToken) {
      try {
        // ✅ PATH FIX: Hits the route you defined: router.get("/me", protect, getMe)
        // mounted at /api/users, so axios calls /users/me
        const endpoint = adminToken ? '/admin/dashboard' : '/users/me';
        const res = await api.get(endpoint);
        
        if (res.data.success) {
          setUser(res.data.user); // Sync fresh data from MongoDB
        }
      } catch (err) {
        console.error("Auth sync failed:", err);
        if (err.response?.status === 401) logout();
      }
    }
    setLoading(false); // ✅ CRITICAL: This allows the ProtectedRoute to render the dashboard
  };

  useEffect(() => { checkUser(); }, []);

  const login = (userData, token) => {
    setUser(userData);
    const key = userData.role === 'admin' ? 'token_admin' : 'token_user';
    localStorage.setItem(key, token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);