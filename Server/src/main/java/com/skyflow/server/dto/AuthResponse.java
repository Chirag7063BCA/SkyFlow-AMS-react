package com.skyflow.server.dto;

public record AuthResponse(boolean success, String message, UserData user) {
    public record UserData(Long id, String name, String email, String picture) {
        public UserData(Long id, String name, String email) {
            this(id, name, email, null);
        }
    }
}
