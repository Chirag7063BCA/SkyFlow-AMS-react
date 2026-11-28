import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/useAuth';
import { saveBooking } from '../../../../services/bookingApi';
import FlightDetailsStep from './FlightDetailsStep';
import FareSummary from './FareSummary';
import PaymentStep from './PaymentStep';
import TravellerDetailsStep from './TravellerDetailsStep';
import '../FlightsStyles/FlightBP.css';

const steps = ['Flight details', 'Traveller details', 'Payment'];
const MAX_TRAVELLERS = 10;

const createTraveller = () => ({
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  countryCode: '',
  phone: '',
  email: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  identityType: '',
  identityNumber: '',
});

export default function FlightBP({
  flight,
  departureDate,
  travellerCount,
  priceLabel,
  fareAmount,
  formatFare,
  onClose,
}) {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, openAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [travellers, setTravellers] = useState([]);
  const [travellerError, setTravellerError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [contact, setContact] = useState({
    countryCode: '+91',
    email: currentUser?.email || '',
    phone: '',
    hasGst: false,
    gstNumber: '',
  });
  const formRef = useRef(null);
  const bookingTravellerCount = Math.max(travellerCount, travellers.length);
  const totalPriceLabel = formatFare(fareAmount * bookingTravellerCount);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  const addTraveller = () => {
    setTravellers((current) =>
      current.length < MAX_TRAVELLERS
        ? [...current, createTraveller()]
        : current,
    );
    setTravellerError('');
  };

  const updateTraveller = (index, name, value) => {
    setTravellers((current) =>
      current.map((traveller, travellerIndex) => {
        if (travellerIndex !== index) return traveller;

        if (name === 'identityType') {
          return { ...traveller, identityType: value, identityNumber: '' };
        }

        if (name === 'identityNumber') {
          const sanitized =
            traveller.identityType === 'aadhaar'
              ? value.replace(/\D/g, '').slice(0, 12)
              : value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 20);
          return { ...traveller, identityNumber: sanitized };
        }

        return { ...traveller, [name]: value };
      }),
    );
  };

  const removeTraveller = (index) => {
    setTravellers((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
    setTravellerError('');
  };

  const updateContact = (event) => {
    const { name, value, type, checked } = event.target;
    setContact((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const continueBooking = () => {
    if (step === 2) {
      if (travellers.length < travellerCount) {
        setTravellerError(
          `Add all ${travellerCount} adult traveller(s) to continue.`,
        );
        return;
      }
      if (!formRef.current?.reportValidity()) return;
    }
    setStep((current) => Math.min(current + 1, steps.length));
  };

  const handleSaveBooking = () => {
    if (!isLoggedIn) {
      openAuth('signin', 'Please sign in to confirm your booking.');
      return;
    }
    if (confirmedBooking) return;
    const saved = saveBooking({
      flight,
      departureDate,
      travellers,
      contact,
      totalAmount: fareAmount * bookingTravellerCount,
      userEmail: currentUser?.email,
    });
    setConfirmedBooking(saved);
  };

  return (
    <div
      className="flight-booking-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="flight-booking-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="flight-booking-title"
      >
        <header className="flight-booking-header">
          <div>
            <p>Complete your trip</p>
            <h2 id="flight-booking-title">Book your flight</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close booking">
            ×
          </button>
        </header>

        <nav className="flight-booking-steps" aria-label="Booking steps">
          {steps.map((label, index) => {
            const number = index + 1;
            return (
              <button
                key={label}
                type="button"
                aria-current={step === number ? 'step' : undefined}
                disabled={number > step}
                onClick={() => setStep(number)}
              >
                <span>{number < step ? '✓' : number}</span>
                {label}
              </button>
            );
          })}
        </nav>

        <div className="flight-booking-content">
          <main className="flight-booking-main" aria-live="polite">
            {step === 1 && (
              <FlightDetailsStep
                flight={flight}
                departureDate={departureDate}
              />
            )}
            {step === 2 && (
              <TravellerDetailsStep
                travellerCount={bookingTravellerCount}
                maxTravellerCount={MAX_TRAVELLERS}
                travellers={travellers}
                onAddTraveller={addTraveller}
                onTravellerChange={updateTraveller}
                onRemoveTraveller={removeTraveller}
                contact={contact}
                onContactChange={updateContact}
                formRef={formRef}
                error={travellerError}
                currentUser={currentUser}
              />
            )}
            {step === 3 && (
              <PaymentStep
                flight={flight}
                travellers={travellers}
                contact={contact}
                confirmedBooking={confirmedBooking}
              />
            )}

            <footer className="flight-booking-actions">
              <button
                type="button"
                onClick={step === 1 ? onClose : () => setStep(step - 1)}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              {step < steps.length ? (
                <button
                  type="button"
                  className="flight-booking-primary"
                  onClick={continueBooking}
                >
                  {step === 1 ? 'Continue to traveller details' : 'Review payment'}
                  <span aria-hidden="true">→</span>
                </button>
              ) : confirmedBooking ? (
                <button
                  type="button"
                  className="flight-booking-primary"
                  onClick={() => {
                    onClose();
                    navigate('/bookings');
                  }}
                >
                  View in My Bookings
                  <span aria-hidden="true">→</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="flight-booking-primary"
                  onClick={handleSaveBooking}
                >
                  Confirm booking
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </footer>
          </main>

          <FareSummary
            flight={flight}
            travellerCount={bookingTravellerCount}
            priceLabel={priceLabel}
            totalPriceLabel={totalPriceLabel}
          />
        </div>
      </section>
    </div>
  );
}
