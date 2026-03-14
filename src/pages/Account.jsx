import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, ShieldCheck, LogOut, Settings, LayoutDashboard } from "lucide-react";
import "../styles/Account.css";

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="account-empty-state">
        <div className="empty-card">
          <User size={48} color="#cbd5e1" />
          <h2>Session Expired</h2>
          <p>Please login to access your Ride N Roar profile.</p>
          <Link to="/login" className="btn-login-redirect">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page-wrapper">
      <div className="account-card-managed">
        <div className="account-header">
          <div className="profile-avatar-large">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="header-text">
            <h1>{user.name}</h1>
            <span className={`role-pill ${isAdmin ? 'admin' : 'customer'}`}>
              {isAdmin ? 'System Administrator' : 'Verified Member'}
            </span>
          </div>
        </div>

        <div className="account-body">
          <div className="info-row">
            <Mail size={18} />
            <div>
              <label>Email Address</label>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="info-row">
            <ShieldCheck size={18} />
            <div>
              <label>Account Status</label>
              <p className="status-active">Active & Verified</p>
            </div>
          </div>

          {isAdmin && (
            <div className="admin-alert-box">
              <Settings size={20} />
              <p>You have full administrative control over the Kathmandu fleet and booking engine.</p>
            </div>
          )}
        </div>

        <div className="account-footer-actions">
          {isAdmin && (
            <button onClick={() => navigate("/admin")} className="btn-account-admin">
              <LayoutDashboard size={18} /> Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="btn-account-logout">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}