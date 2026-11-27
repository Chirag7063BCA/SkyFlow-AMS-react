import React from 'react';
import TicketLeftStrip from './TicketLeftStrip';
import TicketBody from './TicketBody';
import TicketStub from './TicketStub';

export default function TicketCard({ booking, onAction }) {
  return (
    <div className="mb-ticket-card" data-status={booking.status}>
      <TicketLeftStrip />
      <TicketBody booking={booking} onAction={onAction} />
      <TicketStub booking={booking} />
    </div>
  );
}
