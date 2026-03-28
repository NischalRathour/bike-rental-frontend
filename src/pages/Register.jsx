import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/Register.css";

const Register = () => {
  const [input, setInput] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/users/register", {
        ...input,
        email: input.email.toLowerCase().trim()
      });
      if (response.data.success) {
        // Pass requiresOTP: false because this is account activation, not 2FA login
        navigate("/verify-otp", { state: { email: input.email, requiresOTP: false } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-layout">
        <div className="auth-visual-side">
          <div className="auth-overlay"></div>
          <div className="auth-welcome-text">
            <ShieldCheck size={40} color="#6366f1" />
            <h2>Join the Fleet.</h2>
            <p>Nepal's premium bike marketplace awaits.</p>
          </div>
        </div>

        <div className="auth-form-side">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-container-managed">
            <h1>Create Account</h1>
            <p className="subtitle">Join as a Renter or a Bike Owner</p>

            <form onSubmit={handleSubmit} className="managed-form">
              <div className="m-input-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="i-icon" />
                  <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
                </div>
              </div>

              <div className="m-input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="i-icon" />
                  <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} required />
                </div>
              </div>

              <div className="m-input-group">
                <label>Join Ride N Roar as a:</label>
                <select name="role" value={input.role} onChange={handleChange} className="role-selector-premium">
                  <option value="customer">Renter (Customer)</option>
                  <option value="owner">Bike Owner (Partner)</option>
                </select>
              </div>

              <div className="m-input-group">
                <label>Secure Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="i-icon" />
                  <input type="password" name="password" placeholder="Min 6 characters" onChange={handleChange} required minLength="6" />
                </div>
              </div>

              {error && <div className="m-error-box">{error}</div>}

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Register Now <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="auth-footer-modern">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;