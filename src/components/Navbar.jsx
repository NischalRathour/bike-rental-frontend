import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  Bike, 
  PhoneCall,
  Settings,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import "../styles/Navbar.css"; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Sticky Glassmorphism Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logic for Dashboard Redirection based on Actor Role
  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'owner') return '/owner-dashboard';
    return '/customer';
  };

  return (
    <nav className={`nav-premium ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        
        {/* 🏁 BRAND IDENTITY */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon-wrapper">
            <Bike size={22} strokeWidth={3} />
          </div>
          <div className="logo-text-stack">
            <span className="logo-text-main">Ride N Roar</span>
            <span className="logo-text-sub">KATHMANDU</span>
          </div>
        </Link>

        {/* 🗺️ NAVIGATION LINKS */}
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/bikes" className={location.pathname === '/bikes' ? 'active' : ''}>Fleet</Link>
          <Link to="/tours" className={location.pathname === '/tours' ? 'active' : ''}>Expeditions</Link>
          <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Stories</Link>
          <Link to="/contact" className="nav-contact-pill">
            <PhoneCall size={14} /> <span>Support</span>
          </Link>
        </div>

        {/* 👤 AUTHENTICATION ACTIONS */}
        <div className="nav-actions">
          {!user ? (
            /* --- GUEST VIEW --- */
            <div className="auth-group">
              <Link to="/login" className="btn-login-minimal">Sign In</Link>
              <Link to="/register" className="btn-signup-premium">
                Join the Fleet <ShieldCheck size={14} />
              </Link>
            </div>
          ) : (
            /* --- LOGGED-IN VIEW --- */
            <div className="user-dropdown-container">
              <div className="user-profile-pill">
                <div className="avatar-circle">
                  {/* ✅ FIX: Optional chaining avoids the 'charAt' crash */}
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={18} />}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{user?.name?.split(' ')[0] || "Member"}</span>
                  <span className="user-role-tag">{user?.role}</span>
                </div>
                <ChevronDown size={14} className="dropdown-arrow" />
              </div>

              {/* PREMIUM DROPDOWN CONTENT */}
              <div className="nav-dropdown-menu">
                <div className="dropdown-meta">
                   <p className="meta-label">Signed in as</p>
                   <p className="meta-value">{user?.email}</p>
                </div>
                
                <div className="dropdown-divider"></div>

                <Link to={getDashboardLink()} className="dropdown-item">
                  <LayoutDashboard size={16} /> 
                  <span>{user?.role === 'customer' ? 'My Bookings' : 'Management Hub'}</span>
                </Link>

                <Link to="/profile" className="dropdown-item">
                  <Settings size={16} /> 
                  <span>Account Settings</span>
                </Link>

                <div className="dropdown-divider"></div>

                <button onClick={logout} className="dropdown-item logout-action">
                  <LogOut size={16} /> <span>Sign Out</span>
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