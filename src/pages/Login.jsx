import React, { useState } from "react";
import api from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

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
      const res = await api.post("/users/login", input); // endpoint

      const { token, role } = res.data;

      // Save token based on role
      if (role === "customer") {
        localStorage.setItem("customerToken", token);
        alert("Login successful as Customer!");
        navigate("/"); // Customer homepage
      } else if (role === "owner") {
        localStorage.setItem("ownerToken", token);
        alert("Login successful as Owner!");
        navigate("/dashboard"); // Owner dashboard
      } else if (role === "admin") {
        localStorage.setItem("adminToken", token);
        alert("Login successful as Admin!");
        navigate("/admin-dashboard"); // Admin dashboard
      } else {
        alert("Unknown role! Cannot login.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
