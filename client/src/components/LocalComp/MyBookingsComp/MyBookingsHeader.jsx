import { useEffect, useRef, useState } from 'react';
import heroImage from '../../../assets/Hero.png';
import './MyBookingsCompStyles/MyBookingsHeader.css';

const pad = (n) => String(n).padStart(2, '0');

function toStamp(date) {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  );
}

function getEventData(booking) {
  const start = new Date(booking.date);
  const date = Number.isNaN(start.getTime()) ? new Date() : start;
  const match = String(booking.time || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

  if (match) {
    let h = Number(match[1]);
    const period = match[3]?.toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    date.setHours(h, Number(match[2]), 0, 0);
  } else {
    date.setHours(9, 0, 0, 0);
  }

  const end = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  return {
    title: `Flight ${booking.flightNumber}: ${booking.origin.city} (${booking.origin.code}) to ${booking.destination.city} (${booking.destination.code})`,
    details: `Airline: ${booking.airline}\nPNR: ${booking.pnr}\nPassenger: ${booking.passenger}\nSeat: ${booking.seat}`,
    location: booking.origin.airport || booking.origin.city,
    start: toStamp(date),
    end: toStamp(end),
  };
}

function downloadIcs(booking) {
  const ev = getEventData(booking);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${booking.pnr}@skyflow`,
    `DTSTART:${ev.start}`,
    `DTEND:${ev.end}`,
    `SUMMARY:${ev.title}`,
    `DESCRIPTION:${ev.details.replace(/\n/g, '\\n')}`,
    `LOCATION:${ev.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `SkyFlow-${booking.pnr}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function MyBookingsHeader({ upcomingBookings = [], children }) {
  const [selectedPnr, setSelectedPnr] = useState(() => upcomingBookings[0]?.pnr || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef(null);

  const selected =
    upcomingBookings.find((b) => b.pnr === selectedPnr) || upcomingBookings[0] || null;

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const close = (e) => {
      if (e.key === 'Escape' || (e.type === 'mousedown' && !cardRef.current?.contains(e.target))) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [isMenuOpen]);

  const openGoogleCalendar = () => {
    if (!selected) return;
    const ev = getEventData(selected);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: ev.title,
      dates: `${ev.start}/${ev.end}`,
      details: ev.details,
      location: ev.location,
    });
    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank', 'noopener,noreferrer');
    setIsMenuOpen(false);
  };

  return (
    <section
      className="my-bookings-header"
      style={{ '--my-bookings-hero-image': `url("${heroImage}")` }}
      aria-label="My bookings overview"
    >
      <div className="my-bookings-header__inner">
        <div className="mb-top-row">
          <div className="mb-title-area">
            <h1 className="my-bookings-title" aria-label="My bookings">
              <span>MY</span>
              <span className="my-bookings-word-wrapper" aria-hidden="true">
                <span className="my-bookings-animated-word">BOOKINGS</span>
                <span className="my-bookings-animated-word delay">FLIGHTS</span>
              </span>
            </h1>
            <p className="mb-subtitle">View and manage all your flight bookings</p>
          </div>

          <aside className="mb-promo-wrap" ref={cardRef}>
            <button
              type="button"
              className="mb-promo-card"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <div>
                <p className="mb-promo-title">Add your trip to calendar</p>
                <p className="mb-promo-sub">Never miss your flight again</p>
                <span className="mb-promo-link">Add Now ➔</span>
              </div>
              <span className="mb-promo-icon" aria-hidden="true">🗓</span>
            </button>

            {isMenuOpen && (
              <div className="mb-cal-menu" role="dialog" aria-label="Add flight to calendar">
                {selected ? (
                  <>
                    {upcomingBookings.length > 1 ? (
                      <label className="mb-cal-select-wrap">
                        <span>Select upcoming flight</span>
                        <select value={selected.pnr} onChange={(e) => setSelectedPnr(e.target.value)}>
                          {upcomingBookings.map((b) => (
                            <option key={b.pnr} value={b.pnr}>
                              {b.flightNumber} · {b.origin.code} → {b.destination.code} ({b.date})
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : (
                      <p className="mb-cal-flight">
                        {selected.flightNumber} · {selected.origin.code} → {selected.destination.code} ({selected.date})
                      </p>
                    )}

                    <div className="mb-cal-actions">
                      <button type="button" className="mb-cal-btn primary" onClick={openGoogleCalendar}>
                        Google Calendar
                      </button>
                      <button
                        type="button"
                        className="mb-cal-btn"
                        onClick={() => {
                          downloadIcs(selected);
                          setIsMenuOpen(false);
                        }}
                      >
                        Download .ics
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="mb-cal-empty">No upcoming flights to add.</p>
                )}
              </div>
            )}
          </aside>
        </div>
        {children}
      </div>
    </section>
  );
}
