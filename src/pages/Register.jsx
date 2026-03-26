import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
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
    try {
      const response = await api.post("/users/register", input);
      if (response.data.success) {
        navigate("/verify-otp", { state: { email: input.email } });
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
          <img src="/images/moving-bike.jpg" alt="Ride Nepal" className="auth-bg-img" />
          <div className="auth-welcome-text">
            <h2>Join the Community</h2>
            <p>Nepal's premium bike fleet awaits.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="form-container-managed">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit} className="managed-form">
              <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
              {error && <p className="m-error-box">{error}</p>}
              <button type="submit" disabled={loading}>{loading ? "Sending OTP..." : "Register Now"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;