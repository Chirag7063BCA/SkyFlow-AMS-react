import React, { useMemo, useState } from 'react';
import './MyBookingStyles/mybooking.css';
import './MyBookingStyles/ticket.css';
import { BOOKINGS_DATA } from './bookingsData';
import MyBookingFilter from './MyBookingFilter';
import MyBookingTickets from './MyBookingTickets';
import TicketModal from './TicketModal';

function downloadTicket(booking) {
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

export default function MyBookings({ onNavigateHome }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BOOKINGS_DATA.filter((b) => {
      const matchesTab = activeFilter === 'all' || b.status === activeFilter;
      if (!matchesTab) return false;
      if (!q) return true;
      return (
        b.pnr.toLowerCase().includes(q) ||
        b.flightNumber.toLowerCase().includes(q) ||
        b.origin.code.toLowerCase().includes(q) ||
        b.origin.city.toLowerCase().includes(q) ||
        b.destination.code.toLowerCase().includes(q) ||
        b.destination.city.toLowerCase().includes(q)
      );
    });
  }, [activeFilter, searchQuery]);

  const handleAction = (booking, label) => {
    if (label.includes('Download')) downloadTicket(booking);
    else setSelectedBooking(booking);
  };

  return (
    <>
      <MyBookingFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onNavigateHome={onNavigateHome}
      />
      <MyBookingTickets
        bookings={filteredBookings}
        totalCount={BOOKINGS_DATA.length}
        activeFilter={activeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAction={handleAction}
      />
      <TicketModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  );
}
