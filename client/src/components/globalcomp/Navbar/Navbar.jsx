import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import { useAuth } from '../../../context/useAuth';
import logoGif from '../../../assets/navbar logo.gif';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', to: '/', end: true },
  { label: 'Flights', to: '/flights' },
  { label: 'Track Flight', to: '/track' },
  { label: 'My Bookings', to: '/bookings' },
  { label: 'Help', to: '/help' },
];

export default function Navbar() {
  const { currentUser, openAuth, handleLogout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileOpen]);

  const handleNav = (route) => {
    setIsMobileOpen(false);
    if (route === 'home') navigate('/');
    else navigate(`/${route}`);
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
          <img src={logoGif} alt="SkyFlow Logo" className="logo-gif" />
          <span>Sky</span>Flow
        </NavLink>

        <button
          type="button"
          className={`mobile-toggle ${isMobileOpen ? 'open' : ''}`}
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={isMobileOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-center ${isMobileOpen ? 'open' : ''}`}>
          <ul className="nav-menu">
            {NAV_ITEMS.map((item) => (
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

        <div className="nav-actions">
          {currentUser ? (
            <ProfileDropdown
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNav}
            />
          ) : (
            <button
              type="button"
              className="btn-signin"
              onClick={() => openAuth('signin')}
              title="Sign In / Join"
              aria-label="Sign In / Join"
            >
              <span className="signin-icon" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
