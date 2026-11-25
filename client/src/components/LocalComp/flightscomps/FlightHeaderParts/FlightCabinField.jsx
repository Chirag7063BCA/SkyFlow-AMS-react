const cabinOptions = [
  {
    label: 'Economy / Premium',
    description: 'Standard and extra legroom seats',
  },
  {
    label: 'Business Class',
    description: 'Lie-flat seats and lounge access',
  },
  {
    label: 'First Class',
    description: 'Private suite and premium service',
  },
];

export default function FlightCabinField({
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
        <span>Cabin class</span>
        <span className="fsb-chevron" aria-hidden="true">
          ▼
        </span>
      </button>
      <button
        className="fsb-card-input fsb-card-value"
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value}
      </button>
      {isOpen && (
        <div className="fsb-dropdown fsb-choice-menu" role="listbox">
          <span className="fsb-dropdown__heading">Select cabin class</span>
          {cabinOptions.map((option) => (
            <button
              className="fsb-choice-option"
              type="button"
              key={option.label}
              role="option"
              aria-selected={value === option.label}
              onClick={() => onChange(option.label)}
            >
              <span className="fsb-choice-option__icon" aria-hidden="true">
                ✦
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
