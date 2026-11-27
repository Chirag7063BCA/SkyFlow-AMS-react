package com.skyflow.server.auth.dto;

public record AuthResponse(boolean success, String message, UserData user) {
    public record UserData(
            Long id,
            String name,
            String email,
            String picture,
            String role
    ) {
        public UserData(Long id, String name, String email, String role) {
            this(id, name, email, null, role);
        }
    }
}
