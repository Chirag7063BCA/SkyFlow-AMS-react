import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '◉', end: true },
  { to: '/admin/flights', label: 'Flights', icon: '✈' },
  { to: '/admin/bookings', label: 'Bookings', icon: '◫' },
  { to: '/admin/passengers', label: 'Passengers', icon: '◌' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFlightBoard = location.pathname === '/admin/flight-board';

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">SF</div>
        <div>
          <h1>SkyFlow</h1>
          <p>Admin Console</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-card">
        {isFlightBoard ? (
          <>
            <h3>Live View</h3>
            <p>Displaying real-time FIDS data.</p>
            <button type="button" onClick={() => navigate('/admin')}>
              Exit Board
            </button>
          </>
        ) : (
          <>
            <h3>Today&rsquo;s Focus</h3>
            <p>Monitor 18 departures, 12 arrivals, and 4 priority alerts.</p>
            <button type="button" onClick={() => navigate('/admin/flight-board')}>
              View Flight Board
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
