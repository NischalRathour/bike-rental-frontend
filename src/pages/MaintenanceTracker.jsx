import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Settings, Tool, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import "../styles/Maintenance.css";

const MaintenanceTracker = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFleet = async () => {
    try {
      const res = await api.get('/bikes'); // Re-using existing bike fetch
      setBikes(res.data.bikes);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.patch(`/admin/bikes/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setBikes(bikes.map(b => b._id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) { alert("Status Update Failed"); }
  };

  useEffect(() => { fetchFleet(); }, []);

  if (loading) return <div className="loader">Syncing Fleet...</div>;

  return (
    <div className="maintenance-root">
      <div className="maintenance-container">
        <header className="m-header">
          <Link to="/admin" className="btn-back"><ChevronLeft size={20}/> Dashboard</Link>
          <h1 className="text-glow">Fleet <span style={{color: '#6366f1'}}>Maintenance</span></h1>
          <p>Update real-time availability and service logs.</p>
        </header>

        <div className="fleet-grid-premium">
          {bikes.map((bike) => (
            <div key={bike._id} className={`maintenance-card ${bike.status.toLowerCase()}`}>
              <div className="card-top">
                <div className="bike-info">
                  <h3>{bike.name}</h3>
                  <p>ID: {bike._id.slice(-6).toUpperCase()}</p>
                </div>
                <StatusIcon status={bike.status} />
              </div>

              <div className="status-selector-box">
                <p className="label">SET CURRENT STATUS</p>
                <div className="btn-group-status">
                  <button 
                    onClick={() => handleStatusChange(bike._id, 'Available')}
                    className={bike.status === 'Available' ? 'active' : ''}
                  >Available</button>
                  <button 
                    onClick={() => handleStatusChange(bike._id, 'Maintenance')}
                    className={bike.status === 'Maintenance' ? 'active' : ''}
                  >Maintenance</button>
                  <button 
                    onClick={() => handleStatusChange(bike._id, 'Rented')}
                    className={bike.status === 'Rented' ? 'active' : ''}
                    disabled
                  >In Use</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusIcon = ({ status }) => {
  if (status === 'Available') return <CheckCircle color="#10b981" />;
  if (status === 'Maintenance') return <Tool color="#f59e0b" />;
  return <AlertCircle color="#6366f1" />;
};

export default MaintenanceTracker;