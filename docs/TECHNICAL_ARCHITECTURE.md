# Technical Architecture Overview

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React Frontend │ ◄─────────────► │ Spring Boot     │
│   (Port 5173)   │                 │ Backend         │
│                 │                 │ (Port 8080)     │
└─────────────────┘                 └─────────────────┘
                                              │
                                              │ JDBC
                                              ▼
                                    ┌─────────────────┐
                                    │   MySQL         │
                                    │   Database      │
                                    │   (Port 3306)   │
                                    └─────────────────┘
```

### Technology Stack Layers

#### Frontend Layer

- **Framework**: React 18+ with Vite
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS + Custom CSS
- **Build Tool**: Vite

#### Backend Layer

- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Build Tool**: Maven
- **Security**: Spring Security + JWT
- **Data Access**: Spring Data JPA

#### Data Layer

- **Primary Database**: MySQL 8.0+
- **Test Database**: H2 (In-Memory)
- **ORM**: Hibernate
- **Connection Pool**: HikariCP

---

## Data Flow Architecture

### Authentication Flow

```
1. User submits credentials
   ↓
2. Frontend sends POST to /auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Subsequent requests include JWT in Authorization header
```

### Keycode Request Flow

```
1. User fills vehicle information form
   ↓
2. Frontend validates form data
   ↓
3. Frontend sends POST to /keycode/request
   ↓
4. Backend processes request and stores in database
   ↓
5. Backend sends confirmation response
   ↓
6. Frontend updates UI to show success
```

### User Registration Flow

```
1. User fills registration form
   ↓
2. Frontend validates form data
   ↓
3. Frontend sends POST to /auth/register
   ↓
4. Backend hashes password with Bcrypt
   ↓
5. Backend creates user record in database
   ↓
6. Backend sends confirmation response
   ↓
7. Frontend redirects to login page
```

---

## Security Architecture

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication
- **Password Security**: Bcrypt hashing with salt
- **Role-Based Access**: BASEUSER and ADMIN roles
- **Session Management**: Token expiration and refresh

### CORS Configuration

```java
// Multiple frontend ports supported
.allowedOrigins(
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:51731",
    "http://localhost:51732",
    "http://localhost:51733",
    "http://localhost:51734"
)
```

### Security Headers

- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection

---

## Database Architecture

### Entity Relationships

```
User (1) ──── (Many) KeycodeRequest
User (1) ──── (Many) Subscription
User (1) ──── (1) UserRole
KeycodeRequest (Many) ──── (1) VehicleInfo
```

### Database Schema Design

```sql
-- Core user table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('BASEUSER', 'ADMIN') DEFAULT 'BASEUSER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Keycode requests
CREATE TABLE keycode_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    vehicle_info JSON NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User subscriptions
CREATE TABLE subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'CANCELLED'),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## API Architecture

### RESTful Design Principles

- **Resource-Based URLs**: `/users`, `/keycodes`, `/subscriptions`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: Standard HTTP response codes
- **JSON Payloads**: Consistent request/response format

### API Versioning Strategy

- **Current Version**: v1 (implicit)
- **Versioning Approach**: URL path versioning when needed
- **Backward Compatibility**: Maintained through careful API design

### Error Handling

```json
{
  "error": "Validation failed",
  "message": "Email is required",
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/auth/register"
}
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── Router
│   ├── Navbar
│   └── Routes
│       ├── LandingPage
│       ├── Login
│       ├── Register
│       ├── UserDash
│       ├── AdminDashboard
│       └── [Other Pages]
```

### State Management Strategy

- **Local State**: Component-specific state with useState
- **Global State**: Authentication and user data with Context
- **Form State**: Controlled inputs with validation
- **API State**: Loading, success, error states

### Routing Strategy

- **Public Routes**: Landing page, login, admin login, admin register, register
- **Protected Routes**: User dashboard, admin panel
- **Role-Based Routes**: Different access based on user role
- **Fallback Route**: Catch-all routes redirect to landing page

---

## Backend Architecture

### Package Structure

```
org.rma.kchbackend/
├── config/           # Configuration classes
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── DatabaseConfig.java
├── controller/       # REST controllers
│   ├── AuthController.java
│   ├── UserController.java
│   └── KeycodeController.java
├── service/         # Business logic
│   ├── KeycodeUserService.java
│   ├── KeycodeService.java
│   └── EmailService.java
├── repository/      # Data access
│   ├── UserRepository.java
│   └── KeycodeRepository.java
├── model/          # Entity classes
│   ├── User.java
│   └── KeycodeRequest.java
└── dto/            # Data transfer objects
    ├── LoginRequest.java
    └── RegisterRequest.java
```

### Service Layer Design

- **Business Logic**: Centralized in service classes
- **Transaction Management**: Spring-managed transactions
- **Data Validation**: Bean validation annotations
- **Error Handling**: Global exception handling

---

## Performance Considerations

### Frontend Optimization

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized image assets
- **Bundle Optimization**: Tree shaking and minification

### Backend Optimization

- **Database Indexing**: Optimized query performance
- **Connection Pooling**: HikariCP for database connections
- **Caching Strategy**: Redis for session caching (future)
- **Async Processing**: Background job processing (future)

### Database Optimization

- **Index Strategy**: Primary keys, foreign keys, frequently queried fields
- **Query Optimization**: Efficient SQL queries with proper joins
- **Connection Management**: Connection pooling and timeout handling

---

## Scalability Architecture

### Horizontal Scaling

- **Load Balancing**: Multiple backend instances
- **Database Sharding**: Partition data across multiple databases
- **CDN Integration**: Static asset delivery optimization

### Vertical Scaling

- **Resource Allocation**: CPU and memory optimization
- **Database Optimization**: Query performance tuning
- **Caching Layers**: Application and database level caching

---

## Monitoring & Logging

### Application Monitoring

- **Health Checks**: Spring Boot Actuator endpoints
- **Metrics Collection**: Application performance metrics
- **Error Tracking**: Centralized error logging and alerting

### Database Monitoring

- **Query Performance**: Slow query identification
- **Connection Monitoring**: Database connection health
- **Resource Usage**: CPU, memory, and disk utilization

---

## Deployment Architecture

### Development Environment

- **Local Development**: Docker containers for services
- **Hot Reloading**: Frontend and backend development servers
- **Database**: Local MySQL instance

### Production Environment

- **Web Server**: Nginx reverse proxy
- **Application Server**: Spring Boot embedded Tomcat
- **Database**: Managed MySQL service
- **SSL/TLS**: HTTPS encryption

---

## Future Architecture Considerations

### Microservices Migration

- **Service Decomposition**: Break monolith into microservices
- **API Gateway**: Centralized routing and authentication
- **Service Discovery**: Dynamic service registration

### Cloud-Native Features

- **Container Orchestration**: Kubernetes deployment
- **Serverless Functions**: Event-driven processing
- **Managed Services**: Cloud database and messaging services

---

_This architecture document should be updated as the system evolves to maintain accuracy and guide future development decisions._
