import { useState } from 'react';

const DEFAULT_ARTICLES = [
  {
    id: 'console-error',
    question: 'Getting a JavaScript console error',
    answer: 'If you encounter a console error while booking or browsing, open Developer Tools (F12) and check the Console tab. Clearing your browser cache or disabling conflicting extensions usually resolves script issues.'
  },
  {
    id: 'accepted-currencies',
    question: 'Accepted currencies for product billing',
    answer: 'SkyFlow supports multiple international currencies including USD ($), EUR (€), GBP (£), INR (₹), and CAD ($). Payments are securely processed using 256-bit SSL encryption via Visa, MasterCard, and American Express.'
  },
  {
    id: 'cancelling-reservation',
    question: 'Cancelling a website subscription or reservation',
    answer: 'To cancel a confirmed flight or booking, log in to your account, navigate to "My Bookings", select your active trip, and click "Cancel Booking". Eligible refunds are automatically credited back to your original payment method within 5 to 7 business days.'
  },
  {
    id: 'flight-alerts',
    question: 'Setting up new domain and flight alerts',
    answer: 'You can configure automated flight notifications, SMS alerts, and schedule changes under your Profile Settings. Ensure your registered phone number and email are updated to receive instant gate change and departure alerts.'
  },
  {
    id: 'getting-started',
    question: 'Getting started with our application',
    answer: 'New to SkyFlow? Search for available flights directly on the homepage, filter by origin, destination, or date, select your preferred seat class, and complete your reservation seamlessly in just a few easy steps.'
  }
];

export default function HelpFaqAccordion({ articles = DEFAULT_ARTICLES }) {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="articles-section" id="articles-section">
      <div className="container-articles">
        <div className="articles-header">
          <h2>Featured Articles & Guides</h2>
        </div>

        <div className="articles-accordion">
          {articles.map((item) => {
            const isOpen = !!openItems[item.id];
            return (
              <div
                key={item.id}
                className={`article-item ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="article-title-btn"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`article-content-${item.id}`}
                >
                  <span>{item.question}</span>
                  <svg
                    className="dropdown-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    id={`article-content-${item.id}`}
                    className="article-content"
                    role="region"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
