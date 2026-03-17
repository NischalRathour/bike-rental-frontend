import React, { useState } from 'react';
import { 
  MapPin, Calendar, Clock, Star, 
  CheckCircle2, ShieldCheck, ArrowRight, 
  Mountain, Users, Coffee 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig'; // ✅ Integrated Backend API
import "../styles/HireRates.css"; 

const Tours = () => {
  // 1. Form State Management
  const [formData, setFormData] = useState({ 
    fullName: "", 
    groupSize: "1 Person (Solo)" 
  });
  const [submitting, setSubmitting] = useState(false);

  // Tour Static Data
  const tourDetails = {
    name: "Upper Mustang Expedition",
    price: 45000,
    duration: "12 Days",
    difficulty: "Challenging",
    nextDate: "April 15, 2026",
    rating: 5,
    reviews: 14,
    description: "Experience the forbidden kingdom of Mustang on two wheels. This tour takes you through deep river gorges, ancient monasteries, and the high-altitude desert landscapes of the Himalayas. Perfect for riders seeking the ultimate adventure.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000"
  };

  // 2. Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/tours/inquiry', {
        fullName: formData.fullName,
        groupSize: formData.groupSize,
        tourName: tourDetails.name // Automatically sends the featured tour name
      });
      
      alert(response.data.message || "Inquiry sent successfully!");
      setFormData({ fullName: "", groupSize: "1 Person (Solo)" }); // Reset form
    } catch (err) {
      console.error("Inquiry Error:", err);
      alert(err.response?.data?.message || "Failed to send inquiry. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hire-page-root" style={{ paddingTop: '100px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 🏔️ TOUR HERO SECTION */}
      <section className="container-managed" style={{ marginBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          {/* LEFT SIDE: TOUR INFO */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', height: '450px', marginBottom: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <img src={tourDetails.image} alt={tourDetails.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#6366f1', color: '#fff', padding: '8px 20px', borderRadius: '100px', fontWeight: '800', fontSize: '0.8rem' }}>
                FEATURED EXPEDITION
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '10px', margin: 0 }}>{tourDetails.name}</h1>
                <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontWeight: '600', marginTop: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={16} fill="#ffc107" color="#ffc107"/> {tourDetails.rating}.0 ({tourDetails.reviews} reviews)</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16}/> Mustang, Nepal</span>
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '2.2rem', fontWeight: '900', color: '#0f172a' }}>₨{tourDetails.price.toLocaleString()}</span>
                <span style={{ color: '#64748b', fontWeight: '700' }}>per person</span>
              </div>
            </div>

            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#475569', marginBottom: '40px' }}>{tourDetails.description}</p>

            {/* SPECS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '40px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Clock size={24} color="#6366f1" style={{ margin: '0 auto 10px' }}/>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Duration</span>
                <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{tourDetails.duration}</strong>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Mountain size={24} color="#6366f1" style={{ margin: '0 auto 10px' }}/>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Difficulty</span>
                <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{tourDetails.difficulty}</strong>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Calendar size={24} color="#6366f1" style={{ margin: '0 auto 10px' }}/>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Next Batch</span>
                <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{tourDetails.nextDate}</strong>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: INQUIRY FORM */}
          <aside>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', position: 'sticky', top: '120px' }}>
              <h3 style={{ marginBottom: '25px', fontWeight: '800', fontSize: '1.4rem' }}>Reserve Your Spot</h3>
              
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter your name" 
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '8px' }}>GROUP SIZE</label>
                  <select 
                    value={formData.groupSize}
                    onChange={(e) => setFormData({...formData, groupSize: e.target.value})}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                  >
                    <option>1 Person (Solo)</option>
                    <option>2-4 People (Small Group)</option>
                    <option>5+ People (Private Group)</option>
                  </select>
                </div>
                <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600', color: '#64748b' }}>Deposit (15%)</span>
                    <strong style={{ color: '#0f172a' }}>₨6,750</strong>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>Remaining balance to be paid on arrival.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{ 
                    width: '100%', padding: '18px', background: '#0f172a', color: '#fff', 
                    border: 'none', borderRadius: '16px', fontWeight: '800', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', gap: '10px', 
                    cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 
                  }}
                >
                  {submitting ? "Sending..." : "Inquire Now"} <ArrowRight size={18}/>
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {/* 🧭 OTHER PACKAGES SECTION */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container-managed">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="sub-tag">Explore More</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Popular Adventure <span className="text-gradient">Routes</span></h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {/* Manang Card */}
            <div style={{ background: '#f8fafc', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ height: '220px', backgroundImage: 'url(https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=1000)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '25px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '10px' }}>Manang Loop Adventure</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>Explore the Marsyangdi valley and high mountain lakes over 8 days of pure riding.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', color: '#6366f1' }}>₨32,000 / Person</span>
                  <button style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>View Details</button>
                </div>
              </div>
            </div>

            {/* Pokhara Card */}
            <div style={{ background: '#f8fafc', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ height: '220px', backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '25px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '10px' }}>Pokhara Valley Relax</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>Short 3-day gateway to the lake city with panoramic views of Annapurna range.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', color: '#6366f1' }}>₨12,500 / Person</span>
                  <button style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛠️ TRUST SECTION */}
      <section className="container-managed" style={{ padding: '80px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div className="trust-card" style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <ShieldCheck size={40} color="#6366f1" style={{ margin: '0 auto 20px' }}/>
            <h4 style={{ fontWeight: '800', marginBottom: '10px' }}>Fully Insured</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>All our tours come with comprehensive rider and bike insurance.</p>
          </div>
          <div className="trust-card" style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <Users size={40} color="#6366f1" style={{ margin: '0 auto 20px' }}/>
            <h4 style={{ fontWeight: '800', marginBottom: '10px' }}>Expert Guides</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Ride with Nepal's most experienced Himalayan road captains.</p>
          </div>
          <div className="trust-card" style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <Coffee size={40} color="#6366f1" style={{ margin: '0 auto 20px' }}/>
            <h4 style={{ fontWeight: '800', marginBottom: '10px' }}>Premium Lodging</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>We handpick the best tea houses and hotels for your comfort.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tours;