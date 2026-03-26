import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Logic & Context
import { AuthProvider } from "./context/AuthContext";
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
import PaymentPage from "./pages/PaymentPage";
import Account from "./pages/Account"; 
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from "./pages/AdminDashboard";
import AdminBikes from "./pages/AdminBikes"; 
import AdminUsers from "./pages/AdminUsers"; 
import AdminBookings from "./pages/AdminBookings"; 
import BookingConfirmation from "./pages/BookingConfirmation"; 
import OwnerDashboard from "./pages/OwnerDashboard"; 

// Stripe Initialization
const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51SoGdhFOkjXvJLGw4VrVT3ZDm33c0xNtmAJNkyKki45CyNhBWswKYAzjBfpbHC7l5KCOmm2WzBjnCqkbmMRxmDFA001J2tI6Qm";
const stripePromise = loadStripe(stripeKey);

const AppContent = () => {
  const location = useLocation();
  
  // ✅ 1. UI Visibility Logic
  // Check if we are in admin territory or auth screens to hide/show main Navbar
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = ['/login', '/register', '/verify-otp', '/admin-login'].includes(location.pathname);
  const showGlobalUI = !isAdminPath && !isAuthPath;

  return (
    <>
      {/* Global Navbar shows only on main site/customer pages */}
      {showGlobalUI && <Navbar />}
      
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

            {/* 🔐 AUTHENTICATION ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* 🔴 PROTECTED CUSTOMER ROUTES */}
            <Route path="/customer" element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/account" element={
              <ProtectedRoute allowedRoles={['customer', 'admin', 'owner']}>
                <Account />
              </ProtectedRoute>
            } />
            
            <Route path="/my-bookings" element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <MyBookings />
              </ProtectedRoute>
            } />
            
            <Route path="/book/:id" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Booking />
              </ProtectedRoute>
            } />
            
            <Route path="/payment/:bookingId" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <PaymentPage />
              </ProtectedRoute>
            } />
            
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

            {/* 🔴 PROTECTED ADMIN COMMAND CENTER (Nested Routing) */}
            {/* The Layout wraps all sub-routes to keep Sidebar persistent */}
            <Route element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
            }>
                {/* Redirect /admin directly to the dashboard */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* These components render inside the <Outlet /> of AdminLayout */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/bikes" element={<AdminBikes />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* 404 CATCH-ALL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Elements>

      {/* Global Footer shows only on main site/customer pages */}
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