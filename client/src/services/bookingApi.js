import { MY_BOOKINGS } from '../components/LocalComp/MyBookingsComp/myBookingsData';

// Backend endpoint when ready: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/bookings`
const STORAGE_KEY = 'skyflow_bookings';

const DOC_LABELS = {
  aadhaar: 'AADHAAR',
  passport: 'PASSPORT',
};

export function formatDocument(type, number, mask = true) {
  const docType = String(type || '').toLowerCase();
  const label = DOC_LABELS[docType] || 'TRAVEL DOCUMENT';
  const clean = String(number || '').replace(/[^a-z0-9]/gi, '').toUpperCase();

  if (!clean) return { label, value: 'Not provided' };

  if (!mask) {
    return {
      label,
      value: docType === 'aadhaar' ? clean.replace(/(.{4})(?=.)/g, '$1 ').trim() : clean,
    };
  }

  const last4 = clean.slice(-4);
  return {
    label,
    value: docType === 'aadhaar' ? `•••• •••• ${last4}` : `•••• ${last4}`,
  };
}

export function getBookingDocument(booking) {
  if (booking?.travelDocument) {
    return formatDocument(booking.travelDocument.type, booking.travelDocument.number);
  }
  const first = booking?.travellers?.[0];
  return formatDocument(first?.identityType, first?.identityNumber);
}

function readSavedBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function getBookings() {
  return [...readSavedBookings(), ...MY_BOOKINGS];
}

function formatDate(value) {
  if (!value) return 'Upcoming';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function saveBooking({ flight, departureDate, travellers, contact, totalAmount }) {
  const main = travellers[0] || {};
  const passenger = `${main.firstName || ''} ${main.lastName || ''}`.trim() || 'Guest Traveller';

  const booking = {
    pnr: `SF${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'upcoming',
    badge: 'CONFIRMED ✔',
    badgeTone: 'green',
    travelClass: flight.cabinClass || 'Economy',
    origin: {
      code: flight.fromAirportCode || 'DEL',
      city: flight.originCity || 'Origin',
      airport: flight.originAirport || flight.originCity || '',
    },
    destination: {
      code: flight.toAirportCode || 'BOM',
      city: flight.destinationCity || 'Destination',
      airport: flight.destinationAirport || flight.destinationCity || '',
    },
    date: formatDate(departureDate),
    time: flight.departureTime || 'Scheduled',
    flightNumber: flight.flightNumber || 'SF 101',
    airline: flight.airline || 'SkyFlow Air',
    seat: '12A',
    passenger,
    travelDocument: {
      type: main.identityType || '',
      number: main.identityNumber || '',
    },
    travellers,
    contact,
    totalAmount,
  };

  const updated = [booking, ...readSavedBookings()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return booking;
}
