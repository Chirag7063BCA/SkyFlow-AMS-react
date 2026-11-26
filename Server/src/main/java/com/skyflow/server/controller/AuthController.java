package com.skyflow.server.controller;

import com.skyflow.server.dto.*;
import com.skyflow.server.model.GoogleUser;
import com.skyflow.server.model.User;
import com.skyflow.server.repository.GoogleUserRepository;
import com.skyflow.server.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final GoogleUserRepository googleUserRepository;

    public AuthController(UserRepository userRepository, GoogleUserRepository googleUserRepository) {
        this.userRepository = userRepository;
        this.googleUserRepository = googleUserRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("SkyFlow Auth API is running!");
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        if (req.email() == null || req.email().isBlank() ||
            req.password() == null || req.password().isBlank() ||
            req.fullName() == null || req.fullName().isBlank()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Please provide full name, email, and password.", null));
        }

        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(false, "An account with this email already exists. Please Sign In.", null));
        }

        User saved = userRepository.save(new User(req.fullName().trim(), email, req.password()));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(true, "Account created successfully!",
                        new AuthResponse.UserData(saved.getId(), saved.getFullName(), saved.getEmail())));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        if (req.email() == null || req.email().isBlank() || req.password() == null || req.password().isBlank()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Please enter both email and password.", null));
        }

        String email = req.email().trim().toLowerCase();
        var userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AuthResponse(false, "No account found with this email. Please Sign Up.", null));
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(req.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, "Incorrect password! Please try again.", null));
        }

        return ResponseEntity.ok(new AuthResponse(true, "Logged in successfully!",
                new AuthResponse.UserData(user.getId(), user.getFullName(), user.getEmail())));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Google account email is required.", null));
        }

        String email = req.email().trim().toLowerCase();
        String name = (req.name() != null && !req.name().isBlank()) ? req.name().trim() : email.split("@")[0];

        GoogleUser user = googleUserRepository.findByEmail(email).map(existing -> {
            existing.setName(name);
            existing.setPicture(req.picture());
            existing.setLastLogin(LocalDateTime.now());
            return existing;
        }).orElseGet(() -> new GoogleUser(name, email, req.picture()));

        GoogleUser saved = googleUserRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(true, "Google account synchronized in database!",
                new AuthResponse.UserData(saved.getId(), saved.getName(), saved.getEmail(), saved.getPicture())));
    }
}
