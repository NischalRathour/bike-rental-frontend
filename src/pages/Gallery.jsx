import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, Maximize2, MapPin, Heart, 
  Share2, X, Filter, Camera 
} from 'lucide-react';
import "../styles/HireRates.css";

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);

  // Curated stable image data for a premium feel
  const images = [
    { id: 1, url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc", title: "Himalayan Ridge", category: "Expedition" },
    { id: 2, url: "https://images.unsplash.com/photo-1591147761014-9788f21950e1", title: "Royal Enfield Bullet", category: "Classic" },
    { id: 3, url: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6", title: "Upper Mustang Pass", category: "Expedition" },
    { id: 4, url: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4", title: "Mountain Cruiser", category: "Touring" },
    { id: 5, url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87", title: "CRF 250 Rally", category: "Dirt" },
    { id: 6, url: "https://images.unsplash.com/photo-1614165933388-9b552e870e7b", title: "City Scrambler", category: "Classic" },
    { id: 7, url: "https://images.unsplash.com/photo-1517520287167-4bda64282b54", title: "Offroad King", category: "Dirt" },
    { id: 8, url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957", title: "Adventure Tourer", category: "Touring" },
    { id: 9, url: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838", title: "Vintage Explorer", category: "Classic" }
  ];

  const categories = ['All', 'Expedition', 'Classic', 'Dirt', 'Touring'];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  // Disable scroll when Lightbox is open
  useEffect(() => {
    document.body.style.overflow = selectedImg ? 'hidden' : 'unset';
  }, [selectedImg]);

  return (
    <div className="hire-page-root" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 🏔️ FULL-WIDTH HERO SECTION */}
      <section style={{ height: '450px', display: 'flex', alignItems: 'center', background: '#0f172a', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'url(https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="container-managed" style={{ textAlign: 'center', position: 'relative', zIndex: 2, width: '92%', maxWidth: '1600px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '10px 25px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Visual Experience
            </span>
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '900', marginTop: '20px', letterSpacing: '-2px' }}>
              Adventure <span style={{ color: '#818cf8' }}>Logbook</span>
            </h1>
            <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '15px auto', fontSize: '1.2rem', lineHeight: '1.6' }}>
              Real riders, real stories. Explore the moments captured by our community across the Great Himalayan Range.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🛠️ MANAGED FILTER BAR */}
      <div className="container-managed" style={{ marginTop: '-45px', position: 'relative', zIndex: 20, width: '92%', maxWidth: '1600px', margin: '-45px auto 0 auto' }}>
        <div style={{ background: 'white', padding: '15px 40px', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
            <Filter size={20} color="#6366f1" style={{ alignSelf: 'center', marginRight: '10px' }} />
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: '12px 30px', borderRadius: '15px', border: 'none', fontWeight: '800', cursor: 'pointer', transition: '0.3s',
                backgroundColor: filter === cat ? '#0f172a' : '#f1f5f9',
                color: filter === cat ? 'white' : '#64748b',
                fontSize: '0.9rem'
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🖼️ MASONRY GRID: MANAGED LEFT TO RIGHT */}
      <div className="container-managed" style={{ padding: '80px 0', width: '92%', maxWidth: '1600px', margin: '0 auto' }}>
        <motion.div layout style={{ columns: '3 400px', columnGap: '30px' }}>
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedImg(img)}
                style={{ breakInside: 'avoid', marginBottom: '30px', position: 'relative', borderRadius: '35px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 15px 35px rgba(15, 23, 42, 0.08)', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src={`${img.url}?auto=format&fit=crop&w=800&q=80`} alt={img.title} style={{ width: '100%', display: 'block', transition: '0.5s transform' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#6366f1', color: 'white', padding: '6px 15px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {img.category}
                  </div>
                </div>
                <div style={{ padding: '25px', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#0f172a' }}>{img.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontWeight: '600' }}>
                        <MapPin size={14} /> Nepal Highlands
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', color: '#cbd5e1' }}>
                        <Heart size={18} />
                        <Maximize2 size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 📢 BOTTOM SOCIAL CTA */}
        <div style={{ marginTop: '80px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '40px', padding: '80px 40px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Instagram size={48} color="#818cf8" style={{ marginBottom: '25px' }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '15px' }}>Share Your Roar</h2>
            <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto 35px', fontSize: '1.1rem' }}>Tag your journey with #RideNRoar and get featured in our national riders gallery.</p>
            <button style={{ padding: '18px 45px', background: '#fff', color: '#0f172a', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', transition: '0.3s' }} onMouseOver={(e) => e.target.style.background = '#818cf8'} onMouseOut={(e) => e.target.style.background = '#fff'}>
              Follow @RideNRoarNepal
            </button>
          </div>
        </div>
      </div>

      {/* 🔦 PREMIUM LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setSelectedImg(null)} 
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
          >
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              onClick={() => setSelectedImg(null)} 
              style={{ position: 'absolute', top: '40px', right: '40px', background: 'white', border: 'none', borderRadius: '50%', padding: '15px', cursor: 'pointer', zIndex: 2010 }}
            >
              <X size={24} />
            </motion.button>

            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 50, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              style={{ position: 'relative', maxWidth: '1200px', width: '100%', borderRadius: '40px', overflow: 'hidden', background: '#fff', boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }}
            >
              <img src={`${selectedImg.url}?auto=format&fit=crop&w=1600&q=90`} alt={selectedImg.title} style={{ width: '100%', maxHeight: '75vh', objectFit: 'cover' }} />
              <div style={{ padding: '40px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>{selectedImg.title}</h2>
                  <p style={{ color: '#64748b', fontWeight: '700', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={16} /> Featured {selectedImg.category} Series
                  </p>
                </div>
                <button onClick={() => setSelectedImg(null)} style={{ padding: '15px 35px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '800', cursor: 'pointer' }}>
                  Close Gallery
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;