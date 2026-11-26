const formatDate = (date) => {
  if (!date) return 'Not specified';

  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return String(date);

  return value.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function FlightDetailsStep({ flight, departureDate }) {
  return (
    <section className="flight-booking-panel">
      <p className="flight-booking-kicker">Step 1 of 3</p>
      <h3>Review your flight</h3>
      <p className="flight-booking-intro">
        Check the flight details before adding traveller information.
      </p>

      <div className="flight-booking-route">
        <div>
          <span>Departure</span>
          <strong>{flight.departureTime || 'Time unavailable'}</strong>
          <b>{flight.fromAirportCode || '—'}</b>
          <small>{flight.originCity || 'Departure airport'}</small>
        </div>
        <div className="flight-booking-route-line" aria-hidden="true">
          <span>✈</span>
          <i />
          <small>{flight.duration || 'Flight'}</small>
        </div>
        <div className="flight-booking-arrival">
          <span>Arrival</span>
          <strong>{flight.arrivalTime || 'Time unavailable'}</strong>
          <b>{flight.toAirportCode || '—'}</b>
          <small>{flight.destinationCity || 'Arrival airport'}</small>
        </div>
      </div>

      <dl className="flight-booking-flight-meta">
        <div>
          <dt>Airline</dt>
          <dd>{flight.airline || 'Airline unavailable'}</dd>
        </div>
        <div>
          <dt>Flight number</dt>
          <dd>{flight.flightNumber || '—'}</dd>
        </div>
        <div>
          <dt>Travel date</dt>
          <dd>{formatDate(departureDate)}</dd>
        </div>
        <div>
          <dt>Trip</dt>
          <dd>{flight.nonStop ? 'Non-stop' : `${flight.stops ?? 1} stop(s)`}</dd>
        </div>
      </dl>
    </section>
  );
}
