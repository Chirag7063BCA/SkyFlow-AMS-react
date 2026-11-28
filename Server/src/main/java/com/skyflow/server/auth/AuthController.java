package com.skyflow.server.auth;

import com.skyflow.server.auth.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final long NAME_CHANGE_DAYS = 30;

    private final UserRepository userRepository;
    private final GoogleUserRepository googleUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          GoogleUserRepository googleUserRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.googleUserRepository = googleUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("SkyFlow Auth API is running!");
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<Map<String, Object>> regularUsers = userRepository
                .findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "fullName", u.getFullName(),
                        "email", u.getEmail(),
                        "role", u.getRole() != null ? u.getRole() : "ROLE_USER",
                        "createdAt", u.getCreatedAt() != null
                                ? u.getCreatedAt().toString() : "",
                        "type", "Standard"
                ))
                .toList();

        List<Map<String, Object>> googleUsers = googleUserRepository
                .findAll().stream()
                .map(g -> Map.<String, Object>of(
                        "id", g.getId(),
                        "fullName", g.getName(),
                        "email", g.getEmail(),
                        "picture", g.getPicture() != null ? g.getPicture() : "",
                        "role", g.getRole() != null ? g.getRole() : "ROLE_USER",
                        "lastLogin", g.getLastLogin() != null
                                ? g.getLastLogin().toString() : "",
                        "type", "Google"
                ))
                .toList();

        return ResponseEntity.ok(Map.of(
                "totalUsers", regularUsers.size() + googleUsers.size(),
                "standardUsers", regularUsers,
                "googleUsers", googleUsers
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        if (req.email() == null || req.email().isBlank() ||
            req.password() == null || req.password().isBlank() ||
            req.fullName() == null || req.fullName().isBlank()) {
            return ResponseEntity.badRequest().body(
                new AuthResponse(false, "Please provide full name, email, and password.", null)
            );
        }

        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new AuthResponse(false, "An account with this email already exists. Please Sign In.", null)
            );
        }

        User saved = userRepository.save(
            new User(req.fullName().trim(), email, passwordEncoder.encode(req.password()), determineRole(email))
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            new AuthResponse(true, "Account created successfully!", AuthResponse.UserData.fromUser(saved))
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        if (req.email() == null || req.email().isBlank() ||
            req.password() == null || req.password().isBlank()) {
            return ResponseEntity.badRequest().body(
                new AuthResponse(false, "Please enter both email and password.", null)
            );
        }

        String email = req.email().trim().toLowerCase();
        var userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new AuthResponse(false, "No account found with this email. Please Sign Up.", null)
            );
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new AuthResponse(false, "Incorrect password! Please try again.", null)
            );
        }

        return ResponseEntity.ok(
            new AuthResponse(true, "Logged in successfully!", AuthResponse.UserData.fromUser(user))
        );
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return ResponseEntity.badRequest().body(
                new AuthResponse(false, "Google account email is required.", null)
            );
        }

        String email = req.email().trim().toLowerCase();
        String name = (req.name() != null && !req.name().isBlank())
                ? req.name().trim()
                : email.split("@")[0];
        String role = determineRole(email);

        GoogleUser user = googleUserRepository.findByEmail(email)
                .map(existing -> {
                    if (existing.getName() == null || existing.getName().isBlank()) {
                        existing.setName(name);
                    }
                    if (existing.getPicture() == null || existing.getPicture().isBlank()) {
                        existing.setPicture(req.picture());
                    }
                    existing.setLastLogin(LocalDateTime.now());
                    if (existing.getRole() == null || existing.getRole().isBlank()) {
                        existing.setRole(role);
                    }
                    return existing;
                })
                .orElseGet(() -> new GoogleUser(name, email, req.picture(), role));

        GoogleUser saved = googleUserRepository.save(user);

        return ResponseEntity.ok(
            new AuthResponse(true, "Google account synchronized in database!", AuthResponse.UserData.fromGoogleUser(saved))
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(@RequestBody UpdateProfileRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return ResponseEntity.badRequest().body(
                new AuthResponse(false, "User email is required.", null)
            );
        }

        String email = req.email().trim().toLowerCase();
        String requestedName = req.name() != null ? req.name().trim() : "";

        var standardOpt = userRepository.findByEmail(email);
        if (standardOpt.isPresent()) {
            User user = standardOpt.get();
            if (!requestedName.isBlank() && !requestedName.equals(user.getFullName())) {
                String blockMsg = getNameChangeCooldownMessage(user.getNameUpdatedAt());
                if (blockMsg != null) {
                    return ResponseEntity.badRequest().body(new AuthResponse(false, blockMsg, null));
                }
                user.setFullName(requestedName);
                user.setNameUpdatedAt(LocalDateTime.now());
            }
            if (req.picture() != null) user.setPicture(req.picture());
            if (req.phone() != null) user.setPhone(req.phone());
            if (req.gender() != null) user.setGender(req.gender());
            if (req.dob() != null) user.setDob(req.dob());
            if (req.nationality() != null) user.setNationality(req.nationality());
            if (req.maritalStatus() != null) user.setMaritalStatus(req.maritalStatus());
            if (req.city() != null) user.setCity(req.city());
            if (req.state() != null) user.setState(req.state());
            if (req.identityType() != null) user.setIdentityType(req.identityType());
            if (req.identityNumber() != null) user.setIdentityNumber(req.identityNumber());
            User saved = userRepository.save(user);
            return ResponseEntity.ok(
                new AuthResponse(true, "Profile updated.", AuthResponse.UserData.fromUser(saved))
            );
        }

        var googleOpt = googleUserRepository.findByEmail(email);
        if (googleOpt.isPresent()) {
            GoogleUser user = googleOpt.get();
            if (!requestedName.isBlank() && !requestedName.equals(user.getName())) {
                String blockMsg = getNameChangeCooldownMessage(user.getNameUpdatedAt());
                if (blockMsg != null) {
                    return ResponseEntity.badRequest().body(new AuthResponse(false, blockMsg, null));
                }
                user.setName(requestedName);
                user.setNameUpdatedAt(LocalDateTime.now());
            }
            if (req.picture() != null) user.setPicture(req.picture());
            if (req.phone() != null) user.setPhone(req.phone());
            if (req.gender() != null) user.setGender(req.gender());
            if (req.dob() != null) user.setDob(req.dob());
            if (req.nationality() != null) user.setNationality(req.nationality());
            if (req.maritalStatus() != null) user.setMaritalStatus(req.maritalStatus());
            if (req.city() != null) user.setCity(req.city());
            if (req.state() != null) user.setState(req.state());
            if (req.identityType() != null) user.setIdentityType(req.identityType());
            if (req.identityNumber() != null) user.setIdentityNumber(req.identityNumber());
            GoogleUser saved = googleUserRepository.save(user);
            return ResponseEntity.ok(
                new AuthResponse(true, "Profile updated.", AuthResponse.UserData.fromGoogleUser(saved))
            );
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            new AuthResponse(false, "User account not found in database.", null)
        );
    }

    private String getNameChangeCooldownMessage(LocalDateTime lastChanged) {
        if (lastChanged == null) return null;
        LocalDateTime nextAllowed = lastChanged.plusDays(NAME_CHANGE_DAYS);
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(nextAllowed)) {
            long daysLeft = Math.max(1, ChronoUnit.DAYS.between(now, nextAllowed) + 1);
            return "You can change your name again in " + daysLeft + " day(s).";
        }
        return null;
    }

    private String determineRole(String email) {
        if (email != null &&
            (email.endsWith("@skyflow.admin") ||
             email.equals("admin@skyflow.com"))) {
            return "ROLE_ADMIN";
        }
        return "ROLE_USER";
    }
}
