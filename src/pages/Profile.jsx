import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, Save, ChevronLeft, 
  ShieldCheck, Zap, Award, Bell, Lock, Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import "../styles/Profile.css"; // Ensure your CSS matches this premium look

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', formData);
      if (res.data.success) {
        setUser(res.data.user);
        alert("Account synchronized with the Cloud.");
      }
    } catch (err) {
      alert("Sync Error: " + (err.response?.data?.message || "Check connection"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marketplace-profile-wrapper">
      <div className="profile-container-glass">
        
        {/* --- HEADER: NAVIGATION --- */}
        <header className="profile-top-nav">
          <Link to={user?.role === 'owner' ? "/owner-dashboard" : "/customer"} className="btn-back-soft">
            <ChevronLeft size={18} /> Dashboard
          </Link>
          <div className="profile-status-pill">
            <div className="online-indicator"></div>
            <span>System Active</span>
          </div>
        </header>

        <div className="profile-main-grid">
          
          {/* --- LEFT SIDE: IDENTITY CARD --- */}
          <aside className="profile-identity-sidebar">
            <div className="identity-avatar-section">
              <div className="avatar-ring">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                  alt="Avatar" 
                />
              </div>
              <h2 className="user-name-display">{user?.name}</h2>
              <span className="user-role-tag">{user?.role?.toUpperCase()}</span>
            </div>

            <div className="identity-metrics-list">
              <div className="metric-box">
                <Zap size={16} className="icon-indigo" />
                <div className="metric-text">
                   <p className="m-val">{user?.rewardPoints || 0}</p>
                   <p className="m-lab">Reward Points</p>
                </div>
              </div>
              <div className="metric-box">
                <Award size={16} className="icon-green" />
                <div className="metric-text">
                   <p className="m-val">{user?.co2Saved || "0.0"}kg</p>
                   <p className="m-lab">Carbon Offset</p>
                </div>
              </div>
            </div>

            <div className="sidebar-security-badge">
              <ShieldCheck size={14} />
              <span>Identity Verified Member</span>
            </div>
          </aside>

          {/* --- RIGHT SIDE: SETTINGS ENGINE --- */}
          <main className="profile-settings-main">
            <section className="settings-section">
              <h3 className="section-title">Personal <span className="highlight">Details</span></h3>
              <form onSubmit={handleUpdate} className="settings-form">
                <div className="form-input-grid">
                  <div className="form-group">
                    <label><User size={14} /> Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Petter..."
                    />
                  </div>
                  <div className="form-group">
                    <label><Mail size={14} /> Email (Verified)</label>
                    <input type="email" value={user?.email || ""} disabled className="input-locked" />
                  </div>
                  <div className="form-group">
                    <label><Phone size={14} /> Mobile Number</label>
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+977..."
                    />
                  </div>
                  <div className="form-group">
                    <label><MapPin size={14} /> Primary Address</label>
                    <input 
                      type="text" 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Kathmandu..."
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn-save-premium" disabled={loading}>
                  {loading ? "Syncing..." : <><Save size={18} /> Update Profile</>}
                </button>
              </form>
            </section>

            {/* --- MARKETPLACE ADD-ONS --- */}
            <section className="settings-section extra-options">
              <h3 className="section-title">Preferences</h3>
              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <Bell size={18} />
                    <span>Push Notifications</span>
                  </div>
                  <div className="fake-toggle active"></div>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <Lock size={18} />
                    <span>Two-Factor Auth</span>
                  </div>
                  <div className="fake-toggle"></div>
                </div>
              </div>
            </section>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Profile;