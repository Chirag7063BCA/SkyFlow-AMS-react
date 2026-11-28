package com.skyflow.server.auth.dto;

public record UpdateProfileRequest(
        String email,
        String name,
        String picture,
        String phone,
        String gender,
        String dob,
        String nationality,
        String maritalStatus,
        String city,
        String state,
        String identityType,
        String identityNumber
) {}
