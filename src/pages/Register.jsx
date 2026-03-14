import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import "../styles/Register.css";

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/register", input);
      if (response.data) {
        setLoading(false);
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-layout">
        
        {/* 🎨 LEFT SIDE: BRAND CONTENT */}
        <div className="auth-visual-side">
          <div className="auth-overlay"></div>
          <img src="/images/moving-bike.jpg" alt="Ride Nepal" className="auth-bg-img" />
          <div className="auth-welcome-text">
            <h2>Join the Community</h2>
            <p>Access Nepal's premium bike fleet and track your eco-impact with every ride.</p>
            <div className="auth-feature-list">
              <div className="auth-f-item"><ShieldCheck size={18}/> Professional Insurance</div>
              <div className="auth-f-item"><ShieldCheck size={18}/> Verified Condition</div>
            </div>
          </div>
        </div>

        {/* 📝 RIGHT SIDE: FORM */}
        <div className="auth-form-side">
          <div className="form-container-managed">
            <div className="auth-header-modern">
              <h1>Create Account</h1>
              <p>Sign up to start your adventure in Kathmandu</p>
            </div>

            <form onSubmit={handleSubmit} className="managed-form">
              <div className="m-input-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="i-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={input.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="m-input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="i-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={input.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="m-input-group">
                <label>Password</label>
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
                {loading ? "Creating Account..." : "Register Now"} <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer-modern">
              <p>Already a member? <Link to="/login">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;