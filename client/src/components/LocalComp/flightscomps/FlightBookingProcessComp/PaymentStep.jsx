import { formatDocument } from '../../../../services/bookingApi';

export default function PaymentStep({
  flight,
  travellers,
  contact,
  confirmedBooking,
}) {
  const origin = flight.originCity || flight.fromAirportCode;
  const destination = flight.destinationCity || flight.toAirportCode;
  const route = `${origin} to ${destination}`;

  return (
    <section className="flight-booking-panel">
      <p className="flight-booking-kicker">Step 3 of 3</p>
      <h3>Payment</h3>
      <p className="flight-booking-intro">
        Your traveller and flight details are ready for checkout.
      </p>

      {confirmedBooking ? (
        <div className="flight-booking-confirmed">
          <h4>Booking Confirmed (PNR: {confirmedBooking.pnr})</h4>
          <p>Your ticket and ID details are saved in My Bookings.</p>
          <span>Confirmed</span>
        </div>
      ) : (
        <div className="flight-booking-payment">
          <h4>Payment coming soon</h4>
          <p>Confirm your booking below to save it in My Bookings.</p>
          <span>Coming soon</span>
        </div>
      )}

      <dl className="flight-booking-review">
        {travellers.map((traveller, index) => {
          const doc = formatDocument(
            traveller.identityType,
            traveller.identityNumber,
            false,
          );
          return (
            <div key={index}>
              <dt>Adult {index + 1}</dt>
              <dd>{`${traveller.firstName} ${traveller.lastName}`}</dd>
              <dd className="flight-booking-review-doc">
                {doc.label}: {doc.value}
              </dd>
            </div>
          );
        })}
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
