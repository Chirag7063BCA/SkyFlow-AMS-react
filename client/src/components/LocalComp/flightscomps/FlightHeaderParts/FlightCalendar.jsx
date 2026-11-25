import { useState } from 'react';

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

export default function FlightCalendar({ value, minDate, onSelect }) {
  const [calendarMonth, setCalendarMonth] = useState(() =>
    startOfMonth(value || minDate),
  );
  const firstWeekday = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1,
  ).getDay();
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0,
  ).getDate();
  const earliestDate = startOfDay(minDate);
  const calendarDays = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="fsb-calendar" role="dialog" aria-label="Choose a date">
      <div className="fsb-calendar__header">
        <button
          type="button"
          className="fsb-calendar__nav"
          onClick={() =>
            setCalendarMonth(
              new Date(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth() - 1,
                1,
              ),
            )
          }
          disabled={
            calendarMonth.getFullYear() === earliestDate.getFullYear() &&
            calendarMonth.getMonth() <= earliestDate.getMonth()
          }
          aria-label="Previous month"
        >
          ‹
        </button>
        <strong>
          {calendarMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </strong>
        <button
          type="button"
          className="fsb-calendar__nav"
          onClick={() =>
            setCalendarMonth(
              new Date(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth() + 1,
                1,
              ),
            )
          }
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="fsb-calendar__weekdays" aria-hidden="true">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="fsb-calendar__days">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <span className="fsb-calendar__blank" key={`blank-${index}`} />
            );
          }

          const date = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            day,
          );
          const selected = value && date.toDateString() === value.toDateString();

          return (
            <button
              type="button"
              className={`fsb-calendar__day ${selected ? 'is-selected' : ''}`}
              key={day}
              onClick={() => onSelect(date)}
              disabled={date < earliestDate}
              aria-pressed={Boolean(selected)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
