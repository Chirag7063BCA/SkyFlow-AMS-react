import React, { useState } from 'react';
import { FilterIcon, SearchIcon } from './MyBookingIcons';

const STATUS_OPTIONS = [
  { key: 'all', label: 'All Bookings' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function MyBookingFilter({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) {
  const [open, setOpen] = useState(false);

  const activeLabel = STATUS_OPTIONS.find((opt) => opt.key === activeFilter)?.label || 'Filter';

  return (
    <section className="mb-hero-section">
      <div className="mb-hero-inner">
        <h1 className="mb-hero-title">
          MY{' '}
          <span className="mb-animated-wrap">
            <span className="mb-animated-text">BOOKINGS</span>
            <span className="mb-animated-text delay">FLIGHTS</span>
          </span>
        </h1>
        <p className="mb-subtitle">
          View, search, and manage all your flight bookings in one place
        </p>

        <div className="mb-search-row">
          <div className="mb-search-input-wrap">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search PNR, city, or flight..."
              aria-label="Search bookings"
            />
            {searchQuery && (
              <button type="button" className="mb-search-clear" onClick={() => onSearchChange('')}>
                ✕
              </button>
            )}
          </div>

          <div
            className={`mb-filter-wrap ${open ? 'open' : ''}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className="mb-filter-trigger"
              onClick={() => setOpen((prev) => !prev)}
            >
              <FilterIcon />
              <span>{activeFilter === 'all' ? 'Filter' : activeLabel}</span>
            </button>

            <div className="mb-filter-dropdown">
              <span className="mb-fd-title">Booking Status</span>
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`mb-fd-option ${activeFilter === opt.key ? 'active' : ''}`}
                  onClick={() => {
                    onFilterChange(opt.key);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
