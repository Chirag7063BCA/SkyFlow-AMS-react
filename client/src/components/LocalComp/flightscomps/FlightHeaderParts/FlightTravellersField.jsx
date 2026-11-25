export default function FlightTravellersField({
  value,
  isOpen,
  onToggle,
  onChange,
}) {
  return (
    <div className="fsb-card fsb-field">
      <label className="fsb-card-label" htmlFor="fsbTravellers">
        Travellers
      </label>
      <button
        id="fsbTravellers"
        className="fsb-card-input fsb-card-value"
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value} {value === 1 ? 'Adult' : 'Adults'}
      </button>
      {isOpen && (
        <div className="fsb-dropdown fsb-choice-menu" role="listbox">
          <span className="fsb-dropdown__heading">
            Select travellers (max 10)
          </span>
          {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
            <button
              className="fsb-choice-option"
              type="button"
              key={count}
              role="option"
              aria-selected={value === count}
              onClick={() => onChange(count)}
            >
              <span className="fsb-choice-option__icon" aria-hidden="true">
                {count === 1 ? '👤' : '👥'}
              </span>
              <span>
                <strong>
                  {count} {count === 1 ? 'Adult' : 'Adults'}
                </strong>
                <small>
                  {count === 1
                    ? 'Single passenger'
                    : `${count} passengers booking`}
                </small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
