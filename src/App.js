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

// Page Imports
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login"; 
import AdminLogin from "./pages/AdminLogin"; 
import Register from "./pages/Register";
import PaymentPage from "./pages/PaymentPage";
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from "./pages/AdminDashboard";
import AdminBikes from "./pages/AdminBikes"; 
import AdminUsers from "./pages/AdminUsers"; 
import BookingConfirmation from "./pages/BookingConfirmation";
import OwnerDashboard from "./pages/OwnerDashboard"; 

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "your_key_here");

// Helper component to handle Navbar visibility
const AppContent = () => {
  const location = useLocation();
  // Hide Navbar for any route starting with /admin or the admin-login page
  const showNavbar = !location.pathname.startsWith('/admin') && location.pathname !== '/admin-login';

  return (
    <>
      {showNavbar && <Navbar />}
      <Elements stripe={stripePromise}>
        <Routes>
          {/* 🟢 PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/bikes/:id" element={<BikeDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Updated Admin Login Route */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* 🔴 PROTECTED CUSTOMER ROUTES */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute allowedRoles={['customer']}>
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

          <Route path="/booking-success" element={
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

          {/* 🔴 NESTED ADMIN ROUTES (Updated Structure) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout /> 
            </ProtectedRoute>
          } >
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} /> 
            <Route path="bikes" element={<AdminBikes />} /> 
            <Route path="users" element={<AdminUsers />} /> 
          </Route>

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Elements>
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