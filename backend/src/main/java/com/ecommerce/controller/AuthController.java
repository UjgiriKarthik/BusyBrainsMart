package com.ecommerce.controller;

import com.ecommerce.dto.AuthDto;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * REST controller for authentication operations.
 *
 * Endpoints:
 * POST /api/auth/login    - Local username/password login → JWT
 * POST /api/auth/register - New user registration
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Authenticate a user with username and password.
     * Returns a JWT token on success.
     */
    @PostMapping("/login")
        public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthDto.LoginRequest loginRequest) {

        System.out.println("INPUT username: " + loginRequest.getUsername());
        System.out.println("INPUT password: " + loginRequest.getPassword());

        // 🔥 DEBUG BEFORE AUTHENTICATION
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);

        if (user != null) {
                boolean match = passwordEncoder.matches(
                        loginRequest.getPassword(),
                        user.getPassword()
                );
                System.out.println("PASSWORD MATCH: " + match);
        } else {
                System.out.println("USER NOT FOUND");
        }

        // 🔥 AUTHENTICATION
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        User fullUser = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(AuthDto.JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(fullUser.getId())
                .username(fullUser.getUsername())
                .email(fullUser.getEmail())
                .role(role)
                .fullName(fullUser.getFullName())
                .avatarUrl(fullUser.getAvatarUrl())
                .build());
        }

    /**
     * Register a new user account.
     * Default role is ROLE_USER unless overridden (admin can assign roles via profile management).
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody AuthDto.RegisterRequest signUpRequest) {
        // Check for duplicate username
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(AuthDto.MessageResponse.builder()
                            .message("Error: Username is already taken!")
                            .build());
        }

        // Check for duplicate email
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(AuthDto.MessageResponse.builder()
                            .message("Error: Email is already in use!")
                            .build());
        }

        // Create new user with hashed password
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role("ROLE_USER")  // Default role for self-registration
                .fullName(signUpRequest.getFullName())
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(AuthDto.MessageResponse.builder()
                .message("User registered successfully! You can now log in.")
                .build());
    }
}
