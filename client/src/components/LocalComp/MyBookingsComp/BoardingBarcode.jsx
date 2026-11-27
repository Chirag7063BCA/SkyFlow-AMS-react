import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { getBookingDocument } from '../../../services/bookingApi';

function formatTicketText(booking) {
  const doc = getBookingDocument(booking);
  const docValue = doc.value.replace(/•/g, '*');
  const status = String(booking.status || 'upcoming').toUpperCase();

  return [
    'SKYFLOW BOARDING PASS',
    `PNR: ${booking.pnr}`,
    `Passenger: ${booking.passenger || 'Guest Traveller'}`,
    `Flight: ${booking.flightNumber} (${booking.airline})`,
    `Route: ${booking.origin.code} -> ${booking.destination.code}`,
    `Date: ${booking.date} | ${booking.time}`,
    `Seat: ${booking.seat} | ${booking.travelClass}`,
    `${doc.label}: ${docValue}`,
    `Status: ${status}`,
  ].join('\n');
}

export default function BoardingBarcode({ booking }) {
  const [qrSrc, setQrSrc] = useState('');
  const ticketText = formatTicketText(booking);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(ticketText, {
      width: 260,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then((url) => {
        if (active) setQrSrc(url);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [ticketText]);

  if (!qrSrc) return null;

  return (
    <div className="mb-bp-qr-box" title={ticketText}>
      <img
        src={qrSrc}
        alt={`QR code with ticket details for ${booking.pnr}`}
        className="mb-bp-qr"
      />
    </div>
  );
}
