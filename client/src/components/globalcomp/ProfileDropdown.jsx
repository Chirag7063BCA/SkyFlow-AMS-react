import { useState, useEffect } from 'react';

export default function ProfileDropdown({ user, onLogout, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [failedSrc, setFailedSrc] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-profile-menu')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const initials = (() => {
    if (!user?.name) return 'U';
    const parts = user.name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : user.name.slice(0, 2).toUpperCase();
  })();

  const handleLinkClick = (route) => {
    setIsOpen(false);
    onNavigate?.(route);
  };

  const showPicture = Boolean(user?.picture && failedSrc !== user.picture);

  return (
    <div className="user-profile-menu">
      <button
        type="button"
        className="user-avatar-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title={user.name}
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {showPicture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="user-avatar-img"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => setFailedSrc(user.picture)}
          />
        ) : (
          <div className="user-avatar-circle">{initials}</div>
        )}
        <svg
          className={`user-avatar-chevron ${isOpen ? 'open' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div className={`user-dropdown-menu ${isOpen ? 'active' : ''}`}>
        <div className="user-dropdown-header">
          <div className="user-dropdown-avatar">
            {showPicture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="user-dropdown-avatar-img"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            ) : (
              initials
            )}
          </div>
          <div className="user-dropdown-details">
            <span className="user-dropdown-name">{user.name}</span>
            <span className="user-dropdown-email">{user.email}</span>
          </div>
        </div>

        <div className="user-dropdown-divider" />

        <button
          type="button"
          className="user-dropdown-link"
          onClick={() => handleLinkClick('bookings')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>My Bookings</span>
        </button>

        <button
          type="button"
          className="user-dropdown-link"
          onClick={() => handleLinkClick('help')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Help Center</span>
        </button>

        <div className="user-dropdown-divider" />

        <button
          type="button"
          className="user-dropdown-link logout-btn"
          onClick={() => {
            setIsOpen(false);
            onLogout?.();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
