import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    const adminToken = localStorage.getItem('token_admin');
    const userToken = localStorage.getItem('token_user');

    // Optimistic Hydration: prevent UI flicker by loading from storage immediately
    const savedAdmin = localStorage.getItem('adminUser');
    const savedUser = localStorage.getItem('userInfo');
    if (adminToken && savedAdmin) setUser(JSON.parse(savedAdmin));
    else if (userToken && savedUser) setUser(JSON.parse(savedUser));

    if (adminToken || userToken) {
      try {
        // Direct admins to dashboard and customers to profile
        const endpoint = adminToken ? '/admin/dashboard' : '/users/me';
        const res = await api.get(endpoint);
        if (res.data.success) {
          setUser(res.data.user); // Sync fresh data from MongoDB
        }
      } catch (err) {
        if (err.response?.status === 401) logout();
      }
    }
    // ✅ CRITICAL: loading must finish AFTER the sync attempt is done
    setLoading(false); 
  };

  useEffect(() => { checkUser(); }, []);

  const login = (userData, token) => {
    setUser(userData);
    const isAdmin = userData.role === 'admin';
    localStorage.setItem(isAdmin ? 'token_admin' : 'token_user', token);
    localStorage.setItem(isAdmin ? 'adminUser' : 'userInfo', JSON.stringify(userData));
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