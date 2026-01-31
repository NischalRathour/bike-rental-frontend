import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBicycle, FaUser, FaSignOutAlt, FaUserShield, FaCaretDown } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
    
    // Close dropdown when clicking outside
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const userInfo = localStorage.getItem("userInfo");
    const adminUser = localStorage.getItem("adminUser");
    
    if (adminToken && adminUser) {
      try {
        const adminData = JSON.parse(adminUser);
        setUser(adminData);
        setIsAdmin(true);
      } catch (error) {
        console.error("Error parsing admin user:", error);
      }
    } else if (token && userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAdmin(false);
    setShowDropdown(false);
    navigate("/");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    checkAuthStatus();
    setShowDropdown(false);
    navigate("/");
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <FaBicycle className="logo-icon" />
          <Link to="/" className="logo-text">
            Ride N Roar
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/bikes" className="nav-link">
            <span className="nav-text">Bikes</span>
          </Link>
          
          {user && (
            <Link to="/dashboard" className="nav-link">
              <span className="nav-text">Dashboard</span>
            </Link>
          )}
        </div>

        {/* Right Side - Auth Section */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-section" onClick={toggleDropdown}>
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-details">
                <span className="user-name">{user.name || user.email}</span>
                {isAdmin && <span className="user-role">Admin</span>}
              </div>
              <FaCaretDown className={`dropdown-arrow ${showDropdown ? 'rotate' : ''}`} />
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <strong>{user.name || user.email}</strong>
                    {isAdmin && <span className="admin-badge">Administrator</span>}
                  </div>
                  
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <FaUser /> My Dashboard
                  </Link>
                  
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="dropdown-item admin-item" onClick={() => setShowDropdown(false)}>
                      <FaUserShield /> Admin Dashboard
                    </Link>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  
                  {isAdmin ? (
                    <button onClick={handleAdminLogout} className="dropdown-item logout-item">
                      <FaSignOutAlt /> Logout from Admin
                    </button>
                  ) : (
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <FaSignOutAlt /> Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/admin/login" className="btn btn-admin">
                <FaUserShield /> Admin Login
              </Link>
              
              <div className="auth-separator">or</div>
              
              <div className="user-auth">
                <Link to="/login" className="btn btn-login">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}