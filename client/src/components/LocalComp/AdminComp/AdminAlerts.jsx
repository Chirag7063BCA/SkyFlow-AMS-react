import { useState } from 'react';

const INITIAL_ALERTS = [
  {
    id: 'weather',
    typeClass: 'alert-critical',
    title: 'CRITICAL: Severe Weather Warning',
    message:
      'Thunderstorms at YYZ (Toronto) causing potential grounding. Flights SF 405 and SF 410 impacted. ATC advising 2 hour delays.',
    actionLabel: 'Resolve Issue',
    btnStyle: {
      background: 'rgba(220,38,38,0.1)',
      color: 'var(--danger)',
      border: '1px solid rgba(220,38,38,0.3)',
    },
  },
  {
    id: 'crew',
    typeClass: 'alert-warning',
    title: 'WARNING: Crew Shortage',
    message:
      'Cabin crew short by 2 members for SF 109 (CDG -> BER). Standby crew has been notified but pending confirmation.',
    actionLabel: 'Resolve Issue',
    btnStyle: {
      background: 'rgba(217, 119, 6, 0.1)',
      color: 'var(--warning)',
      border: '1px solid rgba(217, 119, 6, 0.3)',
    },
  },
  {
    id: 'gate',
    typeClass: 'alert-info',
    title: 'INFO: Gate Change',
    message:
      'SF 774 (SIN -> BOM) moved from Gate C04 to C08 due to aircraft size requirement. Passenger notifications dispatched.',
    actionLabel: 'Acknowledge',
    btnStyle: {
      background: 'rgba(78, 142, 162, 0.1)',
      color: 'var(--accent-blue)',
      border: '1px solid rgba(78, 142, 162, 0.3)',
    },
  },
];

export default function AdminAlerts() {
  const [resolvedIds, setResolvedIds] = useState([]);

  const markResolved = (id) => {
    setResolvedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const acknowledgeAll = () => {
    setResolvedIds(INITIAL_ALERTS.map((item) => item.id));
  };

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Operations Control</p>
          <h2>System Alerts</h2>
        </div>
        <div className="topbar-actions">
          <button type="button" className="ghost-btn" onClick={acknowledgeAll}>
            Acknowledge All
          </button>
        </div>
      </header>

      <section
        style={{
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {INITIAL_ALERTS.map((alertItem) => {
          const isResolved = resolvedIds.includes(alertItem.id);
          return (
            <div
              key={alertItem.id}
              className={`alert ${alertItem.typeClass}`}
              style={{ opacity: isResolved ? 0.6 : 1 }}
            >
              <div className="alert-content">
                <strong>{alertItem.title}</strong>
                <p>{alertItem.message}</p>
              </div>
              <button
                type="button"
                className="ghost-btn"
                style={alertItem.btnStyle}
                disabled={isResolved}
                onClick={() => markResolved(alertItem.id)}
              >
                {isResolved ? 'Resolved' : alertItem.actionLabel}
              </button>
            </div>
          );
        })}
      </section>
    </>
  );
}
