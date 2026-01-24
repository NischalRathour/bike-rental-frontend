import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bikes" element={<Bikes />} />
        <Route path="/bikes/:id" element={<BikeDetails />} />
        <Route path="/book/:id" element={<Booking />} />

        {/* ✅ REQUIRED */}
        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
