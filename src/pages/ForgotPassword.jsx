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

  // STEP 1: Request OTP
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

  // STEP 2: Change Password using OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sending the email (fixed from step 1), otp, and new password
      const payload = { 
        email: email.toLowerCase().trim(), 
        otp: otp.trim(), 
        newPassword: newPassword 
      };

      const res = await api.post('/users/reset-password', payload);

      if (res.data.success) {
        setMessage("Password updated successfully! Redirecting...");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) { 
      setError(err.response?.data?.message || "Invalid or expired reset code."); 
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc'}}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="form-container-managed" 
        style={{maxWidth: '420px', width: '100%', padding: '40px', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.1)'}}
      >
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
           <h2 style={{color: '#1e293b', marginBottom: '8px'}}>
             {step === 1 ? "Forgot Password" : "Set New Password"}
           </h2>
           <p style={{color: '#64748b', fontSize: '14px'}}>
             {step === 1 ? "Enter your email to receive a recovery code." : "Enter the 6-digit code and your new password."}
           </p>
        </div>
        
        <AnimatePresence>
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-error-box" style={{background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fee2e2'}}>{error}</motion.div>}
          {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-success-box" style={{color: '#10b981', background: '#ecfdf5', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #d1fae5'}}>{message}</motion.div>}
        </AnimatePresence>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="managed-form">
            <div className="m-input-group" style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>Email Address</label>
              <div style={{position: 'relative'}}>
                <Mail size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="your@email.com" 
                  style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                />
              </div>
            </div>
            <button type="submit" className="btn-auth-primary" disabled={loading} style={{width: '100%', background: '#6366f1', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}}>
               {loading ? <Loader2 className="animate-spin" size={20} /> : "Request Reset OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="managed-form">
            {/* Displaying the Email as Read-Only */}
            <div style={{background: '#f1f5f9', padding: '10px 15px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
               <Mail size={16} color="#64748b" />
               <span style={{fontSize: '14px', color: '#475569', fontWeight: '500'}}>{email}</span>
            </div>

            <div className="m-input-group" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>6-Digit OTP</label>
              <div style={{position: 'relative'}}>
                <Key size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  required 
                  placeholder="123456" 
                  maxLength="6"
                  style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', letterSpacing: '2px'}}
                />
              </div>
            </div>

            <div className="m-input-group" style={{marginBottom: '25px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>New Password</label>
              <div style={{position: 'relative'}}>
                <Lock size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  placeholder="Min 6 characters" 
                  minLength="6"
                  style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                />
              </div>
            </div>

            <button type="submit" className="btn-auth-primary" disabled={loading} style={{width: '100%', background: '#10b981', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Update Password <CheckCircle size={18}/></>}
            </button>

            <button type="button" onClick={() => setStep(1)} style={{width: '100%', background: 'none', border: 'none', color: '#6366f1', marginTop: '15px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
               <ArrowLeft size={14} /> Back to email
            </button>
          </form>
        )}

        <div style={{marginTop: '30px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px'}}>
           <p style={{fontSize: '14px', color: '#64748b'}}>Remembered it? <Link to="/login" style={{color: '#6366f1', fontWeight: '600', textDecoration: 'none'}}>Back to Login</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;