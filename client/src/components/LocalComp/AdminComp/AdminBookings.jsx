import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BOOKINGS = [
  {
    ref: '#BK-8821',
    passenger: 'Rina Shah',
    flightNumber: 'SF 218',
    cabin: 'Business',
    amount: '$2,450',
    status: 'Confirmed',
    chipClass: 'on-time',
  },
  {
    ref: '#BK-8822',
    passenger: 'James Carter',
    flightNumber: 'SF 405',
    cabin: 'Economy',
    amount: '$420',
    status: 'Pending',
    chipClass: 'boarding',
  },
  {
    ref: '#BK-8823',
    passenger: 'Amira Khan',
    flightNumber: 'SF 774',
    cabin: 'First',
    amount: '$4,100',
    status: 'Confirmed',
    chipClass: 'on-time',
  },
  {
    ref: '#BK-8824',
    passenger: 'Lars Jensen',
    flightNumber: 'SF 109',
    cabin: 'Economy',
    amount: '$280',
    status: 'Confirmed',
    chipClass: 'on-time',
  },
  {
    ref: '#BK-8825',
    passenger: 'Wei Chen',
    flightNumber: 'SF 992',
    cabin: 'Premium Economy',
    amount: '$890',
    status: 'Cancelled',
    chipClass: 'delayed',
  },
];

export default function AdminBookings() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const query = searchTerm.trim().toLowerCase();
  const filteredBookings = BOOKINGS.filter((item) => {
    if (!query) return true;
    return `${item.ref} ${item.passenger} ${item.flightNumber}`
      .toLowerCase()
      .includes(query);
  });

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Revenue &amp; Reservations</p>
          <h2>Bookings Ledger</h2>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => navigate('/admin/export-report')}
          >
            Export Revenue
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Total Revenue (MTD)</p>
          <h3>$2.4M</h3>
          <span className="positive">+15% vs target</span>
        </article>
        <article className="stat-card">
          <p>New Bookings (Today)</p>
          <h3>342</h3>
          <span className="positive">+12% vs yesterday</span>
        </article>
        <article className="stat-card">
          <p>Refunds / Cancellations</p>
          <h3>$12.5K</h3>
          <span className="warning">Slight increase</span>
        </article>
        <article className="stat-card">
          <p>Average Order Value</p>
          <h3>$850</h3>
          <span className="neutral">Stable</span>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h3>Recent Transactions</h3>
          <div>
            <input
              type="text"
              className="form-control"
              style={{
                width: '250px',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.5)',
              }}
              placeholder="Search Booking Ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Booking Ref</th>
              <th>Passenger</th>
              <th>Flight No.</th>
              <th>Class</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.ref}>
                <td>{booking.ref}</td>
                <td>{booking.passenger}</td>
                <td>{booking.flightNumber}</td>
                <td>{booking.cabin}</td>
                <td>{booking.amount}</td>
                <td>
                  <span className={`chip ${booking.chipClass}`}>{booking.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
