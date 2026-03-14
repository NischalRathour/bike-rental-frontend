import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import { useAuth } from '../context/AuthContext'; 
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Terminal, ShieldAlert } from 'lucide-react';
import { motion } from "framer-motion";
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const { login, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    password: '123456'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      navigate('/admin'); 
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
      const response = await api.post('/users/login', formData);
      
      if (response.data) {
        const { token, role, name, email, _id } = response.data;
        
        if (role !== 'admin') {
          setError('Unauthorized: Administrative access only.');
          setLoading(false);
          return;
        }

        login({ id: _id, name, email, role }, token);
        navigate('/admin'); 
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
        
        {/* 🛠️ LEFT SIDE: SECURITY TERMINAL VISUAL */}
        <div className="admin-visual-panel">
          <div className="admin-overlay"></div>
          <div className="admin-visual-content">
            <div className="shield-icon-box">
              <ShieldCheck size={48} />
            </div>
            <h1>Command Center</h1>
            <p>Authorized personnel only. Accessing the Ride N Roar fleet management systems requires encrypted credentials.</p>
            
            <div className="admin-system-status">
              <div className="status-item">
                <Terminal size={14} /> <span>System: Secure</span>
              </div>
              <div className="status-item">
                <div className="pulse-dot"></div> <span>Fleet Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* 📝 RIGHT SIDE: LOGIN FORM */}
        <div className="admin-form-panel">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="admin-login-box"
          >
            <div className="admin-header-text">
              <h2>Admin Login</h2>
              <p>Please enter your system credentials</p>
            </div>

            {error && (
              <div className="admin-error-alert">
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-managed-form">
              <div className="admin-input-group">
                <label>System Email</label>
                <div className="input-focus-box">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="admin@ridenroar.com"
                    required 
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label>Access Key</label>
                <div className="input-focus-box">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="••••••••"
                    required 
                  />
                  <button 
                    type="button" 
                    className="toggle-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-admin-access" disabled={loading}>
                {loading ? 'Decrypting...' : 'Authenticate Access'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;