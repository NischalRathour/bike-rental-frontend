import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bike, 
  Users, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import "../styles/AdminLayout.css";

const AdminLayout = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🛡️ Security Guard: Double-check admin status on every layout mount
  useEffect(() => {
    const adminToken = localStorage.getItem('token_admin');
    if (!loading && (!adminToken || (user && user.role !== 'admin'))) {
      console.warn("🔒 Unauthorized Admin Access - Redirecting...");
      logout();
      navigate('/login');
    }
  }, [user, loading, navigate, logout]);

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/bikes', icon: <Bike size={20} />, label: 'Manage Fleet' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'User Directory' },
  ];

  // Helper to highlight the active menu item
  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (window.confirm("Confirm sign out from Administrator Console?")) {
      logout();
    }
  };

  if (loading && !user) {
    return (
      <div className="admin-loading-screen">
        <div className="loader-pulse"></div>
        <p>Initializing Secure Session...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout-container">
      {/* 🛠 LEFT SIDEBAR */}
      <aside className="admin-sidebar-nav">
        <div className="sidebar-header">
          <div className="logo-icon-bg">
            <ShieldCheck size={24} color="#00dbde" />
          </div>
          <div className="brand-text">
            <h1>RIDE N ROAR</h1>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="nav-menu">
          <p className="nav-group-label">OVERVIEW</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {isActive(item.path) && <ChevronRight size={14} className="active-indicator" />}
            </Link>
          ))}

          <div className="nav-spacer"></div>

          <p className="nav-group-label">SYSTEM</p>
          <button onClick={handleLogout} className="nav-link logout-link">
            <LogOut size={20} />
            <span className="nav-label">Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* 🖥 RIGHT CONTENT AREA */}
      <main className="admin-main-wrapper">
        <header className="admin-top-navbar">
          <div className="page-context">
            <span className="breadcrumb-root">Admin</span>
            <ChevronRight size={14} />
            <span className="breadcrumb-current">
              {menuItems.find(item => isActive(item.path))?.label || 'Console'}
            </span>
          </div>

          <div className="top-nav-actions">
            <button className="notif-btn">
              <Bell size={20} />
              <span className="notif-badge"></span>
            </button>
            <button className="settings-btn">
              <Settings size={20} />
            </button>
            <div className="admin-profile-pill">
              <div className="avatar-circle">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="profile-text">
                <span className="name">{user?.name || 'System Manager'}</span>
                <span className="status">Online</span>
              </div>
            </div>
          </div>
        </header>

        <section className="admin-page-body">
          {/* ✅ CRITICAL: Dashboard, Bikes, and Users render HERE */}
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;