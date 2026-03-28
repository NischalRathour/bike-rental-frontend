import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/Login.css"; 

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner-dashboard');
      else navigate('/customer');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanInput = {
        email: input.email.toLowerCase().trim(),
        password: input.password
      };

      const res = await api.post("/users/login", cleanInput); 

      if (res.data.requiresOTP) {
        navigate("/verify-otp", { 
          state: { email: res.data.email, requiresOTP: true } 
        });
        return;
      }

      if (res.data.success) {
        login(res.data.user, res.data.token);
        
        const role = res.data.user.role;
        if (role === 'admin') {
           window.location.href = '/admin/dashboard';
        } else if (role === 'owner') {
           navigate('/owner-dashboard');
        } else {
           navigate('/customer');
        }
      }

    } catch (err) {
      if (err.response?.data?.needsVerification) {
        navigate("/verify-otp", { state: { email: input.email, requiresOTP: false } });
      } else {
        setError(err.response?.data?.message || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-layout">
        <div className="auth-visual-side">
          <div className="auth-overlay"></div>
          <div className="auth-welcome-text">
            <h2>Welcome Back.</h2>
            <p>Your journey continues here.</p>
          </div>
        </div>

        <div className="auth-form-side">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-container-managed">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="managed-form">
              <div className="m-input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="i-icon" />
                  <input type="email" name="email" value={input.email} onChange={handleChange} required placeholder="email@example.com" />
                </div>
              </div>

              <div className="m-input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none' }}>Forgot Password?</Link>
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="i-icon" />
                  <input type="password" name="password" value={input.password} onChange={handleChange} required placeholder="••••••••" />
                </div>
              </div>

              {error && <div className="m-error-box">{error}</div>}

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Login <LogIn size={18} /></>}
              </button>
            </form>
            <p className="auth-footer-modern">New here? <Link to="/register">Create an account</Link></p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;