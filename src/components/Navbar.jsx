import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMotorcycle, FaSignOutAlt, FaColumns, FaUser } from 'react-icons/fa';
import "../styles/Navbar.css"; 

const Navbar = () => {
  const { user, logout } = useAuth();

  // Helper function to determine where the dashboard link goes
  const getDashboardLink = () => {
    if (user.role === 'admin') return '/admin';
    if (user.role === 'owner') return '/owner-dashboard';
    return '/customer';
  };

  // Helper function for the Label text
  const getDashboardLabel = () => {
    if (user.role === 'admin') return 'Admin Panel';
    if (user.role === 'owner') return 'Owner Panel';
    return 'My Dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaMotorcycle className="logo-icon" />
          <span className="logo-text">Ride N Roar</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/bikes" className="nav-link">Bikes</Link>
          
          {/* ✅ THE LOGIC FIX: 3-Way Actor Dashboard Link */}
          {user && (
            <Link 
              to={getDashboardLink()} 
              className="nav-link dashboard-highlight"
            >
              <FaColumns /> {getDashboardLabel()}
            </Link>
          )}
        </div>

        <div className="navbar-auth">
          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          ) : (
            <div className="user-controls">
              <span className="user-welcome"><FaUser /> {user.name}</span>
              <button onClick={logout} className="logout-button">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;