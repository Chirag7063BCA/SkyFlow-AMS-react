import React from 'react';
import { Link } from 'react-router-dom';
import './Globalstyles/footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>Sky</span>Flow
          </Link>
          <p className="footer-tagline">
            Elevating airline management and flight booking experience worldwide.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          {/* Navigation */}
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/flights">Flights</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>
              <li><Link to="/track">Track Flight</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press & News</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="footer-col">
            <h4>Legal & Support</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>&copy; 2026 SkyFlow AMS. All rights reserved.</p>
      </div>
    </footer>
  );
}
