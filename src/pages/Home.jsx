import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home">

      {/* HERO SECTION */}
      <section
        className="hero"
        style={{
              backgroundImage: "url(/images/moving-bike.jpg)", 
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Rent a Bike Anywhere in Nepal</h1>
            <p>
              Affordable, eco-friendly, and easy bike rentals for daily travel,
              tours, and adventures.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn">
                Get Started
              </Link>
              <Link to="/bikes" className="btn btn-secondary">
                Browse Bikes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Choose a Bike</h3>
            <p>Select from scooters, mountain bikes, or electric bikes.</p>
          </div>
          <div className="step">
            <h3>2. Book Online</h3>
            <p>Pick your date, time, and location in seconds.</p>
          </div>
          <div className="step">
            <h3>3. Ride & Return</h3>
            <p>Enjoy your ride and return it hassle-free.</p>
          </div>
        </div>
      </section>

      {/* POPULAR BIKES */}
      <section className="popular-bikes">
  <h2>Popular Bikes</h2>

  <div className="bike-grid">
    <div className="bike-card">
      <img src="/images/mountain.jpg" alt="Mountain Bike" />
      <h3>Mountain Bike</h3>
      <p>Perfect for trails and rough terrain.</p>
    </div>

    <div className="bike-card">
      <img src="/images/scooter.jpg" alt="Scooter" />
      <h3>Scooter</h3>
      <p>Easy city commuting at low cost.</p>
    </div>

    <div className="bike-card">
      <img src="/images/electric.jpg" alt="Electric Bike" />
      <h3>Electric Bike</h3>
      <p>Eco-friendly and effortless riding.</p>
    </div>
  </div>

  <Link to="/bikes" className="btn">View All Bikes</Link>
</section>

      {/* WHY CHOOSE US */}
      <section className="why-us">
        <h2>Why Choose Ride N Roar?</h2>
        <div className="reasons">
          <div className="reason">
            <h3>Affordable Pricing</h3>
            <p>No hidden charges, pay only for what you ride.</p>
          </div>
          <div className="reason">
            <h3>Eco-Friendly</h3>
            <p>Reduce pollution and carbon footprint.</p>
          </div>
          <div className="reason">
            <h3>Secure & Reliable</h3>
            <p>Verified users, insured bikes, safe payments.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What Our Riders Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>
              “Very easy booking and well-maintained bikes. Perfect for city
              travel!”
            </p>
            <h4>- Suman, Kathmandu</h4>
          </div>
          <div className="testimonial">
            <p>
              “Affordable and eco-friendly. Best bike rental service in Nepal.”
            </p>
            <h4>- Anjali, Pokhara</h4>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-footer">
        <h2>Ready to Ride?</h2>
        <p>Create an account and start your journey today.</p>
        <Link to="/register" className="btn">
          Register Now
        </Link>

        <footer>
          <p>© 2025 Ride N Roar. All rights reserved.</p>
          <div className="socials">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
        </footer>
      </section>

    </div>
  );
}