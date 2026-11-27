import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAirports,
  getAirportsSync,
} from '../../../services/flightApi';
import heroImage from '../../../assets/Hero.png';
import './LandingStyles/hero.css';

const tripTypes = [
  { value: 'oneWay', label: 'One Way' },
  { value: 'roundTrip', label: 'Round Trip' },
  { value: 'multiCity', label: 'Multi City' },
];

const travelClasses = ['Economy', 'Premium Economy', 'Business', 'First Class'];

const dateFromToday = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
};

const formatAirport = (airport) =>
  `${airport.city}, ${airport.country} (${airport.iata})`;

function AirportField({
  id,
  label,
  value,
  isOpen,
  suggestions,
  onFocus,
  onChange,
  onSelect,
}) {
  return (
    <div className="flight-field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="search"
        className="field-control"
        placeholder="City or airport"
        autoComplete="off"
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        aria-expanded={isOpen}
        aria-controls={`${id}Dropdown`}
      />
      <div
        id={`${id}Dropdown`}
        className={`autocomplete-dropdown ${isOpen ? 'show' : ''}`}
        role="listbox"
      >
        {isOpen &&
          suggestions.map((airport) => (
            <button
              className="autocomplete-option"
              type="button"
              role="option"
              aria-selected={value === formatAirport(airport)}
              key={airport.iata}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(airport)}
            >
              <span className="autocomplete-option-badge">{airport.iata}</span>
              <span className="autocomplete-option-info">
                <span className="autocomplete-option-city">{airport.city}</span>
                <span className="autocomplete-option-airport">{airport.name}</span>
              </span>
            </button>
          ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const [airports, setAirports] = useState(() => getAirportsSync());
  const [tripType, setTripType] = useState('oneWay');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeAirport, setActiveAirport] = useState(null);
  const [departureDate, setDepartureDate] = useState(() => dateFromToday(1));
  const [returnDate, setReturnDate] = useState(() => dateFromToday(2));
  const [travellersClass, setTravellersClass] = useState('Economy');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [resultsMessage, setResultsMessage] = useState(
    'Please enter origin or destination city.',
  );

  useEffect(() => {
    let isMounted = true;
    getAirports().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setAirports(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const query = activeAirport === 'from' ? from : to;
  const airportSuggestions = activeAirport
    ? airports
        .filter((airport) => {
          const searchText = (
            `${airport.city} ${airport.name} ` +
            `${airport.iata} ${airport.country}`
          ).toLowerCase();
          return searchText.includes(query.trim().toLowerCase());
        })
        .slice(0, 6)
    : [];

  const handleAirportChange = (field, value) => {
    if (field === 'from') setFrom(value);
    else setTo(value);
    setResultsMessage('');
  };

  const handleAirportSelect = (field, airport) => {
    const value = formatAirport(airport);
    if (field === 'from') setFrom(value);
    else setTo(value);
    setActiveAirport(null);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setActiveAirport(null);
    setIsClassDropdownOpen(false);

    if (!from.trim() || !to.trim()) {
      setResultsMessage('Please enter origin or destination city.');
      return;
    }

    setResultsMessage('');
    navigate('/flights', {
      state: {
        search: {
          tripType:
            tripType === 'oneWay'
              ? 'One Way'
              : tripType === 'roundTrip'
                ? 'Round Trip'
                : 'Multi City',
          from,
          to,
          departureDate,
          returnDate: tripType === 'oneWay' ? null : returnDate,
          travellers: 1,
          cabinClass: travellersClass,
          fareType: event.currentTarget.elements.fareType.value,
          nonStop: event.currentTarget.elements.nonStop.checked,
        },
      },
    });
  };

  return (
    <section
      className="hero-section"
      id="hero"
      style={{ '--hero-image': `url("${heroImage}")` }}
    >
      <div className="hero-content">
        <p className="hero-eyebrow">Fly Beyond Boundaries</p>
        <h1 className="hero-title" aria-label="WHERE ADVENTURES TAKE FLIGHT">
          WHERE
          <span className="animated-text-wrapper" aria-hidden="true">
            <span className="animated-text hero-title-accent">JOURNEYS</span>
            <span className="animated-text hero-title-accent delay">ADVENTURES</span>
          </span>
          TAKE FLIGHT
        </h1>
        <p className="hero-copy">
          Discover seamless travel experiences, curated for comfort,
          speed, and style.
        </p>

        <form className="search-card" onSubmit={handleSearch}>
          <fieldset className="trip-type">
            <legend className="sr-only">Trip type</legend>
            {tripTypes.map((trip) => (
              <label className="trip-label" key={trip.value}>
                <input
                  type="radio"
                  name="tripType"
                  value={trip.value}
                  checked={tripType === trip.value}
                  onChange={() => setTripType(trip.value)}
                />
                <span className="radio-dot" />
                {trip.label}
              </label>
            ))}
          </fieldset>

          <div className="fields-wrapper">
            <div className="fields-row">
              <AirportField
                id="departureFrom"
                label="Departure From"
                value={from}
                isOpen={activeAirport === 'from'}
                suggestions={airportSuggestions}
                onFocus={() => setActiveAirport('from')}
                onChange={(event) =>
                  handleAirportChange('from', event.target.value)
                }
                onSelect={(airport) => handleAirportSelect('from', airport)}
              />
              <button
                className="swap-btn"
                type="button"
                aria-label="Swap departure and destination"
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
              >
                &#8644;
              </button>
              <AirportField
                id="goingTo"
                label="Going To"
                value={to}
                isOpen={activeAirport === 'to'}
                suggestions={airportSuggestions}
                onFocus={() => setActiveAirport('to')}
                onChange={(event) => handleAirportChange('to', event.target.value)}
                onSelect={(airport) => handleAirportSelect('to', airport)}
              />

              <div className="flight-field">
                <label className="field-label" htmlFor="departureDate">
                  Departure Date
                </label>
                <input
                  id="departureDate"
                  type="date"
                  className="field-control"
                  value={departureDate}
                  onChange={(event) => setDepartureDate(event.target.value)}
                />
              </div>
              <div className="flight-field">
                <label className="field-label" htmlFor="returnDate">
                  Return Date
                </label>
                <input
                  id="returnDate"
                  type="date"
                  className="field-control"
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
                />
              </div>
              <div className="flight-field">
                <label className="field-label" htmlFor="travellersClass">
                  Travellers &amp; Class
                </label>
                <input
                  id="travellersClass"
                  type="text"
                  className="field-control"
                  value={travellersClass}
                  readOnly
                  placeholder="Select Class"
                  autoComplete="off"
                  onClick={() => setIsClassDropdownOpen((open) => !open)}
                  aria-expanded={isClassDropdownOpen}
                  aria-controls="travellersClassDropdown"
                />
                <div
                  id="travellersClassDropdown"
                  className={`autocomplete-dropdown ${
                    isClassDropdownOpen ? 'show' : ''
                  }`}
                  role="listbox"
                >
                  {isClassDropdownOpen &&
                    travelClasses.map((travelClass) => (
                      <button
                        className="autocomplete-option"
                        type="button"
                        role="option"
                        aria-selected={travellersClass === travelClass}
                        key={travelClass}
                        onClick={() => {
                          setTravellersClass(travelClass);
                          setIsClassDropdownOpen(false);
                        }}
                      >
                        <span className="autocomplete-option-info">
                          <span className="autocomplete-option-city">
                            {travelClass}
                          </span>
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <button className="search-btn" type="submit">
              Search
            </button>
          </div>

          <p className="results-msg" aria-live="polite">
            {resultsMessage}
          </p>

          <div className="fares-row">
            <div className="fare-options">
              <label className="fare-label">
                <input type="radio" name="fareType" value="regular" defaultChecked />
                <span className="fare-title">Regular</span>
                <span className="fare-desc">Regular Fares</span>
              </label>
              <label className="fare-label">
                <input type="radio" name="fareType" value="student" />
                <span className="fare-title">Student</span>
                <span className="fare-desc">Extra Baggage</span>
              </label>
              <label className="fare-label">
                <input type="radio" name="fareType" value="armed" />
                <span className="fare-title">Armed Forces</span>
                <span className="fare-desc">Extra Discount</span>
              </label>
              <label className="fare-label">
                <input type="radio" name="fareType" value="senior" />
                <span className="fare-title">Senior Citizen</span>
                <span className="fare-desc">Extra Discount</span>
              </label>
            </div>
            <label className="nonstop-label">
              <input type="checkbox" name="nonStop" />
              <span className="custom-checkbox" />
              <span className="nonstop-text-wrapper">
                <span className="nonstop-title">Non-Stop</span>
                <span className="fare-desc">Direct Flights</span>
              </span>
            </label>
          </div>
        </form>
      </div>
    </section>
  );
}
