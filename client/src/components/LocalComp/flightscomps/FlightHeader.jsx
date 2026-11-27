import { useEffect, useRef, useState } from 'react';
import heroImage from '../../../assets/Hero.png';
import FlightAirportField from './FlightHeaderParts/FlightAirportField';
import FlightDateField from './FlightHeaderParts/FlightDateField';
import FlightFareOptions from './FlightHeaderParts/FlightFareOptions';
import FlightSelectField from './FlightHeaderParts/FlightSelectField';
import FlightTravellersField from './FlightHeaderParts/FlightTravellersField';
import './FlightsStyles/FlightHeader.css';

const TRIP_TYPES = [
  {
    label: 'Round Trip',
    description: 'Return flight included',
    icon: '🔁',
  },
  {
    label: 'One Way',
    description: 'Single directional flight',
    icon: '➡',
  },
  {
    label: 'Multi City',
    description: 'Add another city to your trip',
    icon: '✈',
  },
];

const CABIN_OPTIONS = [
  {
    label: 'Economy / Premium',
    description: 'Standard and extra legroom seats',
    icon: '✦',
  },
  {
    label: 'Business Class',
    description: 'Lie-flat seats and lounge access',
    icon: '✦',
  },
  {
    label: 'First Class',
    description: 'Private suite and premium service',
    icon: '✦',
  },
];

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const parseSearchDate = (value, fallback) => {
  if (!value) return fallback;
  if (value instanceof Date) return value;

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const normalizeCabinClass = (value) => {
  if (value === 'Business' || value === 'Business Class') {
    return 'Business Class';
  }
  if (value === 'First Class') return 'First Class';
  return 'Economy / Premium';
};

export default function FlightHeader({
  airports = [],
  initialSearch,
  onSearch,
}) {
  const formRef = useRef(null);
  const [today] = useState(() => startOfDay(new Date()));
  const [tripType, setTripType] = useState(
    () => initialSearch?.tripType || 'Round Trip',
  );
  const [from, setFrom] = useState(() => initialSearch?.from || '');
  const [to, setTo] = useState(() => initialSearch?.to || '');
  const [departureDate, setDepartureDate] = useState(() =>
    parseSearchDate(initialSearch?.departureDate, addDays(today, 1)),
  );
  const [returnDate, setReturnDate] = useState(() =>
    initialSearch?.returnDate
      ? parseSearchDate(initialSearch.returnDate, addDays(today, 2))
      : initialSearch?.tripType === 'One Way'
        ? null
        : addDays(today, 2),
  );
  const [travellers, setTravellers] = useState(
    () => initialSearch?.travellers || 1,
  );
  const [cabinClass, setCabinClass] = useState(() =>
    normalizeCabinClass(initialSearch?.cabinClass),
  );
  const [fareType, setFareType] = useState(
    () => initialSearch?.fareType || 'regular',
  );
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!formRef.current?.contains(event.target)) setOpenMenu(null);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu((currentMenu) => (currentMenu === menu ? null : menu));
  };

  const handleTripTypeChange = (value) => {
    setTripType(value);
    if (value === 'One Way') setReturnDate(null);
    else if (!returnDate) setReturnDate(addDays(departureDate, 1));
    setOpenMenu(null);
  };

  const handleDepartureDateChange = (date) => {
    setDepartureDate(date);
    if (returnDate && returnDate <= date) setReturnDate(addDays(date, 1));
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.({
      tripType,
      from,
      to,
      departureDate,
      returnDate: tripType === 'One Way' ? null : returnDate,
      travellers,
      cabinClass,
      fareType,
    });
    setOpenMenu(null);
  };

  return (
    <section
      className="flights-search-bar"
      style={{ '--flight-hero-image': `url("${heroImage}")` }}
      aria-label="Search for flights"
    >
      <form className="fsb-container" ref={formRef} onSubmit={handleSubmit}>
        <div className="fsb-cards-row">
          <FlightSelectField
            label="Trip type"
            heading="Select trip type"
            value={tripType}
            options={TRIP_TYPES}
            isOpen={openMenu === 'trip'}
            onToggle={() => toggleMenu('trip')}
            onChange={handleTripTypeChange}
          />

          <FlightAirportField
            field="from"
            label="From"
            value={from}
            airports={airports}
            isOpen={openMenu === 'from'}
            onOpen={() => setOpenMenu('from')}
            onClose={() => setOpenMenu(null)}
            onChange={setFrom}
          />

          <button
            className="fsb-swap-btn"
            type="button"
            onClick={handleSwap}
            aria-label="Swap departure and destination"
          >
            ⇄
          </button>

          <FlightAirportField
            field="to"
            label="To"
            value={to}
            airports={airports}
            isOpen={openMenu === 'to'}
            onOpen={() => setOpenMenu('to')}
            onClose={() => setOpenMenu(null)}
            onChange={setTo}
          />

          <FlightDateField
            field="depart"
            label="Depart"
            value={departureDate}
            minDate={today}
            isOpen={openMenu === 'depart'}
            onToggle={() => toggleMenu('depart')}
            onClose={() => setOpenMenu(null)}
            onChange={handleDepartureDateChange}
          />

          <FlightDateField
            field="return"
            label="Return"
            value={returnDate}
            minDate={departureDate || today}
            isOpen={openMenu === 'return'}
            disabled={tripType === 'One Way'}
            onToggle={() => toggleMenu('return')}
            onClose={() => setOpenMenu(null)}
            onChange={setReturnDate}
            onClear={() => {
              setReturnDate(null);
              setOpenMenu(null);
            }}
          />

          <FlightTravellersField
            value={travellers}
            isOpen={openMenu === 'travellers'}
            onToggle={() => toggleMenu('travellers')}
            onChange={(value) => {
              setTravellers(value);
              setOpenMenu(null);
            }}
          />

          <FlightSelectField
            label="Cabin class"
            heading="Select cabin class"
            value={cabinClass}
            options={CABIN_OPTIONS}
            isOpen={openMenu === 'cabin'}
            onToggle={() => toggleMenu('cabin')}
            onChange={(value) => {
              setCabinClass(value);
              setOpenMenu(null);
            }}
          />

          <button className="fsb-search-btn" type="submit">
            Search
          </button>
        </div>

        <FlightFareOptions value={fareType} onChange={setFareType} />
      </form>
    </section>
  );
}
