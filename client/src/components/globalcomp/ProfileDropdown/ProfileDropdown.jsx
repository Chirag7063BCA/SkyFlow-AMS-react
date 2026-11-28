import { useState, useEffect } from 'react';
import bookingsIcon from '../../../assets/dropdown-icons/bookings.svg';
import helpIcon from '../../../assets/dropdown-icons/help.svg';
import logoutIcon from '../../../assets/dropdown-icons/logout.svg';
import profileIcon from '../../../assets/dropdown-icons/profile.svg';
import './ProfileDropdown.css';

const MENU_ITEMS = [
  { id: 'profile', label: 'My Profile', icon: profileIcon },
  { id: 'bookings', label: 'My Bookings', icon: bookingsIcon },
  { id: 'help', label: 'Help Center', icon: helpIcon },
  { isDivider: true },
  { id: 'logout', label: 'Log Out', icon: logoutIcon, cls: 'logout-btn' },
];

export default function ProfileDropdown({ user, onLogout, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [failedSrc, setFailedSrc] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e) => {
      if (!e.target.closest('.user-profile-menu')) setIsOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isOpen]);

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const showPic = Boolean(user?.picture && failedSrc !== user.picture);

  const initials = (() => {
    if (!user?.name) return displayName.slice(0, 2).toUpperCase();
    const p = user.name.trim().split(' ');
    const chars = p.length >= 2
      ? p[0][0] + p[p.length - 1][0]
      : user.name.slice(0, 2);
    return chars.toUpperCase();
  })();

  const renderAvatar = (clsPrefix) => (
    showPic ? (
      <img
        src={user.picture}
        alt={displayName}
        className={`${clsPrefix}-img`}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setFailedSrc(user.picture)}
      />
    ) : (
      <div className={`${clsPrefix}-circle`}>{initials}</div>
    )
  );

  const handleAction = (item) => {
    setIsOpen(false);
    if (item.id === 'logout') onLogout?.();
    else onNavigate?.(item.id);
  };

  return (
    <div className="user-profile-menu">
      <button
        type="button"
        className="user-avatar-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title={displayName}
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {renderAvatar('user-avatar')}
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
            {renderAvatar('user-dropdown-avatar')}
          </div>
          <div className="user-dropdown-details">
            <span className="user-dropdown-name">{displayName}</span>
            <span className="user-dropdown-email">{user?.email}</span>
          </div>
        </div>

        <div className="user-dropdown-divider" />

        {MENU_ITEMS.map((item, idx) => (
          item.isDivider ? (
            <div key={`div-${idx}`} className="user-dropdown-divider" />
          ) : (
            <button
              key={item.id}
              type="button"
              className={`user-dropdown-link ${item.cls || ''}`}
              onClick={() => handleAction(item)}
            >
              <img src={item.icon} alt="" width="16" height="16" />
              <span>{item.label}</span>
            </button>
          )
        ))}
      </div>
    </div>
  );
}
