import { useMemo, useState } from 'react';
import logo from '../../../assets/navbar logo.gif';
import './FlightsStyles/FlightResults.css';

const currencies = {
  USD: { symbol: '$', rate: 1, label: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, label: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, label: 'British Pound' },
  INR: { symbol: '₹', rate: 83.5, label: 'Indian Rupee' },
  AED: { symbol: 'AED ', rate: 3.67, label: 'UAE Dirham' },
  JPY: { symbol: '¥', rate: 155, label: 'Japanese Yen' },
};

const stopOptions = [
  { value: '0', label: 'Non-Stop' },
  { value: '1', label: '1 Stop' },
  { value: '2', label: '2+ Stops' },
];

const parseFare = (fare) => {
  if (typeof fare === 'number') return fare;
  return Number.parseInt(String(fare || '').replace(/[^0-9]/g, ''), 10) || 0;
};

const getStopCount = (flight) => {
  const stops = Number(flight.stops);
  if (Number.isFinite(stops)) return stops;
  return flight.nonStop ? 0 : 1;
};

const locationMatches = (city, code, input) => {
  const query = input.trim().toLowerCase();
  if (!query) return true;

  const codeMatch = query.match(/\(([^)]+)\)/)?.[1];
  const cityQuery = query.split(',')[0].replace(/\([^)]*\)/, '').trim();
  const cityValue = String(city || '').toLowerCase();
  const codeValue = String(code || '').toLowerCase();

  return (
    cityValue.includes(query) ||
    (cityQuery && cityValue.includes(cityQuery)) ||
    codeValue.includes(query) ||
    (codeMatch ? codeValue === codeMatch.toLowerCase() : false)
  );
};

const formatPrice = (amount, currency) =>
  `${currency.symbol}${Math.round(amount * currency.rate).toLocaleString()}`;

function FlightCard({ flight, index, currency }) {
  const statusClass = String(flight.status || '')
    .toLowerCase()
    .replace(/\s+/g, '-');
  const stopCount = getStopCount(flight);
  const stopLabel =
    stopCount === 0 ? 'Non-stop' : `${stopCount} ${stopCount === 1 ? 'stop' : 'stops'}`;

  return (
    <article
      className="flight-card"
      style={{ animationDelay: `${Math.min(index, 8) * 0.03}s` }}
    >
      <div className="card-top">
        <div>
          <p className="card-airline">
            {flight.flightNumber} · {flight.airline}
          </p>
          <h3 className="card-route">
            {flight.originCity} → {flight.destinationCity}
          </h3>
        </div>
        <div className="card-time">
          <strong>
            {flight.departureTime} – {flight.arrivalTime}
          </strong>
          <span>{flight.duration}</span>
        </div>
      </div>
      <div className="card-meta">
        <span className="pill">
          {flight.fromAirportCode} → {flight.toAirportCode}
        </span>
        <span className="pill">{stopLabel}</span>
        {flight.status && <span className={`pill ${statusClass}`}>{flight.status}</span>}
        <span className="card-price">{formatPrice(parseFare(flight.fare), currency)}</span>
      </div>
    </article>
  );
}

