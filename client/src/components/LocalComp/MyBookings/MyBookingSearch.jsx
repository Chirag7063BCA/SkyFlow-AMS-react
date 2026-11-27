import React from 'react';

export default function MyBookingSearch({ query, onQueryChange, count, total }) {
  return (
    <div className="mb-search-bar">
      <div className="mb-search-input-wrap">
        <span className="mb-search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by PNR, city, airport code or flight..."
          aria-label="Search bookings"
        />
        {query && (
          <button
            type="button"
            className="mb-search-clear"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <span className="mb-search-count">
        Showing <b>{count}</b> of {total} bookings
      </span>
    </div>
  );
}
