const MOCK_BOOKINGS = [
  {
    pnr: 'AI4521',
    status: 'upcoming',
    badgeClass: 'green',
    badgeText: 'CONFIRMED',
    travelClass: 'Economy',
    origin: { code: 'DEL', city: 'Delhi', airport: 'Indira Gandhi Intl.' },
    destination: { code: 'BOM', city: 'Mumbai', airport: 'Chhatrapati Shivaji Intl.' },
    date: '12 Aug 2026',
    time: '08:30 AM',
    duration: '2h 15m',
    stops: 'Non-stop',
    flightNumber: 'AI 4521',
    airline: 'Air India',
    seat: '14A',
    seatType: 'Window',
    passenger: 'Aman Sharma',
    idNumber: 'Aadhaar: XXXX-XXXX-4821',
    terminal: 'T3',
    boardingTime: '07:45 AM',
    actions: [
      { label: 'View Ticket', icon: 'ticket', variant: 'primary' },
      { label: 'Download', icon: 'download' },
    ],
  },
  {
    pnr: 'AI9942',
    status: 'completed',
    badgeClass: 'green',
    badgeText: 'COMPLETED',
    travelClass: 'Economy',
    origin: { code: 'BOM', city: 'Mumbai', airport: 'Chhatrapati Shivaji Intl.' },
    destination: { code: 'DEL', city: 'Delhi', airport: 'Indira Gandhi Intl.' },
    date: '15 Jul 2026',
    time: '10:00 AM',
    duration: '2h 10m',
    stops: 'Non-stop',
    flightNumber: 'AI 9942',
    airline: 'Air India',
    seat: '12B',
    seatType: 'Middle',
    passenger: 'Aman Sharma',
    idNumber: 'Passport: Z4829104',
    terminal: 'T2',
    boardingTime: 'Completed',
    actions: [
      { label: 'View Invoice', icon: 'ticket', variant: 'primary' },
      { label: 'Download', icon: 'download' },
    ],
  },
  {
    pnr: 'AI3310',
    status: 'cancelled',
    badgeClass: 'red-text',
    badgeText: 'CANCELLED',
    travelClass: 'Economy',
    origin: { code: 'DEL', city: 'Delhi', airport: 'Indira Gandhi Intl.' },
    destination: { code: 'CCU', city: 'Kolkata', airport: 'Netaji Subhash Chandra Bose' },
    date: '02 Jul 2026',
    time: '04:45 PM',
    duration: '2h 25m',
    stops: 'Non-stop',
    flightNumber: 'AI 3310',
    airline: 'Air India',
    seat: '18C',
    seatType: 'Aisle',
    passenger: 'Aman Sharma',
    idNumber: 'Aadhaar: XXXX-XXXX-4821',
    terminal: 'T3',
    boardingTime: 'Refunded',
    actions: [{ label: 'Refund Details', icon: 'info', variant: 'outline' }],
  },
];

// Replace with fetch(`${API_BASE}/api/bookings`) when backend is ready
export async function fetchMyBookings() {
  return Promise.resolve(MOCK_BOOKINGS);
}

export function downloadTicket(booking) {
  const text = [
    `SKYFLOW BOARDING PASS (${booking.badgeText})`,
    `PNR: ${booking.pnr} | Flight: ${booking.flightNumber} (${booking.airline})`,
    `Route: ${booking.origin.code} (${booking.origin.city}) -> ${booking.destination.code} (${booking.destination.city})`,
    `Date: ${booking.date} | Time: ${booking.time} | Seat: ${booking.seat}`,
  ].join('\n');

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `SkyFlow-${booking.pnr}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}