export default function FlightResults({ flights = [], search }) {
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(60);
  const currency = currencies[currencyCode];

  const airlines = useMemo(
    () =>
      [...new Set(flights.map((flight) => flight.airline).filter(Boolean))].sort(),
    [flights],
  );

  const hasSearch = Boolean(search?.from?.trim() || search?.to?.trim());
  const matchingFlights = useMemo(() => {
    if (!hasSearch) return [];

    return flights.filter((flight) => {
      const fare = parseFare(flight.fare);
      const stopCount = getStopCount(flight);
      const matchesFrom = locationMatches(
        flight.originCity,
        flight.fromAirportCode,
        search.from || '',
      );
      const matchesTo = locationMatches(
        flight.destinationCity,
        flight.toAirportCode,
        search.to || '',
      );
      const matchesPrice = fare <= maxPrice;
      const matchesStops =
        selectedStops.length === 0 ||
        selectedStops.some((stop) =>
          stop === '2' ? stopCount >= 2 : stopCount === Number(stop),
        );
      const matchesAirline =
        selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);

      return (
        matchesFrom &&
        matchesTo &&
        matchesPrice &&
        matchesStops &&
        matchesAirline
      );
    });
  }, [flights, hasSearch, maxPrice, search, selectedAirlines, selectedStops]);

  const toggleOption = (setOptions, value) => {
    setOptions((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setDisplayLimit(60);
  };

  const title = !hasSearch
    ? 'Search'
    : matchingFlights.length
      ? 'Matching'
      : 'No';
  const note = !hasSearch
    ? 'Enter your travel details above to search.'
    : matchingFlights.length
      ? `${matchingFlights.length} match${matchingFlights.length === 1 ? '' : 'es'} found.`
      : 'No flights found matching your search.';
  const visibleFlights = matchingFlights.slice(0, displayLimit);
  const liveFlights = matchingFlights.filter(
    (flight) => String(flight.status || '').toLowerCase() !== 'scheduled',
  ).length;

  return (
    <section className="flights-view" id="flights">
      <div className="flights-section">
        <header className="flights-header">
          <h2 className="flights-title">
            {title} <span className="flights-title-accent">Flights</span>
          </h2>
          <p className="flights-note" aria-live="polite">
            {hasSearch ? (
              `${note}${matchingFlights.length ? ` ${liveFlights} live` : ''}`
            ) : (
              <span className="animated-note-wrapper">
                <span className="animated-note">
                  All available flights are shown below.
                </span>
                <span className="animated-note delay">
                  Discover top deals on domestic &amp; international routes.
                </span>
              </span>
            )}
          </p>
        </header>

        <div className="flights-layout">
          <div className="flights-main" aria-live="polite">
            {!hasSearch ? (
              <div className="flight-empty-state">
                <img src={logo} alt="SkyFlow Logo" />
                <h3>Search for a Flight</h3>
                <p>
                  Please enter a departure or destination city in the search
                  fields above.
                </p>
              </div>
            ) : matchingFlights.length ? (
              <div className="flights-grid">
                {visibleFlights.map((flight, index) => (
                  <FlightCard
                    key={flight.id || flight.flightNumber || `${flight.airline}-${index}`}
                    flight={flight}
                    index={index}
                    currency={currency}
                  />
                ))}
                {matchingFlights.length > displayLimit && (
                  <button
                    className="load-more-flights"
                    type="button"
                    onClick={() => setDisplayLimit((limit) => limit + 60)}
                  >
                    Load More Flights ({matchingFlights.length - displayLimit}{' '}
                    remaining)
                  </button>
                )}
              </div>
            ) : (
              <div className="flight-empty-state">
                <span className="flight-empty-state__icon" aria-hidden="true">
                  🔍
                </span>
                <h3>No Flights Found</h3>
                <p>
                  No flights match your search criteria. Try searching for
                  different cities or codes.
                </p>
              </div>
            )}
          </div>

          <aside className="flights-sidebar">
            <div className="filter-card">
              <h3 className="filter-title">Filters</h3>

              <div className="filter-group">
                <label className="filter-label" htmlFor="currencySelect">
                  Currency
                </label>
                <select
                  id="currencySelect"
                  className="filter-select"
                  value={currencyCode}
                  onChange={(event) => setCurrencyCode(event.target.value)}
                >
                  {Object.entries(currencies).map(([code, option]) => (
                    <option key={code} value={code}>
                      {code} ({option.symbol.trim()}) - {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label" htmlFor="priceRange">
                  Max Price: <span>{formatPrice(maxPrice, currency)}</span>
                </label>
                <input
                  id="priceRange"
                  className="filter-range"
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(Number(event.target.value));
                    setDisplayLimit(60);
                  }}
                />
              </div>

              <fieldset className="filter-group filter-fieldset">
                <legend className="filter-label">Stops</legend>
                <div className="checkbox-group">
                  {stopOptions.map((option) => (
                    <label className="checkbox-label" key={option.value}>
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={selectedStops.includes(option.value)}
                        onChange={() =>
                          toggleOption(setSelectedStops, option.value)
                        }
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="filter-group filter-fieldset">
                <legend className="filter-label">Airlines</legend>
                <div className="checkbox-group">
                  {airlines.length ? (
                    airlines.map((airline) => (
                      <label className="checkbox-label" key={airline}>
                        <input
                          type="checkbox"
                          checked={selectedAirlines.includes(airline)}
                          onChange={() =>
                            toggleOption(setSelectedAirlines, airline)
                          }
                        />
                        {airline}
                      </label>
                    ))
                  ) : (
                    <p className="filter-empty">Airline filters will appear when flight data is available.</p>
                  )}
                </div>
              </fieldset>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
