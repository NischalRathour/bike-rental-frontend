import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext'; 
import { ShieldCheck, ArrowRight, Lock, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Extract state passed from Login or AdminLogin
  const email = location.state?.email;
  const isLoginFlow = location.state?.requiresOTP;
  const isAdminFlow = location.state?.isAdminFlow; // Captured from AdminLogin

  useEffect(() => {
    // 🛡️ Safety redirect if accessed without email context
    if (!email) {
      navigate('/login');
      return;
    }

    let interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🛰️ Hit the unified verification endpoint
      const res = await api.post('/users/verify-otp', { email, otp });
      
      if (res.data.success) {
        if (isLoginFlow) {
          // ✅ 1. Sync User state to AuthContext (Saves token and user info)
          login(res.data.user, res.data.token);

          const userRole = res.data.user.role;
          console.log(`🔐 System: Identity Authenticated as [${userRole}]`);

          // ✅ 2. Role-Based Command Center Redirection
          if (userRole === 'admin') {
            navigate("/admin/dashboard");
          } else if (userRole === 'owner') {
            navigate("/owner-dashboard");
          } else {
            navigate("/customer");
          }
        } else {
          // 🆕 Registration Success Path
          alert("Account Activated! Authorization successful. Please login.");
          navigate('/login');
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid or expired security code.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      // 🔄 Resend logic based on user email
      await api.post('/users/resend-otp', { email });
      setTimer(60);
      setCanResend(false);
      setOtp('');
      alert("A fresh security code has been dispatched to your Gmail.");
    } catch (err) {
      setError("System failure: Could not dispatch new code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-root-wrapper" style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', background: '#f8fafc', padding: '20px' 
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="otp-card" 
        style={{ 
          maxWidth: '420px', width: '100%', padding: '40px', background: 'white', 
          borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', textAlign: 'center' 
        }}
      >
        {/* Visual Badge */}
        <div style={{ 
          background: isAdminFlow ? '#ef444410' : '#6366f110', 
          width: '70px', height: '70px', borderRadius: '20px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          margin: '0 auto 20px' 
        }}>
          <ShieldCheck size={38} color={isAdminFlow ? '#ef4444' : '#6366f1'} />
        </div>
        
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>
          {isAdminFlow ? 'Admin Verification' : 'Security Check'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '10px 0 30px' }}>
          Enter the 6-digit access code sent to: <br/>
          <strong style={{ color: '#1e293b' }}>{email}</strong>
        </p>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ 
              position: 'absolute', left: '15px', top: '50%', 
              transform: 'translateY(-50%)', color: '#94a3b8' 
            }} />
            <input 
              type="text" 
              placeholder="000000" 
              maxLength="6" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              style={{ 
                width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', 
                border: '2px solid #e2e8f0', fontSize: '22px', textAlign: 'center', 
                fontWeight: '800', letterSpacing: '8px', outline: 'none' 
              }} 
              required 
              autoFocus
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ 
                color: '#ef4444', fontSize: '13px', background: '#fef2f2', 
                padding: '12px', borderRadius: '10px', border: '1px solid #fee2e2' 
              }}
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', padding: '15px', borderRadius: '12px', 
              background: isAdminFlow ? '#1e293b' : '#6366f1', 
              color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Identity"} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Resend Logic Footer */}
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          {canResend ? (
            <button onClick={handleResend} style={{ 
              color: '#6366f1', background: 'none', border: 'none', 
              cursor: 'pointer', fontWeight: '700', fontSize: '14px',
              display: 'inline-flex', alignItems: 'center', gap: '5px'
            }}>
              <RefreshCw size={14} /> Resend Access Key
            </button>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              Request new code in <strong style={{ color: '#6366f1' }}>{timer}s</strong>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerification;