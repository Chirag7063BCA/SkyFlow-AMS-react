import { useState, useEffect } from 'react';
import { loginUser, registerUser, triggerGoogleSignIn } from '../../../services/authApi';
import { useAuth } from '../../../context/useAuth';
import googleIcon from '../../../assets/google-icon.svg';
import './LoginSidebar.css';

const FORM_FIELDS = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', signUpOnly: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com' },
  { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', minLength: 6 },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter your password', minLength: 6, signUpOnly: true },
];

function AuthPanel({ defaultTab, onClose, handleLoginSuccess }) {
  const [isSignIn, setIsSignIn] = useState(defaultTab !== 'signup');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (authError) setAuthError('');
  };

  const onSuccess = (user) => {
    localStorage.setItem('skyflow_user', JSON.stringify(user));
    if (handleLoginSuccess) handleLoginSuccess(user);
    onClose();
  };

  const handleGoogle = () => {
    triggerGoogleSignIn({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim(),
      onLoading: setLoading,
      onError: setAuthError,
      onSuccess,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const email = form.email.trim().toLowerCase();
    const { password, confirmPassword, fullName } = form;

    if (!email || !password) return setAuthError('Please enter both email and password.');
    if (!isSignIn) {
      if (!fullName.trim()) return setAuthError('Please enter your full name.');
      if (password !== confirmPassword) return setAuthError('Passwords do not match!');
    }

    setLoading(true);
    try {
      const res = isSignIn
        ? await loginUser(email, password)
        : await registerUser(fullName.trim(), email, password);
      if (!res.success) return setAuthError(res.message);
      onSuccess(res.user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-drawer" role="dialog" aria-modal="true">
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-panel">
        <div className="drawer-header">
          <div className="drawer-brand-col">
            <h2>{isSignIn ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="drawer-subtitle">
              {isSignIn
                ? 'Sign in to access your flight bookings and privileges.'
                : 'Join SkyFlow to unlock seamless booking worldwide.'}
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        {authError && <div className="auth-error-banner">{authError}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {FORM_FIELDS.filter((f) => !f.signUpOnly || !isSignIn).map((field) => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={updateField}
                required
                minLength={field.minLength}
              />
            </div>
          ))}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="divider"><span>OR</span></div>

        <button type="button" className="google-btn" onClick={handleGoogle} disabled={loading}>
          <img src={googleIcon} alt="" width="18" height="18" />
          <span>Continue with Google</span>
        </button>

        <p className="footer-text">
          {isSignIn ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setIsSignIn(false); setAuthError(''); }}>
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setIsSignIn(true); setAuthError(''); }}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function LoginSidebar() {
  const { isAuthOpen: isOpen, closeAuth: onClose, authDefaultTab: defaultTab, handleLoginSuccess } = useAuth();

  if (!isOpen) return null;

  return (
    <AuthPanel
      key={defaultTab || 'signin'}
      defaultTab={defaultTab}
      onClose={onClose}
      handleLoginSuccess={handleLoginSuccess}
    />
  );
}
