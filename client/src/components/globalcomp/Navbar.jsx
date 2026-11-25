import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Globalstyles/navbar.css';
import logoGif from '../../assets/navbar logo.gif';

const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Flights', to: '/flights' },
  { label: 'Track Flight', to: '/track' },
  { label: 'My Bookings', to: '/bookings' },
  { label: 'Help', to: '/help' },
];

export default function Navbar({ onOpenAuth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = (event) => {
    event.preventDefault();
    if (onOpenAuth) {
      onOpenAuth();
    } else if (typeof window.openDrawer === 'function') {
      window.openDrawer();
    }
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <NavLink
          to="/"
          end
          className="navbar-logo"
          onClick={() => setIsMobileOpen(false)}
        >
          <img
            src={logoGif}
            alt="SkyFlow Logo"
            className="logo-gif"
            id="navbarLogoImg"
          />
          <span>Sky</span>Flow
        </NavLink>

        <input
          type="checkbox"
          id="nav-toggle"
          className="nav-toggle"
          checked={isMobileOpen}
          onChange={(event) => setIsMobileOpen(event.target.checked)}
        />
        <label
          htmlFor="nav-toggle"
          className="mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isMobileOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </label>

        <div className="navbar-center">
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-actions" id="navActions">
          <button
            type="button"
            className="btn-signin"
            id="openSignupBtn"
            onClick={handleAuthClick}
            title="Sign In / Join"
            aria-label="Sign In / Join"
          >
            <svg
              className="btn-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
