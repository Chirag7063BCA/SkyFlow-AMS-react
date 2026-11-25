import { useState } from 'react';

export default function AdminPinModal({ isOpen, onClose, onVerified }) {
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminPin === '6969') {
      setPinError('');
      setAdminPin('');
      onClose();
      if (onVerified) {
        onVerified();
      } else {
        alert("Admin PIN Verified (6969)! Access granted.");
      }
    } else {
      setPinError('Incorrect PIN! Access denied.');
    }
  };

  const handleCancel = () => {
    setAdminPin('');
    setPinError('');
    onClose();
  };

  return (
    <div className="admin-pin-modal-overlay">
      <div className="admin-pin-modal">
        <h3>Admin Console Verification</h3>
        <p>Please enter your 4-digit security PIN to access the SkyFlow Operations Console.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="admin-pin-input"
            maxLength={6}
            placeholder="••••"
            value={adminPin}
            onChange={(e) => {
              setAdminPin(e.target.value);
              setPinError('');
            }}
            autoFocus
          />
          {pinError && <p className="pin-error-text">{pinError}</p>}
          <div className="admin-pin-actions" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="admin-pin-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="admin-pin-confirm">
              Verify & Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
