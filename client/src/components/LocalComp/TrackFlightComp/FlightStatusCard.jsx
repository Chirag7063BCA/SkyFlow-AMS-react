function FlightStatusCard({ flight, isSelected = false, onSelect }) {
  const statusClass = String(flight.status || '')
    .toLowerCase()
    .replace(/\s+/g, '-');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onSelect) onSelect(flight);
    }
  };

  return (
    <article
      className={`flight-card${isSelected ? ' is-selected' : ''}`}
      onClick={() => onSelect && onSelect(flight)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className="card-top">
        <div>
          <p className="card-airline">
            {flight.flightNumber} &middot; {flight.airline}
          </p>
          <p className="card-route">
            {flight.originCity} ({flight.fromAirportCode}) &rarr;{' '}
            {flight.destinationCity} ({flight.toAirportCode})
          </p>
        </div>
        <div className="card-time">
          <strong>
            {flight.departureTime} &rarr; {flight.arrivalTime}
          </strong>
          <span>{flight.duration}</span>
        </div>
      </div>

      <div className="card-meta">
        {flight.isAirborne && (
          <span className="pill airborne">
            In Sky &middot; {Math.round(flight.airborneProgress * 100)}%
          </span>
        )}
        <span className={`pill ${statusClass}`}>{flight.status}</span>
        <span className="pill">{flight.nonStop ? 'Non-stop' : '1 stop'}</span>
        <span className="track-action-pill">
          {isSelected ? 'Tracking Now' : 'Track Live →'}
        </span>
      </div>
    </article>
  );
}

export default FlightStatusCard;
