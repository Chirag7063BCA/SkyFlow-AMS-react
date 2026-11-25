import { useNavigate } from 'react-router-dom';

const BOARD_ROWS = [
  { time: '10:45', destination: 'LONDON', flight: 'SF 218', gate: 'B12', status: 'DEPARTED', color: '#28c76f' },
  { time: '11:20', destination: 'TORONTO', flight: 'SF 405', gate: 'A05', status: 'DELAYED 12:00', color: '#dc2626' },
  { time: '13:15', destination: 'MUMBAI', flight: 'SF 774', gate: 'C08', status: 'BOARDING', color: '#5eb8ff' },
  { time: '15:00', destination: 'BERLIN', flight: 'SF 109', gate: 'D02', status: 'ON TIME', color: '#ffffff' },
  { time: '16:30', destination: 'SEOUL', flight: 'SF 992', gate: 'E04', status: 'ON TIME', color: '#ffffff' },
  { time: '18:00', destination: 'NEW YORK', flight: 'SF 400', gate: 'A10', status: 'ON TIME', color: '#ffffff' },
];

export default function AdminFlightBoard() {
  const navigate = useNavigate();

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">FIDS System</p>
          <h2>Live Flight Board</h2>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <section className="panel table-panel fids-panel">
        <div className="panel-header">
          <h3
            style={{
              color: '#ffb020',
              letterSpacing: '0.15em',
              fontSize: '1.4rem',
            }}
          >
            DEPARTURES
          </h3>
        </div>
        <table className="fids-table">
          <thead>
            <tr>
              <th>TIME</th>
              <th>DESTINATION</th>
              <th>FLIGHT</th>
              <th>GATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {BOARD_ROWS.map((row) => (
              <tr key={row.flight}>
                <td>{row.time}</td>
                <td>{row.destination}</td>
                <td style={{ color: '#ffb020' }}>{row.flight}</td>
                <td>{row.gate}</td>
                <td>
                  <span style={{ color: row.color }}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
