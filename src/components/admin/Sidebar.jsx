import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Bike, Calendar, Users, Settings, LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { label: "Overview", icon: <LayoutDashboard size={18}/>, path: "/admin" },
    { label: "Fleet", icon: <Bike size={18}/>, path: "/admin/bikes" },
    { label: "Schedule", icon: <Calendar size={18}/>, path: "/admin/bookings" },
    { label: "Users", icon: <Users size={18}/>, path: "/admin/users" },
  ];

  return (
    <aside className="admin-glass-sidebar">
      <div className="brand-section">
        <div className="brand-logo">RR</div>
        <span className="brand-name">Ride N Roar</span>
      </div>
      
      <nav className="side-nav">
        <div className="nav-group-label">Main Menu</div>
        {menuItems.map((item) => (
          <button 
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div className="nav-group-label">System</div>
        <button className="nav-btn"><Settings size={18}/> Settings</button>
        <button onClick={logout} className="nav-btn logout-item-sidebar"><LogOut size={18}/> Logout</button>
      </nav>
    </aside>
  );
};

export default Sidebar;