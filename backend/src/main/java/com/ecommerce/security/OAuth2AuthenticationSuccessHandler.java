package com.ecommerce.security;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Handles successful Google OAuth2 login.
 *
 * Flow:
 * 1. Extract user info from Google's OAuth2 token
 * 2. Find or create local User record in MongoDB
 * 3. Generate JWT token
 * 4. Redirect to React frontend with token + user info as query params
 */
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    // Read frontend URL from application.properties (falls back to localhost for dev)
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email     = oAuth2User.getAttribute("email");
        String name      = oAuth2User.getAttribute("name");
        String googleId  = oAuth2User.getAttribute("sub");
        String avatarUrl = oAuth2User.getAttribute("picture");

        // Find or create the user in MongoDB
        User user = findOrCreateOAuthUser(email, name, googleId, avatarUrl);

        // Generate JWT for this user
        String token = jwtUtils.generateTokenFromUsername(user.getUsername());

        // Encode values for safe URL inclusion
        String encodedUsername = URLEncoder.encode(user.getUsername(), StandardCharsets.UTF_8);
        String encodedRole     = URLEncoder.encode(user.getRole(), StandardCharsets.UTF_8);
        String encodedName     = URLEncoder.encode(
            user.getFullName() != null ? user.getFullName() : user.getUsername(),
            StandardCharsets.UTF_8
        );
        String encodedAvatar   = URLEncoder.encode(
            user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
            StandardCharsets.UTF_8
        );
        String encodedEmail    = URLEncoder.encode(
            user.getEmail() != null ? user.getEmail() : "",
            StandardCharsets.UTF_8
        );

        // Redirect to React frontend /oauth2/callback with all user info
        String redirectUrl = frontendUrl + "/oauth2/callback"
                + "?token="    + token
                + "&username=" + encodedUsername
                + "&role="     + encodedRole
                + "&fullName=" + encodedName
                + "&avatarUrl="+ encodedAvatar
                + "&email="    + encodedEmail;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private User findOrCreateOAuthUser(String email, String name,
                                       String googleId, String avatarUrl) {
        // Check by provider + provider ID first
        Optional<User> existing = userRepository.findByProviderAndProviderId("google", googleId);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Check by email — user may have registered locally with same email
        Optional<User> byEmail = userRepository.findByEmail(email);
        if (byEmail.isPresent()) {
            User u = byEmail.get();
            u.setProvider("google");
            u.setProviderId(googleId);
            if (u.getAvatarUrl() == null) u.setAvatarUrl(avatarUrl);
            u.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(u);
        }

        // Brand new OAuth2 user — create with ROLE_USER
        String username = generateUniqueUsername(email);
        User newUser = User.builder()
                .username(username)
                .email(email)
                .fullName(name)
                .role("ROLE_USER")
                .provider("google")
                .providerId(googleId)
                .avatarUrl(avatarUrl)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return userRepository.save(newUser);
    }

    private String generateUniqueUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "_");
        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix++;
        }
        return candidate;
    }
}