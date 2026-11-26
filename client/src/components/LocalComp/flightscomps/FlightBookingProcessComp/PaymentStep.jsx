export default function PaymentStep({ flight, travellers, contact }) {
  const route = `${flight.originCity || flight.fromAirportCode} to ${flight.destinationCity || flight.toAirportCode}`;

  return (
    <section className="flight-booking-panel">
      <p className="flight-booking-kicker">Step 3 of 3</p>
      <h3>Payment</h3>
      <p className="flight-booking-intro">
        Your traveller and flight details are ready for checkout.
      </p>

      <div className="flight-booking-payment">
        <h4>Secure payment will be available here</h4>
        <p>
          A payment provider has not been connected yet. Payment details are
          not collected or processed on this page.
        </p>
        <span>Coming soon</span>
      </div>

      <dl className="flight-booking-review">
        {travellers.map((traveller, index) => (
          <div key={index}>
            <dt>Adult {index + 1}</dt>
            <dd>{`${traveller.firstName} ${traveller.lastName}`}</dd>
          </div>
        ))}
        <div>
          <dt>Booking updates</dt>
          <dd>{contact.email}</dd>
        </div>
        <div>
          <dt>Mobile</dt>
          <dd>{contact.countryCode} {contact.phone}</dd>
        </div>
        <div>
          <dt>Flight</dt>
          <dd>{route}</dd>
        </div>
      </dl>
    </section>
  );
}
