import { useState } from 'react';

export default function AdminSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [delayAlerts, setDelayAlerts] = useState(true);
  const [revenueSummary, setRevenueSummary] = useState(true);
  const [staffingWarnings, setStaffingWarnings] = useState(false);

  const [toastType, setToastType] = useState(null);

  const triggerToast = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim() || !email.trim() || !password || !emailPattern.test(email.trim())) {
      setToastType('error');
    } else {
      setToastType('success');
    }

    setTimeout(() => {
      setToastType(null);
    }, 3000);
  };

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">System Preferences</p>
          <h2>Settings</h2>
        </div>
        <div className="topbar-actions">
          <button type="button" className="primary-btn" onClick={triggerToast}>
            Save Changes
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Admin Profile</h3>
          </div>
          <div className="form-group">
            <label htmlFor="adminName">Full Name</label>
            <input
              type="text"
              id="adminName"
              className="form-control"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="adminEmail">Email Address</label>
            <input
              type="email"
              id="adminEmail"
              className="form-control"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="adminPassword"
                className="form-control"
                placeholder="Enter your password"
                style={{ paddingRight: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                }}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="ghost-btn ghost-btn-dark"
              onClick={triggerToast}
            >
              Update Password
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>System Notifications</h3>
          </div>
          <label className="custom-checkbox" style={{ marginBottom: '16px' }}>
            <input
              type="checkbox"
              checked={delayAlerts}
              onChange={(e) => setDelayAlerts(e.target.checked)}
            />
            Email Alerts for Delays
          </label>
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid var(--border)',
              margin: '16px 0',
            }}
          />
          <label className="custom-checkbox" style={{ marginBottom: '16px' }}>
            <input
              type="checkbox"
              checked={revenueSummary}
              onChange={(e) => setRevenueSummary(e.target.checked)}
            />
            Daily Revenue Summary
          </label>
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid var(--border)',
              margin: '16px 0',
            }}
          />
          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={staffingWarnings}
              onChange={(e) => setStaffingWarnings(e.target.checked)}
            />
            Staffing Warnings
          </label>
        </section>
      </div>

      <div
        id="toast"
        className={`toast-notification${toastType === 'success' ? ' show' : ''}`}
      >
        Your profile has been successfully updated!
      </div>
      <div
        id="errorToast"
        className={`toast-notification${toastType === 'error' ? ' show' : ''}`}
        style={{ backgroundColor: 'var(--danger)' }}
      >
        Please enter all required valid credentials!
      </div>
    </>
  );
}
