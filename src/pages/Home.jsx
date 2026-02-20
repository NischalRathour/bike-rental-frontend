import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Shield, Zap, Star, CheckCircle } from "lucide-react";
import "../styles/Home.css";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <div className="home-wrapper">
      
      {/* 🚀 HERO SECTION */}
      <section className="hero-v2">
        <div className="hero-image-container">
          <img src="/images/moving-bike.jpg" alt="Ride Nepal" className="hero-img" />
          <div className="overlay-gradient"></div>
        </div>
        
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge">#1 Rental Service in Nepal</span>
            <h1>Unleash Your <br /><span>Mountain Adventure</span></h1>
            <p>Premium bikes for the streets of Kathmandu and the trails of the Himalayas. Fast booking, zero hassle.</p>
            <div className="hero-actions">
              <Link to="/bikes" className="btn-primary-v2">Browse Fleet</Link>
              <Link to="/register" className="btn-secondary-v2">Sign Up Now</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🛠 HOW IT WORKS */}
      <section className="steps-section">
        <motion.div {...fadeInUp} className="section-header">
          <h2>How It Works</h2>
          <p>Get on the road in minutes</p>
        </motion.div>

        <div className="steps-grid">
          {[
            { icon: <Zap />, title: "Pick Your Ride", desc: "Select from scooters, electrics, or heavy MTBs." },
            { icon: <Calendar />, title: "Select Dates", desc: "Choose your pickup and return timeline." },
            { icon: <MapPin />, title: "Roar Away", desc: "Pick up your keys and explore the beauty of Nepal." }
          ].map((step, i) => (
            <motion.div 
              key={i}
              {...fadeInUp}
              transition={{ delay: i * 0.2 }}
              className="step-card-v2"
            >
              <div className="icon-box">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🏍 FEATURED BIKES */}
      <section className="featured-section">
        <div className="flex-header">
          <h2>Featured Fleet</h2>
          <Link to="/bikes" className="link-text">See All Bikes →</Link>
        </div>

        <div className="bike-grid-v2">
          {[
            { id: 1, name: "Himalayan MTB", price: "800", img: "/images/mountain.jpg" },
            { id: 2, name: "City Scooter", price: "1200", img: "/images/scooter.jpg" },
            { id: 3, name: "Eco Electric", price: "1000", img: "/images/electric.jpg" }
          ].map((bike) => (
            <motion.div 
              key={bike.id}
              whileHover={{ y: -10 }}
              className="bike-card-modern"
            >
              <div className="img-wrapper">
                <img src={bike.img} alt={bike.name} />
              </div>
              <div className="card-body">
                <h3>{bike.name}</h3>
                <p>Available in Kathmandu</p>
                <div className="card-footer-v2">
                  <span className="price-tag">Rs. {bike.price}<span>/day</span></span>
                  <Link to={`/bikes`} className="btn-sm">View</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🛡 WHY US */}
      <section className="trust-section">
        <div className="trust-grid">
          <motion.div {...fadeInUp} className="trust-img">
            <img src="/images/moving-bike.jpg" alt="Security" />
          </motion.div>
          <motion.div {...fadeInUp} className="trust-content">
            <h2>Why Ride N Roar?</h2>
            <div className="benefit">
              <Shield className="b-icon" />
              <div>
                <h4>Fully Insured</h4>
                <p>Every ride is protected so you can focus on the view.</p>
              </div>
            </div>
            <div className="benefit">
              <CheckCircle className="b-icon" />
              <div>
                <h4>Verified Condition</h4>
                <p>Bikes are sanitized and serviced after every single rental.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🏁 FINAL CTA */}
      <section className="footer-cta">
        <div className="cta-content">
          <h2>Ready to hit the road?</h2>
          <p>Join thousands of riders exploring Nepal daily.</p>
          <Link to="/register" className="btn-white">Create Account</Link>
        </div>
        <footer className="simple-footer">
          <p>© 2026 Ride N Roar Nepal. All rights reserved.</p>
        </footer>
      </section>
    </div>
  );
}