import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="rnr-footer-root">
      <div className="rnr-footer-container">
        
        {/* TOP NAV GRID */}
        <div className="rnr-footer-grid">
          
          {/* Column 1 */}
          <div className="rnr-f-col">
            <h4>Ride N Roar</h4>
            <ul className="rnr-f-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/help">Help Center - FAQ</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/jobs">Jobs</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="rnr-f-col">
            <h4>Services</h4>
            <ul className="rnr-f-links">
              <li><Link to="/software">Fleet Management</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/tours">Guided Tours</Link></li>
              <li><Link to="/insurance">Insurance</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="rnr-f-col">
            <h4>Rent a Bike</h4>
            <ul className="rnr-f-links">
              <li><Link to="/bikes">Browse Bikes</Link></li>
              <li><Link to="/list-bike">List a Bike</Link></li>
              <li><Link to="/photography">Photo Tips</Link></li>
              <li><Link to="/safety">Safety Guide</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="rnr-f-col">
            <h4>Top Regions</h4>
            <ul className="rnr-f-links">
              <li><Link to="/rent/kathmandu">Kathmandu</Link></li>
              <li><Link to="/rent/pokhara">Pokhara</Link></li>
              <li><Link to="/rent/mustang">Mustang</Link></li>
              <li><Link to="/rent/manang">Manang</Link></li>
              <li><Link to="/rent/lumbini">Lumbini</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="rnr-footer-bottom">
          <div className="rnr-bottom-left">
            <div className="rnr-f-logo">Ride N Roar</div>
            <div className="rnr-f-copy">© {currentYear} Ride N Roar Nepal</div>
          </div>

          <div className="rnr-bottom-right">
            <Link to="/imprint" className="rnr-bottom-link">Imprint</Link>
            <Link to="/terms" className="rnr-bottom-link">Terms</Link>
            <Link to="/privacy" className="rnr-bottom-link">Privacy</Link>
            
            <div className="rnr-lang-selector">
              <Globe size={16} />
              <span>English (EN)</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;