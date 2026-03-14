import React, { useState } from "react";
import api from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from "lucide-react";
import "../styles/Login.css"; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/users/login", input); 
      const { token, role, name, email, _id } = res.data;

      login({ id: _id, name, email, role }, token);

      if (role === 'admin') {
        navigate("/admin");
      } 
      else if (role === 'owner') {
        navigate("/owner-dashboard");
      } 
      else {
        navigate("/"); 
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-layout">
        
        {/* 🏍️ LEFT SIDE: BRAND IMPACT */}
        <div className="auth-visual-side">
          <div className="auth-overlay"></div>
          <img src="/images/moving-bike.jpg" alt="Ride N Roar" className="auth-bg-img" />
          <div className="auth-welcome-text">
            <h2>Welcome Back.</h2>
            <p>Your next journey through the Himalayas is just a login away.</p>
            <div className="auth-trust-badges">
              <div className="badge-item"><ShieldCheck size={18}/> Secure Authentication</div>
              <div className="badge-item"><ShieldCheck size={18}/> 24/7 Fleet Support</div>
            </div>
          </div>
        </div>

        {/* 📝 RIGHT SIDE: LOGIN FORM */}
        <div className="auth-form-side">
          <div className="form-container-managed">
            <div className="auth-header-modern">
              <h1>Login</h1>
              <p>Welcome back to <strong>Ride N Roar</strong> Nepal</p>
            </div>

            <form onSubmit={handleSubmit} className="managed-form">
              <div className="m-input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="i-icon" />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email" 
                    value={input.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="m-input-group">
                <div className="label-flex">
                  <label>Password</label>
                  <Link to="#" className="forgot-link">Forgot?</Link>
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="i-icon" />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="••••••••" 
                    value={input.password} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              {error && <div className="m-error-box">{error}</div>}

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? "Authenticating..." : "Login to Account"} <LogIn size={18} />
              </button>
            </form>

            <div className="auth-footer-modern">
              <p>New to Ride N Roar? <Link to="/register">Create an account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;