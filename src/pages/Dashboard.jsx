import React from "react";
import "../styles/Dashboard.css";
import {
  FaMotorcycle,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";

const recentBookings = [
  {
    bike: "Yamaha FZ",
    date: "2025-12-14",
    status: "Active",
    amount: 2500,
    images: [
      "/images/yamaha-fz-1.jpg",
      "/images/yamaha-fz-2.jpg",
      "/images/yamaha-fz-3.jpg",
    ],
  },
  {
    bike: "Royal Enfield",
    date: "2025-12-10",
    status: "Completed",
    amount: 4000,
    images: [
      "/images/royal-enfield-1.jpg",
      "/images/royal-enfield-2.jpg",
      "/images/royal-enfield-3.jpg",
    ],
  },
  {
    bike: "Honda CB350",
    date: "2025-12-12",
    status: "Active",
    amount: 3500,
    images: [
      "/images/honda-cb350-1.jpg",
      "/images/honda-cb350-2.jpg",
      "/images/honda-cb350-3.jpg",
    ],
  },
  {
    bike: "KTM Duke 390",
    date: "2025-12-15",
    status: "Pending",
    amount: 3000,
    images: [
      "/images/ktm-duke-1.jpg",
      "/images/ktm-duke-2.jpg",
      "/images/ktm-duke-3.jpg",
    ],
  },
  {
    bike: "Suzuki Gixxer",
    date: "2025-12-09",
    status: "Completed",
    amount: 2800,
    images: [
      "/images/suzuki-gixxer-1.jpg",
      "/images/suzuki-gixxer-2.jpg",
      "/images/suzuki-gixxer-3.jpg",
    ],
  },
  {
    bike: "TVS Apache",
    date: "2025-12-11",
    status: "Active",
    amount: 2200,
    images: [
      "/images/tvs-apache-1.jpg",
      "/images/tvs-apache-2.jpg",
      "/images/tvs-apache-3.jpg",
    ],
  },
  {
    bike: "Bajaj Pulsar",
    date: "2025-12-08",
    status: "Completed",
    amount: 2000,
    images: [
      "/images/bajaj-pulsar-1.jpg",
      "/images/bajaj-pulsar-2.jpg",
      "/images/bajaj-pulsar-3.jpg",
    ],
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Manage your bike rentals easily 🚲</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FaMotorcycle className="stat-icon" />
          <h3>Total Bookings</h3>
          <p>12</p>
        </div>

        <div className="stat-card">
          <FaClock className="stat-icon" />
          <h3>Active Rentals</h3>
          <p>3</p>
        </div>

        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <h3>Completed</h3>
          <p>9</p>
        </div>

        <div className="stat-card">
          <FaMoneyBillWave className="stat-icon" />
          <h3>Pending Payments</h3>
          <p>2</p>
        </div>
      </div>

      <div className="dashboard-table">
        <h2>Recent Bookings</h2>

        <table>
          <thead>
            <tr>
              <th>Bike</th>
              <th>Images</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {recentBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.bike}</td>

                <td>
                  <div className="bike-images">
                    {booking.images.map((img, i) => (
                      <img key={i} src={img} alt={`${booking.bike}-${i}`} />
                    ))}
                  </div>
                </td>

                <td>{booking.date}</td>
                <td className={`status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </td>
                <td>Rs. {booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;
