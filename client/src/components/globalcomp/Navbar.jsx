import { useState, useEffect } from 'react';
import './Globalstyles/navbar.css';
import logoGif from '../../assets/navbar logo.gif';
import ProfileDropdown from './ProfileDropdown';

const NAV_ITEMS = [
  { label: 'Home', route: 'home', href: '#home' },
  { label: 'Flights', route: 'flights', href: '#flights' },
  { label: 'Track Flight', route: 'track', href: '#track' },
  { label: 'My Bookings', route: 'bookings', href: '#bookings' },
  { label: 'Help', route: 'help', href: '#help' },
];

export default function Navbar({
  activeRoute = 'home',
  onRouteChange,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (route) => {
    setIsMobileOpen(false);
    onRouteChange?.(route);
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <a href="#home" className="navbar-logo" onClick={() => handleNav('home')}>
          <img src={logoGif} alt="SkyFlow Logo" className="logo-gif" id="navbarLogoImg" />
          <span>Sky</span>Flow
        </a>

        <input 
          type="checkbox" 
          id="nav-toggle" 
          className="nav-toggle"
          checked={isMobileOpen}
          onChange={(e) => setIsMobileOpen(e.target.checked)}
        />
        <label htmlFor="nav-toggle" className="mobile-toggle" aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <div className="navbar-center">
          <ul className="nav-menu">
            {NAV_ITEMS.map((item) => (
              <li key={item.route}>
                <a
                  href={item.href}
                  className={`nav-link ${activeRoute === item.route ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.route);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-actions" id="navActions">
          {currentUser ? (
            <ProfileDropdown
              user={currentUser}
              onLogout={onLogout}
              onNavigate={handleNav}
            />
          ) : (
            <button
              type="button"
              className="btn-signin"
              id="openSignupBtn"
              onClick={(e) => {
                e.preventDefault();
                onOpenAuth?.('signin');
              }}
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
          )}
        </div>
      </nav>
    </header>
  );
}
