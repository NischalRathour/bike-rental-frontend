import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  User, Mail, ShieldCheck, LogOut, Settings, 
  Cpu, Globe, TrendingUp, Zap, Bike, ChevronRight, Loader2 
} from "lucide-react";
import { motion } from "framer-motion";
import "../styles/Account.css";

export default function Account() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth(); // ✅ Added loading from context

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🏁 1. SESSION LOADING STATE (Prevents charAt/toUpperCase crashes)
  if (loading) {
    return (
      <div className="account-loader-root">
        <Loader2 className="animate-spin" size={40} color="#6366f1" />
        <p>Decrypting Vault Data...</p>
      </div>
    );
  }

  // 🛡️ 2. GUEST REDIRECT (If user is not logged in)
  if (!user) {
    return (
      <div className="account-empty-state">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="empty-card">
          <User size={48} color="#cbd5e1" />
          <h2>Vault Locked</h2>
          <p>Please login to access your Ride N Roar encrypted profile.</p>
          <Link to="/login" className="btn-login-redirect">Authorize Session</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="account-page-root">
      <div className="account-max-container">
        
        {/* --- 💳 PREMIUM VISA CARD SECTION --- */}
        <section className="wallet-hero-section">
          <motion.div 
            initial={{ rotateY: 15, opacity: 0 }} 
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="visa-platinum-card"
          >
            <div className="card-glass-content">
              <div className="card-top-row">
                <div className="chip-container">
                  <Cpu size={38} className="gold-chip-icon" />
                  <Globe size={20} className="nfc-signal" />
                </div>
                <div className="brand-label">
                  <span className="brand-main">RIDE N ROAR</span>
                  <span className="brand-sub">{isAdmin ? 'SYSTEM ADMIN' : 'PLATINUM MEMBER'}</span>
                </div>
              </div>
              
              <div className="card-middle-row">
                <p className="limit-label">AVAILABLE RENTAL CREDIT</p>
                <h1 className="limit-value">Rs. {isAdmin ? '∞ UNLIMITED' : '850,000.00'}</h1>
              </div>

              <div className="card-bottom-row">
                <div className="card-holder">
                  <label>CARD HOLDER</label>
                  {/* ✅ FIXED: Added optional chaining and uppercase fallback */}
                  <p>{user?.name?.toUpperCase() || "RESERVED"}</p>
                </div>
                <div className="card-expiry">
                  <label>EXPIRES</label>
                  <p>12/28</p>
                </div>
                <div className="visa-branding">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="quick-stats-grid">
            <div className="stat-box-mini">
              <TrendingUp size={20} color="#10b981"/>
              <div><span>Eco Points</span><strong>{isAdmin ? '99k+' : '1,250'} PTS</strong></div>
            </div>
            <div className="stat-box-mini">
              <ShieldCheck size={20} color="#6366f1"/>
              <div><span>ID Status</span><strong>VERIFIED</strong></div>
            </div>
          </div>
        </section>

        {/* --- 👤 ACCOUNT DATA GRID --- */}
        <div className="account-data-grid">
          <aside className="account-nav-sidebar">
            <div className="sidebar-profile-head">
              {/* ✅ FIXED: Safe initial extraction */}
              <div className="avatar-hex-large">{user?.name?.charAt(0) || "U"}</div>
              <h3>{user?.name || "Member"}</h3>
              <p>{user?.email}</p>
            </div>
            <nav className="sidebar-menu">
              <button className="menu-btn active"><User size={18}/> Profile Details</button>
              {!isAdmin && <button onClick={() => navigate("/my-bookings")} className="menu-btn"><Bike size={18}/> Trip Ledger</button>}
              <button className="menu-btn"><Settings size={18}/> Secure Settings</button>
              <button onClick={handleLogout} className="menu-btn logout-trigger"><LogOut size={18}/> Terminate Session</button>
            </nav>
          </aside>

          <main className="account-details-main">
            <header className="details-header">
              <h2>System Identity</h2>
              <p>Managed profile and security configuration for Kathmandu Hub.</p>
            </header>

            <div className="details-form-layout">
              <div className="detail-entry">
                <Mail size={18} className="icon-slate" />
                <div className="text-group">
                  <label>Registered Email</label>
                  <p>{user?.email}</p>
                </div>
              </div>

              <div className="detail-entry">
                <ShieldCheck size={18} className="icon-slate" />
                <div className="text-group">
                  <label>Role Authorization</label>
                  <p className={isAdmin ? 'admin-text' : 'member-text'}>
                    {isAdmin ? 'System Administrator (Level 1)' : 'Standard Marketplace Member'}
                  </p>
                </div>
              </div>

              {isAdmin ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-privilege-box">
                  <Zap size={20} />
                  <div className="priv-text">
                    <strong>Admin Access Enabled</strong>
                    <p>You have priority override permissions for fleet management and transaction audits.</p>
                  </div>
                  <button onClick={() => navigate("/admin/dashboard")} className="btn-go-admin">
                    Dashboard <ChevronRight size={16} />
                  </button>
                </motion.div>
              ) : (
                <div className="member-activity-placeholder">
                  <div className="placeholder-icon"><Bike size={32}/></div>
                  <p>Ready for your next expedition? Explore the latest units in the fleet.</p>
                  <button onClick={() => navigate("/bikes")} className="btn-browse-fleet">Browse Fleet</button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}