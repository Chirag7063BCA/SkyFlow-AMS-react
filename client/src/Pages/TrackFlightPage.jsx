import { useEffect, useState } from 'react';
import flightsData from '../dummydata/flights.json';
import FlightStatusCard from '../components/LocalComp/TrackFlightComp/FlightStatusCard';
import LiveFlightTracker from '../components/LocalComp/TrackFlightComp/LiveFlightTracker';
import {
  evaluateAirborneFlight,
  scanAirborneFlights,
} from '../components/LocalComp/TrackFlightComp/flightScanner';
import '../components/LocalComp/TrackFlightComp/TrackFlight.css';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Pick 10 flights currently in the air (preferring different routes first)
function pickTenAirborneFlights(airborneList) {
  const picked = [];
  const addedRoutes = [];
  const addedFlightNumbers = [];

  for (let i = 0; i < airborneList.length; i += 1) {
    const flight = airborneList[i];
    const route = `${flight.fromAirportCode}-${flight.toAirportCode}`;
    if (!addedRoutes.includes(route)) {
      addedRoutes.push(route);
      addedFlightNumbers.push(flight.flightNumber);
      picked.push(flight);
      if (picked.length === 10) return picked;
    }
  }

  for (let i = 0; i < airborneList.length; i += 1) {
    const flight = airborneList[i];
    if (!addedFlightNumbers.includes(flight.flightNumber)) {
      addedFlightNumbers.push(flight.flightNumber);
      picked.push(flight);
      if (picked.length === 10) return picked;
    }
  }

  return picked;
}

