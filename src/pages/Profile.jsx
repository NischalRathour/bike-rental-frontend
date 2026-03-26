import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Camera, User, Mail, Phone, MapPin, 
  ShieldCheck, Leaf, Save, ChevronLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import "../styles/Profile.css";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // ✅ Functional State Management
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Load user data into form on mount or user change
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "Kathmandu, Nepal",
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Sync with backend
      const res = await api.put('/users/profile', formData);
      
      if (res.data.success) {
        alert("Profile synchronized successfully!");
        // ✅ Update global context to reflect changes instantly
        setUser(res.data.user);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings-root">
      <div className="profile-wide-container">
        
        {/* 👤 LEFT: IDENTITY PREVIEW */}
        <aside className="identity-card-glass">
          <Link to="/customer" className="back-link-modern">
            <ChevronLeft size={16}/> Back to Command Center
          </Link>

          <div className="avatar-upload-wrapper">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
              alt="Avatar" 
              className="avatar-preview" 
            />
            <label className="edit-avatar-btn">
              <Camera size={18} />
              <input type="file" style={{ display: 'none' }} />
            </label>
          </div>

          <h2 className="profile-display-name">{user?.name}</h2>
          <p className="profile-display-email">{user?.email}</p>
          
          <div className="eco-rank-badge">
            <Leaf size={14} /> Eco-Rider: Elite
          </div>

          <div className="verification-card-mini">
            <p className="mini-label">IDENTITY STATUS</p>
            <div className="mini-value">
              <ShieldCheck size={20} color="#10b981" /> 
              Verified {user?.role}
            </div>
          </div>
        </aside>

        {/* 🛠️ RIGHT: EDITABLE SETTINGS */}
        <main className="settings-form-box">
          <h2 className="form-section-title">Account <span className="text-indigo">Configuration</span></h2>
          
          <form onSubmit={handleUpdate} className="managed-form-profile">
            <div className="input-grid-premium">
              <div className="input-group-managed">
                <label><User size={14} /> Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required
                />
              </div>

              <div className="input-group-managed">
                <label><Mail size={14} /> Email Address</label>
                <input type="email" value={user?.email || ""} disabled className="input-locked" />
                <span className="input-hint">Email cannot be changed</span>
              </div>

              <div className="input-group-managed">
                <label><Phone size={14} /> Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+977-98XXXXXXXX"
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>

              <div className="input-group-managed">
                <label><MapPin size={14} /> Primary Location</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                />
              </div>
            </div>

            <div className="security-notice-box">
              <h4>Security Preferences</h4>
              <p>For password changes or role modifications, please contact Thamel HQ support.</p>
              <button type="button" className="btn-link-indigo">Request Access Log</button>
            </div>

            <button type="submit" className="btn-save-profile" disabled={loading}>
              {loading ? "Processing..." : <><Save size={20}/> Save Changes</>}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;