import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, Edit, AlertCircle } from 'lucide-react';

const AdminBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBikes = async () => {
    try {
      const res = await api.get('/bikes');
      setBikes(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBikes(); }, []);

  const deleteBike = async (id) => {
    if (window.confirm("Remove this bike from the fleet?")) {
      try {
        await api.delete(`/admin/bikes/${id}`);
        setBikes(bikes.filter(b => b._id !== id));
      } catch (err) {
        alert("Delete failed. Check admin permissions.");
      }
    }
  };

  if (loading) return <div className="admin-loader">🏍 Loading Fleet...</div>;

  return (
    <div className="admin-card">
      <div className="card-header-flex">
        <h2>Fleet Inventory</h2>
        <button className="btn-add"><Plus size={18} /> New Vehicle</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bike Name</th>
              <th>Price/Hr</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map(bike => (
              <tr key={bike._id}>
                <td className="bike-info-cell">
                  <img src={bike.image || '/placeholder-bike.png'} alt="" />
                  <strong>{bike.name}</strong>
                </td>
                <td>Rs. {bike.pricePerHour}</td>
                <td>
                  <span className={`status-pill ${bike.isAvailable ? 'available' : 'rented'}`}>
                    {bike.isAvailable ? 'In Stock' : 'Out Now'}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="btn-edit"><Edit size={16} /></button>
                  <button onClick={() => deleteBike(bike._id)} className="btn-delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBikes;