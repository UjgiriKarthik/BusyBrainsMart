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
import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    // 🔥 ADD THIS (IMPORTANT)
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");
        String avatarUrl = oAuth2User.getAttribute("picture");

        if (email == null) {
            throw new RuntimeException("Google account email not found");
        }

        User user = findOrCreateOAuthUser(email, name, googleId, avatarUrl);

        String token = jwtUtils.generateTokenFromUsername(user.getUsername());

        // 🔥 USE DYNAMIC URL (FIXED)
        String redirectUrl = frontendUrl + "/oauth2/callback"
                + "?token=" + token
                + "&username=" + user.getUsername()
                + "&role=" + user.getRole();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private User findOrCreateOAuthUser(String email, String name, String googleId, String avatarUrl) {

        Optional<User> existingUser =
                userRepository.findByProviderAndProviderId("google", googleId);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        Optional<User> emailUser = userRepository.findByEmail(email);

        if (emailUser.isPresent()) {
            User user = emailUser.get();
            user.setProvider("google");
            user.setProviderId(googleId);

            if (user.getAvatarUrl() == null) {
                user.setAvatarUrl(avatarUrl);
            }

            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }

        String username = generateUniqueUsername(email);

        User newUser = User.builder()
                .username(username)
                .email(email)
                .fullName(name != null ? name : username)
                .role("ROLE_USER")
                .provider("google")
                .providerId(googleId)
                .avatarUrl(avatarUrl)
                .password("OAUTH_USER") // ✅ correct
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