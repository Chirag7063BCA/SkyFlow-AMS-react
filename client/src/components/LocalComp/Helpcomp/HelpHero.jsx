export default function HelpHero({ onContactClick }) {
  const handleScrollToContact = (e) => {
    e.preventDefault();
    if (onContactClick) {
      onContactClick();
      return;
    }
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="help-hero">
      <div className="hero-content">
        <p className="hero-eyebrow">SkyFlow Support Center</p>
        <h1 className="hero-title">
          <span>HOW CAN</span>
          <span className="animated-text-wrapper">
            <span className="hero-title-accent animated-text">WE HELP?</span>
            <span className="hero-title-accent animated-text delay">WE ASSIST?</span>
          </span>
        </h1>
        <p className="hero-copy">
          Find advice and answers from our support team fast or get in touch with us below.
        </p>
        <button
          type="button"
          onClick={handleScrollToContact}
          className="hero-btn"
          aria-label="Scroll to contact form"
        >
          <span>Get In Touch With Us</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      </div>
    </section>
  );
}
