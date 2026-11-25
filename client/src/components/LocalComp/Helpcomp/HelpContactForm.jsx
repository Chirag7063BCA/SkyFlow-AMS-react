import { useState } from 'react';

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'raghav.chhabra111@gmail.com';
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${SUPPORT_EMAIL}`;

export default function HelpContactForm({ onSubmitSuccess, customEndpoint = FORMSUBMIT_URL }) {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(customEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
          _captcha: 'false',
          _subject: 'SkyFlow Support Desk Query'
        })
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
        setStatus('success');
        setFormData({ email: '', message: '' });
        if (onSubmitSuccess) onSubmitSuccess(result);

        setTimeout(() => {
          setStatus('idle');
        }, 4000);
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Submission failed. Please verify your connection and try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error while submitting your support query. Please check your internet connection.');
    }
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
          <p>Get in touch with us below and our support team will respond within 2 hours.</p>
        </div>

        <form className="help-form" onSubmit={handleSubmit}>
          {status === 'error' && (
            <div className="form-status-alert error" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="supportUserEmail">Email Address</label>
            <input
              type="email"
              id="supportUserEmail"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="supportUserQuery">Your Query / Message</label>
            <textarea
              id="supportUserQuery"
              name="message"
              placeholder="Describe your question or issue in detail..."
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className={`form-submit-btn ${status === 'success' ? 'success' : ''}`}
            disabled={status === 'submitting' || status === 'success'}
          >
            {status === 'submitting' && <span>Sending...</span>}
            {status === 'success' && <span>Form Submitted ✓</span>}
            {status === 'idle' && <span>Send Message &rarr;</span>}
            {status === 'error' && <span>Retry Sending &rarr;</span>}
          </button>
        </form>
      </div>
    </section>
  );
}
