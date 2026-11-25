const tripTypes = [
  {
    label: 'Round Trip',
    description: 'Return flight included',
    icon: '🔁',
  },
  {
    label: 'One Way',
    description: 'Single directional flight',
    icon: '➡',
  },
];

export default function FlightTripTypeField({
  value,
  isOpen,
  onToggle,
  onChange,
}) {
  return (
    <div className="fsb-card fsb-field">
      <button
        type="button"
        className="fsb-card-label fsb-card-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>Trip type</span>
        <span className="fsb-chevron" aria-hidden="true">
          ▼
        </span>
      </button>
      <button
        type="button"
        className="fsb-card-input fsb-card-value"
        onClick={onToggle}
        aria-label={`Trip type: ${value}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value}
      </button>
      {isOpen && (
        <div className="fsb-dropdown fsb-choice-menu" role="listbox">
          <span className="fsb-dropdown__heading">Select trip type</span>
          {tripTypes.map((option) => (
            <button
              className="fsb-choice-option"
              type="button"
              key={option.label}
              role="option"
              aria-selected={value === option.label}
              onClick={() => onChange(option.label)}
            >
              <span className="fsb-choice-option__icon" aria-hidden="true">
                {option.icon}
              </span>
              <span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
