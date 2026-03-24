# 🛒 BusyBrainsMart — Full Stack E-Commerce App

A production-ready full-stack e-commerce application built with **React**, **Spring Boot**, and **MongoDB Atlas**.  
Features JWT authentication, Google SSO (OAuth2), Role-Based Access Control (RBAC), and complete user profile management.

---

## 📸 Features

| Feature | Details |
|---|---|
| **Auth** | JWT login, registration, Google SSO via OAuth2/OIDC |
| **RBAC** | Admin (full CRUD) vs User (read-only) |
| **Products** | Browse, search, filter by category |
| **Admin Panel** | Add / Edit / Delete products (Admin only) |
| **Profile** | View profile, edit info, change password |
| **Database** | MongoDB Atlas (cloud) |
| **Security** | BCrypt passwords, HTTPS-ready, CORS configured |

---

## 🏗️ Architecture

```
React Frontend (port 3000)
       │
       │  HTTP + JWT Bearer Token
       ▼
Spring Boot Backend (port 8080)
       │
       │  Spring Data MongoDB
       ▼
MongoDB Atlas (Cloud Database)
```

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+
- MongoDB Atlas account (free tier works)
- Google Cloud Console project (for OAuth2)

---

### 1️⃣ MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for dev)
5. Click **Connect → Connect your application** → copy the URI

---

### 2️⃣ Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **Credentials → Create OAuth 2.0 Client ID**
5. Set **Authorized redirect URIs**:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
6. Copy the **Client ID** and **Client Secret**

---

### 3️⃣ Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# MongoDB Atlas
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce_db

# JWT — generate with: openssl rand -base64 32
jwt.secret=YOUR_BASE64_SECRET_HERE
jwt.expiration=86400000

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

---

### 4️⃣ Run the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**.  
On first run, it seeds the database with:
- `admin` / `admin123` — ROLE_ADMIN
- `user` / `user123` — ROLE_USER
- 10 sample products

---

### 5️⃣ Run the Frontend

```bash
cd frontend
npm install
npm start
```

The React app starts on **http://localhost:3000**.

---

## 🔑 Default Accounts

| Username | Password | Role | Permissions |
|---|---|---|---|
| `admin` | `admin123` | ROLE_ADMIN | View + Add + Edit + Delete products |
| `user` | `user123` | ROLE_USER | View products only |

---

## 📡 API Reference

### Auth Endpoints (Public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with username/password → JWT |
| POST | `/api/auth/register` | Register new user account |
| GET | `/oauth2/authorization/google` | Initiate Google SSO |

### Product Endpoints
| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/api/products` | No | Any |
| GET | `/api/products/{id}` | No | Any |
| GET | `/api/products/featured` | No | Any |
| GET | `/api/products/categories` | No | Any |
| POST | `/api/products` | Yes | ADMIN only |
| PUT | `/api/products/{id}` | Yes | ADMIN only |
| DELETE | `/api/products/{id}` | Yes | ADMIN only |

### Profile Endpoints (All require Auth)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get current user profile |
| PUT | `/api/profile` | Update profile info |
| PUT | `/api/profile/password` | Change password |

---

## 📁 Project Structure

```
ecommerce-app/
├── backend/
│   ├── src/main/java/com/ecommerce/
│   │   ├── config/
│   │   │   ├── SecurityConfig.java      # JWT + OAuth2 + CORS + RBAC
│   │   │   └── DataInitializer.java     # Seed admin/user + products
│   │   ├── controller/
│   │   │   ├── AuthController.java      # Login + Register
│   │   │   ├── ProductController.java   # CRUD with @PreAuthorize
│   │   │   └── ProfileController.java   # Profile management
│   │   ├── dto/
│   │   │   └── AuthDto.java             # Request/Response DTOs
│   │   ├── model/
│   │   │   ├── User.java                # User MongoDB document
│   │   │   └── Product.java             # Product MongoDB document
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── ProductRepository.java
│   │   └── security/
│   │       ├── JwtUtils.java            # JWT generation & validation
│   │       ├── AuthTokenFilter.java     # Per-request JWT filter
│   │       ├── UserDetailsServiceImpl.java
│   │       └── OAuth2AuthenticationSuccessHandler.java
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js           # Global auth state (React Context)
        ├── services/
        │   └── api.js                   # Axios + JWT interceptors
        ├── pages/
        │   ├── LoginPage.jsx            # Login + Google SSO
        │   ├── RegisterPage.jsx         # Registration
        │   ├── DashboardPage.jsx        # Product listing
        │   ├── ProfilePage.jsx          # Profile management
        │   └── OAuth2Callback.jsx       # Google redirect handler
        ├── components/
        │   ├── Navbar.jsx               # Top navigation
        │   ├── ProductCard.jsx          # Product display card
        │   └── ProductModal.jsx         # Add/Edit product form
        ├── styles/
        │   └── globals.css              # Dark luxury design system
        └── App.js                       # Router + protected routes
```

---

## 🔒 Security Model

### JWT Flow
```
Client → POST /api/auth/login → { token: "eyJ..." }
Client → GET /api/products with Header: Authorization: Bearer eyJ...
Server → AuthTokenFilter validates token → grants access
```

### RBAC
```java
// Backend enforcement
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Product> createProduct(...) { ... }

// Frontend enforcement
{isAdmin() && <button onClick={handleEdit}>Edit</button>}
```

### OAuth2 Flow
```
User clicks "Login with Google"
→ Spring Boot redirects to Google
→ Google authenticates + returns to /login/oauth2/code/google
→ Spring Boot creates/finds User, generates JWT
→ Redirects to React at /oauth2/callback?token=JWT
→ React stores token, navigates to dashboard
```

---

## 🛠️ Tech Stack

**Frontend**
- React 18 with React Router v6
- Axios for HTTP + JWT interceptors
- React Hot Toast for notifications
- Custom CSS design system (no component library)

**Backend**
- Spring Boot 3.2
- Spring Security (JWT + OAuth2)
- Spring Data MongoDB
- JJWT 0.12 for JWT
- Lombok for boilerplate reduction

**Database**
- MongoDB Atlas (cloud-hosted)

---

## 📤 Deploy to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: BusyBrainsMart full stack app"

# Create a private repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/BusyBrainsMart.git
git branch -M main
git push -u origin main
```

> ⚠️ **Important**: Add `application.properties` to `.gitignore` before pushing to avoid leaking secrets.

---

## 🔐 .gitignore

Create `backend/.gitignore`:
```
target/
*.class
application.properties
```

Create `frontend/.gitignore`:
```
node_modules/
build/
.env
.env.local
```

---

## 📝 License

MIT License — Built for educational purposes.
