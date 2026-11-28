import { useRef, useState } from 'react';
import './ProfileCompStyles/ProfileGeneralForm.css';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const DOC_INFO = {
  aadhaar: { label: 'AADHAAR NUMBER', placeholder: '12-digit Aadhaar number', mode: 'numeric' },
  passport: { label: 'PASSPORT NUMBER', placeholder: 'Enter passport number', mode: 'text' },
};

export default function ProfileGeneralForm({ user, onSave }) {
  const genderRef = useRef(null);
  const [now, setNow] = useState(() => Date.now());
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ text: '', isError: false });

  const nameParts = (user?.name || '').trim().split(/\s+/);
  const [form, setForm] = useState({
    firstName: user?.firstName || nameParts[0] || '',
    lastName: user?.lastName || nameParts.slice(1).join(' '),
    gender: user?.gender || '',
    dob: user?.dob || '',
    nationality: user?.nationality || '',
    maritalStatus: user?.maritalStatus || '',
    city: user?.city || '',
    state: user?.state || '',
    phone: user?.phone || '',
    identityType: user?.identityType || '',
    identityNumber: user?.identityNumber || '',
  });

  const nextNameDate = user?.nameUpdatedAt
    ? new Date(new Date(user.nameUpdatedAt).getTime() + THIRTY_DAYS_MS)
    : null;
  const isNameLocked = Boolean(nextNameDate && nextNameDate.getTime() > now);
  const doc = DOC_INFO[form.identityType];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus({ text: '', isError: false });

    if (name === 'identityType') {
      setForm({ ...form, identityType: value, identityNumber: '' });
      return;
    }

    if (name === 'identityNumber') {
      const clean =
        form.identityType === 'aadhaar'
          ? value.replace(/\D/g, '').slice(0, 12)
          : value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 20);
      setForm({ ...form, identityNumber: clean });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = isNameLocked
      ? user?.name
      : `${form.firstName} ${form.lastName}`.trim() || user?.name;

    setSaving(true);
    const res = await onSave({ ...form, name: fullName });
    setNow(Date.now());
    setSaving(false);
    setStatus({
      text: res?.message || 'Saved',
      isError: res?.success === false && !res?.offline,
    });
  };

  return (
    <form className="pf-main-card" onSubmit={handleSubmit}>
      <div className="pf-card-head">
        <h2>My Profile</h2>
        <div className="pf-save-wrap">
          {status.text && (
            <span className={status.isError ? 'pf-error-text' : 'pf-saved-text'}>
              {status.text}
            </span>
          )}
          <button type="submit" className="pf-save-btn" disabled={saving}>
            {saving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </div>

      {!form.gender && (
        <div className="pf-info-strip">
          <div>
            <strong>Let us personalize your travel!</strong>
            <p>Tell us your gender to help us plan better trips for you!</p>
          </div>
          <button
            type="button"
            className="pf-inline-link"
            onClick={() => genderRef.current?.focus()}
          >
            Add Gender
          </button>
        </div>
      )}

      <h3 className="pf-section-heading">General Information</h3>

      <div className="pf-name-section">
        <div className="pf-grid-2">
          <label className={`pf-field ${isNameLocked ? 'locked' : ''}`}>
            <span>FIRST &amp; MIDDLE NAME</span>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First & Middle Name"
              disabled={isNameLocked}
            />
          </label>
          <label className={`pf-field ${isNameLocked ? 'locked' : ''}`}>
            <span>LAST NAME</span>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              disabled={isNameLocked}
            />
          </label>
        </div>
        {isNameLocked && (
          <small className="pf-hint">
            You can change your name again on {nextNameDate.toLocaleDateString()} (once every 30 days).
          </small>
        )}
      </div>

      <div className="pf-grid-3">
        <label className="pf-field">
          <span>GENDER</span>
          <select ref={genderRef} name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="pf-field">
          <span>DATE OF BIRTH</span>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} />
        </label>

        <label className="pf-field">
          <span>NATIONALITY</span>
          <select name="nationality" value={form.nationality} onChange={handleChange}>
            <option value="">Select</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="UAE">UAE</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>

      <div className="pf-grid-3">
        <label className="pf-field">
          <span>MARITAL STATUS</span>
          <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
        </label>

        <label className="pf-field">
          <span>CITY OF RESIDENCE</span>
          <input name="city" value={form.city} onChange={handleChange} placeholder="Enter city" />
        </label>

        <div className="pf-field-col">
          <label className="pf-field">
            <span>STATE</span>
            <input name="state" value={form.state} onChange={handleChange} placeholder="Enter state" />
          </label>
          <small className="pf-hint">Required for GST purpose on your tax invoice</small>
        </div>
      </div>

      <div className="pf-contact-block">
        <h3 className="pf-section-heading">Contact Details</h3>
        <p className="pf-contact-sub">Add contact information to receive booking details &amp; other alerts</p>

        <div className="pf-grid-2">
          <label className="pf-field">
            <span>MOBILE NUMBER</span>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Add Mobile Number" />
          </label>

          <div className="pf-field pf-email-box">
            <span>EMAIL ID</span>
            <div className="pf-email-val">
              <strong>{user?.email || ''}</strong>
              <svg
                className="pf-verified"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Verified"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="pf-contact-block">
        <h3 className="pf-section-heading">Documents Details</h3>
        <p className="pf-contact-sub">Save your Aadhaar or Passport details for faster flight check-in</p>

        <div className="pf-grid-2">
          <label className="pf-field">
            <span>DOCUMENT TYPE</span>
            <select name="identityType" value={form.identityType} onChange={handleChange}>
              <option value="">Select ID type</option>
              <option value="aadhaar">Aadhaar Card</option>
              <option value="passport">Passport</option>
            </select>
          </label>

          <label className={`pf-field ${!doc ? 'locked' : ''}`}>
            <span>{doc ? doc.label : 'DOCUMENT NUMBER'}</span>
            <input
              name="identityNumber"
              value={form.identityNumber}
              onChange={handleChange}
              disabled={!doc}
              inputMode={doc ? doc.mode : 'text'}
              placeholder={doc ? doc.placeholder : 'Select a document type first'}
            />
          </label>
        </div>
      </div>
    </form>
  );
}
