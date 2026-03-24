package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String role;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String provider;
    private String providerId;
    private boolean enabled = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // No-arg constructor
    public User() {}

    // All-arg constructor
    public User(String id, String username, String email, String password,
                String role, String fullName, String phone, String avatarUrl,
                String provider, String providerId, boolean enabled,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.provider = provider;
        this.providerId = providerId;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id, username, email, password, role, fullName;
        private String phone, avatarUrl, provider, providerId;
        private boolean enabled = true;
        private LocalDateTime createdAt, updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder username(String u) { this.username = u; return this; }
        public Builder email(String e) { this.email = e; return this; }
        public Builder password(String p) { this.password = p; return this; }
        public Builder role(String r) { this.role = r; return this; }
        public Builder fullName(String f) { this.fullName = f; return this; }
        public Builder phone(String p) { this.phone = p; return this; }
        public Builder avatarUrl(String a) { this.avatarUrl = a; return this; }
        public Builder provider(String p) { this.provider = p; return this; }
        public Builder providerId(String p) { this.providerId = p; return this; }
        public Builder enabled(boolean e) { this.enabled = e; return this; }
        public Builder createdAt(LocalDateTime d) { this.createdAt = d; return this; }
        public Builder updatedAt(LocalDateTime d) { this.updatedAt = d; return this; }
        public User build() {
            return new User(id, username, email, password, role, fullName,
                    phone, avatarUrl, provider, providerId, enabled, createdAt, updatedAt);
        }
    }

    // Getters
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public String getFullName() { return fullName; }
    public String getPhone() { return phone; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getProvider() { return provider; }
    public String getProviderId() { return providerId; }
    public boolean isEnabled() { return enabled; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public void setProvider(String provider) { this.provider = provider; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}