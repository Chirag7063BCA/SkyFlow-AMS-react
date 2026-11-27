package com.skyflow.server.auth.dto;

public record RegisterRequest(
        String fullName,
        String email,
        String password
) {}
