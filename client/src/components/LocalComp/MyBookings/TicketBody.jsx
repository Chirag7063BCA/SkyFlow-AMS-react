import React from 'react';

export default function TicketBody({ booking, onAction }) {
  const passenger = booking.footerItems[2]?.value || 'Passenger';

  return (
    <div className="mb-bp-main">
      <div className="mb-bp-header">
        <div className="mb-bp-label">
          <span>PASSENGER</span>
          <b>{passenger}</b>
        </div>

        <div className="mb-bp-city-title">
          <h2>{booking.destination.city}</h2>
          <small>{booking.travelClass} • {booking.airline}</small>
        </div>

        <span className={`mb-t-badge ${booking.badgeClass}`}>
          {booking.badgeText}
        </span>
      </div>

      <div className="mb-bp-route">
        <div className="mb-bp-port">
          <b>{booking.origin.code}</b>
          <span>{booking.origin.city}</span>
          <small>{booking.origin.airport}</small>
        </div>

        <div className="mb-bp-flight-arrow">
          <span className="mb-bp-arrow-line" />
          <span className="mb-bp-plane">✈</span>
        </div>

        <div className="mb-bp-port right">
          <b>{booking.destination.code}</b>
          <span>{booking.destination.city}</span>
          <small>{booking.destination.airport}</small>
        </div>
      </div>

      <div className="mb-bp-middle">
        <div className="mb-bp-grid">
          <div className="mb-bp-label">
            <span>DATE</span>
            <b>{booking.date}</b>
          </div>
          <div className="mb-bp-label">
            <span>TIME</span>
            <b>{booking.time}</b>
          </div>
          <div className="mb-bp-label">
            <span>FLIGHT</span>
            <b>{booking.flightNumber}</b>
          </div>
          <div className="mb-bp-label">
            <span>SEAT</span>
            <b>{booking.seat}</b>
          </div>
        </div>

        <div className="mb-bp-stamp">
          <small>{booking.destination.code}</small>
          <span>✈</span>
          <small>{booking.pnr}</small>
        </div>
      </div>

      <div className="mb-bp-footer">
        <span className="mb-bp-wish">HAVE A NICE FLIGHT ✈</span>
        <div className="mb-bp-actions">
          {booking.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`mb-btn ${action.variant || ''}`.trim()}
              onClick={() => onAction?.(booking, action.label)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
