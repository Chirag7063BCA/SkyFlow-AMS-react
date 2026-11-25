import { useState, useEffect } from 'react';
import Navbar from './components/globalcomp/Navbar';
import LandingPage from './Pages/LandingPage';
import HelpPage from './Pages/HelpPage';
import Footer from './components/globalcomp/Footer';
import LoginSidebar from './components/globalcomp/loginsidebar';

function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState('signin');

  // Load authenticated user from localStorage on mount
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skyflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync route based on window location hash e.g. #help, #home
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'help') {
        setCurrentRoute('help');
      } else {
        setCurrentRoute('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleRouteChange = (route) => {
    setCurrentRoute(route);
    window.location.hash = `#${route}`;
  };

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
    <div className="min-h-screen flex flex-col bg-[#001D39]">
      <Navbar
        activeRoute={currentRoute}
        onRouteChange={handleRouteChange}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentRoute === 'help' ? <HelpPage /> : <LandingPage />}
      </main>

      <Footer />

      {/* Slide-over Authentication Drawer */}
      <LoginSidebar
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authDefaultTab}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
