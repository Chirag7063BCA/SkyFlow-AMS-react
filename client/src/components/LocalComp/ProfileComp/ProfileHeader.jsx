import { Link } from 'react-router-dom';
import './ProfileCompStyles/ProfileHeader.css';

function Icon({ children, size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function ProfileHeader({ user, totalBookings, onPhotoChange }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 180;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const min = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, size, size);
      URL.revokeObjectURL(url);
      onPhotoChange(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = url;
  };

  return (
    <section className="pf-header">
      <div className="pf-header-glow" aria-hidden="true" />
      <div className="pf-header-inner">
        <div className="pf-header-row">
          <div className="pf-user-block">
            <label className="pf-avatar-ring" title="Change profile photo">
              {user?.picture ? (
                <img src={user.picture} alt={user.name || 'Profile'} referrerPolicy="no-referrer" />
              ) : (
                <div className="pf-avatar-empty">
                  <Icon size={24}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </Icon>
                  <span>Add Photo</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFile} hidden />
            </label>

            <div className="pf-user-meta">
              {user?.name && <h1>{user.name}</h1>}
              <div className="pf-meta-items">
                <span>
                  <Icon><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" /></Icon>
                  {user?.phone || 'Add Mobile Number'}
                </span>
                <span>
                  <Icon><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></Icon>
                  {user?.email || ''}
                </span>
              </div>
            </div>
          </div>

          <div className="pf-quick-pills">
            <Link to="/bookings" className="pf-pill">
              <span className="pf-pill-icon">
                <Icon size={16}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></Icon>
              </span>
              <span className="pf-pill-text">
                <small>My Trips</small>
                <strong>Bookings</strong>
              </span>
              <span className="pf-pill-count">{totalBookings}</span>
              <span className="pf-pill-arrow">
                <Icon size={15}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
