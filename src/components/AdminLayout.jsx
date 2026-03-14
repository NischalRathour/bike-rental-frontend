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
  Terminal,
  Activity,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import "../styles/AdminLayout.css";

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin-login'); 
    };

    const isRoot = location.pathname === '/admin' || location.pathname === '/admin/';

    return (
        <div className="admin-app-shell">
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
                    {/* ✅ ADDED BOOKING OPERATIONS LINK */}
                    <Link to="/admin/bookings" className={`nav-link-pro ${location.pathname.includes('bookings') ? 'active' : ''}`}>
                        <Clock size={20} /> <span>Booking Ops</span>
                    </Link>
                    <Link to="/admin/users" className={`nav-link-pro ${location.pathname.includes('users') ? 'active' : ''}`}>
                        <Users size={20} /> <span>Identity Directory</span>
                    </Link>
                </nav>

                <div className="sidebar-user-footer">
                    <div className="admin-profile-pill">
                        <div className="admin-avatar">{user?.name?.charAt(0)}</div>
                        <div className="admin-meta">
                            <strong>{user?.name}</strong>
                            <span>Super Admin</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-terminate">
                        <LogOut size={18} /> <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            <main className="admin-viewport">
                {isRoot ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-welcome-hub">
                        <header className="hub-header">
                            <h1 className="hero-text-glow">Namaste, {user?.name}</h1>
                            <p className="hero-subtext">Authorized access to the Kathmandu fleet command center.</p>
                        </header>
                        
                        <div className="intelligence-grid">
                            <button onClick={() => navigate('/admin/dashboard')} className="intel-card blue">
                                <div className="intel-icon"><Activity size={28} /></div>
                                <div className="intel-info"><h3>System Analytics</h3><p>Live revenue tracking</p></div>
                                <ChevronRight className="arrow" />
                            </button>

                            <button onClick={() => navigate('/admin/bookings')} className="intel-card purple">
                                <div className="intel-icon"><Clock size={28} /></div>
                                <div className="intel-info"><h3>Reservations</h3><p>Approve or Cancel rides</p></div>
                                <ChevronRight className="arrow" />
                            </button>

                            <button onClick={() => navigate('/admin/bikes')} className="intel-card green">
                                <div className="intel-icon"><Bike size={28} /></div>
                                <div className="intel-info"><h3>Fleet</h3><p>Manage unit inventory</p></div>
                                <ChevronRight className="arrow" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="outlet-container">
                        <Outlet />
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default AdminLayout;