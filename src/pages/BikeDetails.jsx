import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShieldCheck, Zap, Fuel, Gauge, MapPin } from "lucide-react";
import "../styles/BikeDetails.css"; // We will create a specific CSS for this

const bikes = [
  { _id: "694d0605a48ce99e1d178757", name: "Hero Xtreme 200S", price: 950, type: "Commuter", engine: "200cc", fuel: "Petrol", images: ["/images/bike8.jpg"], description: "The Hero Xtreme 200S is a reliable commuter bike designed for the streets of Kathmandu. It offers a perfect balance of power and fuel efficiency for daily riders." },
  { _id: "694d0605a48ce99e1d178758", name: "Honda CB Shine", price: 800, type: "Commuter", engine: "125cc", fuel: "Petrol", images: ["/images/bike9.jpg"], description: "The Honda CB Shine is a compact daily rider known for its smooth performance and excellent mileage. Ideal for navigating city traffic with ease." },
  { _id: "6965387ac8f1e5c605231295", name: "Suzuki GSX-R1000", price: 2000, type: "Sport", engine: "1000cc", fuel: "Petrol", images: ["/images/bike3.jpg"], description: "A high-performance street bike for experienced riders. The GSX-R1000 delivers unmatched power and agility for those seeking an adrenaline rush." },
  { _id: "696ba6bd1bad3c26a3d1fbb1", name: "Kawasaki Ninja 650", price: 1800, type: "Sport", engine: "650cc", fuel: "Petrol", images: ["/images/bike4.jpg"], description: "Sporty motorcycle perfect for city rides and weekend getaways. The Ninja 650 offers a comfortable upright riding position with sporty performance." },
  { _id: "696bbe5938845977a85bd20f", name: "Yamaha R15", price: 1200, type: "Sport", engine: "155cc", fuel: "Petrol", images: ["/images/bike1.jpg"], description: "The Yamaha R15 is a legend in the entry-level sport category, bringing racing DNA to the streets with its aerodynamic design." },
  { _id: "696bcafd3f3bf6e595727048", name: "Honda CB500X", price: 1500, type: "Adventure", engine: "500cc", fuel: "Petrol", images: ["/images/bike2.jpg"], description: "Adventure touring motorcycle built for the diverse terrains of Nepal. Comfortable for long highway hauls and capable on light trails." },
  { _id: "696ba5931bad3c26a3d1fbac", name: "KTM Duke 390", price: 1300, type: "Sport", engine: "373cc", fuel: "Petrol", images: ["/images/bike3.jpg"], description: "The 'Corner Rocket' KTM Duke 390 is lightweight, powerful, and packed with state-of-the-art technology for aggressive street riding." },
  { _id: "69652c02c8f1e5c605231289", name: "Royal Enfield Classic 350", price: 1100, type: "Cruiser", engine: "350cc", fuel: "Petrol", images: ["/images/bike4.jpg"], description: "A classic cruiser with vintage style and a modern heart. Experience the iconic 'thump' while cruising through the valley." },
  { _id: "6965387ac8f1e5c605231296", name: "Suzuki Gixxer", price: 1000, type: "Commuter", engine: "155cc", fuel: "Petrol", images: ["/images/bike5.jpg"], description: "A lightweight commuter bike with big-bike looks. The Gixxer is easy to handle and extremely fun to ride in urban environments." },
];

export default function BikeDetails() {
  const { id } = useParams();
  const bike = bikes.find((b) => b._id === id);

  if (!bike) {
    return (
      <div className="error-page">
        <h2>Motorcycle Not Found</h2>
        <Link to="/bikes">Back to Fleet</Link>
      </div>
    );
  }

  return (
    <div className="details-page-wrapper">
      <div className="container-managed">
        <Link to="/bikes" className="back-nav">
          <ArrowLeft size={18} /> <span>Back to Fleet</span>
        </Link>

        <div className="details-split-layout">
          {/* 🏍️ LEFT: IMAGE GALLERY BOX */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="details-visual-side"
          >
            <div className="main-image-frame">
              <img src={bike.images[0]} alt={bike.name} />
              <div className="type-pill-large">{bike.type}</div>
            </div>
            <div className="trust-badges-row">
              <div className="t-badge"><ShieldCheck size={16} /> Fully Insured</div>
              <div className="t-badge"><ShieldCheck size={16} /> Serviced Today</div>
            </div>
          </motion.div>

          {/* 📝 RIGHT: SPECIFICATIONS & BOOKING */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="details-info-side"
          >
            <div className="info-header">
              <span className="loc-text"><MapPin size={14} /> Available in Kathmandu</span>
              <h1>{bike.name}</h1>
              <div className="rating-row">
                <Star size={16} fill="#ffc107" stroke="none" />
                <strong>4.9</strong> <span>(24 Reviews)</span>
              </div>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <Gauge size={20} />
                <div>
                  <p>Engine</p>
                  <strong>{bike.engine}</strong>
                </div>
              </div>
              <div className="spec-item">
                <Fuel size={20} />
                <div>
                  <p>Fuel Type</p>
                  <strong>{bike.fuel}</strong>
                </div>
              </div>
              <div className="spec-item">
                <Zap size={20} />
                <div>
                  <p>Performance</p>
                  <strong>Premium</strong>
                </div>
              </div>
            </div>

            <div className="description-box">
              <h3>Description</h3>
              <p>{bike.description}</p>
            </div>

            <div className="booking-card">
              <div className="price-stack">
                <span className="label">Rental Price</span>
                <div className="price-val">
                  Rs. {bike.price} <span>/ day</span>
                </div>
              </div>
              <Link to={`/book/${bike._id}`} className="btn-book-final">
                Book This Ride <ArrowLeft style={{ transform: 'rotate(180deg)' }} size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}