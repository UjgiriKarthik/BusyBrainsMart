package com.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDto {

    // ── LoginRequest ──────────────────────────────────────────
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;

        public LoginRequest() {}
        public String getUsername() { return username; }
        public String getPassword() { return password; }
        public void setUsername(String u) { this.username = u; }
        public void setPassword(String p) { this.password = p; }
    }

    // ── RegisterRequest ───────────────────────────────────────
    public static class RegisterRequest {
        @NotBlank @Size(min = 3, max = 30) private String username;
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 6) private String password;
        private String fullName;

        public RegisterRequest() {}
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public String getFullName() { return fullName; }
        public void setUsername(String u) { this.username = u; }
        public void setEmail(String e) { this.email = e; }
        public void setPassword(String p) { this.password = p; }
        public void setFullName(String f) { this.fullName = f; }
    }

    // ── JwtResponse ───────────────────────────────────────────
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private String id, username, email, role, fullName, avatarUrl;

        public JwtResponse() {}

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String token, id, username, email, role, fullName, avatarUrl;

            public Builder token(String v) { this.token = v; return this; }
            public Builder type(String v) { return this; }
            public Builder id(String v) { this.id = v; return this; }
            public Builder username(String v) { this.username = v; return this; }
            public Builder email(String v) { this.email = v; return this; }
            public Builder role(String v) { this.role = v; return this; }
            public Builder fullName(String v) { this.fullName = v; return this; }
            public Builder avatarUrl(String v) { this.avatarUrl = v; return this; }

            public JwtResponse build() {
                JwtResponse r = new JwtResponse();
                r.token = token; r.id = id; r.username = username;
                r.email = email; r.role = role; r.fullName = fullName;
                r.avatarUrl = avatarUrl;
                return r;
            }
        }

        public String getToken() { return token; }
        public String getType() { return type; }
        public String getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getFullName() { return fullName; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setToken(String token) { this.token = token; }
        public void setId(String id) { this.id = id; }
        public void setUsername(String username) { this.username = username; }
        public void setEmail(String email) { this.email = email; }
        public void setRole(String role) { this.role = role; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }

    // ── MessageResponse ───────────────────────────────────────
    public static class MessageResponse {
        private String message;

        public MessageResponse() {}
        public MessageResponse(String message) { this.message = message; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String message;
            public Builder message(String m) { this.message = m; return this; }
            public MessageResponse build() { return new MessageResponse(message); }
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}