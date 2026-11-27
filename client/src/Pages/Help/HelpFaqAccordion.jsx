import { useState } from 'react';

const FAQS = [
  { id: 'console-error', q: 'Getting a JavaScript console error', a: 'If you encounter a console error while booking or browsing, open Developer Tools (F12) and check the Console tab. Clearing your browser cache or disabling conflicting extensions usually resolves script issues.' },
  { id: 'accepted-currencies', q: 'Accepted currencies for product billing', a: 'SkyFlow supports multiple international currencies including USD ($), EUR (€), GBP (£), INR (₹), and CAD ($). Payments are securely processed using 256-bit SSL encryption via Visa, MasterCard, and American Express.' },
  { id: 'cancelling-reservation', q: 'Cancelling a website subscription or reservation', a: 'To cancel a confirmed flight or booking, log in to your account, navigate to "My Bookings", select your active trip, and click "Cancel Booking". Eligible refunds are automatically credited back to your original payment method within 5 to 7 business days.' },
  { id: 'flight-alerts', q: 'Setting up new domain and flight alerts', a: 'You can configure automated flight notifications, SMS alerts, and schedule changes under your Profile Settings. Ensure your registered phone number and email are updated to receive instant gate change and departure alerts.' },
  { id: 'getting-started', q: 'Getting started with our application', a: 'New to SkyFlow? Search for available flights directly on the homepage, filter by origin, destination, or date, select your preferred seat class, and complete your reservation seamlessly in just a few easy steps.' },
];

export default function HelpFaqAccordion({ articles = FAQS }) {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="articles-section" id="articles-section">
      <div className="help-container">
        <div className="articles-header">
          <h2>Featured Articles &amp; Guides</h2>
        </div>
        <div className="articles-accordion">
          {articles.map(({ id, q, a }) => {
            const isOpen = openId === id;
            return (
              <div key={id} className={`article-item ${isOpen ? 'open' : ''}`}>
                <button type="button" className="article-title-btn" onClick={() => toggle(id)} aria-expanded={isOpen}>
                  <span>{q}</span>
                  <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && <div className="article-content">{a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
