import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Search, Shield, MoreVertical, 
  Trash2, Filter, Activity, ShieldCheck, 
  UserCheck, Globe, Fingerprint, Loader2,
  ArrowUpCircle, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import "../styles/AdminUsers.css";

const AdminUsers = () => {
  const { user: currentUser } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // Tracking individual node actions

  // 📡 FETCH IDENTITY NODES
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) { 
        console.error("CRITICAL: Directory Access Denied", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchUsers();
  }, []);

  // 🗑️ REVOKE ACCESS (DELETE)
  const handleDeleteUser = async (id) => {
    if (id === currentUser?._id) {
        return alert("PROTOCOL VIOLATION: You cannot terminate your own administrative node.");
    }

    if(window.confirm("SECURITY ALERT: Permanent removal of this identity node. Proceed?")) {
      setProcessingId(id);
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert("AUTHORIZATION ERROR: Node removal rejected by server.");
      } finally {
        setProcessingId(null);
      }
    }
  };

  // ⚡ PRIVILEGE MODIFICATION (PROMOTE/DEMOTE)
  const handleToggleAdmin = async (id, currentRole) => {
      if (id === currentUser?._id) return;
      
      const newRole = currentRole === 'admin' ? 'customer' : 'admin';
      setProcessingId(id);
      try {
          await api.put(`/admin/users/${id}/role`, { role: newRole });
          setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      } catch (err) {
          alert("PERMISSION ERROR: Node privilege modification failed.");
      } finally {
          setProcessingId(null);
      }
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="admin-loading-vault">
      <Loader2 className="animate-spin" size={42} color="#6366f1" />
      <p>Authorized Access: Decrypting Identity Nodes...</p>
    </div>
  );

  return (
    <div className="admin-identity-portal">
      <div className="portal-container">
        
        {/* 🏢 COMMAND HEADER */}
        <header className="portal-header">
          <div className="intel-summary">
            <div className="status-badge-live">
                <div className="pulse-dot-green"></div> LIVE DIRECTORY
            </div>
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
                placeholder="Locate user by identity, email or role..." 
                autoComplete="off"
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
                <th><Fingerprint size={14}/> IDENTITY NODE</th>
                <th><ShieldCheck size={14}/> ACCESS TIER</th>
                <th><Mail size={14}/> NETWORK EMAIL</th>
                <th><Globe size={14}/> REGION</th>
                <th style={{textAlign: 'right'}}>NODE CONTROL</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='popLayout'>
                {filtered.map((u, index) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    key={u._id}
                    className={u._id === currentUser?._id ? "current-admin-row" : ""}
                  >
                    <td>
                      <div className="id-profile-cell">
                        <div className={`avatar-hex ${u.role}`}>
                            {processingId === u._id ? <Loader2 className="animate-spin" size={16}/> : u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="id-text">
                          <strong>{u.name} {u._id === currentUser?._id && <span className="self-tag">(YOU)</span>}</strong>
                          <span>NODE_{u._id.slice(-6).toUpperCase()}</span>
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
                        {u._id !== currentUser?._id ? (
                            <>
                                <button 
                                    className="btn-action-promote" 
                                    title={u.role === 'admin' ? "Revoke Admin Rights" : "Grant Admin Rights"}
                                    onClick={() => handleToggleAdmin(u._id, u.role)}
                                    disabled={processingId === u._id}
                                >
                                    <ArrowUpCircle size={18} className={u.role === 'admin' ? 'rotate-180 text-red' : ''}/>
                                </button>
                                
                                <button 
                                    className="btn-action-revoke" 
                                    title="Purge Node"
                                    onClick={() => handleDeleteUser(u._id)}
                                    disabled={processingId === u._id}
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </>
                        ) : (
                            <span className="node-locked"><Shield size={14}/> LOCKED</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="terminal-empty-state">
              <AlertTriangle size={48} className="empty-icon-alert" />
              <h3>No Matches Found</h3>
              <p>The system could not locate any identity nodes matching your current query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;