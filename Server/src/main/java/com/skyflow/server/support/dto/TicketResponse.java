package com.skyflow.server.support.dto;

public record TicketResponse(
        boolean success,
        String message,
        Long ticketId,
        String status
) {
    public TicketResponse(boolean success, String message, Long ticketId) {
        this(success, message, ticketId, "OPEN");
    }
}
