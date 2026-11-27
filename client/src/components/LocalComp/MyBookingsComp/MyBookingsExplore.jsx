import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cabinBannerImg from '../../../assets/help_bento_plane.jpg';
import heroPlaneImg from '../../../assets/Hero.png';
import './MyBookingsCompStyles/MyBookingsExplore.css';

export default function MyBookingsExplore({ upcomingBookings = [] }) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');

  const nextTrip = upcomingBookings[0];

  const handleFindFlights = (event) => {
    event.preventDefault();
    const city = destination.trim();
    navigate('/flights', city ? { state: { search: { to: city } } } : undefined);
  };

  return (
    <section className="mb-hub-section" aria-label="Next trip and quick actions">
      <div className="mb-hub-grid">
        <div
          className="mb-hub-hero"
          style={{ '--mb-hub-bg': `url("${cabinBannerImg}")` }}
        >
          <h2>Book Your Next Flight</h2>
          <p>
            Planning another trip? Enter a city to jump straight to live fares
            and schedules.
          </p>

          <form className="mb-hub-pill" onSubmit={handleFindFlights}>
            <input
              type="text"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Where do you want to fly?"
              aria-label="Destination city"
            />
            <button type="submit">Find Flights</button>
          </form>
        </div>

        <Link to="/flights" className="mb-hub-card mb-hub-blue">
          <strong>{upcomingBookings.length} Upcoming</strong>
          <p>
            {nextTrip
              ? `Next trip: ${nextTrip.origin.code} to ${nextTrip.destination.code} on ${nextTrip.date}`
              : 'No upcoming trips yet. Browse available flights.'}
          </p>
        </Link>

        <Link to="/track" className="mb-hub-card mb-hub-light">
          <strong>Track Flight</strong>
          <p>
            {nextTrip
              ? `Check live route status for ${nextTrip.flightNumber}`
              : 'Follow real-time departures and arrivals on the map.'}
          </p>
        </Link>

        <Link
          to="/help"
          className="mb-hub-card mb-hub-wide mb-hub-photo"
          style={{ '--mb-hub-card-bg': `url("${heroPlaneImg}")` }}
        >
          <strong>NEED CHANGES OR REFUNDS?</strong>
          <p>
            Reschedule a ticket, check baggage rules, or follow up on a
            cancellation in the Help Center.
          </p>
        </Link>
      </div>
    </section>
  );
}

