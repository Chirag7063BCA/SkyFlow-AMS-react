export default function FlightSelectField({
  label,
  heading,
  value,
  options = [],
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
        <span>{label}</span>
        <span className="fsb-chevron" aria-hidden="true">
          ▼
        </span>
      </button>
      <button
        type="button"
        className="fsb-card-input fsb-card-value"
        onClick={onToggle}
        aria-label={`${label}: ${value}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value}
      </button>
      {isOpen && (
        <div className="fsb-dropdown fsb-choice-menu" role="listbox">
          <span className="fsb-dropdown__heading">
            {heading || `Select ${label.toLowerCase()}`}
          </span>
          {options.map((option) => (
            <button
              className="fsb-choice-option"
              type="button"
              key={option.label}
              role="option"
              aria-selected={value === option.label}
              onClick={() => onChange(option.label)}
            >
              {option.icon && (
                <span className="fsb-choice-option__icon" aria-hidden="true">
                  {option.icon}
                </span>
              )}
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
