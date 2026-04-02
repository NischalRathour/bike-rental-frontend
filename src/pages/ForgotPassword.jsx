import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Key, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/users/forgot-password', { email: email.toLowerCase().trim() });
      if (res.data.success) {
        setStep(2);
        setMessage("Security code sent to your Gmail.");
      }
    } catch (err) { 
      setError(err.response?.data?.message || "Error sending reset email."); 
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { 
        email: email.toLowerCase().trim(), 
        otp: otp.trim(), 
        newPassword: newPassword 
      };
      const res = await api.post('/users/reset-password', payload);
      if (res.data.success) {
        setMessage("Password updated! Redirecting to login...");
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) { 
      setError(err.response?.data?.message || "Invalid or expired reset code."); 
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc'}}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{maxWidth: '420px', width: '100%', padding: '40px', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
        
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
           <h2 style={{color: '#1e293b', marginBottom: '8px'}}>{step === 1 ? "Forgot Password" : "Set New Password"}</h2>
           <p style={{color: '#64748b', fontSize: '14px'}}>
             {step === 1 ? "Enter your email to receive a recovery code." : "Enter the 6-digit code and your new password."}
           </p>
        </div>
        
        <AnimatePresence>
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', textAlign: 'center'}}>{error}</motion.div>}
          {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{color: '#10b981', background: '#ecfdf5', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', textAlign: 'center'}}>{message}</motion.div>}
        </AnimatePresence>

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px'}}>Email Address</label>
              <div style={{position: 'relative'}}>
                <Mail size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" 
                  style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{width: '100%', background: '#6366f1', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer'}}>
               {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px'}}>Enter OTP</label>
              <div style={{position: 'relative'}}>
                <Key size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength="6" placeholder="6-digit code"
                  style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', letterSpacing: '2px'}}
                />
              </div>
            </div>
            <div style={{marginBottom: '25px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px'}}>New Password</label>
              <div style={{position: 'relative'}}>
                <Lock size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength="6" placeholder="Create new password"
                  style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{width: '100%', background: '#10b981', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer'}}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
          </form>
        )}

        <div style={{marginTop: '25px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px'}}>
           <Link to="/login" style={{color: '#6366f1', fontSize: '13px', fontWeight: '600', textDecoration: 'none'}}>Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;