package com.skyflow.server.auth.dto;

import com.skyflow.server.auth.GoogleUser;
import com.skyflow.server.auth.User;

public record AuthResponse(boolean success, String message, UserData user) {
    public record UserData(
            Long id,
            String name,
            String email,
            String picture,
            String role,
            String phone,
            String gender,
            String dob,
            String nationality,
            String maritalStatus,
            String city,
            String state,
            String identityType,
            String identityNumber,
            String nameUpdatedAt
    ) {
        public static UserData fromUser(User u) {
            return new UserData(
                    u.getId(), u.getFullName(), u.getEmail(), u.getPicture(), u.getRole(),
                    u.getPhone(), u.getGender(), u.getDob(), u.getNationality(),
                    u.getMaritalStatus(), u.getCity(), u.getState(),
                    u.getIdentityType(), u.getIdentityNumber(),
                    u.getNameUpdatedAt() != null ? u.getNameUpdatedAt().toString() : null
            );
        }

        public static UserData fromGoogleUser(GoogleUser g) {
            return new UserData(
                    g.getId(), g.getName(), g.getEmail(), g.getPicture(), g.getRole(),
                    g.getPhone(), g.getGender(), g.getDob(), g.getNationality(),
                    g.getMaritalStatus(), g.getCity(), g.getState(),
                    g.getIdentityType(), g.getIdentityNumber(),
                    g.getNameUpdatedAt() != null ? g.getNameUpdatedAt().toString() : null
            );
        }
    }
}
