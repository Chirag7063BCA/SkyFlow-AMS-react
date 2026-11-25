import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminFlights({ flights }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const query = searchTerm.trim().toLowerCase();
  const filteredFlights = flights.filter((flight) => {
    if (!query) return true;
    return `${flight.flightNumber} ${flight.origin} ${flight.destination} ${flight.aircraft}`
      .toLowerCase()
      .includes(query);
  });

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Fleet Management</p>
          <h2>Flights Overview</h2>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => navigate('/admin/export-report')}
          >
            Export Report
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate('/admin/new-flight')}
          >
            + New Flight
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Total Flights (Today)</p>
          <h3>142</h3>
          <span className="positive">All on schedule</span>
        </article>
        <article className="stat-card">
          <p>On-Time Performance</p>
          <h3>94.2%</h3>
          <span className="positive">+1.2% vs yesterday</span>
        </article>
        <article className="stat-card">
          <p>Active Delays</p>
          <h3>4</h3>
          <span className="warning">Weather related</span>
        </article>
        <article className="stat-card">
          <p>Cancellations</p>
          <h3>0</h3>
          <span className="neutral">0% impact</span>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h3>Active Fleet Schedule</h3>
          <div>
            <input
              type="text"
              className="form-control"
              style={{
                width: '250px',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.5)',
              }}
              placeholder="Search flight # or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Flight No.</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Departure Time</th>
              <th>Status</th>
              <th>Aircraft</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.map((flight) => (
              <tr key={flight.flightNumber}>
                <td>{flight.flightNumber}</td>
                <td>{flight.origin}</td>
                <td>{flight.destination}</td>
                <td>{flight.departureTime}</td>
                <td>
                  <span className={`chip ${flight.chipClass}`}>{flight.status}</span>
                </td>
                <td>{flight.aircraft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
