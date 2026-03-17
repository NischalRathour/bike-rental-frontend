import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, Maximize2, MapPin, Heart, 
  Share2, Filter, X, ChevronLeft, ChevronRight 
} from 'lucide-react';
import "../styles/HireRates.css";

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);

  // Stable image data
  const images = [
    { id: 1, url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc", title: "Himalayan Ridge", category: "Expedition" },
    { id: 2, url: "https://images.unsplash.com/photo-1591147761014-9788f21950e1", title: "Royal Enfield Bullet", category: "Classic" },
    { id: 3, url: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6", title: "Upper Mustang Pass", category: "Expedition" },
    { id: 4, url: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4", title: "Mountain Cruiser", category: "Touring" },
    { id: 5, url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87", title: "CRF 250 Rally", category: "Dirt" },
    { id: 6, url: "https://images.unsplash.com/photo-1614165933388-9b552e870e7b", title: "City Scrambler", category: "Classic" },
    { id: 7, url: "https://images.unsplash.com/photo-1517520287167-4bda64282b54", title: "Offroad King", category: "Dirt" },
    { id: 8, url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957", title: "Adventure Tourer", category: "Touring" }
  ];

  const categories = ['All', 'Expedition', 'Classic', 'Dirt', 'Touring'];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  // Disable scroll when Lightbox is open
  useEffect(() => {
    if (selectedImg) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedImg]);

  return (
    <div className="hire-page-root" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 🏔️ GALLERY HERO */}
      <section className="hire-hero-section" style={{ height: '400px', display: 'flex', alignItems: 'center', background: '#0f172a', color: 'white' }}>
        <div className="container-managed" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ background: 'rgba(129, 140, 248, 0.2)', color: '#818cf8', padding: '8px 20px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px' }}>
              #RIDENROARNEPAL
            </span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginTop: '15px' }}>Adventure <span style={{ color: '#818cf8' }}>Logbook</span></h1>
            <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '15px auto' }}>
              Explore the moments captured by our community across the Great Himalayan Range.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🛠️ FILTER BAR */}
      <div className="container-managed" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: 'white', padding: '15px 30px', borderRadius: '20px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', transition: '0.3s',
                backgroundColor: filter === cat ? '#6366f1' : '#f1f5f9',
                color: filter === cat ? 'white' : '#64748b'
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🖼️ MASONRY GRID */}
      <div className="container-managed" style={{ padding: '60px 0' }}>
        <motion.div layout style={{ columns: '3 300px', columnGap: '25px' }}>
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedImg(img)}
                style={{ breakInside: 'avoid', marginBottom: '25px', position: 'relative', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src={`${img.url}?auto=format&fit=crop&w=800&q=80`} alt={img.title} style={{ width: '100%', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#6366f1', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '800' }}>
                    {img.category}
                  </div>
                </div>
                <div style={{ padding: '18px', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>{img.title}</h4>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <MapPin size={12} /> Nepal
                      </span>
                    </div>
                    <Maximize2 size={16} color="#cbd5e1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 🔦 LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImg(null)}
              style={{ position: 'absolute', top: '30px', right: '30px', background: 'white', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', zIndex: 1010 }}
            >
              <X size={24} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: '1000px', width: '100%', maxHeight: '85vh', borderRadius: '24px', overflow: 'hidden', background: '#fff' }}
            >
              <img 
                src={`${selectedImg.url}?auto=format&fit=crop&w=1200&q=90`} 
                alt={selectedImg.title} 
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover' }} 
              />
              <div style={{ padding: '30px', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{selectedImg.title}</h2>
                    <p style={{ color: '#64748b', fontWeight: '600' }}>Category: {selectedImg.category}</p>
                  </div>
                  <button onClick={() => setSelectedImg(null)} style={{ padding: '12px 25px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;