import { Link } from 'react-router-dom';
import heroImage from '../../assets/Hero.png';
import { useAuth } from '../../context/useAuth';
import './ProtectedRoute.css';

export default function ProtectedRoute({ adminOnly = false, children }) {
  const { isLoggedIn, isAdmin, openAuth } = useAuth();

  if (isLoggedIn && (!adminOnly || isAdmin)) {
    return children;
  }

  const isAdminBlock = isLoggedIn && adminOnly;
  const authPrompt = adminOnly
    ? 'Sign in with an admin account to continue.'
    : 'Sign in to view your bookings.';

  return (
    <section
      className="protected-hero"
      style={{ '--protected-hero-image': `url(${heroImage})` }}
    >
      <div className="protected-inner">
        <h1 className="protected-title">
          {isAdminBlock ? 'RESTRICTED ' : 'SIGN IN TO '}
          <span>{isAdminBlock ? 'AREA' : 'CONTINUE'}</span>
        </h1>

        <p className="protected-subtitle">
          {isAdminBlock
            ? 'Only SkyFlow administrator accounts can open this page.'
            : 'Access your bookings, passenger details, and boarding passes.'}
        </p>

        <div className="protected-bar">
          <div>
            <strong>{isAdminBlock ? 'Admin access required' : 'Account required'}</strong>
            <span>
              {isAdminBlock
                ? 'Go back home or browse flights.'
                : 'Sign in with your SkyFlow account or Google.'}
            </span>
          </div>

          <div className="protected-actions">
            {isAdminBlock ? (
              <Link to="/flights" className="protected-btn primary">
                Browse Flights
              </Link>
            ) : (
              <button
                type="button"
                className="protected-btn primary"
                onClick={() => openAuth('signin', authPrompt)}
              >
                Sign In
              </button>
            )}
            <Link to="/" className="protected-btn secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
