import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaBicycle } from 'react-icons/fa';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: 'admin@example.com',  // ← YOUR EMAIL
    password: '123456'           // ← YOUR PASSWORD
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log("🔐 Attempting admin login with:", formData.email);
      
      // Try multiple endpoints
      let response;
      
      try {
        // First try the correct endpoint
        response = await axios.post('http://localhost:5000/api/admin/auth/login', formData);
      } catch (err) {
        console.log("Trying fallback endpoint...");
        // Try fallback endpoint
        response = await axios.post('http://localhost:5000/api/admin/login', formData);
      }
      
      console.log("✅ Login response:", response.data);
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        
        console.log("✅ Token saved:", response.data.token?.substring(0, 20) + '...');
        
        // Test dashboard access
        try {
          const dashboardRes = await axios.get('http://localhost:5000/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${response.data.token}` }
          });
          console.log("✅ Dashboard test successful");
          navigate('/admin/dashboard');
        } catch (dashboardErr) {
          console.error("❌ Dashboard error:", dashboardErr.response?.data);
          setError('Login succeeded but dashboard access failed: ' + 
            (dashboardErr.response?.data?.message || dashboardErr.message));
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      
      // Specific error messages
      if (error.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (error.response?.status === 403) {
        setError('Access denied. This account is not an admin.');
      } else if (error.response?.status === 404) {
        setError('Login endpoint not found. Check backend server.');
      } else {
        setError(
          error.response?.data?.message || 
          error.message || 
          'Login failed. Please check if backend is running on port 5000.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Test backend connection
  const testBackend = async () => {
    try {
      console.log("Testing backend connection...");
      const response = await axios.get('http://localhost:5000/');
      console.log("✅ Backend is running:", response.data);
      
      // Test admin setup
      const setupRes = await axios.get('http://localhost:5000/api/admin/setup');
      console.log("✅ Admin setup:", setupRes.data);
      
      alert(`✅ Backend is running!\nMessage: ${response.data.message}\nAdmin status: ${setupRes.data.message}`);
    } catch (error) {
      console.error("❌ Backend test failed:", error);
      alert('❌ Backend is not responding.\nMake sure:\n1. Backend server is running\n2. Check: http://localhost:5000/');
    }
  };

  // Test admin credentials
  const testAdminCredentials = async () => {
    try {
      console.log("Testing admin credentials...");
      
      // First check if admin exists
      const setupRes = await axios.get('http://localhost:5000/api/admin/setup');
      console.log("Setup check:", setupRes.data);
      
      if (setupRes.data.success) {
        alert(`✅ Admin found:\nEmail: ${setupRes.data.admin?.email}\nRole: ${setupRes.data.admin?.role}`);
      } else {
        alert('⚠️ Admin not found. Creating one...');
        
        // Try to create admin
        const createRes = await axios.post('http://localhost:5000/api/admin/test-login', {
          email: 'admin@example.com',
          password: '123456'
        });
        
        console.log("Create response:", createRes.data);
        alert('Admin creation attempted. Check console.');
      }
    } catch (error) {
      console.error("Test failed:", error);
      alert('Test failed. Check console for details.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <div className="logo">
            <FaBicycle className="logo-icon" />
            <h1>Bike Rental Admin</h1>
          </div>
          <p className="subtitle">Administrator Dashboard</p>
        </div>

        {error && (
          <div className="error-alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Admin Email
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

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
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
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>

        <div className="login-footer">
          <div className="debug-tools">
            <button 
              onClick={testBackend}
              className="debug-button"
              type="button"
            >
              Test Backend
            </button>
            <button 
              onClick={testAdminCredentials}
              className="debug-button"
              type="button"
            >
              Check Admin
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="debug-button"
              type="button"
            >
              Clear & Reload
            </button>
          </div>
          
          <p className="help-text">
            <strong>Your Credentials:</strong> admin@example.com / 123456
          </p>
          
          <div className="quick-links">
            <button 
              onClick={() => navigate('/home')}
              className="link-button"
              type="button"
            >
              ← Customer Site
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="link-button"
              type="button"
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
