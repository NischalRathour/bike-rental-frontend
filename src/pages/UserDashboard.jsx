import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import BikeCard from "../components/BikeCard";
import "../styles/Dashboard.css";

const bikes = [
  { id: 1, name: "Royal Enfield", type: "Cruiser", price: 2000 },
  { id: 2, name: "Yamaha FZ", type: "Street", price: 1500 },
  { id: 3, name: "Pulsar NS", type: "Sport", price: 1800 },
];

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="stats">
          <StatCard title="Total Bookings" value="3" />
          <StatCard title="Active Rentals" value="1" />
          <StatCard title="Available Bikes" value="12" />
        </div>

        <h3 className="section-title">Available Bikes</h3>

        <div className="bike-grid">
          {bikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
