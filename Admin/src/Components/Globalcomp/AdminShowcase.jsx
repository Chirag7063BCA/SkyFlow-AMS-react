function AdminShowcase() {
  return (
    <aside className="admin-showcase" aria-label="SkyFlow administration">
      <div className="admin-showcase__stars" aria-hidden="true" />
      <div className="admin-showcase__orb admin-showcase__orb--large" aria-hidden="true" />
      <div className="admin-showcase__orb admin-showcase__orb--small" aria-hidden="true" />
      <div className="admin-showcase__landscape" aria-hidden="true">
        <span className="admin-showcase__ridge admin-showcase__ridge--back" />
        <span className="admin-showcase__ridge admin-showcase__ridge--front" />
      </div>

      <div className="admin-showcase__top">
        <span className="admin-showcase__label">SKYFLOW / ADMIN</span>
        <span className="admin-showcase__index">01 — 03</span>
      </div>

      <div className="admin-showcase__caption">
        <span className="admin-showcase__caption-line" />
        <p>One clear view<br />of your operations.</p>
        <span className="admin-showcase__subcaption">
          Your workspace, in good hands.
        </span>
      </div>

      <div className="admin-showcase__bottom">
        <span className="admin-showcase__avatar" aria-hidden="true">S</span>
        <span>
          <strong>Administrator</strong>
          <small>SkyFlow workspace</small>
        </span>
        <span className="admin-showcase__arrows" aria-hidden="true">← &nbsp; →</span>
      </div>
    </aside>
  )
}

export default AdminShowcase
