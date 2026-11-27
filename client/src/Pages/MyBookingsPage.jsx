import React from 'react';
import MyBookings from '../components/LocalComp/MyBookings/MyBookings';

export default function MyBookingsPage({ onNavigateHome }) {
  return (
    <div className="my-bookings-page">
      <MyBookings onNavigateHome={onNavigateHome} />
    </div>
  );
}
