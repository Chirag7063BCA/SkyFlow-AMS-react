import React from 'react';

const FILTER_OPTIONS = [
  { key: 'all', label: 'All Bookings' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function MyBookingFilter({
  activeFilter,
  onFilterChange,
  onNavigateHome,
}) {
  const handleTitleClick = (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  return (
    <section className="hero-section mb-hero-section">
      <div className="hero-content">
        <div className="mb-wrapper">
          <div className="mb-top-row">
            <div className="mb-title-area">
              <h1 className="hero-title mb-main-title">
                <a
                  href="#home"
                  className="mb-title-link"
                  title="Back to Home"
                  onClick={handleTitleClick}
                >
                  MY
                  <span className="animated-text-wrapper mb-title-accent-wrap">
                    <span className="animated-text hero-title-accent">BOOKINGS</span>
                    <span className="animated-text hero-title-accent delay">FLIGHTS</span>
                  </span>
                </a>
              </h1>
              <p className="mb-subtitle">View and manage all your flight bookings</p>
              <div className="mb-filters">
                {FILTER_OPTIONS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={`mb-filter ${activeFilter === filter.key ? 'active' : ''}`}
                    onClick={() => onFilterChange(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-promo-card">
              <div>
                <p className="mb-promo-title">Add your trip to calendar</p>
                <p className="mb-promo-sub">Never miss your flight again</p>
                <a
                  href="#calendar"
                  className="mb-promo-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Add Now ➔
                </a>
              </div>
              <span className="mb-promo-icon">📅</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