export default function TrackFlightPage({ flights = flightsData } = {}) {
  // Note current time on page load and keep updating every 5 seconds
  const [liveNow, setLiveNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Scan all flights that are in the sky right now
  const airborneFlights = scanAirborneFlights(flights, liveNow);
  const tenAirborneFlights = pickTenAirborneFlights(airborneFlights);

  // Search form states
  const [flightNumber, setFlightNumber] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [resultMessage, setResultMessage] = useState(
    tenAirborneFlights.length > 0
      ? `Scanned at ${formatTime(liveNow)}: ${airborneFlights.length} flights currently in the sky — showing 10 live flights.`
      : `Scanned at ${formatTime(liveNow)}: no flights currently airborne.`,
  );
  const [selectedFlight, setSelectedFlight] = useState(
    tenAirborneFlights[0] || null,
  );

  // Re-check current clock and refresh the 10 airborne flights list
  const handleRescanSky = () => {
    const now = new Date();
    const currentAirborne = scanAirborneFlights(flights, now);
    const topTen = pickTenAirborneFlights(currentAirborne);

    setLiveNow(now);
    setSearchResults(null);

    if (topTen.length > 0) {
      const first = topTen[0];
      setSelectedFlight(first);
      setFlightNumber(first.flightNumber);
      setFromCity(`${first.originCity} (${first.fromAirportCode})`);
      setToCity(`${first.destinationCity} (${first.toAirportCode})`);
      setResultMessage(
        `Scanned at ${formatTime(now)}: ${currentAirborne.length} flights in the sky now — tracking ${first.flightNumber}.`,
      );
    } else {
      setSelectedFlight(null);
      setResultMessage(
        `Scanned at ${formatTime(now)}: no flights currently airborne at this minute.`,
      );
    }
  };

  // Track the clicked flight card in the live map & telemetry panel
  const selectFlightToTrack = (flight) => {
    const updatedFlight = evaluateAirborneFlight(flight, liveNow);
    setSelectedFlight(updatedFlight);
    setFlightNumber(updatedFlight.flightNumber);
    setFromCity(`${updatedFlight.originCity} (${updatedFlight.fromAirportCode})`);
    setToCity(`${updatedFlight.destinationCity} (${updatedFlight.toAirportCode})`);
    setResultMessage(
      updatedFlight.isAirborne
        ? `Tracking live airborne flight ${updatedFlight.flightNumber} (${updatedFlight.airline}) — ${Math.round(updatedFlight.airborneProgress * 100)}% complete (${updatedFlight.minutesRemaining}m left).`
        : `${updatedFlight.flightNumber} is not currently in the air at ${formatTime(liveNow)}.`,
    );

    const panel = document.getElementById('live-tracker-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter active airborne flights from search inputs
  const handleSearch = (event) => {
    event.preventDefault();

    const now = new Date();
    setLiveNow(now);
    const currentAirborne = scanAirborneFlights(flights, now);

    const numberQuery = flightNumber.trim().toUpperCase();
    const fromQuery = fromCity.trim().toLowerCase();
    const toQuery = toCity.trim().toLowerCase();

    if (!numberQuery && !fromQuery && !toQuery) {
      setResultMessage(
        'Please enter a flight number or departure/arrival city to track.',
      );
      setSearchResults(null);
      return;
    }

    const matches = currentAirborne.filter((flight) => {
      const originText = `${flight.originCity} (${flight.fromAirportCode})`.toLowerCase();
      const destText = `${flight.destinationCity} (${flight.toAirportCode})`.toLowerCase();

      const numberMatches = numberQuery
        ? flight.flightNumber.toUpperCase().includes(numberQuery)
        : true;
      const fromMatches = fromQuery ? originText.includes(fromQuery) : true;
      const toMatches = toQuery ? destText.includes(toQuery) : true;

      return numberMatches && fromMatches && toMatches;
    });

    if (matches.length === 0) {
      setResultMessage(
        `No flight matching your search is currently in the air at ${formatTime(now)}. Select any of the live airborne flights below.`,
      );
      setSearchResults([]);
      return;
    }

    const topMatches = matches.slice(0, 10);
    setResultMessage(
      `Found ${matches.length} airborne flight${matches.length > 1 ? 's' : ''} in the sky at ${formatTime(now)}.`,
    );
    setSearchResults(topMatches);
    setSelectedFlight(topMatches[0]);

    const section = document.getElementById('flight-status-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const quickPickFlights = tenAirborneFlights.slice(0, 4);

  return (
    <div className="track-page">
      <section className="hero-section track-hero">
        <div className="hero-content track-hero-content">
          <p className="hero-eyebrow">Live Flight Tracker</p>
          <h1 className="hero-title">
            KEEP YOUR
            <span className="animated-text-wrapper">
              <span className="animated-text hero-title-accent">TRIP</span>
              <span className="animated-text hero-title-accent delay">FLIGHT</span>
            </span>
            ON TRACK
          </h1>
          <p className="hero-copy">
            Real-time airborne flight scanner checks the current clock, finds
            flights in the sky right now, and maps live journey completion.
          </p>

          <form className="search-card" onSubmit={handleSearch}>
            <div className="keyword-field">
              <label className="field-label" htmlFor="trackFlightNumber">
                Flight Number
              </label>
              <input
                id="trackFlightNumber"
                type="text"
                className="keyword-input"
                placeholder="Search airborne flight e.g. EK-712 or AI-212"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
              />
            </div>

            <div className="fields-wrapper">
              <div className="fields-row">
                <div className="flight-field">
                  <label className="field-label" htmlFor="trackFrom">
                    Departure city / airport
                  </label>
                  <input
                    id="trackFrom"
                    type="text"
                    className="field-control"
                    placeholder="e.g. DEL or New Delhi"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                  />
                </div>
                <div className="flight-field">
                  <label className="field-label" htmlFor="trackTo">
                    Arrival city / airport
                  </label>
                  <input
                    id="trackTo"
                    type="text"
                    className="field-control"
                    placeholder="e.g. BOM or Mumbai"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                  />
                </div>
                <div className="flight-field">
                  <label className="field-label" htmlFor="trackDate">
                    Date (optional)
                  </label>
                  <input
                    id="trackDate"
                    type="date"
                    className="field-control"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                </div>
              </div>
              <button id="trackBtn" type="submit" className="search-btn">
                Track Flight
              </button>
            </div>

            <div className="search-footer-row">
              <div className="quick-picks">
                <span className="quick-picks-label">In sky now:</span>
                {quickPickFlights.map((flight) => (
                  <button
                    key={flight.flightNumber}
                    type="button"
                    className="quick-pick-btn"
                    onClick={() => selectFlightToTrack(flight)}
                  >
                    {flight.flightNumber} ({flight.fromAirportCode} &rarr;{' '}
                    {flight.toAirportCode})
                  </button>
                ))}
              </div>
              {resultMessage && (
                <p id="trackResult" className="results-msg" aria-live="polite">
                  {resultMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      <section id="flight-status-section" className="track-section">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">
              Live Sky Scan &middot; {formatTime(liveNow)}
            </p>
            <h2 className="section-title">
              Flights In The Air Now ({tenAirborneFlights.length})
            </h2>
          </div>
          <div className="section-header-actions">
            <p className="section-note">
              Found {airborneFlights.length} flights airborne at{' '}
              {formatTime(liveNow)}. Showing 10 live flights—click{' '}
              <strong>Track Live</strong> on any card to view real-time progress.
            </p>
            <button
              type="button"
              className="rescan-sky-btn"
              onClick={handleRescanSky}
            >
              Rescan Live Sky
            </button>
          </div>
        </div>

        <LiveFlightTracker
          flight={selectedFlight}
          liveNow={liveNow}
          onClear={() => setSelectedFlight(null)}
        />

        {Array.isArray(searchResults) && searchResults.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="flights-grid">
              {searchResults.map((flight) => (
                <FlightStatusCard
                  key={`search-${flight.flightNumber}`}
                  flight={flight}
                  isSelected={selectedFlight?.flightNumber === flight.flightNumber}
                  onSelect={selectFlightToTrack}
                />
              ))}
            </div>
          </div>
        )}

        <div id="statusGrid" className="flights-grid">
          {tenAirborneFlights.map((flight) => (
            <FlightStatusCard
              key={flight.flightNumber}
              flight={flight}
              isSelected={selectedFlight?.flightNumber === flight.flightNumber}
              onSelect={selectFlightToTrack}
            />
          ))}
        </div>
      </section>

      <section className="track-section track-section-tinted">
        <div className="track-section-inner">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Why SkyFlow</p>
              <h2 className="section-title">Track flights with confidence</h2>
            </div>
            <p className="section-note">
              Built for passengers, pickup coordinators, and operations teams.
            </p>
          </div>

          <div className="feature-grid-4">
            <article className="feature-card dark-feature-card">
              <div className="feature-card-top">
                <div className="feature-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <span className="feature-tag">Live Sync</span>
              </div>
              <h3>Real-time flight updates</h3>
              <p>
                Live airborne completion and arrival ETAs calculated directly
                from current time and active flight schedules.
              </p>
            </article>

            <article className="feature-card dark-feature-card">
              <div className="feature-card-top">
                <div className="feature-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <span className="feature-tag">Instant</span>
              </div>
              <h3>Instant route lookup</h3>
              <p>
                Search by flight number, city name, or IATA airport code across
                active flights in the sky.
              </p>
            </article>

            <article className="feature-card dark-feature-card">
              <div className="feature-card-top">
                <div className="feature-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="feature-tag">Gate Map</span>
              </div>
              <h3>Gate &amp; terminal clarity</h3>
              <p>
                View departure gates, arrival terminals, and baggage carousel
                assignments at a glance.
              </p>
            </article>

            <article className="feature-card dark-feature-card">
              <div className="feature-card-top">
                <div className="feature-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span className="feature-tag">On Time</span>
              </div>
              <h3>Schedule readiness</h3>
              <p>
                Track remaining flight minutes and weather delays early so
                transfers and pickups run smoothly.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="track-section">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Travel Essentials</p>
            <h2 className="section-title">Plan ahead with our tips</h2>
          </div>
          <p className="section-note">
            Clear guidance to help you arrive on time and adapt smoothly to
            schedule changes.
          </p>
        </div>

        <div className="feature-grid-3">
          <article className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="feature-tag">Tip 01</span>
            </div>
            <h3>Track before you leave</h3>
            <p>
              Verify your flight status and terminal before heading to the
              airport to avoid unexpected waits.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span className="feature-tag">Tip 02</span>
            </div>
            <h3>Confirm boarding windows</h3>
            <p>
              Gates typically close 20 minutes prior to departure—monitor live
              airborne and arrival updates closely.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-card-top">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="feature-tag">Tip 03</span>
            </div>
            <h3>Coordinate pickups</h3>
            <p>
              Check the estimated arrival time and baggage belt assignment
              before meeting arriving passengers.
            </p>
          </article>
        </div>
      </section>

      <section className="track-section" style={{ paddingTop: '0.5rem' }}>
        <div className="info-card">
          <div>
            <p className="section-eyebrow">Need Help?</p>
            <h2 className="section-title">Flight tracking made simple</h2>
            <p className="hero-copy">
              Every time you open Track Flight, SkyFlow checks the current time,
              lists 10 flights currently in the sky, and tracks real airborne
              completion from departure to landing.
            </p>
          </div>
          <ul className="help-list">
            <li>Open or click Rescan Live Sky to detect 10 flights in the air now.</li>
            <li>Click Track Live on any card to inspect its real-time map position.</li>
            <li>Solid blue line marks distance covered; dotted line marks remaining route.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
