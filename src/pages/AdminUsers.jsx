import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Mail, Phone, Calendar, Search, Shield, User, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data.success) {
          setUsers(res.data.users);
          setFilteredUsers(res.data.users);
        }
      } catch (err) { 
        console.error("Error fetching users:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchUsers();
  }, []);

  // Search Logic
  useEffect(() => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  if (loading) return (
    <div className="admin-loader-container">
      <div className="admin-loader"></div>
      <p>Accessing Kathmandu Customer Records...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="admin-card"
    >
      <div className="card-header-flex">
        <div>
          <h2>User Directory</h2>
          <p className="subtext">{users.length} registered accounts in the system</p>
        </div>
        
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-filter"><Filter size={18} /></button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Role / Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
              <tr key={u._id} className="table-row">
                <td>
                  <div className="user-profile-cell">
                    <div className="user-avatar">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{u.name}</strong>
                      <span className="user-id">ID: {u._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div className="info-item"><Mail size={14}/> {u.email}</div>
                    <div className="info-item"><Phone size={14}/> {u.phone || '+977-XXXXXXXXXX'}</div>
                  </div>
                </td>
                <td>
                  <div className={`role-pill ${u.role}`}>
                    {u.role === 'admin' ? <Shield size={12}/> : <User size={12}/>}
                    {u.role}
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14}/>
                    {new Date(u.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="empty-state">No users matching "{searchTerm}" found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminUsers;