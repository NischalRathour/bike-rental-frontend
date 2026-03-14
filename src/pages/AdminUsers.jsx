import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Search, Shield, User, MoreVertical, 
  Trash2, Filter, Activity, ShieldCheck, 
  UserCheck, Globe, Fingerprint 
} from 'lucide-react';
import "../styles/AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data.success) setUsers(res.data.users);
      } catch (err) { 
        console.error("Intelligence Fetch Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if(window.confirm("CRITICAL: Are you sure you want to revoke this user's system access?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert("Authorization error: System failed to revoke access.");
      }
    }
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="admin-loading-vault">
      <div className="vault-spinner"></div>
      <p>Authorized Access: Decrypting Identity Nodes...</p>
    </div>
  );

  return (
    <div className="admin-identity-portal">
      <div className="portal-container">
        
        {/* 🏢 COMMAND HEADER */}
        <header className="portal-header">
          <div className="intel-summary">
            <h1 className="glitch-text">Identity Intelligence</h1>
            <div className="global-stats-row">
              <div className="mini-stat">
                <Activity size={14} className="icon-pulse" /> 
                <span><strong>{users.length}</strong> ACTIVE NODES</span>
              </div>
              <div className="mini-stat">
                <Shield size={14} /> 
                <span><strong>{users.filter(u => u.role === 'admin').length}</strong> PRIVILEGED</span>
              </div>
            </div>
          </div>

          <div className="portal-controls">
            <div className="search-glass-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Locate user by identity or email..." 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-portal-filter"><Filter size={18}/></button>
          </div>
        </header>

        {/* 📑 DATA TERMINAL */}
        <div className="data-terminal-card">
          <table className="identity-data-table">
            <thead>
              <tr>
                <th><Fingerprint size={14}/> IDENTITY</th>
                <th><ShieldCheck size={14}/> ACCESS TIER</th>
                <th><Mail size={14}/> NETWORK EMAIL</th>
                <th><Globe size={14}/> RESIDENCY</th>
                <th style={{textAlign: 'right'}}>SYSTEM CONTROL</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((u, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    key={u._id}
                  >
                    <td>
                      <div className="id-profile-cell">
                        <div className="avatar-hex">{u.name.charAt(0).toUpperCase()}</div>
                        <div className="id-text">
                          <strong>{u.name}</strong>
                          <span>ID: {u._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`access-pill-modern ${u.role}`}>
                        {u.role === 'admin' ? <ShieldCheck size={12}/> : <UserCheck size={12}/>}
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="email-link-cell">{u.email}</td>
                    <td className="region-cell">Kathmandu Hub</td>
                    <td style={{textAlign: 'right'}}>
                      <div className="terminal-actions">
                        <button className="btn-action-more"><MoreVertical size={16}/></button>
                        <button 
                          className="btn-action-revoke" 
                          onClick={() => handleDeleteUser(u._id)}
                          title="Revoke Node Access"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="terminal-empty-state">
              <Shield size={48} className="empty-icon" />
              <p>No identities found within the current search parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;