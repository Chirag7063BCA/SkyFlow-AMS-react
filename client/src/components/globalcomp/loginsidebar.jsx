import { useState, useEffect } from 'react';
import './Globalstyles/signup.css';
import AdminPinModal from './AdminPinModal';
import { loginUser, registerUser, syncGoogleUser } from '../../services/authApi';
import { useAuth } from '../../context/useAuth';

export default function LoginSidebar({ onAdminAccess } = {}) {
  const { isAuthOpen: isOpen, closeAuth: onClose, authDefaultTab: defaultTab, handleLoginSuccess: onLoginSuccess } = useAuth();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [prevOpen, setPrevOpen] = useState(isOpen);
  const [authError, setAuthError] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem('skyflow_remember') === 'true';
    } catch {
      return false;
    }
  });

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setActiveTab(defaultTab);
      setAuthError('');
      try {
        const savedEmail = localStorage.getItem('skyflow_saved_email') || '';
        setFormData({ fullName: '', email: savedEmail, password: '', confirmPassword: '' });
      } catch {
      }
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showAdminPin) {
          setShowAdminPin(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showAdminPin, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (authError) setAuthError('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setAuthError('');
  };

  const saveAndClose = (user) => {
    localStorage.setItem('skyflow_user', JSON.stringify(user));
    if (onLoginSuccess) onLoginSuccess(user);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setAuthError('');
    onClose();
  };

  const triggerGoogleSignIn = (clientId) => {
    if (!window.google?.accounts?.oauth2) {
      setAuthError('Google Identity Services not loaded. Please verify your internet connection.');
      return;
    }

    setIsGoogleLoading(true);
    setAuthError('');

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          setIsGoogleLoading(false);
          if (tokenResponse.error) {
            setAuthError(`Google Sign-In failed: ${tokenResponse.error}`);
            return;
          }
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            if (!res.ok) throw new Error('Failed to retrieve Google profile');
            const profile = await res.json();
            if (profile.email) {
              const googleUserData = {
                name: profile.name || profile.email.split('@')[0],
                email: profile.email,
                picture: profile.picture || ''
              };
              const syncRes = await syncGoogleUser(googleUserData);
              saveAndClose(syncRes.user || googleUserData);
            } else {
              setAuthError('Google account did not provide a valid email.');
            }
          } catch {
            setAuthError('Failed to fetch profile details from Google.');
          }
        }
      });
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setIsGoogleLoading(false);
      setAuthError(err.message || 'Error initializing Google authentication.');
    }
  };

  const handleGoogleClick = () => {
    const activeClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
    if (!activeClientId) {
      setAuthError('Google Client ID not configured. Please check your .env file.');
      return;
    }
    triggerGoogleSignIn(activeClientId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const email = formData.email.trim().toLowerCase();
    const { password, confirmPassword, fullName } = formData;

    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('skyflow_saved_email', email);
      localStorage.setItem('skyflow_remember', 'true');
    } else {
      localStorage.removeItem('skyflow_saved_email');
      localStorage.removeItem('skyflow_remember');
    }

    setIsSubmitting(true);

    try {
      if (activeTab === 'signin') {
        const result = await loginUser(email, password);
        if (!result.success) {
          setAuthError(result.message);
          return;
        }
        saveAndClose(result.user);
      } else {
        if (!fullName.trim()) {
          setAuthError('Please enter your full name.');
          return;
        }
        if (password !== confirmPassword) {
          setAuthError('Passwords do not match! Please check and try again.');
          return;
        }

        const result = await registerUser(fullName.trim(), email, password);
        if (!result.success) {
          setAuthError(result.message);
          return;
        }
        saveAndClose(result.user);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignIn = activeTab === 'signin';

  return (
    <div className="signup-drawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
      <div className="drawer-overlay" onClick={onClose} />

      <div className="drawer-panel">
        <div className="drawer-header">
          <div className="drawer-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 15.5L11.5 3l-1.8 8.2L21 9.5 8.5 21l2.3-8.5L3 15.5Z" fill="#2563eb" />
            </svg>
            <h2 id="drawerTitle">{isSignIn ? 'Welcome Back' : 'Create Account'}</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close auth drawer">
            &times;
          </button>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${isSignIn ? 'active' : ''}`}
            onClick={() => switchTab('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${!isSignIn ? 'active' : ''}`}
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {authError && (
          <div className="auth-error-banner">
            {authError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSignIn && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="authEmail">Email Address</label>
            <input
              type="email"
              id="authEmail"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="authPassword">Password</label>
            <input
              type="password"
              id="authPassword"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {!isSignIn && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          )}

          {isSignIn && (
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="forgot-link"
                onClick={() => alert('Password reset link sent to your email!')}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting
              ? isSignIn
                ? 'Signing In...'
                : 'Creating Account...'
              : isSignIn
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleClick}
          disabled={isGoogleLoading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <p className="footer-text">
          {isSignIn ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => switchTab('signup')}>
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchTab('signin')}>
                Sign in
              </button>
            </>
          )}
        </p>

        <div className="admin-panel-access">
          <button
            type="button"
            className="admin-access-btn"
            onClick={() => setShowAdminPin(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Admin Panel</span>
          </button>
        </div>
      </div>

      <AdminPinModal
        isOpen={showAdminPin}
        onClose={() => setShowAdminPin(false)}
        onVerified={onAdminAccess}
      />
    </div>
  );
}
