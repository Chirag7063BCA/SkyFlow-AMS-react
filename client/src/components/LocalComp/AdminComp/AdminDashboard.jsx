import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Operations control center</p>
          <h2>Welcome back, Admin</h2>
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

      <section className="hero-banner">
        <div className="hero-copy">
          <p className="badge">Live operations</p>
          <h3>Run your airline operations from one polished control center.</h3>
          <p>
            Track bookings, optimize aircraft schedules, and keep every departure
            on time.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate('/admin')}
            >
              Open Dashboard
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate('/admin/alerts')}
            >
              Review Alerts
            </button>
          </div>
        </div>

        <div className="hero-metrics">
          <div className="mini-card">
            <span>Occupancy</span>
            <strong>82%</strong>
          </div>
          <div className="mini-card">
            <span>On-Time</span>
            <strong>94%</strong>
          </div>
          <div className="mini-card">
            <span>Revenue</span>
            <strong>$1.2M</strong>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Bookings</p>
          <h3>1,482</h3>
          <span className="positive">+12% vs last week</span>
        </article>
        <article className="stat-card">
          <p>Revenue</p>
          <h3>$248K</h3>
          <span className="positive">+8.4% this month</span>
        </article>
        <article className="stat-card">
          <p>Active Flights</p>
          <h3>36</h3>
          <span className="neutral">6 departing soon</span>
        </article>
        <article className="stat-card">
          <p>Support Tickets</p>
          <h3>18</h3>
          <span className="warning">3 need urgent reply</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-header">
            <h3>Weekly Demand</h3>
            <Link to="/admin/export-report">View report</Link>
          </div>
          <div className="bars" aria-label="Weekly demand chart">
            <div className="bar-group"><span className="bar mon"></span><label>Mon</label></div>
            <div className="bar-group"><span className="bar tue"></span><label>Tue</label></div>
            <div className="bar-group"><span className="bar wed"></span><label>Wed</label></div>
            <div className="bar-group"><span className="bar thu"></span><label>Thu</label></div>
            <div className="bar-group"><span className="bar fri"></span><label>Fri</label></div>
            <div className="bar-group"><span className="bar sat"></span><label>Sat</label></div>
            <div className="bar-group"><span className="bar sun"></span><label>Sun</label></div>
          </div>
        </article>

        <article className="panel activity-panel">
          <div className="panel-header">
            <h3>Recent Bookings</h3>
            <Link to="/admin/bookings">See all</Link>
          </div>
          <ul className="activity-list">
            <li>
              <div>
                <strong>Rina Shah</strong>
                <p>Business Class · LHR &rarr; DXB</p>
              </div>
              <span>Confirmed</span>
            </li>
            <li>
              <div>
                <strong>James Carter</strong>
                <p>Economy · NYC &rarr; SFO</p>
              </div>
              <span>Pending</span>
            </li>
            <li>
              <div>
                <strong>Amira Khan</strong>
                <p>First Class · SIN &rarr; BKK</p>
              </div>
              <span>VIP</span>
            </li>
          </ul>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h3>Flight Schedule Overview</h3>
          <Link to="/admin/flights">View flights</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Flight</th>
              <th>Route</th>
              <th>Gate</th>
              <th>Status</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SF 218</td>
              <td>Dubai &rarr; London</td>
              <td>B12</td>
              <td><span className="chip on-time">On Time</span></td>
              <td>14:20</td>
            </tr>
            <tr>
              <td>SF 405</td>
              <td>New York &rarr; Toronto</td>
              <td>A05</td>
              <td><span className="chip delayed">Delayed</span></td>
              <td>15:05</td>
            </tr>
            <tr>
              <td>SF 774</td>
              <td>Singapore &rarr; Mumbai</td>
              <td>C08</td>
              <td><span className="chip boarding">Boarding</span></td>
              <td>16:10</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
