import bentoPlaneImg from '../../assets/help_bento_plane.jpg';
import iconGettingStarted from '../../assets/help-icons/getting-started.svg';
import iconAccountBilling from '../../assets/help-icons/account-billing.svg';
import iconTroubleshooting from '../../assets/help-icons/troubleshooting.svg';
import iconBaggageAllowance from '../../assets/help-icons/baggage-allowance.svg';
import iconCancellationsRefunds from '../../assets/help-icons/cancellations-refunds.svg';
import iconFlightAlerts from '../../assets/help-icons/flight-status-alerts.svg';

const TOPICS = [
  { id: 'getting-started', title: 'GETTING STARTED', desc: 'Get your account up and running in just a few easy steps.', icon: iconGettingStarted },
  { id: 'account-billing', title: 'ACCOUNT & BILLING', desc: 'Manage accounts, billing details, payments, and invoices.', icon: iconAccountBilling },
  { id: 'troubleshooting', title: 'TROUBLESHOOTING', desc: 'Quick solutions to common configuration and booking issues.', icon: iconTroubleshooting },
  { id: 'baggage-allowance', title: 'BAGGAGE ALLOWANCE', desc: 'Carry-on rules, checked baggage weight limits, and excess fees.', icon: iconBaggageAllowance },
  { id: 'cancellations-refunds', title: 'CANCELLATIONS & REFUNDS', desc: 'Ticket cancellation policies, refund steps, and timelines.', icon: iconCancellationsRefunds },
  { id: 'flight-status-alerts', title: 'FLIGHT STATUS & ALERTS', desc: 'Live flight departures, gate updates, and delay notifications.', icon: iconFlightAlerts },
];

export default function HelpTopicsBento({ onTopicSelect }) {
  const handleClick = (id) => {
    if (onTopicSelect) onTopicSelect(id);
    else document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="topics-section" id="topics-section">
      <div className="help-container">
        <div className="topics-bento-layout">
          <div className="topics-bento-banner">
            <img src={bentoPlaneImg} alt="SkyFlow Fleet" className="bento-banner-img" />
            <div className="bento-banner-overlay">
              <span className="bento-badge">SkyFlow Fleet</span>
              <h3 className="bento-banner-title">Fly Beyond Boundaries</h3>
            </div>
          </div>

          <div className="topics-cards-grid">
            {TOPICS.map(({ id, title, desc, icon }) => (
              <button key={id} type="button" className="bento-card" onClick={() => handleClick(id)}>
                <div className="bento-card-top">
                  <h3 className="bento-card-title">{title}</h3>
                  <p className="bento-card-desc">{desc}</p>
                </div>
                <div className="bento-card-illustration">
                  <img src={icon} alt="" className="bento-card-icon" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
