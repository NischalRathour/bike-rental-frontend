import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'; // ⚡ FIXED: Imported Provider to handle dynamic environments locally
import "../styles/Login.css"; 

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [input, setInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚡ DYNAMIC ENVIRONMENT CHECK
  // Dynamically switches keys so local and live environments execute concurrently without adjustments
  const IS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  
  const CURRENT_GOOGLE_CLIENT_ID = IS_LOCAL
    ? "882551458559-vdp154cg3ussv7eh5h7t2oqln386fk0h.apps.googleusercontent.com" // 🟢 Key A (Localhost)
    : "715694544162-5o84adq0s3lc0aqr90jhbpfgjdkq4gh1.apps.googleusercontent.com"; // 🌐 Key B (Vercel Production)

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

  // 1. Standard Credential Submit Handler
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

  // 2. Google OAuth Success Handler (Federated Tunnel to Backend)
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const { credential } = credentialResponse;
      
      // Send the token signature directly to your backend endpoint
      const res = await api.post('/users/google-login', { token: credential });
      
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
      console.error("Google Authentication Handshake Failure:", err);
      setError(err.response?.data?.technicalReason || err.response?.data?.message || "Google single sign-on verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ⚡ FIXED: Wrapped container with the context provider using our dynamic environmental ID hook */
    <GoogleOAuthProvider clientId={CURRENT_GOOGLE_CLIENT_ID}>
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

              <div className="auth-divider">
                <span>OR SIGN IN WITH</span>
              </div>

              <div className="google-oauth-row" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Sign-On Transaction Rejected")}
                  theme="outline"
                  size="large"
                  shape="pill"
                  width="350"
                  text="signin_with"
                  useOneTap
                />
              </div>

              <p className="auth-footer-modern">New here? <Link to="/register">Create an account</Link></p>
            </motion.div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;