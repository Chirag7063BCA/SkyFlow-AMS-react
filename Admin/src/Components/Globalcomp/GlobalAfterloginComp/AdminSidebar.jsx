import { useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { hasAdminSession, logoutAdmin } from '../../../services/adminAuth.js'
import './GlobalAfterloginCompStyles/AdminSidebar.css'

const navigationItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '◉' },
  { label: 'Flights', path: '/admin/flights', icon: '✈' },
  { label: 'Bookings', path: '/admin/bookings', icon: '▣' },
  { label: 'Passengers', path: '/admin/passengers', icon: '◌' },
  { label: 'Settings', path: '/admin/settings', icon: '⚙' },
]

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const navigate = useNavigate()

  const closeSidebar = () => setIsOpen(false)

  const exitBoard = () => {
    closeSidebar()
    setLogoutError('')

    try {
      logoutAdmin()
      navigate('/admin', { replace: true })
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Unable to sign out.')
    }
  }

  let isAuthenticated = false
  try {
    isAuthenticated = hasAdminSession()
  } catch {
    return (
      <main className="admin-session-message">
        <p role="alert">Browser session storage is unavailable.</p>
        <Link to="/admin">Return to sign in</Link>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className={`app-shell${isOpen ? ' app-shell--menu-open' : ''}`}>
      {isOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close admin navigation"
          onClick={closeSidebar}
        />
      )}

      <aside className="sidebar" aria-label="Admin sidebar">
        <Link className="brand" to="/admin/dashboard" onClick={closeSidebar}>
          <span className="brand-mark" aria-hidden="true">SF</span>
          <span className="brand-copy">
            <strong>SkyFlow</strong>
            <small>Admin Console</small>
          </span>
        </Link>

        <nav id="admin-navigation" className="sidebar-nav" aria-label="Admin navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              to={item.path}
              end={item.path === '/admin/dashboard'}
              onClick={closeSidebar}
            >
              <span className="nav-item__icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <section className="sidebar-card" aria-label="Live view status">
          <span className="sidebar-card__status">
            <span aria-hidden="true" />
            LIVE VIEW
          </span>
          <h2>Live View</h2>
          <p>Displaying real-time FIDS data.</p>
          <button type="button" onClick={exitBoard}>Exit Board</button>
        </section>
      </aside>

      <main className="admin-main">
        <header className="admin-main__topbar">
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={isOpen ? 'Close admin navigation' : 'Open admin navigation'}
            aria-expanded={isOpen}
            aria-controls="admin-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <span>SKYFLOW ADMIN</span>
        </header>
        <div className="admin-main__content">
          {logoutError && (
            <p className="admin-logout-error" role="alert">
              {logoutError}
            </p>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminSidebar
