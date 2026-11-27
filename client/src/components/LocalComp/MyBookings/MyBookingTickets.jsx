import React from 'react';
import MyBookingSearch from './MyBookingSearch';
import TicketCard from './TicketCard';

export default function MyBookingTickets({
  bookings,
  totalCount,
  activeFilter,
  searchQuery,
  onSearchChange,
  onAction,
}) {
  return (
    <section className="mb-content-section">
      <div className="mb-wrapper">
        <MyBookingSearch
          query={searchQuery}
          onQueryChange={onSearchChange}
          count={bookings.length}
          total={totalCount}
        />

        <div className="mb-tickets" id="mbTicketsContainer">
          {bookings.length === 0 ? (
            <div className="mb-empty-state" id="mb-empty-state">
              <div className="mb-empty-icon">📭</div>
              <h3>No {activeFilter === 'all' ? 'matching' : activeFilter} bookings</h3>
              <p>Try another filter or clear your search query.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <TicketCard
                key={booking.pnr}
                booking={booking}
                onAction={onAction}
              />
            ))
          )}
        </div>

        <div className="mb-reminder">
          <div className="mb-rem-icon">🔔</div>
          <div className="mb-rem-text">
            <b>Travel stress-free!</b>
            <p>
              Arrive at the airport at least 2 hours before departure for domestic
              flights.
            </p>
          </div>
          <div className="mb-rem-plane">✈</div>
        </div>
      </div>
    </section>
  );
}
