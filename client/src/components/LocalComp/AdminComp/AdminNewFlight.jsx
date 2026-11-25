import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminNewFlight({ onAddFlight }) {
  const navigate = useNavigate();
  const [flightNumber, setFlightNumber] = useState('');
  const [aircraft, setAircraft] = useState('Boeing 777');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDateTime, setDepartureDateTime] = useState('');
  const [arrivalDateTime, setArrivalDateTime] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (flightNumber.trim() && origin.trim() && destination.trim() && onAddFlight) {
      const formattedTime = departureDateTime
        ? new Date(departureDateTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'TBD';

      onAddFlight({
        flightNumber: flightNumber.trim().toUpperCase(),
        origin: origin.trim(),
        destination: destination.trim(),
        departureTime: formattedTime,
        status: 'Scheduled',
        chipClass: 'on-time',
        aircraft,
      });
    }
    navigate('/admin/flights');
  };

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Fleet Management</p>
          <h2>Schedule New Flight</h2>
        </div>
      </header>

      <section className="panel" style={{ maxWidth: '800px' }}>
        <div className="panel-header">
          <h3>Flight Details</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="newFlightNumber">Flight Number</label>
              <input
                id="newFlightNumber"
                type="text"
                className="form-control"
                placeholder="e.g. SF 808"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newAircraft">Aircraft Type</label>
              <select
                id="newAircraft"
                className="form-control"
                value={aircraft}
                onChange={(e) => setAircraft(e.target.value)}
              >
                <option>Boeing 777</option>
                <option>Airbus A350</option>
                <option>Boeing 787 Dreamliner</option>
                <option>Airbus A320</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="newOrigin">Origin</label>
              <input
                id="newOrigin"
                type="text"
                className="form-control"
                placeholder="Airport Code (e.g. JFK)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newDestination">Destination</label>
              <input
                id="newDestination"
                type="text"
                className="form-control"
                placeholder="Airport Code (e.g. LHR)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="newDepartureTime">Departure Date &amp; Time</label>
              <input
                id="newDepartureTime"
                type="datetime-local"
                className="form-control"
                value={departureDateTime}
                onChange={(e) => setDepartureDateTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newArrivalTime">Estimated Arrival</label>
              <input
                id="newArrivalTime"
                type="datetime-local"
                className="form-control"
                value={arrivalDateTime}
                onChange={(e) => setArrivalDateTime(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button type="submit" className="primary-btn">
              Schedule Flight
            </button>
            <button
              type="button"
              className="ghost-btn ghost-btn-dark"
              onClick={() => navigate('/admin/flights')}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
