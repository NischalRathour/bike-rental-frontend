import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bikesData } from '../data/fleet'; // ✅ Ensure this file uses paths like /images/bullet.jpg
import { 
  Star, Gauge, Calendar, Fuel, Users, 
  CheckCircle, ShieldCheck, Heart, Share2, Info,
  Settings, ArrowRight, MessageCircle 
} from 'lucide-react';
import "../styles/BikeDetails.css";

const BikeDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('features');
  const [bike, setBike] = useState(null);

  useEffect(() => {
    // 🔍 Fetch the bike data
    const selectedBike = bikesData.find(b => b._id === id);
    
    if (selectedBike) {
      setBike(selectedBike);
      window.scrollTo(0, 0); 
    } else {
      // Fallback if ID is invalid
      navigate('/bikes');
    }
  }, [id, navigate]);

  if (!bike) {
    return (
      <div className="details-loading">
        <div className="spinner"></div>
        <p>Fetching Vehicle Specs...</p>
      </div>
    );
  }

  return (
    <div className="details-root">
      {/* 🧭 NAVIGATION BREADCRUMB */}
      <div className="breadcrumb-bar">
        <div className="container-managed">
          <p>Home &gt; Bike Rental Nepal &gt; <span className="active">{bike.name}</span></p>
        </div>
      </div>

      <main className="details-container container-managed">
        <div className="details-grid">
          
          {/* ⬅️ LEFT SIDE: DYNAMIC CONTENT */}
          <div className="content-side">
            <div className="main-image-card">
              {/* ✅ UPDATED: Added real image logic with fallback */}
              <img 
                src={bike.images && bike.images[0] ? bike.images[0] : "/images/royal-enfield-1.jpg"} 
                alt={bike.name} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/images/royal-enfield-1.jpg"; 
                }}
              />
              <div className="year-badge">{bike.modelYear || "2024"}</div>
            </div>

            <div className="title-section">
              <div className="title-left">
                <h1>{bike.brand} {bike.name}</h1>
                <div className="review-summary">
                  <Star size={18} fill="#ffc107" color="#ffc107" />
                  <span>{bike.rating || "5.0"} ({bike.reviews || "12"} reviews)</span>
                </div>
              </div>
              <div className="price-box">
                <span className="amount">₨{bike.price.toLocaleString()}</span>
                <span className="unit">/ Day</span>
              </div>
            </div>

            <div className="action-buttons-row">
              <button className="btn-icon-text"><Heart size={18}/> Wishlist</button>
              <button className="btn-icon-text"><Share2 size={18}/> Share</button>
            </div>

            <p className="description-text">{bike.description || "Premium condition, serviced and ready for the Nepalese terrain."}</p>

            {/* 📊 DYNAMIC SPECS GRID */}
            <div className="features-grid">
              <div className="feature-item">
                <Gauge size={22}/> 
                <div><span>Mileage</span><strong>{bike.mileage || "45 kmpl"}</strong></div>
              </div>
              <div className="feature-item">
                <Calendar size={22}/> 
                <div><span>Edition</span><strong>{bike.modelYear || "2024"}</strong></div>
              </div>
              <div className="feature-item">
                <Info size={22}/> 
                <div><span>Engine</span><strong>{bike.cc || bike.engine}</strong></div>
              </div>
              <div className="feature-item">
                <Users size={22}/> 
                <div><span>Passengers</span><strong>2 Seats</strong></div>
              </div>
              <div className="feature-item">
                <Settings size={22}/> 
                <div><span>Gearbox</span><strong>5-Speed Manual</strong></div>
              </div>
              <div className="feature-item">
                <Fuel size={22}/> 
                <div><span>Fuel Type</span><strong>Petrol</strong></div>
              </div>
            </div>

            {/* 📑 TABBED INFORMATION */}
            <div className="tabs-container">
              <div className="tab-headers">
                <button className={activeTab === 'features' ? 'active' : ''} onClick={() => setActiveTab('features')}>Inclusions</button>
                <button className={activeTab === 'policy' ? 'active' : ''} onClick={() => setActiveTab('policy')}>Rental Policy</button>
              </div>

              <div className="tab-content">
                {activeTab === 'features' && (
                  <ul className="included-list">
                    <li><CheckCircle size={18} color="#10b981"/> Road Map of Nepal Trails</li>
                    <li><CheckCircle size={18} color="#10b981"/> 24/7 Mechanical Support</li>
                    <li><CheckCircle size={18} color="#10b981"/> Unlimited KMs in Valley</li>
                    <li><ShieldCheck size={18} color="#10b981"/> Theft Protection Coverage</li>
                  </ul>
                )}
                {activeTab === 'policy' && (
                  <div className="policy-text">
                    <p>• Refundable security deposit required upon pickup.</p>
                    <p>• Must hold a valid Category A driving license.</p>
                    <p>• Late return fee: ₨ 500 per hour after 8:00 PM.</p>
                    <p>• Full tank provided; please return with full tank.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ➡️ RIGHT SIDE: STICKY BOOKING FORM */}
          <aside className="booking-side">
            <div className="booking-card sticky">
              <h3>Secure Booking</h3>
              <form className="booking-form" onSubmit={(e) => {
                e.preventDefault();
                navigate(`/book/${bike._id}`);
              }}>
                <div className="form-group">
                  <label>Pickup Date</label>
                  <input type="date" className="custom-input" required />
                </div>
                <div className="form-group">
                  <label>Return Date</label>
                  <input type="date" className="custom-input" required />
                </div>
                
                <div className="total-preview">
                  <span>Base Price</span>
                  <strong className="text-indigo">₨{bike.price.toLocaleString()}</strong>
                </div>

                <button type="submit" className="btn-book-now">
                  Proceed to Book <ArrowRight size={18}/>
                </button>
              </form>

              <div className="whatsapp-help">
                <MessageCircle size={18} />
                <span>Need help? <a href="https://wa.me/9779800000000" target="_blank" rel="noreferrer">WhatsApp Sujan</a></span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default BikeDetails;