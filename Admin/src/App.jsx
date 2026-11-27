import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AdminSidebar from './Components/Globalcomp/GlobalAfterloginComp/AdminSidebar.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import { loginAdmin } from './services/adminAuth.js'

function AdminSectionPage({ title, description }) {
  return (
    <section className="admin-page">
      <span className="admin-page__eyebrow">SKYFLOW ADMIN</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

function AppRoutes() {
  const navigate = useNavigate()

  const handleLogin = async (credentials) => {
    await loginAdmin(credentials)
    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage onLogin={handleLogin} />} />
      <Route path="/admin" element={<AdminLoginPage onLogin={handleLogin} />} />
      <Route element={<AdminSidebar />}>
        <Route
          path="/admin/dashboard"
          element={
            <AdminSectionPage
              title="Dashboard"
              description="Your admin overview will appear here."
            />
          }
        />
        <Route
          path="/admin/flights"
          element={
            <AdminSectionPage
              title="Flights"
              description="Flight management will appear here."
            />
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminSectionPage
              title="Bookings"
              description="Booking management will appear here."
            />
          }
        />
        <Route
          path="/admin/passengers"
          element={
            <AdminSectionPage
              title="Passengers"
              description="Passenger management will appear here."
            />
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminSectionPage
              title="Settings"
              description="Admin settings will appear here."
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
