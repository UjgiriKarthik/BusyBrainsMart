package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ GET PROFILE
    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail() != null ? user.getEmail() : "",
                "fullName", user.getFullName() != null ? user.getFullName() : "",
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "role", user.getRole(),
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
                "provider", user.getProvider() != null ? user.getProvider() : "local",
                "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        ));
    }

    // ✅ UPDATE PROFILE
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request,
                                           Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Email already in use"));
            }
            user.setEmail(request.getEmail());
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    // ✅ CHANGE PASSWORD
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request,
                                           Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "OAuth users cannot change password"));
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Current password is incorrect"));
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "New password must be at least 6 characters"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // ✅ DTO WITHOUT LOMBOK

    public static class UpdateProfileRequest {
        private String fullName;
        private String email;
        private String phone;
        private String avatarUrl;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }

    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}