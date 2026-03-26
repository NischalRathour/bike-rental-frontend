import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Bike, 
  Users, 
  LogOut, 
  ShieldCheck, 
  Home, 
  ChevronRight,
  Activity,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/AdminLayout.css";

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Ensures "Welcome Portal" only shows when URL is exactly /admin
    const isRoot = location.pathname === '/admin' || location.pathname === '/admin/';

    const handleLogout = () => {
        logout(); // Wipes local session data
        navigate('/admin-login', { replace: true }); 
    };

    return (
        <div className="admin-app-shell">
            {/* --- COMMAND SIDEBAR --- */}
            <aside className="admin-sidebar-premium">
                <div className="sidebar-brand-box">
                    <div className="brand-logo-hex">
                        <ShieldCheck size={24} color="#fff" />
                    </div>
                    <div className="brand-titles">
                        <span className="brand-main">RNR ADMIN</span>
                        <span className="brand-status">
                            <div className="status-dot-pulse"></div> SYSTEM ONLINE
                        </span>
                    </div>
                </div>
                
                <nav className="sidebar-navigation">
                    <Link to="/admin" className={`nav-link-pro ${isRoot ? 'active' : ''}`}>
                        <Home size={20} /> <span>Welcome Portal</span>
                    </Link>
                    <Link to="/admin/dashboard" className={`nav-link-pro ${location.pathname.includes('dashboard') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> <span>Analytics Engine</span>
                    </Link>
                    <Link to="/admin/bikes" className={`nav-link-pro ${location.pathname.includes('bikes') ? 'active' : ''}`}>
                        <Bike size={20} /> <span>Fleet Inventory</span>
                    </Link>
                    <Link to="/admin/bookings" className={`nav-link-pro ${location.pathname.includes('bookings') ? 'active' : ''}`}>
                        <Clock size={20} /> <span>Booking Ops</span>
                    </Link>
                    <Link to="/admin/users" className={`nav-link-pro ${location.pathname.includes('users') ? 'active' : ''}`}>
                        <Users size={20} /> <span>Identity Directory</span>
                    </Link>
                </nav>

                <div className="sidebar-user-footer">
                    <div className="admin-profile-pill">
                        <div className="admin-avatar">{user?.name?.charAt(0).toUpperCase() || 'A'}</div>
                        <div className="admin-meta">
                            <strong>{user?.name || 'Super Admin'}</strong>
                            <span>Node ID: {user?.id?.slice(-5).toUpperCase() || 'ROOT'}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-terminate">
                        <LogOut size={18} /> <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* --- DATA VIEWPORT --- */}
            <main className="admin-viewport">
                <AnimatePresence mode="wait">
                    {isRoot ? (
                        <motion.div 
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -20 }}
                            className="admin-welcome-hub"
                        >
                            <header className="hub-header">
                                <h1 className="hero-text-glow">Welcome Back, {user?.name || 'Admin'}</h1>
                                <p className="hero-subtext"> Kathmandu Marketplace Telemetry & Fleet Control Node.</p>
                            </header>
                            
                            <div className="intelligence-grid">
                                <button onClick={() => navigate('/admin/dashboard')} className="intel-card blue">
                                    <div className="intel-icon"><Activity size={28} /></div>
                                    <div className="intel-info"><h3>System Analytics</h3><p>Revenue & Trends</p></div>
                                    <ChevronRight className="arrow" />
                                </button>
                                <button onClick={() => navigate('/admin/bookings')} className="intel-card purple">
                                    <div className="intel-icon"><Clock size={28} /></div>
                                    <div className="intel-info"><h3>Reservations</h3><p>Active booking traffic</p></div>
                                    <ChevronRight className="arrow" />
                                </button>
                                <button onClick={() => navigate('/admin/bikes')} className="intel-card green">
                                    <div className="intel-icon"><Bike size={28} /></div>
                                    <div className="intel-info"><h3>Fleet</h3><p>Manage unit availability</p></div>
                                    <ChevronRight className="arrow" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key={location.pathname}
                            initial={{ opacity: 0, x: 10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            className="outlet-container"
                        >
                            {/* ✅ Child components (Dashboard, Bikes, etc.) render here */}
                            <Outlet />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminLayout;