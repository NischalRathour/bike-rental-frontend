import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import { useAuth } from '../context/AuthContext'; 
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Terminal, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const { login, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const emailInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true }); 
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/login', formData);
      
      if (response.data.success) {
        // 1. Save data to Context/LocalStorage
        login(response.data.user, response.data.token);

        console.log("🔓 Admin Authorized. Entering Command Center...");

        // 2. 🚨 THE "LOOP KILLER" FIX
        // This refresh ensures the 'admin' role is recognized by all guards.
        window.location.href = '/admin/dashboard'; 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-auth-split">
        <div className="admin-visual-panel">
          <div className="admin-overlay"></div>
          <div className="admin-visual-content">
            <ShieldCheck size={56} className="text-indigo-400" />
            <h1>Command Center</h1>
            <p>Ride N Roar Fleet Management Protocol.</p>
            <div className="admin-system-status">
              <div className="status-item"><Terminal size={14} /> <span>Node: KATHMANDU_ADMIN</span></div>
              <div className="status-item"><div className="pulse-dot"></div> <span>System: Secure</span></div>
            </div>
          </div>
        </div>

        <div className="admin-form-panel">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="admin-login-box">
            <div className="admin-header-text">
              <h2>Admin Login</h2>
              <p>System Credentials Required</p>
            </div>

            <AnimatePresence>
                {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="admin-error-alert">
                    <ShieldAlert size={18} />
                    <span>{error}</span>
                </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="admin-managed-form">
              <div className="admin-input-group">
                <label>System Email</label>
                <div className="input-focus-box">
                  <Mail size={18} className="input-icon" />
                  <input ref={emailInputRef} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@example.com" required />
                </div>
              </div>

              <div className="admin-input-group">
                <label>Access Key</label>
                <div className="input-focus-box">
                  <Lock size={18} className="input-icon" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                  <button type="button" className="toggle-visibility" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-admin-access" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate Access'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;