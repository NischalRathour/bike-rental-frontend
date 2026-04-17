import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, Twitter, Facebook, ArrowRight, 
  Globe, Mail, MapPin, ShieldCheck 
} from 'lucide-react';
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="rnr-footer-root">
      <div className="rnr-footer-container">
        
        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        <div className="rnr-footer-upper">
          <div className="rnr-f-brand-side">
            <Link to="/" className="rnr-f-logo">RIDE<span>N</span>ROAR</Link>
            <p className="rnr-f-tagline">
              Redefining exploration in the Himalayas with Kathmandu's most exclusive motorcycle fleet. Curated for the bold.
            </p>
            <div className="rnr-social-stack">
               <a href="#" className="rnr-social-circle"><Instagram size={20}/></a>
               <a href="#" className="rnr-social-circle"><Twitter size={20}/></a>
               <a href="#" className="rnr-social-circle"><Facebook size={20}/></a>
            </div>
          </div>

          <div className="rnr-newsletter-box">
            <h4>Stay in the Loop</h4>
            <p>Get exclusive early access to new fleet arrivals and curated tours.</p>
            <div className="rnr-f-input-group">
              <input type="email" placeholder="Enter your email" />
              <button className="rnr-f-btn">
                <span>Join</span> <ArrowRight size={18}/>
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN LINKS GRID --- */}
        <div className="rnr-footer-grid">
          
          {/* Column 1: Company */}
          <div className="rnr-f-col">
            <h4>The Collective</h4>
            <ul className="rnr-f-links">
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/blog">Rider's Journal</Link></li>
              <li><Link to="/press">Press Room</Link></li>
              <li><Link to="/jobs">Careers</Link></li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div className="rnr-f-col">
            <h4>Experience</h4>
            <ul className="rnr-f-links">
              <li><Link to="/bikes">Browse Fleet</Link></li>
              <li><Link to="/tours">Luxury Tours</Link></li>
              <li><Link to="/insurance">Rider Protection</Link></li>
              <li><Link to="/safety">Safety Protocol</Link></li>
            </ul>
          </div>

          {/* Column 3: Regions */}
          <div className="rnr-f-col">
            <h4>Top Regions</h4>
            <ul className="rnr-f-links">
              <li><Link to="/rent/kathmandu">Kathmandu Valley</Link></li>
              <li><Link to="/rent/pokhara">Pokhara Lakeside</Link></li>
              <li><Link to="/rent/mustang">Upper Mustang</Link></li>
              <li><Link to="/rent/manang">Manang Circuit</Link></li>
            </ul>
          </div>

          {/* Column 4: Basecamp Support */}
          <div className="rnr-f-col">
            <h4>Basecamp</h4>
            <ul className="rnr-f-links">
              <li><Link to="/help">Help Center - FAQ</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
              <li className="f-contact-item"><Mail size={14}/> info@ridenroar.com</li>
              <li className="f-contact-item"><MapPin size={14}/> Thamel, KTM</li>
            </ul>
          </div>

        </div>

        {/* --- BOTTOM LEGAL SECTION --- */}
        <div className="rnr-footer-bottom">
          <div className="rnr-bottom-left">
            <p className="rnr-f-copy">© {currentYear} Ride N Roar Nepal. Crafted for Excellence.</p>
          </div>

          <div className="rnr-bottom-right">
            <Link to="/privacy" className="rnr-bottom-link">Privacy</Link>
            <Link to="/terms" className="rnr-bottom-link">Terms</Link>
            <Link to="/imprint" className="rnr-bottom-link">Imprint</Link>
            
            <div className="rnr-lang-selector">
              <Globe size={16} />
              <span>English (NP)</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;