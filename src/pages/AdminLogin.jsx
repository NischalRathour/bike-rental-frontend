import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import { useAuth } from '../context/AuthContext'; // ✅ Essential for state sync
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaBicycle } from 'react-icons/fa';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const { login, user, loading: authLoading } = useAuth(); // ✅ Pulling login and user state
  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    password: '123456'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // 🛡️ Guard: If an admin session is already active, jump straight to dashboard
  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log("🔐 Authenticating Admin...");
      
      const response = await api.post('/admin/login', formData);
      
      if (response.data.success) {
        // ✅ CRITICAL STEP: 
        // We call the context 'login' which updates the global state.
        // This ensures 'ProtectedRoute' sees the user immediately.
        login(response.data.user, response.data.token);
        
        console.log("✅ Admin verified. State synchronized.");
        
        // Use navigate to move to the dashboard within the SPA
        navigate('/admin'); 
      }
    } catch (err) {
      console.error('❌ Authentication failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 🛠 Session Reset (Debug Tool)
  const resetSession = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <div className="logo">
            <FaBicycle className="logo-icon" />
            <h1>Ride N Roar</h1>
          </div>
          <p className="subtitle">Administrator Console</p>
        </div>

        {/* Display Errors if any */}
        {error && (
          <div className="error-alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" /> Admin Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="admin@example.com"
              required 
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" /> Password
            </label>
            <div className="password-input">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                required 
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={resetSession} className="debug-button" type="button">
            Reset Session
          </button>
          <p className="help-text">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;