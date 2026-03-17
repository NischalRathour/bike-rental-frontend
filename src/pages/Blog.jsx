import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, User, ArrowRight, Clock, 
  ChevronLeft, Bookmark, Share2, 
  AlertCircle, MessageSquare, Send, Loader2
} from 'lucide-react';
import api from '../api/axiosConfig';
import "../styles/HireRates.css";

// --- Sub-Component: Comments Section ---
const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/blog/${blogId}/comments`);
        setComments(res.data);
      } catch (err) { 
        console.error("Error fetching comments"); 
      } finally {
        setFetching(false);
      }
    };
    if (blogId) fetchComments();
  }, [blogId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post(`/blog/${blogId}/comments`, { 
        userName, 
        text: newComment 
      });
      setComments([res.data, ...comments]);
      setNewComment("");
      setUserName("");
    } catch (err) { 
      alert("Error posting comment. Please try again."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={{ marginTop: '60px', padding: '40px', background: '#f8fafc', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', fontWeight: '800' }}>
        <MessageSquare size={24} color="#6366f1" /> Discussions ({comments.length})
      </h3>

      <form onSubmit={handlePostComment} style={{ marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '15px' }}>
          <input 
            type="text" placeholder="Your Name" value={userName} required
            onChange={(e) => setUserName(e.target.value)}
            style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
          />
          <div style={{ position: 'relative' }}>
            <input 
              type="text" placeholder="Ask a question about this route..." value={newComment} required
              onChange={(e) => setNewComment(e.target.value)}
              style={{ width: '100%', padding: '14px 50px 14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
            />
            <button type="submit" disabled={loading} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}>
              {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
            </button>
          </div>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fetching ? (
          <p style={{ color: '#94a3b8' }}>Loading comments...</p>
        ) : comments.map((c, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{c.userName}</strong>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(c.createdAt || c.date).toLocaleDateString()}</span>
            </div>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: '1.6' }}>{c.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Main Blog Component ---
const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    { 
      id: "top-5-routes",
      title: "Top 5 Routes in Nepal for 2026", 
      date: "March 10, 2026", 
      author: "Sujan M.", 
      readTime: "8 min read",
      category: "Adventures",
      excerpt: "From the hidden valleys of Upper Dolpo to the freshly paved curves of the Mid-Hill Highway...", 
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc",
      content: `The Himalayan riding season of 2026 is shaping up to be the most accessible yet.

      ### 1. Upper Mustang Corridor
      The legendary "Forbidden Kingdom" remains the crown jewel of Nepal. In 2026, the road from Jomsom to Lo Manthang has seen significant improvements, though the high-altitude desert winds still demand respect.

      ### 2. The Dolpo Discovery
      Upper Dolpo is the new frontier. It offers a raw, untouched experience that Mustang had ten years ago. It is remote, rugged, and requires a dedicated support vehicle.

      ### 3. Mid-Hill Twisties
      For those who love asphalt, the Mid-Hill highway offers thousands of banked corners across the lush middle hills.`
    }
  ];

  if (selectedPost) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '100px' }}>
        <article className="container-managed" style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '100px' }}>
          <button onClick={() => setSelectedPost(null)} style={{ border: 'none', background: '#f1f5f9', padding: '12px 24px', borderRadius: '100px', fontWeight: '700', cursor: 'pointer', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChevronLeft size={18}/> Back to Journal
          </button>

          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: '1.1', color: '#0f172a' }}>{selectedPost.title}</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', color: '#64748b', fontSize: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16}/> {selectedPost.author}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16}/> {selectedPost.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> {selectedPost.readTime}</span>
            </div>
          </header>

          <img src={selectedPost.image} alt="" style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '32px', marginBottom: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />

          <div style={{ fontSize: '1.25rem', lineHeight: '1.9', color: '#1e293b', whiteSpace: 'pre-line' }}>
            {selectedPost.content}
          </div>

          <CommentSection blogId={selectedPost.id} />
        </article>
      </div>
    );
  }

  return (
    <div className="hire-page-root" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container-managed">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="sub-tag">The Rider's Journal</span>
            <h1 style={{ fontWeight: 900, fontSize: '3.5rem', marginTop: '10px' }}>Explore <span style={{ color: '#6366f1' }}>Nepal</span></h1>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px' }}>
          {posts.map((post) => (
            <motion.div 
              key={post.id} 
              whileHover={{ y: -10 }} 
              onClick={() => setSelectedPost(post)} 
              style={{ background: 'white', borderRadius: '28px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}
            >
              <img src={post.image} alt="" style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
              <div style={{ padding: '35px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <span style={{ color: '#6366f1', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>{post.category}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{post.readTime}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '15px', color: '#0f172a' }}>{post.title}</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '25px' }}>{post.excerpt}</p>
                <div style={{ color: '#6366f1', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Read Detail <ArrowRight size={18}/>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;