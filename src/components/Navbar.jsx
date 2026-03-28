import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  MapPin
} from 'lucide-react';
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
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'owner') return '/owner-dashboard';
    return '/customer';
  };

  return (
    <nav className={`nav-root ${isScrolled ? 'nav-active' : ''}`}>
      <div className="nav-wrapper">
        
        {/* 🏁 LOGO SECTION */}
        <Link to="/" className="brand-box">
          <div className="brand-icon">
            <Bike size={20} strokeWidth={2.5} />
          </div>
          <div className="brand-labels">
            <span className="brand-name">Ride N Roar</span>
            <span className="brand-loc"><MapPin size={8} /> KATHMANDU</span>
          </div>
        </Link>

        {/* 🧭 SIMPLE NAV LINKS */}
        <div className="nav-menu">
          <Link to="/" className={location.pathname === '/' ? 'link-active' : ''}>Home</Link>
          <Link to="/bikes" className={location.pathname === '/bikes' ? 'link-active' : ''}>Bikes</Link>
          <Link to="/tours" className={location.pathname === '/tours' ? 'link-active' : ''}>Tours</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'link-active' : ''}>Support</Link>
        </div>

        {/* 👤 PROFILE & AUTH */}
        <div className="nav-side">
          {!user ? (
            <div className="guest-btns">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="signup-btn">
                Join <ShieldCheck size={14} />
              </Link>
            </div>
          ) : (
            <div className="user-group">
              <div className="user-pill">
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle size={18} />}
                </div>
                <div className="user-meta">
                  <span className="u-name">{user?.name?.split(' ')[0] || "User"}</span>
                  <span className="u-role">{user?.role}</span>
                </div>
                <ChevronDown size={12} className="u-arrow" />
              </div>

              {/* DROPDOWN MENU */}
              <div className="user-menu-drop">
                <div className="menu-header">
                   <p>{user?.email}</p>
                </div>
                
                <div className="menu-sep"></div>

                <Link to={getDashboardLink()} className="menu-link">
                  <LayoutDashboard size={15} /> 
                  <span>{user?.role === 'customer' ? 'My Bookings' : 'My Garage'}</span>
                </Link>

                <Link to="/profile" className="menu-link">
                  <Settings size={15} /> 
                  <span>Settings</span>
                </Link>

                <div className="menu-sep"></div>

                <button onClick={logout} className="menu-link out-btn">
                  <LogOut size={15} /> <span>Logout</span>
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