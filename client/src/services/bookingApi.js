// Backend endpoint when ready: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/bookings`
const STORAGE_KEY = 'skyflow_bookings';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function formatDocument(type, number, mask = true) {
  const docType = String(type || '').toLowerCase();
  let label = 'TRAVEL DOCUMENT';
  if (docType === 'aadhaar') label = 'AADHAAR';
  if (docType === 'passport') label = 'PASSPORT';

  const clean = String(number || '').replaceAll(' ', '').toUpperCase();
  if (!clean) return { label, value: 'Not provided' };

  if (!mask) {
    if (docType === 'aadhaar') {
      const grouped = clean.match(/.{1,4}/g);
      return { label, value: grouped ? grouped.join(' ') : clean };
    }
    return { label, value: clean };
  }

  const last4 = clean.slice(-4);
  const masked = docType === 'aadhaar' ? `•••• •••• ${last4}` : `•••• ${last4}`;
  return { label, value: masked };
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

export function getBookings(userEmail) {
  const cleanEmail = normalizeEmail(userEmail);
  if (!cleanEmail) return [];
  return readSavedBookings().filter(
    (booking) => normalizeEmail(booking.userEmail) === cleanEmail,
  );
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

export function saveBooking({ flight, departureDate, travellers, contact, totalAmount, userEmail }) {
  const main = travellers[0] || {};
  const fullName = `${main.firstName || ''} ${main.lastName || ''}`.trim();

  const booking = {
    pnr: `SF${Math.floor(1000 + Math.random() * 9000)}`,
    userEmail: normalizeEmail(userEmail || contact?.email),
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
    passenger: fullName || 'Guest Traveller',
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

export function encodePassToken(booking) {
  const doc = booking.docLabel
    ? { label: booking.docLabel, value: booking.docValue }
    : getBookingDocument(booking);

  const last4 = String(doc.value || '').replace(/[^a-z0-9]/gi, '').slice(-4);
  let docCode = 'D';
  if (doc.label === 'AADHAAR') docCode = 'A';
  if (doc.label === 'PASSPORT') docCode = 'P';

  const parts = [
    booking.pnr || '',
    booking.passenger || 'Guest Traveller',
    booking.flightNumber || '',
    booking.airline || '',
    booking.origin?.code || '',
    booking.origin?.city || '',
    booking.destination?.code || '',
    booking.destination?.city || '',
    booking.date || '',
    booking.time || '',
    booking.seat || '',
    booking.travelClass || 'Economy',
    booking.status || 'upcoming',
    docCode,
    last4,
  ];

  return parts.map((item) => String(item).replaceAll('~', ' ')).join('~');
}

export function decodePassToken(token) {
  if (!token) return null;
  const parts = String(token).split('~');
  if (parts.length < 13) return null;

  const [
    pnr,
    passenger,
    flightNumber,
    airline,
    oc,
    on,
    dc,
    dn,
    date,
    time,
    seat,
    travelClass,
    status,
    docCode,
    last4,
  ] = parts;

  let docLabel = 'TRAVEL DOCUMENT';
  if (docCode === 'A') docLabel = 'AADHAAR';
  if (docCode === 'P') docLabel = 'PASSPORT';

  let docValue = 'Not provided';
  if (last4) {
    docValue = docCode === 'A' ? `•••• •••• ${last4}` : `•••• ${last4}`;
  }

  return {
    pnr,
    passenger,
    flightNumber,
    airline,
    origin: { code: oc, city: on, airport: on },
    destination: { code: dc, city: dn, airport: dn },
    date,
    time,
    seat,
    travelClass,
    status,
    docLabel,
    docValue,
  };
}
