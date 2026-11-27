package com.skyflow.server.auth.dto;

public record GoogleAuthRequest(
        String name,
        String email,
        String picture
) {}
