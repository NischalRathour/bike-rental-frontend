import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { AlertTriangle, LogOut, RefreshCw, XCircle } from "lucide-react";

// Logic & Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts & Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import AdminLayout from "./components/AdminLayout"; 

// Page Imports
import Home from "./pages/Home";
import HireRates from "./pages/HireRates"; 
import Bikes from "./pages/Bikes";           
import Tours from "./pages/Tours"; 
import Gallery from "./pages/Gallery"; 
import Blog from "./pages/Blog"; 
import Contact from "./pages/Contact"; 
import BikeDetails from "./pages/BikeDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login"; 
import AdminLogin from "./pages/AdminLogin"; 
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import ForgotPassword from "./pages/ForgotPassword"; 
import PaymentPage from "./pages/PaymentPage";

// ✅ UPDATED: Importing your Premium Profile component
import Profile from "./pages/Profile"; 

import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from "./pages/AdminDashboard";
import AdminBikes from "./pages/AdminBikes"; 
import AdminUsers from "./pages/AdminUsers"; 
import AdminBookings from "./pages/AdminBookings"; 
import BookingConfirmation from "./pages/BookingConfirmation"; 
import OwnerDashboard from "./pages/OwnerDashboard"; 

const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "your_stripe_key_here";
const stripePromise = loadStripe(stripeKey);

const AppContent = () => {
  const location = useLocation();
  const { showTimeoutWarning, sessionExpired, logout } = useAuth();
  
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = ['/login', '/register', '/verify-otp', '/admin-login', '/forgot-password'].includes(location.pathname);
  const showGlobalUI = !isAdminPath && !isAuthPath;

  return (
    <>
      {/* 🛑 SESSION EXPIRED TOAST */}
      {sessionExpired && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10001, background: '#1e293b', color: '#fff', padding: '12px 25px',
          borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)', border: '1px solid #334155'
        }}>
          <XCircle color="#ef4444" size={20} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Your session has expired. Please login again.</span>
          <button 
            onClick={() => logout(true)} 
            style={{ background: '#6366f1', border: 'none', color: '#fff', padding: '6px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
          >
            Go to Login
          </button>
        </div>
      )}

      {/* 🚨 SESSION TIMEOUT WARNING */}
      {showTimeoutWarning && !sessionExpired && (
        <div style={{
          position: 'fixed', top: '25px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10000, background: '#fff', padding: '16px 24px', borderRadius: '12px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.2)', borderLeft: '6px solid #ef4444',
          display: 'flex', alignItems: 'center', gap: '20px', minWidth: '350px'
        }}>
          <AlertTriangle color="#ef4444" size={28} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>Session Expiring</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Less than 1 minute remaining. Please extend your session.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
              <RefreshCw size={14} /> Extend
            </button>
            <button onClick={() => logout(true)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}

      {showGlobalUI && <Navbar />}
      
      <Elements stripe={stripePromise}>
        <div className="page-wrapper" style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hire-rates" element={<HireRates />} /> 
            <Route path="/bikes" element={<Bikes />} /> 
            <Route path="/bikes/:id" element={<BikeDetails />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* --- PROTECTED DASHBOARD ROUTES --- */}
            <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/owner-dashboard" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />

            {/* ✅ UPDATED: Using the Premium Profile Component for the /account route */}
            <Route path="/account" element={<ProtectedRoute allowedRoles={['customer', 'admin', 'owner']}><Profile /></ProtectedRoute>} />
            
            <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><MyBookings /></ProtectedRoute>} />
            <Route path="/book/:id" element={<ProtectedRoute allowedRoles={['customer']}><Booking /></ProtectedRoute>} />
            <Route path="/payment/:bookingId" element={<ProtectedRoute allowedRoles={['customer']}><PaymentPage /></ProtectedRoute>} />
            <Route path="/booking-confirmation" element={<ProtectedRoute allowedRoles={['customer']}><BookingConfirmation /></ProtectedRoute>} />

            {/* --- ADMIN SUBSYSTEM --- */}
            <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/bikes" element={<AdminBikes />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Elements>

      {showGlobalUI && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}