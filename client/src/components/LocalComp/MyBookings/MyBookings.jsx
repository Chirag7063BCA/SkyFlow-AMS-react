import React, { useEffect, useMemo, useState } from 'react';
import './MyBookingStyles/mybooking.css';
import './MyBookingStyles/ticket.css';
import { downloadTicket, fetchMyBookings } from './bookingsApi';
import MyBookingFilter from './MyBookingFilter';
import MyBookingTickets from './MyBookingTickets';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchMyBookings()
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookings.filter((b) => {
      if (activeFilter !== 'all' && b.status !== activeFilter) return false;
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
  }, [bookings, activeFilter, searchQuery]);

  const handleAction = (booking, label) => {
    if (label.includes('Download')) downloadTicket(booking);
    else setSelectedBooking(booking);
  };

  return (
    <div className="my-bookings-page">
      <MyBookingFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <MyBookingTickets
        bookings={filteredBookings}
        loading={loading}
        activeFilter={activeFilter}
        selectedBooking={selectedBooking}
        onCloseModal={() => setSelectedBooking(null)}
        onAction={handleAction}
      />
    </div>
  );
}
