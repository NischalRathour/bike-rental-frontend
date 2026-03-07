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
      const res = await api.post("/users/login", input); 
      const { token, role, name, email, _id } = res.data;

      // ✅ 1. Sync with AuthContext
      // This handles storing token_admin, token_owner, or token_user based on role
      login({ id: _id, name, email, role }, token);

      // ✅ 2. TARGETED REDIRECTION
      // We change the behavior ONLY for these two actors
      if (role === 'admin') {
        console.log("Admin authenticated. Launching Command Center...");
        navigate("/admin");
      } 
      else if (role === 'owner') {
        console.log("Owner authenticated. Launching Fleet Dashboard...");
        navigate("/owner-dashboard");
      } 
      else {
        // Customer login remains unchanged
        navigate("/"); 
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back to Ride N Roar</p>
        
        {error && <div className="auth-error-box">{error}</div>}
        
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={input.email} 
          onChange={handleChange} 
          required 
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={input.password} 
          onChange={handleChange} 
          required 
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Authorizing..." : "Login"}
        </button>
        
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
};

export default Login;