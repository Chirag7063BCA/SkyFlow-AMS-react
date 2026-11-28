import './ProfileCompStyles/ProfileSidebar.css';

function NavIcon({ id }) {
  return (
    <svg
      className="pf-nav-icon"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {id === 'profile' && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </>
      )}
      {id === 'logout' && (
        <>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </>
      )}
      {id === 'password' && (
        <>
          <circle cx="7.5" cy="15.5" r="5.5" />
          <path d="m21 2-9.6 9.6" />
          <path d="m15.5 7.5 3 3L22 7l-3-3" />
        </>
      )}
    </svg>
  );
}

export default function ProfileSidebar({ activeTab, onTabChange, showDot, onLogout }) {
  return (
    <aside className="pf-sidebar">
      <p className="pf-sidebar-title">MY ACCOUNT</p>

      <nav className="pf-sidebar-nav">
        <button
          type="button"
          className={`pf-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <NavIcon id="profile" />
          <span>My Profile</span>
          {showDot && <span className="pf-red-dot" />}
        </button>

        <button type="button" className="pf-nav-item logout" onClick={onLogout}>
          <NavIcon id="logout" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="pf-sidebar-divider" />

      <button
        type="button"
        className={`pf-nav-item ${activeTab === 'password' ? 'active' : ''}`}
        onClick={() => onTabChange('password')}
      >
        <NavIcon id="password" />
        <span>Reset Password</span>
      </button>
    </aside>
  );
}
