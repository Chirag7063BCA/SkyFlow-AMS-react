const DEMO_ADMIN_USERS = [{ username: 'chirag' }]
const SESSION_KEY = 'skyflow-admin-demo-session'

export function loginAdmin({ username, password }) {
  const isKnownAdmin = DEMO_ADMIN_USERS.some((admin) => admin.username === username)

  if (!isKnownAdmin || !password.trim()) {
    throw new Error('Invalid username or password.')
  }

  // Frontend-only demo authentication; this does not protect real admin data.
  sessionStorage.setItem(SESSION_KEY, 'authenticated')
}

export function hasAdminSession() {
  return sessionStorage.getItem(SESSION_KEY) === 'authenticated'
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY)
}
