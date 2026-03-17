import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bikesData } from '../data/fleet'; // ✅ Importing your shared data
import { 
  Star, Gauge, Calendar, Fuel, Users, 
  CheckCircle, ShieldCheck, Heart, Share2, Info,
  Settings, ArrowRight, MessageCircle 
} from 'lucide-react';
import "../styles/BikeDetails.css";

const BikeDetails = () => {
  const { id } = useParams(); // Grabs 'b1', 'b2', etc. from the URL
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('features');
  const [bike, setBike] = useState(null);

  useEffect(() => {
    // 🔍 Find the specific bike from your fleet.js matching the URL ID
    const selectedBike = bikesData.find(b => b._id === id);
    
    if (selectedBike) {
      setBike(selectedBike);
      window.scrollTo(0, 0); // Reset scroll to top on load
    } else {
      // If user enters an ID that doesn't exist, send them back to marketplace
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
              <img src={bike.images[0]} alt={bike.name} />
              <div className="year-badge">{bike.modelYear}</div>
            </div>

            <div className="title-section">
              <div className="title-left">
                <h1>{bike.name}</h1>
                <div className="review-summary">
                  <Star size={18} fill="#ffc107" color="#ffc107" />
                  <span>{bike.rating}.0 ({bike.reviews} reviews)</span>
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

            <p className="description-text">{bike.description}</p>

            {/* 📊 DYNAMIC SPECS GRID */}
            <div className="features-grid">
              <div className="feature-item">
                <Gauge size={22}/> 
                <div><span>Mileage</span><strong>{bike.mileage}</strong></div>
              </div>
              <div className="feature-item">
                <Calendar size={22}/> 
                <div><span>Edition</span><strong>{bike.modelYear}</strong></div>
              </div>
              <div className="feature-item">
                <Info size={22}/> 
                <div><span>Engine</span><strong>{bike.engine}</strong></div>
              </div>
              <div className="feature-item">
                <Users size={22}/> 
                <div><span>Passengers</span><strong>{bike.seats}</strong></div>
              </div>
              <div className="feature-item">
                <Settings size={22}/> 
                <div><span>Gearbox</span><strong>{bike.gear}</strong></div>
              </div>
              <div className="feature-item">
                <Fuel size={22}/> 
                <div><span>Fuel Type</span><strong>{bike.fuel}</strong></div>
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
                    <p>• Must hold a valid <strong>Category A</strong> driving license.</p>
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
              <form className="booking-form">
                <div className="form-group">
                  <label>Pickup Date</label>
                  <input type="date" className="custom-input" />
                </div>
                <div className="form-group">
                  <label>Return Date</label>
                  <input type="date" className="custom-input" />
                </div>
                
                <div className="total-preview">
                  <span>Base Price</span>
                  <strong>₨{bike.price.toLocaleString()}</strong>
                </div>

                <button type="submit" className="btn-book-now">
                  Proceed to Book <ArrowRight size={18}/>
                </button>
              </form>

              <div className="whatsapp-help">
                <MessageCircle size={18} />
                <span>Need help? <a href="#">WhatsApp Sujan</a></span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default BikeDetails;