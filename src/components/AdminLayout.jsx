import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Bike, Users, LogOut, ShieldCheck, Home } from 'lucide-react';
import "../styles/AdminLayout.css";

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin-login'); 
    };

    // Define if we are on the landing page
    const isRoot = location.pathname === '/admin' || location.pathname === '/admin/';

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <ShieldCheck size={32} color="#6366f1" />
                    <div className="brand-text">
                        <span className="main-name">Ride N Roar</span>
                        <span className="sub-name">Admin Portal</span>
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    <Link to="/admin" className={`nav-item ${isRoot ? 'active' : ''}`}>
                        <Home size={20} /> Welcome Portal
                    </Link>
                    <Link to="/admin/dashboard" className={`nav-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /> System Analytics
                    </Link>
                    <Link to="/admin/bikes" className={`nav-item ${location.pathname.includes('bikes') ? 'active' : ''}`}>
                        <Bike size={20} /> Fleet Inventory
                    </Link>
                    <Link to="/admin/users" className={`nav-item ${location.pathname.includes('users') ? 'active' : ''}`}>
                        <Users size={20} /> User Directory
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-user-info">
                        <p className="user-name">{user?.name}</p>
                        <p className="user-role">Super Admin</p>
                    </div>
                    <button onClick={handleLogout} className="logout-trigger">
                        <LogOut size={20} /> Terminate
                    </button>
                </div>
            </aside>

            <main className="admin-main-content">
                {isRoot ? (
                    <div className="admin-welcome-screen">
                        <div className="welcome-content">
                            <h1 className="hero-gradient-text">Welcome, {user?.name}</h1>
                            <p className="subtitle-faded">Kathmandu Fleet Management Command Center</p>
                        </div>
                        
                        <div className="quick-access-grid">
                            <button onClick={() => navigate('/admin/dashboard')} className="quick-card">
                                <div className="card-icon blue"><LayoutDashboard size={32} /></div>
                                <h3>Analytics</h3>
                                <p>View revenue and eco-telemetry</p>
                            </button>
                            <button onClick={() => navigate('/admin/bikes')} className="quick-card">
                                <div className="card-icon green"><Bike size={32} /></div>
                                <h3>Fleet</h3>
                                <p>Manage bike inventory</p>
                            </button>
                            <button onClick={() => navigate('/admin/users')} className="quick-card">
                                <div className="card-icon purple"><Users size={32} /></div>
                                <h3>Users</h3>
                                <p>Manage system identities</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default AdminLayout;