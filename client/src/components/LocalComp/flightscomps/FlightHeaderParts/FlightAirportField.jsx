import { useMemo, useState } from 'react';

const formatAirport = (airport) =>
  `${airport.city}, ${airport.country || ''} (${airport.iata})`;

export default function FlightAirportField({
  field,
  label,
  value,
  airports,
  isOpen,
  onOpen,
  onClose,
  onChange,
}) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputId = `fsb${field === 'from' ? 'From' : 'To'}`;
  const dropdownId = `${inputId}Dropdown`;

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    return airports
      .filter((airport) => {
        const searchText =
          `${airport.city || ''} ${airport.name || ''} ${airport.iata || ''} ${airport.country || ''}`.toLowerCase();
        return !query || searchText.includes(query);
      })
      .slice(0, 10);
  }, [airports, value]);

  const selectAirport = (airport) => {
    onChange(formatAirport(airport));
    setActiveIndex(-1);
    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (!isOpen || !suggestions.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex(
        (current) => (current + direction + suggestions.length) % suggestions.length,
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectAirport(suggestions[Math.max(0, activeIndex)]);
    }
  };

  return (
    <div className="fsb-card fsb-field">
      <label className="fsb-card-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="fsb-card-input"
        type="search"
        placeholder="City or airport"
        value={value}
        autoComplete="off"
        onFocus={() => {
          setActiveIndex(-1);
          onOpen();
        }}
        onChange={(event) => {
          setActiveIndex(-1);
          onChange(event.target.value);
          onOpen();
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={dropdownId}
      />
      <div id={dropdownId}>
        {isOpen && (
          <div className="fsb-dropdown fsb-airport-menu" role="listbox">
            {airports.length === 0 ? (
              <p className="fsb-dropdown__empty">
                Airport suggestions are unavailable.
              </p>
            ) : suggestions.length === 0 ? (
              <p className="fsb-dropdown__empty">No matching airports.</p>
            ) : (
              suggestions.map((airport, index) => (
                <button
                  type="button"
                  className={`fsb-airport-option ${
                    activeIndex === index ? 'is-active' : ''
                  }`}
                  key={airport.iata}
                  onClick={() => selectAirport(airport)}
                  role="option"
                  aria-selected={value === formatAirport(airport)}
                >
                  <span className="fsb-airport-option__icon" aria-hidden="true">
                    ✈
                  </span>
                  <span className="fsb-airport-option__details">
                    <strong>
                      {airport.city}, {airport.country || ''}
                    </strong>
                    <small>{airport.name}</small>
                  </span>
                  <span className="fsb-airport-option__code">
                    {airport.iata}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
