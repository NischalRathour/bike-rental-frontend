import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Bike, 
  History, 
  UserCircle, 
  LogOut, 
  ShieldCheck 
} from "lucide-react";

/**
 * 🛰️ SIDEBAR SUBSYSTEM
 * Logic: Handles navigation across the multi-tenant ecosystem.
 * It dynamically adjusts the Dashboard link based on the User Role.
 */
const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // 🛡️ ROLE-BASED DYNAMIC ROUTING
  // Ensures Owners go to their Fleet Manager and Customers go to the Rental Hub
  const userRole = user?.role?.toLowerCase();
  const dashboardPath = userRole === 'owner' ? "/owner-dashboard" : "/customer";

  // ✨ UI HELPER: Active State Logic
  // Matches the current URL to apply high-status styling to the active link
  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <div className="sidebar-glass-container">
      
      {/* 🏎️ BRAND SECTION */}
      <div className="sidebar-brand">
        <ShieldCheck className="brand-logo-icon" size={28} color="#6366f1" />
        <h2 className="brand-text">Ride N Roar</h2>
      </div>

      {/* 👤 IDENTITY PREVIEW (Mini) */}
      <div className="sidebar-user-preview">
        <div className="mini-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="user-info">
          <p className="user-name-small">{user?.name || "Member"}</p>
          <p className="user-role-label">{userRole}</p>
        </div>
      </div>

      {/* 🗺️ NAVIGATION ENGINE */}
      <nav className="sidebar-nav">
        <Link to={dashboardPath} className={isActive(dashboardPath)}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link to="/my-bookings" className={isActive("/my-bookings")}>
          <History size={20} />
          <span>My Bookings</span>
        </Link>

        <Link to="/bikes" className={isActive("/bikes")}>
          <Bike size={20} />
          <span>Available Bikes</span>
        </Link>

        {/* ✅ FIXED PROFILE LINK: Maps to /account as defined in App.js */}
        <Link to="/account" className={isActive("/account")}>
          <UserCircle size={20} />
          <span>Edit Profile</span>
        </Link>
      </nav>

      {/* 🚪 SYSTEM EXIT */}
      <div className="sidebar-footer">
        <button 
          onClick={() => logout(true)} 
          className="logout-btn-premium"
          title="Secure Logout"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;