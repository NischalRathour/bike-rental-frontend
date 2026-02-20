import React, { useState } from "react";
import api from "../api/axiosConfig"; // ✅ Use the 'api' instance consistent with Login.jsx
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // ✅ Automatically set the role to customer
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
      // ✅ Updated path to match your mounting: app.use("/api/users", userRoutes)
      const response = await api.post("/users/register", input);
      
      if (response.data) {
        setLoading(false);
        // After successful registration in Kathmandu, send them to login
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Your Account</h2>
          <p className="register-subtitle">
            Join <strong>Ride N Roar</strong> and book your ride today 🏍️
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={input.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
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

          {/* Hidden input to ensure role is always sent as customer */}
          <input type="hidden" name="role" value="customer" />

          {error && <p className="register-error-msg">{error}</p>}

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;