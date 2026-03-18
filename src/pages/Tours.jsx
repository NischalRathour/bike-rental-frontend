import React, { useState } from 'react';
import { 
  MapPin, Calendar, Clock, Star, 
  ShieldCheck, ArrowRight, 
  Mountain, Users, Coffee 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import "../styles/HireRates.css"; 

const Tours = () => {
  const [formData, setFormData] = useState({ 
    fullName: "", 
    groupSize: "1 Person (Solo)" 
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/tours/inquiry', {
        fullName: formData.fullName,
        groupSize: formData.groupSize,
        tourName: tourDetails.name 
      });
      alert(response.data.message || "Inquiry sent successfully!");
      setFormData({ fullName: "", groupSize: "1 Person (Solo)" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hire-page-root" style={{ paddingTop: '120px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 🚀 MAIN CONTENT WRAPPER */}
      <div className="container-full-managed" style={{ width: '92%', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* 🏔️ TOUR HERO SECTION: 2-COLUMN GRID */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '50px', alignItems: 'start', marginBottom: '80px' }}>
          
          {/* LEFT SIDE: VISUALS & CONTENT */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ position: 'relative', borderRadius: '40px', overflow: 'hidden', height: '550px', marginBottom: '40px', boxShadow: '0 30px 60px rgba(15, 23, 42, 0.15)' }}>
              <img src={tourDetails.image} alt={tourDetails.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '30px', left: '30px', background: '#6366f1', color: '#fff', padding: '10px 25px', borderRadius: '100px', fontWeight: '800', fontSize: '0.75rem', letterSpacing: '1px' }}>
                FEATURED EXPEDITION
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '30px' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', letterSpacing: '-2px', margin: '0 0 15px 0', lineHeight: 1.1 }}>{tourDetails.name}</h1>
                <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontWeight: '700' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={18} fill="#ffc107" color="#ffc107"/> {tourDetails.rating}.0 ({tourDetails.reviews} reviews)</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18}/> Mustang, Nepal</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '2.8rem', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>₨{tourDetails.price.toLocaleString()}</span>
                <span style={{ color: '#64748b', fontWeight: '700', fontSize: '1rem' }}>per person / all inclusive</span>
              </div>
            </div>

            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#475569', marginBottom: '50px', maxWidth: '90%' }}>{tourDetails.description}</p>

            {/* SPECS GRID: HORIZONTAL ALIGNMENT */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
              {[
                { icon: Clock, label: "Duration", value: tourDetails.duration },
                { icon: Mountain, label: "Difficulty", value: tourDetails.difficulty },
                { icon: Calendar, label: "Next Batch", value: tourDetails.nextDate }
              ].map((spec, i) => (
                <div key={i} style={{ background: '#fff', padding: '30px', borderRadius: '30px', border: '1px solid #e2e8f0', textAlign: 'center', transition: '0.3s' }}>
                  <spec.icon size={28} color="#6366f1" style={{ margin: '0 auto 15px' }}/>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{spec.label}</span>
                  <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{spec.value}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE: PREMIUM INQUIRY FORM */}
          <aside style={{ position: 'sticky', top: '120px' }}>
            <div style={{ background: '#fff', padding: '50px', borderRadius: '40px', border: '1px solid #e2e8f0', boxShadow: '0 40px 80px -20px rgba(15, 23, 42, 0.1)' }}>
              <h3 style={{ marginBottom: '30px', fontWeight: '900', fontSize: '1.8rem', letterSpacing: '-1px' }}>Reserve Your Spot</h3>
              
              <form style={{ display: 'flex', flexDirection: 'column', gap: '25px' }} onSubmit={handleSubmit}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '10px', letterSpacing: '0.5px' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter your name" 
                    style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '600' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', marginBottom: '10px', letterSpacing: '0.5px' }}>GROUP SIZE</label>
                  <select 
                    value={formData.groupSize}
                    onChange={(e) => setFormData({...formData, groupSize: e.target.value})}
                    style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: '600', cursor: 'pointer' }}
                  >
                    <option>1 Person (Solo)</option>
                    <option>2-4 People (Small Group)</option>
                    <option>5+ People (Private Group)</option>
                  </select>
                </div>
                <div style={{ padding: '25px', background: '#f1f5f9', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', color: '#64748b' }}>Deposit (15%)</span>
                    <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>₨6,750</strong>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>The remaining balance will be collected upon arrival at our headquarters.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{ 
                    width: '100%', padding: '20px', background: '#0f172a', color: '#fff', 
                    border: 'none', borderRadius: '18px', fontWeight: '800', fontSize: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
                    cursor: submitting ? 'not-allowed' : 'pointer', transition: '0.3s'
                  }}
                  onMouseOver={(e) => !submitting && (e.currentTarget.style.background = '#6366f1')}
                  onMouseOut={(e) => !submitting && (e.currentTarget.style.background = '#0f172a')}
                >
                  {submitting ? "Processing..." : "Confirm Inquiry"} <ArrowRight size={20}/>
                </button>
              </form>
            </div>
          </aside>
        </section>

        {/* 🧭 OTHER PACKAGES SECTION: WIDE GRID */}
        <section style={{ padding: '100px 0', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <div>
              <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '6px 15px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Marketplace</span>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', marginTop: '15px', letterSpacing: '-1.5px' }}>Popular Adventure Routes</h2>
            </div>
            <button style={{ padding: '12px 30px', borderRadius: '14px', border: '2px solid #0f172a', background: 'transparent', fontWeight: '800', cursor: 'pointer' }}>Explore All Tours</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
            {/* Manang Card */}
            <div style={{ background: '#fff', borderRadius: '35px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', height: '320px' }}>
              <div style={{ flex: 1, backgroundImage: 'url(https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=1000)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ flex: 1.2, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '15px' }}>Manang Loop</h4>
                <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '30px', lineHeight: '1.6' }}>The Marsyangdi valley and high mountain lakes. 8 days of pure riding.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontWeight: '900', color: '#6366f1', fontSize: '1.2rem' }}>₨32,000</span>
                  <button style={{ padding: '12px 25px', borderRadius: '15px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>View Package</button>
                </div>
              </div>
            </div>

            {/* Pokhara Card */}
            <div style={{ background: '#fff', borderRadius: '35px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', height: '320px' }}>
              <div style={{ flex: 1, backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ flex: 1.2, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '15px' }}>Pokhara Relax</h4>
                <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '30px', lineHeight: '1.6' }}>Short 3-day getaway with panoramic views of the Annapurna range.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontWeight: '900', color: '#6366f1', fontSize: '1.2rem' }}>₨12,500</span>
                  <button style={{ padding: '12px 25px', borderRadius: '15px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>View Package</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🛠️ TRUST SECTION: HORIZONTAL ALIGNMENT */}
        <section style={{ padding: '0 0 100px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {[
              { icon: ShieldCheck, title: "Fully Insured", desc: "Comprehensive rider and bike insurance included." },
              { icon: Users, title: "Expert Guides", desc: "Nepal's most experienced road captains." },
              { icon: Coffee, title: "Premium Lodging", desc: "Handpicked tea houses and hotels for comfort." }
            ].map((trust, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', padding: '40px', background: '#fff', borderRadius: '35px', border: '1px solid #e2e8f0' }}>
                <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '20px', height: 'fit-content' }}>
                  <trust.icon size={32} color="#6366f1"/>
                </div>
                <div>
                  <h4 style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '8px' }}>{trust.title}</h4>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{trust.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tours;