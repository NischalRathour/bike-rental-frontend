import React from "react";
import { motion } from "framer-motion";
import { 
  Bike, 
  Zap, 
  ShieldCheck, 
  Search, 
  Filter, 
  MapPin, 
  Star,
  ChevronRight,
  LayoutDashboard,
  Clock
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import BikeCard from "../components/BikeCard";
import "../styles/Dashboard.css";

const bikes = [
  { id: 1, name: "Royal Enfield Classic", type: "Cruiser", price: 2000, rating: 4.8, image: "/images/re.png" },
  { id: 2, name: "Yamaha FZ-S V3", type: "Street", price: 1500, rating: 4.5, image: "/images/fz.png" },
  { id: 3, name: "Pulsar NS 200", type: "Sport", price: 1800, rating: 4.7, image: "/images/ns.png" },
];

const UserDashboard = () => {
  return (
    <div className="premium-dashboard-layout">
      <Sidebar />

      <div className="dashboard-main-viewport">
        <Topbar />

        <div className="dashboard-scroll-content">
          {/* 🚀 WELCOME HERO SECTION */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="user-welcome-hero"
          >
            <div className="hero-text">
              <h1>Welcome Back, Rider!</h1>
              <p>Your Kathmandu adventure starts here. Choose your machine.</p>
            </div>
            <div className="hero-search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search for your next ride..." />
              <button className="btn-search-trigger">Find Bike</button>
            </div>
          </motion.header>

          {/* 📊 INTERACTIVE STATS HUB */}
          <div className="stats-intelligence-row">
            <StatCard 
              title="Total Rides" 
              value="03" 
              icon={<Bike size={22} />} 
              color="indigo" 
            />
            <StatCard 
              title="Active Now" 
              value="01" 
              icon={<Clock size={22} />} 
              color="green" 
            />
            <StatCard 
              title="Fleet Credits" 
              value="Rs. 500" 
              icon={<Zap size={22} />} 
              color="amber" 
            />
            <div className="promo-mini-card">
              <ShieldCheck size={24} color="#10b981" />
              <div>
                <strong>Premium Insured</strong>
                <span>Fully Covered Rides</span>
              </div>
            </div>
          </div>

          {/* 🏍️ AVAILABLE FLEET SECTION */}
          <section className="fleet-explorer">
            <div className="section-header-flex">
              <div className="title-group">
                <h3 className="section-title">Premium Fleet Inventory</h3>
                <span className="live-pulse-tag">
                  <div className="pulse-dot"></div> {bikes.length} Units Online
                </span>
              </div>
              <button className="btn-filter-settings">
                <Filter size={18} /> Filters
              </button>
            </div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="premium-bike-grid"
            >
              {bikes.map((bike) => (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  key={bike.id}
                >
                  <BikeCard bike={bike} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;