import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>BikeRental</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="#">My Bookings</Link>
        <Link to="#">Available Bikes</Link>
        <Link to="#">Profile</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
