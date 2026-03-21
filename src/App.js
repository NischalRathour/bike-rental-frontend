import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Logic & Context
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts & Components
import AdminLayout from "./components/AdminLayout"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 

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
import PaymentPage from "./pages/PaymentPage";
import Account from "./pages/Account"; // ✅ Added Account Page
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from "./pages/AdminDashboard";
import AdminBikes from "./pages/AdminBikes"; 
import AdminUsers from "./pages/AdminUsers"; 
import AdminBookings from "./pages/AdminBookings"; 
import BookingConfirmation from "./pages/BookingConfirmation"; // ✅ Ensure this is correct
import OwnerDashboard from "./pages/OwnerDashboard"; 

// --- STRIPE INITIALIZATION ---
// Replace with your real key in .env
const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51SoGdhFOkjXvJLGw4VrVT3ZDm33c0xNtmAJNkyKki45CyNhBWswKYAzjBfpbHC7l5KCOmm2WzBjnCqkbmMRxmDFA001J2tI6Qm";
const stripePromise = loadStripe(stripeKey);

const AppContent = () => {
  const location = useLocation();
  
  // Logic to hide Navbar and Footer on Admin pages or Admin Login
  const showGlobalUI = !location.pathname.startsWith('/admin') && location.pathname !== '/admin-login';

  return (
    <>
      {/* --- NAVIGATION --- */}
      {showGlobalUI && <Navbar />}
      
      {/* --- MAIN CONTENT WRAPPER --- */}
      <Elements stripe={stripePromise}>
        <div className="page-wrapper" style={{ minHeight: '80vh' }}>
          <Routes>
            {/* 🟢 PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/hire-rates" element={<HireRates />} /> 
            <Route path="/bikes" element={<Bikes />} /> 
            <Route path="/bikes/:id" element={<BikeDetails />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />

            {/* 🔐 AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* 🔴 PROTECTED CUSTOMER ROUTES */}
            <Route path="/customer" element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/account" element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <Account />
              </ProtectedRoute>
            } />
            
            <Route path="/my-bookings" element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <MyBookings />
              </ProtectedRoute>
            } />
            
            {/* Booking Page */}
            <Route path="/book/:id" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Booking />
              </ProtectedRoute>
            } />
            
            {/* Payment Page */}
            <Route path="/payment/:bookingId" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <PaymentPage />
              </ProtectedRoute>
            } />
            
            {/* ✅ FIXED PATH: Changed from /booking-success to /booking-confirmation */}
            <Route path="/booking-confirmation" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <BookingConfirmation />
              </ProtectedRoute>
            } />

            {/* 🔵 PROTECTED OWNER ROUTES */}
            <Route path="/owner-dashboard" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />

            {/* 🔴 NESTED ADMIN ROUTES */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout /> 
              </ProtectedRoute>
            } >
              <Route index element={<Navigate to="/admin/dashboard" replace />} /> 
              <Route path="dashboard" element={<AdminDashboard />} /> 
              <Route path="bikes" element={<AdminBikes />} /> 
              <Route path="bookings" element={<AdminBookings />} /> 
              <Route path="users" element={<AdminUsers />} /> 
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Elements>

      {/* --- PREMIUM FOOTER --- */}
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