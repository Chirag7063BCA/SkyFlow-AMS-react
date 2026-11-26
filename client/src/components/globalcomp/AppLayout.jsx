import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import LoginSidebar from './loginsidebar';
import Navbar from './Navbar';

export default function AppLayout() {
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
    <div className="flex min-h-screen flex-col bg-[#001D39]">
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LoginSidebar
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authDefaultTab}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
