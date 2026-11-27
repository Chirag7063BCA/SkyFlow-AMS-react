package com.skyflow.server.auth;

import com.skyflow.server.auth.dto.AuthResponse;
import com.skyflow.server.auth.dto.GoogleAuthRequest;
import com.skyflow.server.auth.dto.LoginRequest;
import com.skyflow.server.auth.dto.RegisterRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest req) {
        if (req.email() == null || req.email().isBlank() ||
            req.password() == null || req.password().isBlank() ||
            req.fullName() == null || req.fullName().isBlank()) {
            return ResponseEntity.badRequest().body(
                new AuthResponse(
                    false,
                    "Please provide full name, email, and password.",
                    null
                )
            );
        }

        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new AuthResponse(
                    false,
                    "An account with this email already exists. " +
                    "Please Sign In.",
                    null
                )
            );
        }

        String role = determineRole(email);
        String hashedPassword = passwordEncoder.encode(req.password());
        User saved = userRepository.save(
            new User(req.fullName().trim(), email, hashedPassword, role)
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            new AuthResponse(
                true,
                "Account created successfully!",
                new AuthResponse.UserData(
                    saved.getId(),
                    saved.getFullName(),
                    saved.getEmail(),
                    saved.getRole()
                )
            )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest req) {
        if (req.email() == null || req.email().isBlank() ||
            req.password() == null || req.password().isBlank()) {
            return ResponseEntity.badRequest().body(
                new AuthResponse(
                    false,
                    "Please enter both email and password.",
                    null
                )
            );
        }

        String email = req.email().trim().toLowerCase();
        var userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new AuthResponse(
                    false,
                    "No account found with this email. Please Sign Up.",
                    null
                )
            );
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new AuthResponse(
                    false,
                    "Incorrect password! Please try again.",
                    null
                )
            );
        }

        return ResponseEntity.ok(
            new AuthResponse(
                true,
                "Logged in successfully!",
                new AuthResponse.UserData(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getRole()
                )
            )
        );
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(
            @RequestBody GoogleAuthRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return ResponseEntity.badRequest().body(
                new AuthResponse(
                    false,
                    "Google account email is required.",
                    null
                )
            );
        }

        String email = req.email().trim().toLowerCase();
        String name = (req.name() != null && !req.name().isBlank())
                ? req.name().trim()
                : email.split("@")[0];
        String role = determineRole(email);

        GoogleUser user = googleUserRepository.findByEmail(email)
                .map(existing -> {
                    existing.setName(name);
                    existing.setPicture(req.picture());
                    existing.setLastLogin(LocalDateTime.now());
                    if (existing.getRole() == null ||
                        existing.getRole().isBlank()) {
                        existing.setRole(role);
                    }
                    return existing;
                })
                .orElseGet(() -> new GoogleUser(
                    name, email, req.picture(), role
                ));

        GoogleUser saved = googleUserRepository.save(user);

        return ResponseEntity.ok(
            new AuthResponse(
                true,
                "Google account synchronized in database!",
                new AuthResponse.UserData(
                    saved.getId(),
                    saved.getName(),
                    saved.getEmail(),
                    saved.getPicture(),
                    saved.getRole()
                )
            )
        );
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
