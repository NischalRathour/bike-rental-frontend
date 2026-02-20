import React, { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ Use the central logout logic

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout(); // ✅ This handles all localStorage keys automatically
    navigate("/login");
  };

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Not signed in</h2>
        <p>Please <Link to="/login" style={{ color: '#00dbde' }}>login</Link> to view your profile.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
          {isAdmin ? "Admin Profile" : "User Profile"}
        </h2>
        
        <p><strong>Name:</strong> {user.name || "—"}</p>
        <p><strong>Email:</strong> {user.email || "—"}</p>
        <p><strong>Status:</strong> <span style={{ color: '#10b981' }}>Active</span></p>
        
        {isAdmin && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#ebf8ff', borderRadius: '6px', color: '#2b6cb0' }}>
             🛡️ You have Administrative access to the Kathmandu Fleet.
          </div>
        )}

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          {isAdmin && (
            <button 
              onClick={() => navigate("/admin")} 
              style={{ padding: '10px 20px', background: '#00dbde', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
            >
              Go to Admin Panel
            </button>
          )}
          <button 
            onClick={handleLogout} 
            style={{ padding: '10px 20px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}