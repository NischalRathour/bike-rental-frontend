import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { Mail, Search, Shield, User } from 'lucide-react';
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
      } catch (err) { console.error("Error fetching users:", err); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loader">Accessing Records...</div>;

  return (
    <div className="user-directory-wrapper">
      <div className="directory-header">
        <div>
          <h1 className="hero-gradient-text">Identity Intelligence</h1>
          <p style={{color: '#94a3b8'}}>{users.length} active nodes in system</p>
        </div>
        <div className="search-glass">
          <Search size={18} color="#6366f1" />
          <input 
            placeholder="Search Kathmandu user base..." 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="user-tiles-grid">
        {filtered.map((u) => (
          <motion.div 
            whileHover={{ y: -8, transition: { duration: 0.2 } }} 
            key={u._id} 
            className="user-tile-glass"
          >
            <div className={`role-badge ${u.role}`}>
              {u.role === 'admin' ? <Shield size={12}/> : <User size={12}/>} {u.role}
            </div>
            <div className="avatar-circle">{u.name.charAt(0).toUpperCase()}</div>
            <h3>{u.name}</h3>
            <p><Mail size={14}/> {u.email}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;