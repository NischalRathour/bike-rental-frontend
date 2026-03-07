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

  useEffect(() => {
    // If already logged in as admin, go to admin portal
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
        
        // Ensure we only let admins in through this specific portal
        if (role !== 'admin') {
          setError('Access restricted to administrators.');
          setLoading(false);
          return;
        }

        login({ id: _id, name, email, role }, token);
        navigate('/admin'); // Redirect to the Landing Page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
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
            {loading ? 'Decrypting Credentials...' : 'Access Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;