import { useState } from 'react';
import './ProfileCompStyles/ProfileExtras.css';

export function ResetPasswordPanel() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) return setMsg('Password must be at least 6 characters.');
    if (password !== confirm) return setMsg('Passwords do not match.');
    setPassword('');
    setConfirm('');
    setMsg('Password updated.');
  };

  return (
    <form className="pf-main-card" onSubmit={handleSubmit}>
      <div className="pf-card-head">
        <h2>Reset Password</h2>
      </div>
      <div className="pf-reset-fields">
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setMsg(''); }}
          placeholder="New password"
          required
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setMsg(''); }}
          placeholder="Confirm new password"
          required
        />
        <button type="submit" className="pf-save-btn">Update Password</button>
        {msg && <p className="pf-empty">{msg}</p>}
      </div>
    </form>
  );
}
