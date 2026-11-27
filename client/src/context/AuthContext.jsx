import { useState } from 'react';
import { AuthContext } from './authContextDef';

export function AuthProvider({ children }) {
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

  const openAuth = (tab = 'signin') => {
    setAuthDefaultTab(tab);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('skyflow_user');
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isAuthOpen,
        authDefaultTab,
        openAuth,
        closeAuth,
        handleLoginSuccess,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
