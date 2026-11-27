import { useEffect, useRef, useState } from 'react';
import './MyBookingsCompStyles/MyBookingsFilters.css';

const STATUS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function MyBookingsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const close = (e) => {
      if (e.key === 'Escape' || (e.type === 'mousedown' && !wrapRef.current?.contains(e.target))) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [isOpen]);

  const activeLabel =
    STATUS_OPTIONS.find((item) => item.id === statusFilter)?.label || 'All';

  return (
    <div className="mb-toolbar" role="search" aria-label="Search and filter bookings">
      <div className="mb-oval-search">
        <svg
          className="mb-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by PNR, city, flight, or passenger..."
          aria-label="Search bookings"
        />
      </div>

      <div
        className={`mb-filter-wrap ${isOpen ? 'is-open' : ''}`}
        ref={wrapRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          type="button"
          className={`mb-filter-btn ${statusFilter !== 'all' ? 'has-active' : ''}`}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
          </svg>
          <span>{statusFilter === 'all' ? 'Filter' : activeLabel}</span>
        </button>

        <div className="mb-filter-panel" role="region" aria-label="Status filter">
          <div className="mb-panel-head">
            <span>Filters</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 4v16M12 4v16M18 4v16" strokeLinecap="round" opacity="0.4" />
              <circle cx="6" cy="9" r="2" fill="currentColor" />
              <circle cx="12" cy="15" r="2" fill="currentColor" />
              <circle cx="18" cy="10" r="2" fill="currentColor" />
            </svg>
          </div>

          <div className="mb-panel-body">
            <p className="mb-panel-title">Status</p>
            <div className="mb-status-grid">
              {STATUS_OPTIONS.map((option) => {
                const selected = statusFilter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`mb-status-option ${selected ? 'is-selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => onStatusChange(option.id)}
                  >
                    <span className="mb-radio-circle" aria-hidden="true">
                      {selected && '✓'}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-panel-actions">
              <button
                type="button"
                className="mb-apply-btn"
                onClick={() => setIsOpen(false)}
              >
                Apply filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
