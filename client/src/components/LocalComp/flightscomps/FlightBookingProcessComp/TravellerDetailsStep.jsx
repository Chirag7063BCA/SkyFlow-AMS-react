const countries = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'United States (+1)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+971', label: 'UAE (+971)' },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, index) => currentYear - index);

export default function TravellerDetailsStep({
  travellerCount,
  maxTravellerCount,
  travellers,
  onAddTraveller,
  onTravellerChange,
  onRemoveTraveller,
  contact,
  onContactChange,
  formRef,
  error,
}) {
  const addedCount = travellers.filter(
    (traveller) => traveller.firstName.trim() && traveller.lastName.trim(),
  ).length;

  const updateTraveller = (index, event) => {
    onTravellerChange(index, event.target.name, event.target.value);
  };

  return (
    <section className="flight-booking-panel traveller-details">
      <h3>Traveller Details</h3>

      <div className="traveller-login-banner">
        <span className="traveller-login-icon" aria-hidden="true" />
        <p>
          Log in to view your <strong>saved traveller list, unlock amazing deals</strong>{' '}
          &amp; much more!
        </p>
        <button type="button" onClick={() => window.openDrawer?.()}>
          LOGIN NOW
        </button>
      </div>

      <div className="traveller-count">
        <strong>
          <span className="traveller-person-icon" aria-hidden="true" />
          ADULT (12 yrs+)
        </strong>
        <span>
          {addedCount}/{travellerCount} <span>added</span>
        </span>
      </div>

      <div className="traveller-warning">
        <strong>Important:</strong> Enter the name as shown on the traveller’s
        government-approved ID and make sure the document number matches.
      </div>

      <form
        className="traveller-step-form"
        ref={formRef}
        onSubmit={(event) => event.preventDefault()}
      >
        {travellers.length === 0 && (
          <p className="traveller-empty">
            You have not added any adults to the list
          </p>
        )}

        {travellers.map((traveller, index) => (
          <fieldset className="traveller-card" key={index}>
            <div className="traveller-card-header">
              <span className="traveller-check" aria-hidden="true">✓</span>
              <strong>ADULT {index + 1}</strong>
              <button
                type="button"
                onClick={() => onRemoveTraveller(index)}
                aria-label={`Remove adult ${index + 1}`}
              >
                Remove
              </button>
            </div>

            <div className="traveller-card-fields">
              <label>
                <span className="visually-hidden">First and middle name</span>
                <input
                  name="firstName"
                  value={traveller.firstName}
                  onChange={(event) => updateTraveller(index, event)}
                  placeholder="First & Middle Name"
                  autoComplete={index === 0 ? 'given-name' : 'off'}
                  required
                />
              </label>

              <label>
                <span className="visually-hidden">Last name</span>
                <input
                  name="lastName"
                  value={traveller.lastName}
                  onChange={(event) => updateTraveller(index, event)}
                  placeholder="Last Name"
                  autoComplete={index === 0 ? 'family-name' : 'off'}
                  required
                />
              </label>

              <div className="traveller-gender" role="radiogroup" aria-label={`Gender for adult ${index + 1}`}>
                {['male', 'female'].map((gender) => (
                  <label
                    className={traveller.gender === gender ? 'selected' : ''}
                    key={gender}
                  >
                    <input
                      type="radio"
                      name={`gender-${index}`}
                      value={gender}
                      checked={traveller.gender === gender}
                      onChange={() =>
                        onTravellerChange(index, 'gender', gender)
                      }
                    />
                    {gender.toUpperCase()}
                  </label>
                ))}
              </div>

              <label>
                <span>Country Code (Optional)</span>
                <select
                  name="countryCode"
                  value={traveller.countryCode}
                  onChange={(event) => updateTraveller(index, event)}
                >
                  <option value="">Country Code (Optional)</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Mobile No (Optional)</span>
                <input
                  name="phone"
                  type="tel"
                  value={traveller.phone}
                  onChange={(event) => updateTraveller(index, event)}
                  placeholder="Mobile No (Optional)"
                />
              </label>

              <label>
                <span>Email (Optional)</span>
                <input
                  name="email"
                  type="email"
                  value={traveller.email}
                  onChange={(event) => updateTraveller(index, event)}
                  placeholder="Email (Optional)"
                />
              </label>

              <div className="traveller-date">
                <span>Date of birth</span>
                <div>
                  <label>
                    <span className="visually-hidden">Date</span>
                    <select
                      name="birthDay"
                      value={traveller.birthDay}
                      onChange={(event) => updateTraveller(index, event)}
                    >
                      <option value="">Date</option>
                      {Array.from({ length: 31 }, (_, day) => day + 1).map((day) => (
                        <option key={day} value={String(day).padStart(2, '0')}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="visually-hidden">Month</span>
                    <select
                      name="birthMonth"
                      value={traveller.birthMonth}
                      onChange={(event) => updateTraveller(index, event)}
                    >
                      <option value="">Month</option>
                      {months.map((month, monthIndex) => (
                        <option
                          key={month}
                          value={String(monthIndex + 1).padStart(2, '0')}
                        >
                          {month}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="visually-hidden">Year</span>
                    <select
                      name="birthYear"
                      value={traveller.birthYear}
                      onChange={(event) => updateTraveller(index, event)}
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="traveller-identity">
                <h4>Identity verification</h4>
                <div>
                  <label>
                    <span>ID type</span>
                    <select
                      name="identityType"
                      value={traveller.identityType}
                      onChange={(event) => updateTraveller(index, event)}
                      required
                    >
                      <option value="">Select ID type</option>
                      <option value="aadhaar">Aadhaar card</option>
                      <option value="passport">Passport</option>
                    </select>
                  </label>
                  <label>
                    <span>
                      {traveller.identityType === 'aadhaar'
                        ? 'Aadhaar number'
                        : traveller.identityType === 'passport'
                          ? 'Passport number'
                          : 'Document number'}
                    </span>
                    <input
                      name="identityNumber"
                      type="text"
                      inputMode={
                        traveller.identityType === 'aadhaar' ? 'numeric' : 'text'
                      }
                      maxLength={
                        traveller.identityType === 'aadhaar' ? 12 : 20
                      }
                      pattern={
                        traveller.identityType === 'aadhaar'
                          ? '[0-9]{12}'
                          : undefined
                      }
                      title={
                        traveller.identityType === 'aadhaar'
                          ? 'Enter the 12-digit Aadhaar number'
                          : undefined
                      }
                      autoComplete="off"
                      value={traveller.identityNumber}
                      onChange={(event) => updateTraveller(index, event)}
                      placeholder={
                        traveller.identityType === 'aadhaar'
                          ? '12-digit Aadhaar number'
                          : 'Enter passport number'
                      }
                      required
                    />
                  </label>
                </div>
                <p>
                  ID verification is not active yet. These details stay in this
                  form and are not sent to a service.
                </p>
              </div>
            </div>
          </fieldset>
        ))}

        <button
          className="traveller-add-button"
          type="button"
          disabled={travellers.length >= maxTravellerCount}
          onClick={onAddTraveller}
        >
          + ADD NEW ADULT
        </button>

        {error && <p className="traveller-error" role="alert">{error}</p>}

        <section className="traveller-contact">
          <h4>Booking details will be sent to</h4>
          <div className="traveller-contact-fields">
            <label>
              Country Code
              <select
                name="countryCode"
                value={contact.countryCode}
                onChange={onContactChange}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Mobile No
              <input
                name="phone"
                type="tel"
                minLength="7"
                maxLength="20"
                value={contact.phone}
                onChange={onContactChange}
                placeholder="Mobile No"
                autoComplete="tel-national"
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={contact.email}
                onChange={onContactChange}
                placeholder="Email"
                autoComplete="email"
                required
              />
            </label>
          </div>
        </section>

        <div className="traveller-gst">
          <label>
            <input
              name="hasGst"
              type="checkbox"
              checked={contact.hasGst}
              onChange={onContactChange}
            />
            <strong>I have a GST number</strong> <span>(Optional)</span>
          </label>
          {contact.hasGst && (
            <input
              name="gstNumber"
              value={contact.gstNumber}
              onChange={onContactChange}
              placeholder="GST number"
            />
          )}
        </div>
      </form>
    </section>
  );
}
