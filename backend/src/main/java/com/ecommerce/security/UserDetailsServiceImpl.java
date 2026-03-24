package com.ecommerce.security;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

/**
 * Spring Security UserDetailsService implementation.
 * Loads user data from MongoDB for authentication.
 * Supports both:
 * - Normal users (username/password)
 * - OAuth users (Google login)
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with username: " + username
                ));

        // Convert role → GrantedAuthority
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(user.getRole());

        // 🔥 IMPORTANT FIX: handle Google users
        String password;

        if ("google".equals(user.getProvider())) {
            // Google users don’t have password → give dummy
            password = "OAUTH_USER";
        } else {
            password = user.getPassword();
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(password)
                .authorities(Collections.singletonList(authority))
                .accountExpired(false)
                .credentialsExpired(false)
                .disabled(!user.isEnabled())
                .build();
    }
}