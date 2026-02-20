import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMotorcycle, FaUserCircle, FaSignOutAlt, FaChevronDown, FaHistory, FaColumns } from 'react-icons/fa';

// ✅ THIS LINE IS THE FIX: It connects the CSS to this file
import "../styles/Navbar.css"; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <FaMotorcycle className="logo-icon" style={{ fontSize: '28px', color: '#00dbde' }} />
          <span className="logo-text">Ride N Roar</span>
        </Link>

        {/* NAV LINKS */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/bikes" className="nav-link">Bikes</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        {/* AUTH / USER SECTION */}
        <div className="navbar-auth">
          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          ) : (
            <div className="user-section">
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <FaChevronDown className="dropdown-arrow" />

              {/* DROPDOWN MENU */}
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <strong>Account Settings</strong>
                  <span className="admin-badge">{user.role.toUpperCase()}</span>
                </div>
                
                {user.role === 'customer' && (
                  <>
                    <button onClick={() => navigate('/customer/dashboard')} className="dropdown-item">
                      <FaColumns /> Dashboard
                    </button>
                    <button onClick={() => navigate('/my-bookings')} className="dropdown-item">
                      <FaHistory /> My Bookings
                    </button>
                  </>
                )}

                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin/dashboard')} className="dropdown-item admin-item">
                    <FaColumns /> Admin Panel
                  </button>
                )}

                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-item logout-item">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;