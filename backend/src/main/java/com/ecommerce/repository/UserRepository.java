package com.ecommerce.repository;

import com.ecommerce.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * MongoDB repository for User documents.
 * Extends MongoRepository for standard CRUD + custom queries.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find user by username (for JWT login).
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email (for OAuth2 and registration checks).
     */
    Optional<User> findByEmail(String email);

    /**
     * Find OAuth2 user by provider name and provider's user ID.
     * Used to match returning Google/Facebook users.
     */
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    /**
     * Check if username is already taken.
     */
    boolean existsByUsername(String username);

    /**
     * Check if email is already registered.
     */
    boolean existsByEmail(String email);
}
