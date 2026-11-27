import React from 'react';
import {
  BellIcon,
  DownloadIcon,
  GlobeIcon,
  InfoIcon,
  PlaneIcon,
  PrintIcon,
  TicketIcon,
} from './MyBookingIcons';

const ACTION_ICONS = {
  ticket: <TicketIcon />,
  download: <DownloadIcon />,
  info: <InfoIcon />,
};

export default function MyBookingTickets({
  bookings,
  loading,
  activeFilter,
  selectedBooking,
  onCloseModal,
  onAction,
}) {
  return (
    <section className="mb-content-section">
      {loading ? (
        <div className="mb-empty-state"><h3>Loading bookings...</h3></div>
      ) : bookings.length === 0 ? (
        <div className="mb-empty-state">
          <div className="mb-empty-icon"><TicketIcon /></div>
          <h3>No {activeFilter === 'all' ? 'matching' : activeFilter} bookings</h3>
          <p>Try another filter or clear your search query.</p>
        </div>
      ) : (
        <div className="mb-tickets">
          {bookings.map((b) => (
            <div key={b.pnr} className="mb-ticket-card" data-status={b.status}>
              <div className="mb-bp-strip">
                <GlobeIcon />
                <span className="mb-bp-vertical">BOARDING PASS</span>
                <PlaneIcon size={14} />
              </div>

              <div className="mb-bp-main">
                <div className="mb-bp-header">
                  <div className="mb-bp-label">
                    <span>PASSENGER</span>
                    <b>{b.passenger}</b>
                    <small className="mb-bp-id">{b.idNumber}</small>
                  </div>
                  <div className="mb-bp-city-title">
                    <h2>{b.destination.city}</h2>
                    <small>{b.travelClass} • {b.airline}</small>
                  </div>
                  <span className={`mb-t-badge ${b.badgeClass}`}>{b.badgeText}</span>
                </div>

                <div className="mb-bp-route">
                  <div className="mb-bp-port">
                    <b>{b.origin.code}</b>
                    <span>{b.origin.city}</span>
                    <small>{b.origin.airport}</small>
                  </div>
                  <div className="mb-bp-flight-arrow">
                    <span className="mb-bp-arrow-line" />
                    <span className="mb-bp-plane"><PlaneIcon size={16} /></span>
                  </div>
                  <div className="mb-bp-port right">
                    <b>{b.destination.code}</b>
                    <span>{b.destination.city}</span>
                    <small>{b.destination.airport}</small>
                  </div>
                </div>

                <div className="mb-bp-middle">
                  <div className="mb-bp-grid">
                    <div className="mb-bp-label"><span>DATE</span><b>{b.date}</b></div>
                    <div className="mb-bp-label"><span>TIME</span><b>{b.time}</b></div>
                    <div className="mb-bp-label"><span>FLIGHT</span><b>{b.flightNumber}</b></div>
                    <div className="mb-bp-label"><span>SEAT</span><b>{b.seat}</b></div>
                  </div>
                  <div className="mb-bp-stamp">
                    <small>{b.destination.code}</small>
                    <PlaneIcon size={13} />
                    <small>{b.pnr}</small>
                  </div>
                </div>

                <div className="mb-bp-footer">
                  <span className="mb-bp-wish">
                    HAVE A NICE FLIGHT <PlaneIcon size={12} />
                  </span>
                  <div className="mb-bp-actions">
                    {b.actions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className={`mb-btn ${action.variant || ''}`.trim()}
                        onClick={() => onAction(b, action.label)}
                      >
                        {ACTION_ICONS[action.icon]}
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-bp-stub">
                <div className="mb-bp-stub-head">
                  <span>BOARDING PASS</span>
                  <PlaneIcon size={13} />
                </div>
                <div className="mb-bp-stub-body">
                  <div className="mb-bp-stub-port">
                    <span>FROM</span>
                    <div><b>{b.origin.code}</b><small>{b.origin.city}</small></div>
                  </div>
                  <div className="mb-bp-dot-line" />
                  <div className="mb-bp-stub-port">
                    <span>TO</span>
                    <div><b>{b.destination.code}</b><small>{b.destination.city}</small></div>
                  </div>
                  <div className="mb-bp-stub-bottom">
                    <div className="mb-bp-stub-meta">
                      <div className="mb-bp-label"><span>FLIGHT</span><b>{b.flightNumber}</b></div>
                      <div className="mb-bp-label"><span>DATE</span><b>{b.date}</b></div>
                      <div className="mb-bp-label"><span>SEAT</span><b>{b.seat}</b></div>
                    </div>
                    <div className="mb-bp-vbarcode" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-reminder">
        <div className="mb-rem-icon"><BellIcon /></div>
        <div className="mb-rem-text">
          <b>Travel stress-free!</b>
          <p>Arrive at the airport at least 2 hours before departure for domestic flights.</p>
        </div>
        <div className="mb-rem-plane"><PlaneIcon size={34} /></div>
      </div>

      {selectedBooking && (
        <div className="mb-modal-backdrop" onClick={onCloseModal}>
          <div className="mb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mb-modal-head">
              <div>
                <h3>{selectedBooking.airline} • {selectedBooking.flightNumber}</h3>
                <span>PNR: {selectedBooking.pnr} • {selectedBooking.travelClass}</span>
              </div>
              <button type="button" className="mb-modal-close" onClick={onCloseModal}>✕</button>
            </div>
            <div className="mb-modal-route">
              <div><b>{selectedBooking.origin.code}</b><small>{selectedBooking.origin.city}</small></div>
              <span className="mb-modal-dur"><PlaneIcon size={14} /> {selectedBooking.duration} ({selectedBooking.stops})</span>
              <div className="right"><b>{selectedBooking.destination.code}</b><small>{selectedBooking.destination.city}</small></div>
            </div>
            <div className="mb-modal-grid">
              <div><span>Passenger</span><b>{selectedBooking.passenger}</b></div>
              <div><span>ID / Document</span><b>{selectedBooking.idNumber}</b></div>
              <div><span>Date & Time</span><b>{selectedBooking.date}, {selectedBooking.time}</b></div>
              <div><span>Terminal & Boarding</span><b>{selectedBooking.terminal} • {selectedBooking.boardingTime}</b></div>
              <div><span>Seat</span><b>{selectedBooking.seat} ({selectedBooking.seatType})</b></div>
            </div>
            <div className="mb-modal-actions">
              <button type="button" className="mb-btn primary" onClick={() => window.print()}>
                <PrintIcon /><span>Print Boarding Pass</span>
              </button>
              <button type="button" className="mb-btn" onClick={onCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
