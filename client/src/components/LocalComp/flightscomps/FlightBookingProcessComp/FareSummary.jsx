export default function FareSummary({
  flight,
  travellerCount,
  priceLabel,
  totalPriceLabel,
}) {
  return (
    <aside className="flight-booking-summary" aria-label="Fare summary">
      <h3>Fare summary</h3>
      <div className="flight-booking-summary-route">
        <span>{flight.fromAirportCode || 'From'}</span>
        <i aria-hidden="true" />
        <span>{flight.toAirportCode || 'To'}</span>
      </div>
      <p>{flight.airline} · {flight.flightNumber}</p>

      <div className="flight-booking-fare-row">
        <span>Fare per traveller</span>
        <strong>{priceLabel}</strong>
      </div>
      <div className="flight-booking-fare-row">
        <span>Travellers</span>
        <strong>{travellerCount}</strong>
      </div>
      <div className="flight-booking-total">
        <span>Total shown</span>
        <strong>{totalPriceLabel}</strong>
      </div>
      <small>
        Final taxes and fees will be confirmed by the connected booking
        provider.
      </small>
    </aside>
  );
}
