import React from 'react';

export default function TicketStub({ booking }) {
  return (
    <div className="mb-bp-stub">
      <div className="mb-bp-stub-head">
        <span>BOARDING PASS</span>
        <span>✈</span>
      </div>

      <div className="mb-bp-stub-body">
        <div className="mb-bp-stub-port">
          <span>FROM</span>
          <div>
            <b>{booking.origin.code}</b>
            <small>{booking.origin.city}</small>
          </div>
        </div>

        <div className="mb-bp-dot-line" />

        <div className="mb-bp-stub-port">
          <span>TO</span>
          <div>
            <b>{booking.destination.code}</b>
            <small>{booking.destination.city}</small>
          </div>
        </div>

        <div className="mb-bp-stub-bottom">
          <div className="mb-bp-stub-meta">
            <div className="mb-bp-label">
              <span>FLIGHT</span>
              <b>{booking.flightNumber}</b>
            </div>
            <div className="mb-bp-label">
              <span>DATE</span>
              <b>{booking.date}</b>
            </div>
            <div className="mb-bp-label">
              <span>SEAT</span>
              <b>{booking.seat}</b>
            </div>
          </div>

          <div className="mb-bp-vbarcode" />
        </div>
      </div>
    </div>
  );
}
