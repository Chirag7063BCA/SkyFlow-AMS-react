import { useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Navbar from './components/globalcomp/Navbar';
import LandingPage from './Pages/LandingPage';
import FlightsPage from './Pages/FlightsPage';
<<<<<<< Updated upstream
import HelpPage from './Pages/HelpPage';
=======
import TrackFlightPage from './Pages/TrackFlightPage';
import AdminPage from './Pages/AdminPage';
>>>>>>> Stashed changes
import Footer from './components/globalcomp/Footer';
import LoginSidebar from './components/globalcomp/loginsidebar';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#001D39]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/track" element={<TrackFlightPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState('signin');

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skyflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleOpenAuth = (tab = 'signin') => {
    setAuthDefaultTab(tab);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('skyflow_user');
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
<<<<<<< Updated upstream
      <div className="flex min-h-screen flex-col bg-[#001D39]">
        <Navbar
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <LoginSidebar
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          defaultTab={authDefaultTab}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
=======
      <AppLayout />
>>>>>>> Stashed changes
    </BrowserRouter>
  );
}

export default App;
