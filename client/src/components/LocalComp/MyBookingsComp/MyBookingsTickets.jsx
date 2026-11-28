import { flushSync } from 'react-dom';
import { useEffect, useState } from 'react';
import { formatDocument, getBookingDocument } from '../../../services/bookingApi';
import BoardingBarcode from './BoardingBarcode';
import './MyBookingsCompStyles/MyBookingsTickets.css';

function TicketCard({
  booking,
  isPrinting = false,
  onView,
  onPrint,
  viewLabel = 'View Ticket',
}) {
  const passenger = booking.passenger || 'Guest Traveller';
  const travelDocument = getBookingDocument(booking);
  const hasMultipleTravellers =
    Array.isArray(booking.travellers) && booking.travellers.length > 1;

  return (
    <article
      className={`mb-ticket-card ${isPrinting ? 'is-printing' : ''}`}
      data-status={booking.status}
      role="group"
      aria-label={`Boarding pass ${booking.pnr}`}
    >
      <div className="mb-bp-strip" aria-hidden="true">
        <span className="mb-bp-globe">◎</span>
        <span className="mb-bp-vertical">BOARDING PASS</span>
        <span className="mb-bp-rail-plane">✈</span>
      </div>

      <div className="mb-bp-main">
        <div className="mb-bp-header">
          <div className="mb-bp-label">
            <span>PASSENGER</span>
            <b>{passenger}</b>
            <small className="mb-bp-id">PNR: {booking.pnr}</small>
          </div>
          <div className="mb-bp-city-title">
            <h2>{booking.destination.city}</h2>
            <small>{booking.travelClass} · {booking.airline}</small>
          </div>
          <span className={`mb-t-badge ${booking.badgeTone}`}>{booking.badge}</span>
        </div>

        <div className="mb-bp-route">
          <div className="mb-bp-port">
            <b>{booking.origin.code}</b>
            <span>{booking.origin.city}</span>
            <small>{booking.origin.airport}</small>
          </div>
          <div className="mb-bp-flight-arrow" aria-hidden="true">
            <span className="mb-bp-arrow-line" />
            <span className="mb-bp-plane">✈</span>
          </div>
          <div className="mb-bp-port mb-bp-port--right">
            <b>{booking.destination.code}</b>
            <span>{booking.destination.city}</span>
            <small>{booking.destination.airport}</small>
          </div>
        </div>

        <div className="mb-bp-middle">
          <div className="mb-bp-grid">
            <div className="mb-bp-label"><span>DATE</span><b>{booking.date}</b></div>
            <div className="mb-bp-label"><span>TIME</span><b>{booking.time}</b></div>
            <div className="mb-bp-label"><span>FLIGHT</span><b>{booking.flightNumber}</b></div>
            <div className="mb-bp-label"><span>SEAT</span><b>{booking.seat}</b></div>
            <div className="mb-bp-label mb-bp-document">
              <span>{travelDocument.label}</span>
              <b>{travelDocument.value}</b>
            </div>
            {viewLabel === 'Close' && hasMultipleTravellers && (
              <div className="mb-bp-label mb-bp-document">
                <span>ALL TRAVELLERS</span>
                <ul className="mb-bp-travellers-list">
                  {booking.travellers.map((traveller, idx) => {
                    const doc = formatDocument(
                      traveller.identityType,
                      traveller.identityNumber,
                    );
                    return (
                      <li key={idx}>
                        {traveller.firstName} {traveller.lastName} · {doc.label}:{' '}
                        {doc.value}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <div className="mb-bp-stamp" aria-hidden="true">
            <small>{booking.destination.code}</small>
            <span>✈</span>
            <small>{booking.pnr}</small>
          </div>
        </div>

        <div className="mb-bp-footer">
          <span className="mb-bp-wish">HAVE A NICE FLIGHT <span aria-hidden="true">✈</span></span>
          <div className="mb-bp-actions">
            <button
              className={`mb-btn ${viewLabel === 'Close' ? 'outline' : 'primary'}`}
              type="button"
              onClick={onView}
            >
              {viewLabel}
            </button>
            <button className="mb-btn" type="button" onClick={onPrint}>
              Print Ticket
            </button>
          </div>
        </div>
      </div>

      <div className="mb-bp-stub" aria-hidden="true">
        <div className="mb-bp-stub-head">
          <span>BOARDING PASS</span>
          <span>✈</span>
        </div>
        <div className="mb-bp-stub-body">
          <div className="mb-bp-stub-port">
            <span>FROM</span>
            <div><b>{booking.origin.code}</b><small>{booking.origin.city}</small></div>
          </div>
          <div className="mb-bp-dot-line" />
          <div className="mb-bp-stub-port">
            <span>TO</span>
            <div><b>{booking.destination.code}</b><small>{booking.destination.city}</small></div>
          </div>
          <div className="mb-bp-stub-bottom">
            <div className="mb-bp-stub-meta">
              <div className="mb-bp-label"><span>FLIGHT</span><b>{booking.flightNumber}</b></div>
              <div className="mb-bp-label"><span>DATE</span><b>{booking.date}</b></div>
              <div className="mb-bp-label"><span>SEAT</span><b>{booking.seat}</b></div>
            </div>
            <BoardingBarcode booking={booking} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyBookingsTickets({ bookings }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [printingTarget, setPrintingTarget] = useState(null);

  useEffect(() => {
    const clearPrintState = () => setPrintingTarget(null);
    window.addEventListener('afterprint', clearPrintState);
    return () => window.removeEventListener('afterprint', clearPrintState);
  }, []);

  useEffect(() => {
    if (!selectedBooking) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedBooking(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedBooking]);

  const printTicket = (booking, source) => {
    flushSync(() => setPrintingTarget(`${source}-${booking.pnr}`));
    window.print();
  };

  return (
    <section className="mb-content-section" aria-label="Your bookings">
      <div className="my-bookings-content-inner">
        {bookings.length > 0 ? (
          <div className="mb-tickets" id="bookings-list">
            {bookings.map((booking) => (
              <TicketCard
                key={booking.pnr}
                booking={booking}
                isPrinting={printingTarget === `grid-${booking.pnr}`}
                onView={() => setSelectedBooking(booking)}
                onPrint={() => printTicket(booking, 'grid')}
              />
            ))}
          </div>
        ) : (
          <div className="mb-empty-state">
            <div className="mb-empty-icon" aria-hidden="true">🎫</div>
            <h2>No bookings found</h2>
            <p>Book a flight or try another filter to see your tickets here.</p>
          </div>
        )}

        {selectedBooking && (
          <div className="mb-ticket-modal">
            <button
              className="mb-ticket-modal__backdrop"
              type="button"
              aria-label="Close ticket details"
              onClick={() => setSelectedBooking(null)}
            />
            <div
              className="mb-ticket-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mb-ticket-modal-title"
            >
              <div className="mb-ticket-modal__header">
                <h2 id="mb-ticket-modal-title">Your boarding pass</h2>
                <button
                  className="mb-ticket-modal__close"
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelectedBooking(null)}
                >
                  ×
                </button>
              </div>
              <TicketCard
                booking={selectedBooking}
                isPrinting={printingTarget === `modal-${selectedBooking.pnr}`}
                onView={() => setSelectedBooking(null)}
                onPrint={() => printTicket(selectedBooking, 'modal')}
                viewLabel="Close"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
