import { useState } from 'react';
import './LandingStyles/hero.css';

const getDateValue = (daysFromToday) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function Hero({ onSearch }) {
  const [tripType, setTripType] = useState('oneWay');
  const [departureFrom, setDepartureFrom] = useState('');
  const [goingTo, setGoingTo] = useState('');
  const [departureDate, setDepartureDate] = useState(() => getDateValue(1));
  const [returnDate, setReturnDate] = useState(() => getDateValue(7));
  const travellersClass = 'Economy';
  const [fareType, setFareType] = useState('regular');
  const [nonStop, setNonStop] = useState(false);
  const [resultsMsg, setResultsMsg] = useState('Please enter origin or destination city.');

  const handleSwap = () => {
    setDepartureFrom(goingTo);
    setGoingTo(departureFrom);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!departureFrom.trim() || !goingTo.trim()) {
      setResultsMsg('Please enter origin or destination city.');
      return;
    }
    setResultsMsg('');
    if (onSearch) {
      onSearch({
        tripType,
        departureFrom,
        goingTo,
        departureDate,
        returnDate,
        travellersClass,
        fareType,
        nonStop,
      });
    }
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Fly Beyond Boundaries</p>
        <h1 className="hero-title">
          WHERE
          <span className="animated-text-wrapper">
            <span className="animated-text hero-title-accent">JOURNEYS</span>
            <span className="animated-text hero-title-accent delay">ADVENTURES</span>
          </span>
          TAKE FLIGHT
        </h1>
        <p className="hero-copy">
          Discover seamless travel experiences, curated for comfort, speed, and style.
        </p>

        <form className="search-card" onSubmit={handleSearch}>
          <fieldset className="trip-type">
            <legend className="sr-only">Trip type</legend>
            <label className={`trip-label ${tripType === 'oneWay' ? 'active' : ''}`}>
              <input
                type="radio"
                name="tripType"
                value="oneWay"
                checked={tripType === 'oneWay'}
                onChange={() => setTripType('oneWay')}
              />
              <span className="radio-dot"></span> One Way
            </label>
            <label className={`trip-label ${tripType === 'roundTrip' ? 'active' : ''}`}>
              <input
                type="radio"
                name="tripType"
                value="roundTrip"
                checked={tripType === 'roundTrip'}
                onChange={() => setTripType('roundTrip')}
              />
              <span className="radio-dot"></span> Round Trip
            </label>
            <label className={`trip-label ${tripType === 'multiCity' ? 'active' : ''}`}>
              <input
                type="radio"
                name="tripType"
                value="multiCity"
                checked={tripType === 'multiCity'}
                onChange={() => setTripType('multiCity')}
              />
              <span className="radio-dot"></span> Multi City
            </label>
          </fieldset>

          <div className="fields-wrapper">
            <div className="fields-row">
              <div className="flight-field">
                <label className="field-label" htmlFor="departureFrom">
                  Departure From
                </label>
                <input
                  id="departureFrom"
                  type="search"
                  className="field-control"
                  placeholder="City or airport"
                  autoComplete="off"
                  value={departureFrom}
                  onChange={(e) => setDepartureFrom(e.target.value)}
                />
              </div>

              <button
                className="swap-btn"
                id="swapBtn"
                type="button"
                aria-label="Swap"
                onClick={handleSwap}
              >
                &#8644;
              </button>

              <div className="flight-field">
                <label className="field-label" htmlFor="goingTo">
                  Going To
                </label>
                <input
                  id="goingTo"
                  type="search"
                  className="field-control"
                  placeholder="City or airport"
                  autoComplete="off"
                  value={goingTo}
                  onChange={(e) => setGoingTo(e.target.value)}
                />
              </div>

              <div className="flight-field">
                <label className="field-label" htmlFor="departureDate">
                  Departure Date
                </label>
                <input
                  id="departureDate"
                  type="date"
                  className="field-control"
                  value={departureDate}
                  min={getDateValue(0)}
                  onChange={(event) => {
                    setDepartureDate(event.target.value);
                    if (returnDate < event.target.value) {
                      setReturnDate(event.target.value);
                    }
                  }}
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
                  min={departureDate}
                  disabled={tripType === 'oneWay'}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>

              <div className="flight-field">
                <label className="field-label" htmlFor="travellersClass">
                  Travellers & Class
                </label>
                <input
                  id="travellersClass"
                  type="text"
                  className="field-control"
                  value={travellersClass}
                  readOnly
                  placeholder="Select Class"
                  autoComplete="off"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            <button className="search-btn" id="searchBtn" type="submit">
              Search
            </button>
          </div>

          <p className="results-msg" id="resultsMsg" aria-live="polite">
            {resultsMsg}
          </p>

          <div className="fares-row">
            <div className="fare-options">
              <label className={`fare-label ${fareType === 'regular' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="fareType"
                  value="regular"
                  checked={fareType === 'regular'}
                  onChange={() => setFareType('regular')}
                />
                <span className="fare-title">Regular</span>
                <span className="fare-desc">Regular Fares</span>
              </label>
              <label className={`fare-label ${fareType === 'student' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="fareType"
                  value="student"
                  checked={fareType === 'student'}
                  onChange={() => setFareType('student')}
                />
                <span className="fare-title">Student</span>
                <span className="fare-desc">Extra Baggage</span>
              </label>
              <label className={`fare-label ${fareType === 'armed' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="fareType"
                  value="armed"
                  checked={fareType === 'armed'}
                  onChange={() => setFareType('armed')}
                />
                <span className="fare-title">Armed Forces</span>
                <span className="fare-desc">Extra Discount</span>
              </label>
              <label className={`fare-label ${fareType === 'senior' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="fareType"
                  value="senior"
                  checked={fareType === 'senior'}
                  onChange={() => setFareType('senior')}
                />
                <span className="fare-title">Senior Citizen</span>
                <span className="fare-desc">Extra Discount</span>
              </label>
            </div>

            <label className="nonstop-label">
              <input
                type="checkbox"
                id="nonStop"
                checked={nonStop}
                onChange={(e) => setNonStop(e.target.checked)}
              />
              <span className="custom-checkbox"></span>
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
