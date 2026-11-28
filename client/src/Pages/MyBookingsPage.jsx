import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyBookingsExplore from '../components/LocalComp/MyBookingsComp/MyBookingsExplore';
import MyBookingsFilters from '../components/LocalComp/MyBookingsComp/MyBookingsFilters';
import MyBookingsHeader from '../components/LocalComp/MyBookingsComp/MyBookingsHeader';
import MyBookingsTickets from '../components/LocalComp/MyBookingsComp/MyBookingsTickets';
import { useAuth } from '../context/useAuth';
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
  const { currentUser, isLoggedIn, openAuth, closeAuth } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (isLoggedIn) return;
    openAuth('signin', 'Login to view your bookings.', null, () => {
      navigate('/', { replace: true });
    });
    return () => closeAuth(false);
  }, [isLoggedIn, openAuth, closeAuth, navigate]);

  const bookings = getBookings(currentUser?.email);
  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
      return !query || matchesSearch(booking, query);
    });
  }, [bookings, searchQuery, statusFilter]);

  return (
    <div className={isLoggedIn ? '' : 'mb-page-locked'}>
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
    </div>
  );
}
