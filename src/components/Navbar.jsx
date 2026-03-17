import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  Bike, 
  Map, 
  PhoneCall 
} from 'lucide-react';
import "../styles/Navbar.css"; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for premium glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'owner') return '/owner-dashboard';
    return '/customer';
  };

  return (
    <nav className={`nav-premium ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        {/* 🏁 BRAND LOGO */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon-wrapper">
            <Bike size={22} strokeWidth={3} />
          </div>
          <span className="logo-text">Ride N Roar</span>
        </Link>

        {/* 🗺️ MAIN BUSINESS LINKS (FDD ALIGNED) */}
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/bikes" className={location.pathname === '/bikes' ? 'active' : ''}>Hire Rates</Link>
          <Link to="/tours" className={location.pathname === '/tours' ? 'active' : ''}>Tours</Link>
          <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>Gallery</Link>
          <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blog</Link>
          <Link to="/contact" className="nav-contact-link">
            <PhoneCall size={14} /> Get in touch
          </Link>
        </div>

        {/* 👤 AUTH & ACTOR LOGIC */}
        <div className="nav-actions">
          {!user ? (
            <div className="auth-group">
              <Link to="/login" className="btn-login-minimal">Login</Link>
              <Link to="/register" className="btn-signup-premium">Create Account</Link>
            </div>
          ) : (
            <div className="user-dropdown-trigger">
              <div className="user-profile-pill">
                <div className="avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <ChevronDown size={14} className="dropdown-arrow" />
              </div>

              {/* DROPDOWN MENU */}
              <div className="nav-dropdown-menu">
                <Link to={getDashboardLink()} className="dropdown-item">
                  <LayoutDashboard size={16} /> 
                  {user.role === 'customer' ? 'My Bookings' : 'Control Panel'}
                </Link>
                <button onClick={logout} className="dropdown-item logout-red">
                  <LogOut size={16} /> Sign Out
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