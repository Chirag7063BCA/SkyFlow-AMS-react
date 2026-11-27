import { useMemo, useState } from 'react';
import MyBookingsExplore from '../components/LocalComp/MyBookingsComp/MyBookingsExplore';
import MyBookingsFilters from '../components/LocalComp/MyBookingsComp/MyBookingsFilters';
import MyBookingsHeader from '../components/LocalComp/MyBookingsComp/MyBookingsHeader';
import MyBookingsTickets from '../components/LocalComp/MyBookingsComp/MyBookingsTickets';
import { getBookings } from '../services/bookingApi';

function matchesSearch(booking, query) {
  const fields = [
    booking.pnr,
    booking.passenger,
    booking.flightNumber,
    booking.airline,
    booking.origin?.city,
    booking.origin?.code,
    booking.destination?.city,
    booking.destination?.code,
  ];
  return fields.some((val) => val && val.toLowerCase().includes(query));
}

export default function MyBookingsPage() {
  const [bookings] = useState(() => getBookings());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const upcomingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'upcoming'),
    [bookings],
  );

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
      return !query || matchesSearch(booking, query);
    });
  }, [bookings, searchQuery, statusFilter]);

  return (
    <>
      <MyBookingsHeader upcomingBookings={upcomingBookings}>
        <MyBookingsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </MyBookingsHeader>
      <MyBookingsTickets bookings={filteredBookings} />
      <MyBookingsExplore upcomingBookings={upcomingBookings} />
    </>
  );
}
