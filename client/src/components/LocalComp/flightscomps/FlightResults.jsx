import { useCallback, useEffect, useMemo, useState } from 'react';
import logo from '../../../assets/navbar logo.gif';
import winterEscapeOffer from '../../../assets/highlights/winter_escape_offer.jpg';
import luxuryHotelOffer from '../../../assets/highlights/luxury_hotel_offer.jpg';
import loungeAccessOffer from '../../../assets/highlights/lounge_access_offer.jpg';
import carRentalOffer from '../../../assets/highlights/car_rental_offer.jpg';
import FlightBP from './FlightBookingProcessComp/FlightBP';
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

const spotlightSlots = [
  {
    id: 'flight-deals',
    label: 'Flight and lounge promotions',
    intervalMs: 2000,
    slides: [
      {
        id: 'winter-escape',
        image: winterEscapeOffer,
        alt: 'Snow-capped alpine resort and aircraft wing at golden hour',
        badge: 'Sponsored · Flight Deal',
        title: 'Winter Escape — Up to 35% Off',
        description:
          'Save on seasonal alpine and international routes booked with SkyFlow.',
        cta: 'Limited Offer',
      },
      {
        id: 'lounge-card',
        image: loungeAccessOffer,
        alt: 'Executive airport VIP lounge overlooking aircraft on the tarmac',
        badge: 'Sponsored · Travel Perks',
        title: 'SkyFlow Priority Lounge Access',
        description:
          'Unlock complimentary airport lounge passes and fast-track boarding.',
        cta: 'Member Perk',
      },
    ],
  },
  {
    id: 'travel-partners',
    label: 'Partner hotel and car rental offers',
    intervalMs: 2000,
    slides: [
      {
        id: 'luxury-hotel',
        image: luxuryHotelOffer,
        alt: 'Twilight infinity pool at an oceanfront luxury resort',
        badge: 'Sponsored · Hotel Partner',
        title: 'Oceanfront Stays — Save 20%',
        description:
          'Bundle curated coastal resorts with your flight for exclusive rates.',
        cta: 'Partner Deal',
      },
      {
        id: 'car-rental',
        image: carRentalOffer,
        alt: 'Convertible sedan driving along a Mediterranean cliffside highway',
        badge: 'Sponsored · Car Rental',
        title: 'Zero-Fee Airport Car Pickups',
        description:
          'Drive straight from arrivals with flexible mileage and instant booking.',
        cta: 'Partner Offer',
      },
    ],
  },
];

function SpotlightCarousel({ slides, intervalMs, label }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs, isPaused]);

  return (
    <section
      className="flight-spotlight-card"
      aria-label={label}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="flight-spotlight-carousel">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              className={`flight-spotlight-slide ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="flight-spotlight-image"
              />
              <div className="flight-spotlight-overlay">
                <span className="flight-spotlight-badge">{slide.badge}</span>
                <div className="flight-spotlight-body">
                  <h4>{slide.title}</h4>
                  <p>{slide.description}</p>
                </div>
                <span className="flight-spotlight-cta">{slide.cta}</span>
              </div>
            </div>
          );
        })}

        {slides.length > 1 && (
          <div
            className="flight-spotlight-dots"
            role="tablist"
            aria-label={`${label} slides`}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Show ${slide.title}`}
                className={`flight-spotlight-dot ${
                  index === activeIndex ? 'is-active' : ''
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const parseFare = (fare) => {
  if (typeof fare === 'number') return fare;
  return Number.parseInt(String(fare || '').replace(/[^0-9]/g, ''), 10) || 0;
};

const getStopCount = (flight) => (flight.nonStop ? 0 : 1);

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

function FlightCard({ flight, index, currency, search }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const closeBooking = useCallback(() => setIsBookingOpen(false), []);
  const statusClass = String(flight.status || '')
    .toLowerCase()
    .replace(/\s+/g, '-');
  const stopCount = getStopCount(flight);
  const stopLabel =
    stopCount === 0
      ? 'Non-stop'
      : `${stopCount} ${stopCount === 1 ? 'stop' : 'stops'}`;
  const travellerCount = Math.max(
    1,
    Math.floor(Number(search?.travellers) || 1),
  );
  const formattedPrice = formatPrice(parseFare(flight.fare), currency);

  return (
    <>
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
          {flight.status && (
            <span className={`pill ${statusClass}`}>{flight.status}</span>
          )}
          <span className="card-price">{formattedPrice}</span>
          <button
            className="flight-book-button"
            type="button"
            onClick={() => setIsBookingOpen(true)}
          >
            Book flight
          </button>
        </div>
      </article>
      {isBookingOpen && (
        <FlightBP
          flight={flight}
          departureDate={search?.departureDate}
          travellerCount={travellerCount}
          priceLabel={formattedPrice}
          fareAmount={parseFare(flight.fare)}
          formatFare={(amount) => formatPrice(amount, currency)}
          onClose={closeBooking}
        />
      )}
    </>
  );
}

export default function FlightResults({ flights = [], search, adContent = null }) {
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
      const matchesNonStop =
        !search.nonStop || flight.nonStop === true || stopCount === 0;
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
        matchesNonStop &&
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
      ? `${matchingFlights.length} match${
          matchingFlights.length === 1 ? '' : 'es'
        } found.`
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
                    key={
                      flight.id ||
                      flight.flightNumber ||
                      `${flight.airline}-${index}`
                    }
                    flight={flight}
                    index={index}
                    currency={currency}
                    search={search}
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

            {!hasSearch && (
              <div
                className="flight-spotlight-stack"
                aria-label="Featured promotions and partner offers"
              >
                {adContent ??
                  spotlightSlots.map((slot) => (
                    <SpotlightCarousel
                      key={slot.id}
                      slides={slot.slides}
                      intervalMs={slot.intervalMs}
                      label={slot.label}
                    />
                  ))}
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
                    <p className="filter-empty">
                      Airline filters will appear when flight data is available.
                    </p>
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
