import FlightRouteMap from './FlightRouteMap';
import { evaluateAirborneFlight } from './flightScanner';

const TERMINALS = ['T1', 'T2', 'T3'];
const GATES = ['A04', 'A12', 'B08', 'B15', 'C03', 'C11', 'D06'];
const BELTS = ['Belt 02', 'Belt 04', 'Belt 07', 'Belt 09'];

// Pick a consistent terminal, gate, and baggage belt from the flight number
function getGateAndTerminal(flightNumber) {
  const digitsOnly = String(flightNumber || '').replace(/[^0-9]/g, '');
  const number = parseInt(digitsOnly, 10) || 1;

  return {
    depTerminal: TERMINALS[number % TERMINALS.length],
    arrTerminal: TERMINALS[(number + 1) % TERMINALS.length],
    gate: GATES[number % GATES.length],
    belt: BELTS[number % BELTS.length],
  };
}

export default function LiveFlightTracker({ flight, liveNow, onClear }) {
  if (!flight) return null;

  const liveFlight = evaluateAirborneFlight(flight, liveNow);
  const { depTerminal, arrTerminal, gate, belt } = getGateAndTerminal(
    liveFlight.flightNumber,
  );

  const progress = liveFlight.isAirborne
    ? Math.round(liveFlight.airborneProgress * 100)
    : 0;

  const phaseText = liveFlight.isAirborne
    ? `In the Sky · ${liveFlight.minutesRemaining}m left`
    : 'Scheduled / Not Airborne';

  const advisoryText = liveFlight.isAirborne
    ? `Currently airborne (${progress}% complete) en route to ${liveFlight.destinationCity} (${liveFlight.toAirportCode}), landing around ${liveFlight.arrivalTime}.`
    : `Flight ${liveFlight.flightNumber} is not currently airborne at this time.`;

  const statusClass = String(liveFlight.status || '')
    .toLowerCase()
    .replace(/\s+/g, '-');

  return (
    <div id="live-tracker-panel" className="tracker-panel">
      <div className="tracker-panel-top">
        <div className="tracker-identity">
          <span className="live-indicator">
            <span className="live-dot" aria-hidden="true"></span>
            {liveFlight.isAirborne ? 'AIRBORNE TELEMETRY' : 'FLIGHT TELEMETRY'}
          </span>
          <h3>
            {liveFlight.flightNumber} &middot; {liveFlight.airline}
          </h3>
          <span className={`pill ${statusClass}`}>{liveFlight.status}</span>
        </div>

        {onClear && (
          <button
            type="button"
            className="tracker-close-btn"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>

      {/* Left 50%: Live Google Map | Right 50%: Flight Details */}
      <div className="tracker-split-body">
        <div className="tracker-left-map">
          <FlightRouteMap flight={liveFlight} liveNow={liveNow} />
        </div>

        <div className="tracker-right-details">
          <div className="details-route-header">
            <div className="details-endpoint">
              <span className="endpoint-code">{liveFlight.fromAirportCode}</span>
              <strong className="endpoint-city">{liveFlight.originCity}</strong>
              <span className="endpoint-time">
                Departs {liveFlight.departureTime}
              </span>
            </div>

            <div className="details-progress-center">
              <span className="tracker-phase-label">{phaseText}</span>
              <div className="tracker-progress-track">
                <div
                  className="tracker-progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
                <span
                  className="tracker-plane-marker"
                  style={{ left: `${progress}%` }}
                  aria-hidden="true"
                >
                  ✈
                </span>
              </div>
              <span className="tracker-duration-label">
                {liveFlight.duration} &middot;{' '}
                {liveFlight.nonStop ? 'Non-stop' : '1 stop'}
              </span>
            </div>

            <div className="details-endpoint details-endpoint-right">
              <span className="endpoint-code">{liveFlight.toAirportCode}</span>
              <strong className="endpoint-city">
                {liveFlight.destinationCity}
              </strong>
              <span className="endpoint-time">
                Arrives {liveFlight.arrivalTime}
              </span>
            </div>
          </div>

          <div className="details-grid-2x2">
            <div className="detail-box">
              <span className="detail-label">Departure Terminal &amp; Gate</span>
              <strong className="detail-value">
                {depTerminal} &middot; Gate {gate}
              </strong>
            </div>

            <div className="detail-box">
              <span className="detail-label">Arrival Terminal &amp; Belt</span>
              <strong className="detail-value">
                {arrTerminal} &middot; {belt}
              </strong>
            </div>

            <div className="detail-box">
              <span className="detail-label">Flight Schedule</span>
              <strong className="detail-value">
                {liveFlight.departureTime} &rarr; {liveFlight.arrivalTime}
              </strong>
            </div>

            <div className="detail-box">
              <span className="detail-label">Duration &amp; Route</span>
              <strong className="detail-value">
                {liveFlight.duration} &middot;{' '}
                {liveFlight.nonStop ? 'Non-stop' : '1 stop'}
              </strong>
            </div>
          </div>

          <div className="details-advisory">
            <div className="advisory-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <span className="advisory-label">Live Operational Advisory</span>
              <p className="advisory-text">{advisoryText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}