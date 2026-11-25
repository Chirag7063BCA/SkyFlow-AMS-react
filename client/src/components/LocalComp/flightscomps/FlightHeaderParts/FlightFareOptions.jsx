const fareTypes = [
  { value: 'regular', label: 'Regular' },
  { value: 'student', label: 'Student' },
  { value: 'armed', label: 'Armed Forces' },
  { value: 'gst', label: 'Have a GST number ?' },
  { value: 'senior', label: 'Senior Citizen' },
  { value: 'doctor', label: 'Doctor and Nurses' },
];

export default function FlightFareOptions({ value, onChange }) {
  return (
    <div className="fsb-fare-row">
      <span className="fsb-fare-title">Fare type:</span>
      <div className="fsb-fare-options">
        {fareTypes.map((fare) => (
          <label className="fsb-fare-pill" key={fare.value}>
            <input
              type="radio"
              name="fsbFareType"
              value={fare.value}
              checked={value === fare.value}
              onChange={() => onChange(fare.value)}
            />
            <span>{fare.label}</span>
            {fare.value === 'gst' && (
              <span className="fsb-badge-new">new</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
