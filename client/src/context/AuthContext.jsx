import { useCallback, useRef, useState } from 'react';
import { AuthContext } from './authContextDef';

function getSavedUser() {
  try {
    const user = JSON.parse(localStorage.getItem('skyflow_user'));
    return user?.email ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState('signin');
  const [authMessage, setAuthMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(getSavedUser);
  const afterLoginRef = useRef(null);
  const afterCloseRef = useRef(null);

  const openAuth = useCallback((tab = 'signin', message = '', onSuccess = null, onClose = null) => {
    setAuthDefaultTab(tab);
    setAuthMessage(message);
    afterLoginRef.current = onSuccess;
    afterCloseRef.current = onClose;
    setIsAuthOpen(true);
  }, []);

  const closeAuth = useCallback((runOnClose = true) => {
    setIsAuthOpen(false);
    setAuthMessage('');
    afterLoginRef.current = null;
    const onClose = afterCloseRef.current;
    afterCloseRef.current = null;
    if (runOnClose && onClose) onClose();
  }, []);

  const handleLoginSuccess = (user) => {
    if (!user?.email) return;
    localStorage.setItem('skyflow_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthOpen(false);
    setAuthMessage('');
    afterCloseRef.current = null;
    afterLoginRef.current?.(user);
    afterLoginRef.current = null;
  };

  const handleLogout = () => {
    localStorage.removeItem('skyflow_user');
    afterLoginRef.current = null;
    afterCloseRef.current = null;
    setCurrentUser(null);
  };

  const isLoggedIn = Boolean(currentUser?.email);
  const isAdmin = isLoggedIn && currentUser.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isAdmin,
        isAuthOpen,
        authDefaultTab,
        authMessage,
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
