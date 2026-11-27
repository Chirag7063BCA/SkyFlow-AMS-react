package com.skyflow.server.support.dto;

public record TicketRequest(
        String fullName,
        String email,
        String subject,
        String message
) {}
