import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bike, Compass, Headphones, User, 
  LayoutDashboard, LogOut, ChevronDown, 
  Sparkles, MapPin, ShieldCheck, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    const role = user.role?.toLowerCase();
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'owner') return '/owner-dashboard';
    return '/customer';
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Compass size={20}/> },
    { name: 'Bikes', path: '/bikes', icon: <Bike size={20}/> },
    { name: 'Tours', path: '/tours', icon: <Sparkles size={20}/> },
    { name: 'Support', path: '/contact', icon: <Headphones size={20}/> },
  ];

  return (
    <nav className={`premium-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        
        {/* 🦁 BRAND LOGO - High Visibility */}
        <Link to="/" className="brand-box">
          <div className="logo-glow-wrapper">
            <Bike size={26} className="logo-svg" />
          </div>
          <div className="brand-text">
            <span className="brand-name">RIDE N ROAR</span>
            <span className="brand-loc"><MapPin size={12} /> KATHMANDU</span>
          </div>
        </Link>

        {/* 🧭 NAVIGATION ENGINE - Bold & Clear */}
        <div className="nav-links-wrapper">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`nav-pill ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.name}</span>
              {location.pathname === link.path && (
                <motion.div layoutId="nav-active" className="nav-active-dot" />
              )}
            </Link>
          ))}
        </div>

        {/* 👤 AUTH HUB - User Friendly Dropdown */}
        <div className="user-action-area">
          {!user ? (
            <div className="guest-btns">
              <Link to="/login" className="login-link">Sign In</Link>
              <Link to="/register" className="signup-btn-premium">
                Join <ShieldCheck size={16} />
              </Link>
            </div>
          ) : (
            <div className="profile-dropdown-trigger">
              <div className="user-avatar-premium">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div className="user-info-stack no-mobile">
                <p className="u-welcome">Welcome,</p>
                <p className="u-display-name">{user.name.split(' ')[0]}</p>
              </div>
              <ChevronDown size={16} className="drop-arrow" />
              
              <div className="nav-dropdown-menu">
                 <div className="menu-profile-header">
                    <p className="u-email-header">{user.email}</p>
                    <span className="u-role-badge">{user.role}</span>
                 </div>
                 <div className="drop-divider"></div>
                 
                 <Link to={getDashboardLink()} className="drop-item">
                    <LayoutDashboard size={18} /> 
                    <span>{user.role === 'customer' ? 'My Bookings' : 'Control Center'}</span>
                 </Link>
                 
                 <Link to="/account" className={`drop-item ${location.pathname === '/account' ? 'active-drop' : ''}`}>
                    <Settings size={18} /> <span>Account Settings</span>
                 </Link>

                 <div className="drop-divider"></div>
                 
                 <button onClick={() => logout(true)} className="drop-item text-danger">
                    <LogOut size={18} /> <span>End Session</span>
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