import React from 'react';

export default function TicketModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="mb-modal-backdrop" onClick={onClose}>
      <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mb-modal-head">
          <div>
            <h3>{booking.airline} • {booking.flightNumber}</h3>
            <span>PNR: {booking.pnr} • {booking.travelClass}</span>
          </div>
          <button type="button" className="mb-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mb-modal-route">
          <div>
            <b>{booking.origin.code}</b>
            <small>{booking.origin.city}</small>
          </div>
          <span>✈ {booking.duration} ({booking.stops})</span>
          <div className="right">
            <b>{booking.destination.code}</b>
            <small>{booking.destination.city}</small>
          </div>
        </div>

        <div className="mb-modal-grid">
          <div><span>Date</span><b>{booking.date}</b></div>
          <div><span>Departure</span><b>{booking.time}</b></div>
          <div><span>Seat</span><b>{booking.seat} ({booking.seatType})</b></div>
          {booking.footerItems.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <b className={item.valueClass || ''}>{item.value}</b>
            </div>
          ))}
        </div>

        <div className="mb-modal-actions">
          <button type="button" className="mb-btn primary" onClick={() => window.print()}>
            🖨 Print Boarding Pass
          </button>
          <button type="button" className="mb-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
