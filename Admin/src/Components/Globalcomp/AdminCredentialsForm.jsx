import { useState } from 'react'

const currentYear = new Date().getFullYear()

function AdminCredentialsForm({ onLogin, onForgotPassword }) {
  const [username, setUsername] = useState('chirag')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (!onLogin) {
        throw new Error('Admin sign-in is unavailable right now.')
      }

      await onLogin({ username, password })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Sign-in failed. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-login__content">
      <header className="admin-login__header">
        <a className="admin-login__wordmark" href="/" aria-label="SkyFlow home">
          <span className="admin-login__mark" aria-hidden="true">S</span>
          <span>SKYFLOW</span>
        </a>
        <span className="admin-login__secure">
          <span aria-hidden="true">●</span> ADMIN PORTAL
        </span>
      </header>

      <div className="admin-login__body">
        <span className="admin-login__eyebrow">WELCOME BACK</span>
        <h1>Sign in to your<br />admin account</h1>
        <p className="admin-login__intro">
          Manage your workspace with your administrator credentials.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-login-form__field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label className="admin-login-form__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <div className="admin-login-form__options">
            <label className="admin-login-form__remember">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            {onForgotPassword && (
              <button
                className="admin-login-form__text-button"
                type="button"
                onClick={() => onForgotPassword(username)}
              >
                Forgot password?
              </button>
            )}
          </div>

          {errorMessage && (
            <p className="admin-login-form__error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="admin-login-form__submit"
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>
      </div>

      <footer className="admin-login__footer">
        <span>© {currentYear} SkyFlow</span>
        <span>Secure access for administrators</span>
      </footer>
    </div>
  )
}

export default AdminCredentialsForm
