import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { submitSupportTicket } from './supportApi';

const CATEGORIES = [
  'General Inquiry', 'Flight Booking & Reservation', 'Baggage & Lost Items',
  'Cancellations & Refunds', 'Check-in & Boarding Pass', 'Special Assistance', 'Technical Issue'
];

export default function HelpContactForm({ onSubmitSuccess }) {
  const { currentUser } = useAuth();
  const init = () => ({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    subject: 'General Inquiry',
    message: '',
  });

  const [form, setForm] = useState(init);
  const [status, setStatus] = useState('idle');
  const [ticket, setTicket] = useState(null);
  const [err, setErr] = useState('');

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (err) setErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim();
    if (!email || !form.message.trim()) return;

    setStatus('submitting');
    setErr('');

    const res = await submitSupportTicket({
      fullName: form.fullName.trim() || email.split('@')[0],
      email,
      subject: form.subject,
      message: form.message.trim(),
    });

    if (res.success) {
      setStatus('success');
      setTicket(res);
      onSubmitSuccess?.(res);
    } else {
      setStatus('error');
      setErr(res.message || 'Submission failed. Please try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setTicket(null);
    setForm(init());
  };

  return (
    <section className="contact-form-section" id="contact-form">
      <div className="container-form">
        <div className="form-header">
          <div className="form-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Support Desk</span>
          </div>
          <h2>Didn't find an answer to your question?</h2>
          <p>Submit your query below. Every ticket is logged into our central database and reviewed by operations.</p>
        </div>

        {status === 'success' && ticket ? (
          <div className="ticket-success-box">
            <div className="ticket-id-badge">✓ Ticket #{ticket.ticketId}</div>
            <h3>Support Ticket Registered!</h3>
            <p>Your inquiry is saved in SkyFlow&apos;s cloud database. An operations agent will follow up at <strong>{form.email}</strong> within 2 hours.</p>
            <button type="button" className="ticket-reset-btn" onClick={reset}>Submit Another Inquiry &rarr;</button>
          </div>
        ) : (
          <form className="help-form" onSubmit={handleSubmit} key={currentUser?.email || 'guest'}>
            {status === 'error' && <div className="form-status-alert error">{err}</div>}

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="supportUserFullName">Passenger Name</label>
                <input id="supportUserFullName" name="fullName" placeholder="e.g. John Doe" value={form.fullName} onChange={update} />
              </div>
              <div className="form-group">
                <label htmlFor="supportUserEmail">Email Address *</label>
                <input id="supportUserEmail" type="email" name="email" placeholder="name@example.com" value={form.email} onChange={update} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="supportUserSubject">Inquiry Category</label>
              <select id="supportUserSubject" name="subject" value={form.subject} onChange={update}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="supportUserQuery">Detailed Description *</label>
              <textarea id="supportUserQuery" name="message" rows={3} placeholder="Describe your question or issue in detail..." value={form.message} onChange={update} required />
            </div>

            <button type="submit" className="form-submit-btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                <span>Registering Ticket in Database...</span>
              ) : (
                <>
                  <span>Submit Support Ticket</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
