import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "Kathmandu, Nepal",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', formData);
      if (res.data.success) {
        alert("Profile synchronized successfully!");
        // Update local context
        setUser({ ...user, ...formData });
      }
    } catch (err) {
      alert("Update failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings-root">
      <div className="profile-wide-container">
        
        {/* 👤 LEFT: IDENTITY PREVIEW */}
        <aside className="identity-card-glass">
          <Link to="/customer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem', marginBottom: '30px' }}>
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

          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0' }}>{user?.name}</h2>
          <p style={{ color: '#64748b', fontWeight: '600', marginTop: '5px' }}>{user?.email}</p>
          
          <div className="eco-rank-badge">
            <Leaf size={14} /> Eco-Rider: Elite
          </div>

          <div style={{ marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '25px', textAlign: 'left' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', marginBottom: '15px' }}>ACCOUNT VERIFICATION</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', fontWeight: '700' }}>
              <ShieldCheck size={20} color="#10b981" /> Verified Member
            </div>
          </div>
        </aside>

        {/* 🛠️ RIGHT: EDITABLE SETTINGS */}
        <main className="settings-form-box">
          <h2 className="form-section-title">Account <span style={{ color: '#6366f1' }}>Configuration</span></h2>
          
          <form onSubmit={handleUpdate}>
            <div className="input-grid-premium">
              <div className="input-group-managed">
                <label><User size={14} style={{ marginRight: '5px' }} /> Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="input-group-managed">
                <label><Mail size={14} style={{ marginRight: '5px' }} /> Email Address</label>
                <input type="email" value={user?.email} disabled style={{ cursor: 'not-allowed', opacity: 0.6 }} />
              </div>

              <div className="input-group-managed">
                <label><Phone size={14} style={{ marginRight: '5px' }} /> Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+977-98XXXXXXXX"
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>

              <div className="input-group-managed">
                <label><MapPin size={14} style={{ marginRight: '5px' }} /> Primary Location</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                />
              </div>
            </div>

            <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #f1f5f9' }}>
              <h4 style={{ fontWeight: '800', marginBottom: '15px' }}>Security Preferences</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>To change your password, an authentication link will be sent to your registered email.</p>
              <button type="button" style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '800', cursor: 'pointer', padding: 0 }}>Request Password Reset</button>
            </div>

            <button type="submit" className="btn-save-profile" disabled={loading}>
              {loading ? "Syncing..." : <><Save size={20}/> Save Changes</>}
            </button>
          </form>
        </main>

      </div>
    </div>
  );
};

export default Profile;