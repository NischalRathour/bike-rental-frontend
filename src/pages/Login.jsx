import React, { useState } from "react";
import api from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

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
      // 1. Authenticate with your Kathmandu backend (Port 5000)
      const res = await api.post("/users/login", input); 
      const { token, role, name, email, _id } = res.data;

      // 2. Save session in AuthContext & LocalStorage
      login({ id: _id, name, email, role }, token);

      // 3. ✅ NAVIGATION FIX: 
      // We must navigate to the exact paths defined in your App.js Routes.
      if (role === "admin") {
        // App.js defines: path="/admin"
        navigate("/admin"); 
      } else {
        // App.js defines: path="/customer"
        navigate("/customer"); 
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your Ride N Roar account</p>
        </div>

        {error && <div className="auth-error-box">{error}</div>}

        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="email" 
            placeholder="example@mail.com" 
            value={input.email}
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            value={input.password}
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" className="btn-auth" disabled={loading}>
          {loading ? "Verifying Session..." : "Login"}
        </button>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;