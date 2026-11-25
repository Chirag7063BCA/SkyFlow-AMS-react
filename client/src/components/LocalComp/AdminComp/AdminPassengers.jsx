import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PASSENGERS = [
  {
    name: 'Rina Shah',
    passportId: 'P982***11',
    tier: 'Gold',
    tierClass: 'chip delayed',
    tierStyle: undefined,
    miles: '142,500',
    upcomingFlight: 'SF 218 (LHR)',
    contact: 'rina.s@example.com',
  },
  {
    name: 'James Carter',
    passportId: 'P445***92',
    tier: 'Silver',
    tierClass: 'chip neutral',
    tierStyle: { background: 'rgba(15,38,64,0.1)', color: '#0f2640' },
    miles: '45,200',
    upcomingFlight: 'SF 405 (YYZ)',
    contact: 'james.c@example.com',
  },
  {
    name: 'Amira Khan',
    passportId: 'P112***44',
    tier: 'Platinum VIP',
    tierClass: 'chip boarding',
    tierStyle: { background: 'rgba(10,10,10,0.8)', color: '#fff' },
    miles: '350,000',
    upcomingFlight: 'SF 774 (BOM)',
    contact: 'amira.k@example.com',
  },
  {
    name: 'Lars Jensen',
    passportId: 'P778***33',
    tier: 'Member',
    tierClass: 'chip on-time',
    tierStyle: { background: 'rgba(78, 142, 162, 0.15)', color: '#4e8ea2' },
    miles: '12,000',
    upcomingFlight: 'SF 109 (BER)',
    contact: 'lars.j@example.com',
  },
  {
    name: 'Wei Chen',
    passportId: 'P332***76',
    tier: 'Gold',
    tierClass: 'chip delayed',
    tierStyle: undefined,
    miles: '180,300',
    upcomingFlight: 'SF 992 (ICN)',
    contact: 'wei.chen@example.com',
  },
];

export default function AdminPassengers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const query = searchTerm.trim().toLowerCase();
  const filteredPassengers = PASSENGERS.filter((passenger) => {
    if (!query) return true;
    return `${passenger.name} ${passenger.contact} ${passenger.passportId}`
      .toLowerCase()
      .includes(query);
  });

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Customer Directory</p>
          <h2>Passengers</h2>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => navigate('/admin/export-report')}
          >
            Export Directory
          </button>
        </div>
      </header>

      <section className="panel table-panel">
        <div className="panel-header">
          <h3>Passenger Manifest &amp; Loyalty</h3>
          <input
            type="text"
            className="form-control"
            style={{
              width: '300px',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.5)',
            }}
            placeholder="Search name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Passport / ID</th>
              <th>Loyalty Tier</th>
              <th>Miles</th>
              <th>Upcoming Flight</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredPassengers.map((passenger) => (
              <tr key={passenger.passportId}>
                <td><strong>{passenger.name}</strong></td>
                <td>{passenger.passportId}</td>
                <td>
                  <span className={passenger.tierClass} style={passenger.tierStyle}>
                    {passenger.tier}
                  </span>
                </td>
                <td>{passenger.miles}</td>
                <td>{passenger.upcomingFlight}</td>
                <td>{passenger.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
