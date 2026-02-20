import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import { useAuth } from '../context/AuthContext'; 
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaBicycle } from 'react-icons/fa';
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

  // Guard: If admin is already logged in and tries to access login page, send to home
  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      navigate('/'); 
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/users/login', formData); // Using shared login route
      
      if (response.data) {
        const { token, role, name, email, _id } = response.data;
        
        // Sync with AuthContext
        login({ id: _id, name, email, role }, token);
        
        // ✅ LOGIC FIX: Send to Home instead of Dashboard
        navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
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

        {error && <div className="error-alert"><p>{error}</p></div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label><FaEnvelope /> Admin Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label><FaLock /> Password</label>
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Access Site'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;