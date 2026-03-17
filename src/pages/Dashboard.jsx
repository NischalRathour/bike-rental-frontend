import React from "react";
import { motion } from "framer-motion";
import { 
  Bike, CheckCircle, Clock, Wallet, 
  Calendar, Search, ChevronRight, LayoutDashboard,
  MapPin, Settings
} from "lucide-react";
import "../styles/Dashboard.css";

const recentBookings = [
  { id: "BK-7701", bike: "Yamaha FZ V3", date: "2026-03-14", status: "Active", amount: 2500, img: "/images/yamaha-fz-1.jpg", type: "City" },
  { id: "BK-7705", bike: "Royal Enfield Classic", date: "2026-03-10", status: "Completed", amount: 4000, img: "/images/royal-enfield-1.jpg", type: "Touring" },
  { id: "BK-7708", bike: "KTM Duke 390", date: "2026-03-15", status: "Pending", amount: 3000, img: "/images/ktm-duke-1.jpg", type: "Dirt" },
  { id: "BK-7710", bike: "Honda CB350", date: "2026-03-12", status: "Active", amount: 3500, img: "/images/honda-cb350-1.jpg", type: "Cruiser" },
];

const Dashboard = () => {
  return (
    <div className="premium-dashboard-root">
      <div className="dashboard-container-max">
        
        {/* 🚀 DYNAMIC HEADER SECTION */}
        <header className="dashboard-hero-card">
          <div className="hero-main-content">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="welcome-text"
            >
              <span className="live-status-pill">
                <span className="pulse-dot"></span> System Live
              </span>
              <h1>Command Center</h1>
              <p>Welcome back! You have <strong>4 motorcycles</strong> currently out on the road.</p>
            </motion.div>

            <div className="hero-search-wrapper">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Track Booking ID..." />
            </div>
          </div>
        </header>

        {/* 📊 KPI INTELLIGENCE GRID */}
        <div className="intelligence-stats-grid">
          <div className="intel-card">
            <div className="icon-box blue"><Bike size={22} /></div>
            <div className="intel-info">
              <span className="label">Total Fleet</span>
              <h3>12 Units</h3>
            </div>
          </div>
          <div className="intel-card">
            <div className="icon-box amber"><Clock size={22} /></div>
            <div className="intel-info">
              <span className="label">Active Rides</span>
              <h3>03 Sessions</h3>
            </div>
          </div>
          <div className="intel-card">
            <div className="icon-box green"><CheckCircle size={22} /></div>
            <div className="intel-info">
              <span className="label">Returns Today</span>
              <h3>02 Units</h3>
            </div>
          </div>
          <div className="intel-card">
            <div className="icon-box purple"><Wallet size={22} /></div>
            <div className="intel-info">
              <span className="label">Net Revenue</span>
              <h3>Rs. 45,200</h3>
            </div>
          </div>
        </div>

        {/* 🏍️ MANAGED OPERATIONS LISTING */}
        <section className="ops-management-section">
          <div className="section-head-flex">
            <div className="title-block">
              <h2>Recent Fleet Activity</h2>
              <p>Real-time updates from Kathmandu Central Station</p>
            </div>
            <div className="action-block">
              <button className="btn-outline">Download Ledger</button>
              <button className="btn-primary-small">Manage Fleet</button>
            </div>
          </div>

          <div className="advanced-data-grid">
            {/* Table Header */}
            <div className="grid-labels">
              <span>VEHICLE & ID</span>
              <span>RENTAL DATE</span>
              <span>STATUS</span>
              <span>TOTAL REVENUE</span>
              <span>ACTION</span>
            </div>

            {/* Table Rows */}
            {recentBookings.map((booking, index) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid-row-item"
              >
                <div className="vehicle-meta">
                  <div className="img-container">
                    <img src={booking.img} alt={booking.bike} />
                  </div>
                  <div className="v-text">
                    <strong>{booking.bike}</strong>
                    <span>{booking.id} • {booking.type}</span>
                  </div>
                </div>

                <div className="cell-date">
                  <Calendar size={14} /> {booking.date}
                </div>

                <div className="cell-status">
                  <span className={`status-pill-v2 ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="cell-price">
                  <strong>Rs. {booking.amount.toLocaleString()}</strong>
                </div>

                <div className="cell-action">
                  <button className="icon-btn" title="View Details">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;