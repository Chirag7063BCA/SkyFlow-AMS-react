import bentoPlaneImg from '../../../assets/help_bento_plane.jpg';

const TOPICS = [
  {
    id: 'getting-started',
    title: 'GETTING STARTED',
    description: 'Get your account up and running in just a few easy steps.'
  },
  {
    id: 'account-billing',
    title: 'ACCOUNT & BILLING',
    description: 'Manage accounts, billing details, payments, and invoices.'
  },
  {
    id: 'troubleshooting',
    title: 'TROUBLESHOOTING',
    description: 'Quick solutions to common configuration and booking issues.'
  },
  {
    id: 'baggage-allowance',
    title: 'BAGGAGE ALLOWANCE',
    description: 'Carry-on rules, checked baggage weight limits, and excess fees.'
  },
  {
    id: 'cancellations-refunds',
    title: 'CANCELLATIONS & REFUNDS',
    description: 'Ticket cancellation policies, refund steps, and timelines.'
  },
  {
    id: 'flight-status-alerts',
    title: 'FLIGHT STATUS & ALERTS',
    description: 'Live flight departures, gate updates, and delay notifications.'
  }
];

function TopicIcon({ id }) {
  return (
    <svg
      width="85"
      height="85"
      viewBox="0 0 100 100"
      fill="none"
      stroke="#2563eb"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {id === 'getting-started' && (
        <polygon points="25,15 75,45 50,55 65,85 50,90 35,60 25,75" />
      )}
      {id === 'account-billing' && (
        <>
          <line x1="50" y1="50" x2="50" y2="95" />
          <circle cx="50" cy="50" r="6" />
          <path d="M50 50 C40 30, 45 10, 50 5 C55 10, 60 30, 50 50 Z" />
          <path d="M50 50 C70 40, 90 45, 95 50 C90 55, 70 60, 50 50 Z" />
          <path d="M50 50 C30 60, 10 55, 5 50 C10 45, 30 40, 50 50 Z" />
        </>
      )}
      {id === 'troubleshooting' && (
        <>
          <path d="M50,20 C30,20 20,35 20,50 C20,65 30,80 50,80 C70,80 80,65 80,50 C80,35 70,20 50,20 Z" />
          <circle cx="35" cy="40" r="4" />
          <circle cx="65" cy="40" r="4" />
          <circle cx="50" cy="60" r="4" />
          <line x1="35" y1="40" x2="50" y2="60" />
          <line x1="65" y1="40" x2="50" y2="60" />
          <line x1="35" y1="40" x2="50" y2="20" />
          <line x1="65" y1="40" x2="50" y2="20" />
        </>
      )}
      {id === 'baggage-allowance' && (
        <>
          <circle cx="50" cy="50" r="22" />
          <circle cx="50" cy="50" r="10" />
          <path d="M50 20 V10 M50 90 V80 M20 50 H10 M90 50 H80 M29 29 L22 22 M78 78 L71 71 M29 71 L22 78 M78 22 L71 29" />
        </>
      )}
      {id === 'cancellations-refunds' && (
        <path d="M25,50 A25,25 0 1,1 50,75 L50,85 L65,70 L50,55 L50,65 A15,15 0 1,0 35,50 Z" />
      )}
      {id === 'flight-status-alerts' && (
        <path d="M15 65 L45 50 L45 20 C45 15, 55 15, 55 20 L55 50 L85 65 L85 73 L55 63 L55 83 L63 89 L63 95 L50 91 L37 95 L37 89 L45 83 L45 63 L15 73 Z" />
      )}
    </svg>
  );
}

export default function HelpTopicsBento({ onTopicSelect }) {
  const handleTopicClick = (e, topicId) => {
    e.preventDefault();
    if (onTopicSelect) {
      onTopicSelect(topicId);
      return;
    }
    const articlesSection = document.getElementById('articles-section');
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="topics-section" id="topics-section">
      <div className="container-topics">
        <div className="topics-bento-layout">
          {/* Bento Left Banner */}
          <div className="topics-bento-banner">
            <img
              src={bentoPlaneImg}
              alt="SkyFlow Aviation Fleet"
              className="bento-banner-img"
            />
            <div className="bento-banner-overlay">
              <span className="bento-badge">SkyFlow Fleet</span>
              <h3 className="bento-banner-title">Fly Beyond Boundaries</h3>
            </div>
          </div>

          {/* Bento Right Cards Grid */}
          <div className="topics-cards-grid">
            {TOPICS.map((topic) => (
              <div
                key={topic.id}
                className="bento-card"
                role="button"
                tabIndex={0}
                onClick={(e) => handleTopicClick(e, topic.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTopicClick(e, topic.id);
                  }
                }}
              >
                <div className="bento-card-top">
                  <h3 className="bento-card-title">{topic.title}</h3>
                  <p className="bento-card-desc">{topic.description}</p>
                </div>
                <div className="bento-card-illustration">
                  <TopicIcon id={topic.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
