import FlightCalendar from './FlightCalendar';

const formatDate = (date) => {
  if (!date) return '';
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const yearSuffix = String(date.getFullYear()).slice(-2);
  return `${weekday}, ${date.getDate()} ${month} ${yearSuffix}`;
};

export default function FlightDateField({
  field,
  label,
  value,
  minDate,
  isOpen,
  disabled = false,
  onToggle,
  onClose,
  onChange,
  onClear,
}) {
  const inputId = field === 'depart' ? 'fsbDepart' : 'fsbReturn';

  const selectDate = (date) => {
    onChange(date);
    onClose();
  };

  return (
    <div className={`fsb-card fsb-field ${disabled ? 'is-disabled' : ''}`}>
      {field === 'return' ? (
        <div className="fsb-card-header">
          <label className="fsb-card-label" htmlFor={inputId}>
            {label}
          </label>
          <button
            type="button"
            className="fsb-card-clear"
            onClick={onClear}
            aria-label="Clear return date"
            disabled={disabled || !value}
          >
            ×
          </button>
        </div>
      ) : (
        <label className="fsb-card-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="fsb-card-input"
        type="text"
        value={formatDate(value)}
        placeholder={field === 'return' ? 'Select return' : ''}
        readOnly
        disabled={disabled}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      />
      {isOpen && !disabled && (
        <FlightCalendar
          value={value}
          minDate={minDate}
          onSelect={selectDate}
        />
      )}
    </div>
  );
}
