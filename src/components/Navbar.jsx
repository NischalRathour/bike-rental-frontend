import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  Bike, 
  Settings,
  ShieldCheck,
  UserCircle,
  MapPin,
  Compass,
  Sparkles,
  Headphones
} from 'lucide-react';
import "../styles/Navbar.css"; 

/**
 * 🛰️ GLOBAL NAVIGATION SUBSYSTEM - PREMIUM EDITION
 * Synchronized with Auth logic and Mega-Typography styling
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // ✨ UI Logic: Navbar transparency and height shift on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * 🛡️ ROLE-BASED DYNAMIC ROUTING
   * Maps users to their specific entry points (Admin, Owner, Customer)
   */
  const getDashboardLink = () => {
    if (!user) return '/login';
    const role = user.role?.toLowerCase();
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'owner') return '/owner-dashboard';
    return '/customer';
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Compass size={24}/> },
    { name: 'Bikes', path: '/bikes', icon: <Bike size={24}/> },
    { name: 'Tours', path: '/tours', icon: <Sparkles size={24}/> },
    { name: 'Support', path: '/contact', icon: <Headphones size={24}/> },
  ];

  return (
    <nav className={`premium-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        
        {/* 🏁 BRAND IDENTITY - MEGA SCALE */}
        <Link to="/" className="brand-box">
          <div className="logo-glow-wrapper">
            <Bike size={32} className="logo-svg" strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <span className="brand-name">RIDE N ROAR</span>
            <span className="brand-loc"><MapPin size={14} /> KATHMANDU</span>
          </div>
        </Link>

        {/* 🧭 NAVIGATION ENGINE - MEGA PILLS */}
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

        {/* 👤 AUTHENTICATION & PROFILE HUB */}
        <div className="user-action-area">
          {!user ? (
            <div className="guest-btns">
              <Link to="/login" className="login-link">Sign In</Link>
              <Link to="/register" className="signup-btn-premium">
                Join <ShieldCheck size={20} />
              </Link>
            </div>
          ) : (
            <div className="profile-dropdown-trigger">
              <div className="user-avatar-premium">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={22} />}
              </div>
              <div className="user-info-stack no-mobile">
                <p className="u-welcome">Welcome back,</p>
                <p className="u-display-name">{user?.name?.split(' ')[0] || "Member"}</p>
              </div>
              <ChevronDown size={20} className="drop-arrow" />
              
              {/* 📂 SECURE MEGA DROPDOWN MENU */}
              <div className="nav-dropdown-menu">
                 <div className="menu-profile-header">
                    <p className="u-email-header">{user?.email}</p>
                    <span className="u-role-badge">{user?.role}</span>
                 </div>
                 <div className="drop-divider"></div>
                 
                 <Link to={getDashboardLink()} className="drop-item">
                    <LayoutDashboard size={22} /> 
                    <span>{user?.role === 'customer' ? 'My Bookings' : 'Control Center'}</span>
                 </Link>
                 
                 <Link to="/account" className={`drop-item ${location.pathname === '/account' ? 'active-drop' : ''}`}>
                    <Settings size={22} /> <span>Account Settings</span>
                 </Link>

                 <div className="drop-divider"></div>
                 
                 <button 
                  type="button" 
                  onClick={() => logout(true)} 
                  className="drop-item text-danger"
                 >
                    <LogOut size={22} /> <span>Terminate Session</span>
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