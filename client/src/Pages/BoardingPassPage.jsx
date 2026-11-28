import { useSearchParams } from 'react-router-dom';
import logoGif from '../assets/navbar logo.gif';
import planeBanner from '../assets/Hero.png';
import BoardingBarcode from '../components/LocalComp/MyBookingsComp/BoardingBarcode';
import { decodePassToken, getBookingDocument, getBookings } from '../services/bookingApi';
import './BoardingPassPage.css';

function getGate(flightNumber) {
  const num = Number.parseInt(String(flightNumber || '').replace(/\D/g, ''), 10) || 1;
  return `G${(num % 12) + 1}`;
}

function downloadPassText(pass) {
  const lines = [
    'SKYFLOW BOARDING PASS',
    `PNR: ${pass.pnr}`,
    `Passenger: ${pass.passenger}`,
    `Flight: ${pass.flightNumber} (${pass.airline})`,
    `Route: ${pass.origin.code} (${pass.origin.city}) -> ${pass.destination.code} (${pass.destination.city})`,
    `Date: ${pass.date} | Time: ${pass.time}`,
    `Seat: ${pass.seat} | Class: ${pass.travelClass}`,
    `${pass.docLabel}: ${pass.docValue}`,
    `Status: ${String(pass.status).toUpperCase()}`,
  ].join('\n');

  const url = URL.createObjectURL(new Blob([lines], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `SkyFlow-Pass-${pass.pnr}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" aria-hidden="true">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
      <path d="M12 7v6M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 4v12m0 0-4-4m4 4 4-4M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9V4h12v5M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="6" rx="1" />
    </svg>
  );
}

export default function BoardingPassPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  const pnrParam = searchParams.get('pnr');

  let pass = decodePassToken(token);
  if (pass) {
    const localMatch = getBookings().find((b) => b.pnr === pass.pnr);
    if (localMatch) {
      pass = {
        ...pass,
        origin: localMatch.origin || pass.origin,
        destination: localMatch.destination || pass.destination,
      };
    }
  } else if (pnrParam) {
    const found = getBookings().find((b) => b.pnr === pnrParam);
    if (found) {
      const doc = getBookingDocument(found);
      pass = { ...found, docLabel: doc.label, docValue: doc.value };
    }
  }

  if (!pass) {
    return (
      <main className="bp-scan-page">
        <div className="bp-scan-empty">
          <h2>Boarding Pass Not Found</h2>
          <p>Please scan a valid SkyFlow ticket QR code.</p>
        </div>
      </main>
    );
  }

  const isCancelled = pass.status === 'cancelled';
  const isCompleted = pass.status === 'completed';
  const statusLabel = isCancelled
    ? 'Booking Cancelled'
    : isCompleted
      ? 'Trip Completed'
      : 'Booking Verified';
  const readyTitle = isCancelled
    ? 'This ticket is cancelled'
    : isCompleted
      ? 'Flight completed'
      : 'Your boarding pass is ready';
  const readySub = isCancelled
    ? 'Please contact SkyFlow support for refund details'
    : isCompleted
      ? 'Thank you for flying with SkyFlow'
      : 'Show this boarding pass at the airport';

  return (
    <main
      className="bp-scan-page"
      style={{ '--bp-plane-bg': `url("${planeBanner}")` }}
    >
      <div className="bp-scan-shell">
        <header className="bp-scan-top">
          <div className="bp-scan-brand">
            <img src={logoGif} alt="SkyFlow" />
            <div>
              <strong>SkyFlow</strong>
              <span>Airline Management</span>
            </div>
          </div>

          <span className={`bp-scan-verified ${pass.status}`}>
            <i aria-hidden="true">
              {isCancelled ? <AlertIcon /> : <CheckIcon />}
            </i>
            {statusLabel}
          </span>
        </header>

        <section className="bp-scan-card" aria-label={`Boarding pass ${pass.pnr}`}>
          <div className="bp-scan-route-head">
            <div className="bp-scan-port">
              <span>{pass.origin.city}</span>
              <b>{pass.origin.code}</b>
              <small>{pass.origin.airport}</small>
            </div>

            <div className="bp-scan-mid" aria-hidden="true">
              <div className="bp-scan-line">
                <i />
                <span className="bp-scan-plane">
                  <PlaneIcon />
                </span>
                <i />
              </div>
              <small>{pass.travelClass}</small>
            </div>

            <div className="bp-scan-port bp-scan-port--right">
              <span>{pass.destination.city}</span>
              <b>{pass.destination.code}</b>
              <small>{pass.destination.airport}</small>
            </div>
          </div>

          <div className="bp-scan-body">
            <div className="bp-scan-times">
              <div className="bp-scan-time-item">
                <span className="bp-scan-ico"><CalendarIcon /></span>
                <div>
                  <span>Departure Date</span>
                  <strong>{pass.date}</strong>
                </div>
              </div>
              <div className="bp-scan-time-item">
                <span className="bp-scan-ico"><ClockIcon /></span>
                <div>
                  <span>Departure Time</span>
                  <strong>{pass.time}</strong>
                </div>
              </div>
              <div>
                <span>Airline</span>
                <strong>{pass.airline}</strong>
              </div>
              <div>
                <span>{pass.docLabel}</span>
                <strong>{pass.docValue}</strong>
              </div>
            </div>

            <div className="bp-scan-passenger">
              <div>
                <span>Passenger Name</span>
                <strong>{pass.passenger}</strong>
              </div>
            </div>

            <div className="bp-scan-meta">
              <div>
                <span>PNR</span>
                <strong>{pass.pnr}</strong>
              </div>
              <div>
                <span>Flight</span>
                <strong>{pass.flightNumber}</strong>
              </div>
              <div>
                <span>Gate</span>
                <strong>{getGate(pass.flightNumber)}</strong>
              </div>
              <div>
                <span>Seat</span>
                <strong>{pass.seat}</strong>
              </div>
              <div>
                <span>Class</span>
                <strong>{pass.travelClass}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong className="bp-scan-cap">{pass.status}</strong>
              </div>
            </div>

            <div className="bp-scan-qr-row">
              <BoardingBarcode
                booking={pass}
                token={token}
                boxClassName="bp-scan-qr-box"
                imgClassName="bp-scan-qr"
              />
            </div>

            <div className={`bp-scan-ready ${pass.status}`}>
              <span className="bp-scan-ready-icon" aria-hidden="true">
                {isCancelled ? <AlertIcon /> : <CheckIcon />}
              </span>
              <div>
                <strong>{readyTitle}</strong>
                <small>{readySub}</small>
              </div>
            </div>
          </div>
        </section>

        <div className="bp-scan-actions">
          <button
            type="button"
            className="bp-scan-btn primary"
            onClick={() => downloadPassText(pass)}
          >
            <DownloadIcon />
            Download Pass
          </button>
          <button
            type="button"
            className="bp-scan-btn"
            onClick={() => window.print()}
          >
            <PrintIcon />
            Print Pass
          </button>
        </div>

        <p className="bp-scan-tagline">FLY SMART · FLY SKYFLOW</p>
      </div>
    </main>
  );
}
