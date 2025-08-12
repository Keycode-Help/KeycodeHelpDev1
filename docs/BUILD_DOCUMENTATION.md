# Keycode Help - Build Documentation

## Table of Contents

1. [Application Overview](#application-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [Database Schema](#database-schema)
6. [Authentication & Security](#authentication--security)
7. [API Endpoints](#api-endpoints)
8. [Component Library](#component-library)
9. [State Management](#state-management)
10. [Routing Structure](#routing-structure)
11. [Styling System](#styling-system)
12. [Utility Functions](#utility-functions)
13. [Configuration Files](#configuration-files)
14. [Startup Scripts](#startup-scripts)
15. [Known Dependencies](#known-dependencies)
16. [Development Workflow](#development-workflow)

---

## Application Overview

**Keycode Help** is a full-stack web application designed for automotive professionals to request and obtain vehicle keycodes. The application serves users in the US and Canada, providing a subscription-based service for keycode requests.

**Core Purpose**: Streamline the process of obtaining vehicle keycodes for automotive professionals through a web-based platform.

**Target Users**:

- BASEUSER: Regular automotive professionals
- ADMIN: System administrators with user management capabilities (requires super admin approval)
- SUPER_ADMIN: System super administrators with admin approval capabilities

---

## Architecture & Tech Stack

### Backend

- **Language**: Java 21
- **Framework**: Spring Boot 3.x
- **Build Tool**: Maven
- **Database**: MySQL 8.0+ (Production), H2 (Testing)
- **Security**: Spring Security with JWT
- **Email**: SendGrid integration
- **Port**: 8080

### Frontend

- **Framework**: React 18+ with Vite
- **Language**: JavaScript/JSX
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Port**: 5173 (default), dynamic ports supported

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Testing**: Jest (Next.js) / Vitest (Vite)
- **Version Control**: Git

---

## Backend Structure

### Package Organization

```
org.rma.kchbackend/
├── config/           # Configuration classes
├── controller/       # REST API controllers
├── service/         # Business logic services
├── repository/      # Data access layer
├── model/          # Entity classes
├── dto/            # Data Transfer Objects
└── util/           # Utility classes
```

### Key Configuration Classes

- **SecurityConfig**: Spring Security configuration with JWT
- **CorsConfig**: CORS policy configuration for frontend communication
- **DatabaseConfig**: Database connection and JPA configuration

### Controllers

- **AuthController**: Authentication endpoints (login, register, logout)
- **UserController**: User management endpoints
- **KeycodeController**: Keycode request endpoints
- **AdminController**: Administrative endpoints

### Services

- **KeycodeUserService**: User business logic
- **KeycodeService**: Keycode request business logic
- **EmailService**: Email functionality via SendGrid

---

## Frontend Structure

### Directory Organization

```
src/
├── components/      # Reusable UI components
├── pages/          # Page-level components
├── context/        # React Context providers
├── styles/         # CSS files
├── utils/          # Utility functions
├── data/           # Static data files
└── assets/         # Images, logos, etc.
```

### Component Architecture

- **Modular Component Pattern (MCP)**: Each component lives in its own folder
- **Component Structure**: index.tsx, [ComponentName].test.tsx, [ComponentName].stories.tsx
- **Styling**: Tailwind CSS with optional .module.css files

---

## Database Schema

### Core Tables

- **users**: User accounts and authentication
- **keycode_requests**: Keycode request records
- **subscriptions**: User subscription plans
- **user_roles**: Role-based access control
- **audit_logs**: System activity tracking

### Key Fields

- **users**: id, email, password_hash, role, created_at, updated_at
- **keycode_requests**: id, user_id, vehicle_info, status, created_at
- **subscriptions**: id, user_id, plan_type, start_date, end_date

---

## Authentication & Security

### JWT Implementation

- **Token Storage**: Local storage
- **Expiration**: Configurable token lifetime
- **Refresh**: Automatic token refresh mechanism

### Role-Based Access Control

- **BASEUSER**: Standard user permissions
- **ADMIN**: Administrative access to user management

### Security Features

- **Password Hashing**: Bcrypt.js for secure password storage
- **CORS Protection**: Configured for specific frontend origins
- **Input Validation**: Server-side validation for all inputs

---

## API Endpoints

### Authentication Routes

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### User Routes

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/dashboard` - User dashboard data

### Keycode Routes

- `POST /keycode/request` - Submit keycode request
- `GET /keycode/history` - Get request history
- `PUT /keycode/status` - Update request status

### Admin Routes

- `GET /admin/users` - List all users
- `GET /admin/requests` - List all requests
- `PUT /admin/user/role` - Update user role

---

## Component Library

### Core Components

- **Navbar**: Main navigation component with role-based menu items
- **ModalContent**: Reusable modal dialog component
- **StatesDropDown**: US/Canada state selection dropdown
- **IconProvider**: Icon management system

### Page Components

- **LandingPage**: Marketing homepage (primary entry point)
- **Login**: User authentication form
- **AdminLogin**: Administrative authentication form
- **AdminRegister**: Administrative account creation form
- **SuperAdminDashboard**: Super admin interface for managing admin approvals
- **Register**: User registration form
- **UserDash**: User dashboard
- **AdminDashboard**: Administrative interface
- **Cart**: Shopping cart functionality
- **VehicleKeycodeRequest**: Keycode request form

### Subscription Components

- **MembershipPage**: Subscription plan selection
- **SubscriptionPage**: Subscription management
- **MembershipCard**: Individual plan display
- **FAQSection**: Frequently asked questions
- **SignUpSteps**: Registration process guide

---

## State Management

### Context Providers

- **AuthContext**: User authentication state and methods
  - `user`: Current user object
  - `userRole`: User's role (BASEUSER/ADMIN)
  - `login()`: Authentication method
  - `logout()`: Logout method
  - `register()`: Registration method

### State Patterns

- **Local State**: Component-level state with useState
- **Context State**: Global state shared across components
- **Form State**: Controlled form inputs with validation

---

## Routing Structure

### Route Configuration

```jsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/admin-login" element={<AdminLogin />} />
  <Route path="/admin-register" element={<AdminRegister />} />
  <Route path="/register" element={<Register />} />
  <Route path="/user-dash" element={<UserDash />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/super-admin" element={<SuperAdminDashboard />} />
  <Route path="/vehicle-keycode-request" element={<VehicleKeycodeRequest />} />
  <Route path="/membership" element={<MembershipPage />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/profile" element={<UpdateUserProfile />} />
  <Route path="*" element={<LandingPage />} />
</Routes>
```

### Navigation Logic

- **Public Routes**: Landing page, login, register
- **Protected Routes**: User dashboard, admin panel, keycode requests
- **Role-Based Access**: Different navigation items based on user role

---

## Styling System

### CSS Architecture

- **Tailwind CSS**: Primary styling framework
- **Component-Specific CSS**: Individual .css files for complex components
- **Global Styles**: index.css for app-wide styling

### Key Style Files

- **navbar.css**: Navigation component styling
- **lp.css**: Landing page specific styles
- **login.css**: Authentication form styling
- **userDash.css**: Dashboard styling
- **adminDashboard.css**: Admin interface styling

### Design System

- **Color Palette**: Primary (#0b41e4), Success (#4ae66c), CTA (#ffce20)
- **Typography**: Inter font family
- **Spacing**: Consistent padding/margin system
- **Responsive**: Mobile-first design approach

---

## Utility Functions

### Data Utilities

- **states.js**: US/Canada state data
- **features.js**: Subscription feature definitions
- **memberships.js**: Membership plan configurations
- **FAQItems.js**: Frequently asked questions data

### Helper Functions

- **Validation**: Form input validation
- **Formatting**: Data formatting utilities
- **API Calls**: Centralized HTTP request handling

---

## Configuration Files

### Backend Configuration

- **application.properties**: Database, security, and app settings
- **pom.xml**: Maven dependencies and build configuration
- **SecurityConfig.java**: Security and CORS settings

### Frontend Configuration

- **package.json**: Dependencies and scripts
- **vite.config.js**: Build tool configuration
- **tailwind.config.js**: CSS framework configuration

---

## Startup Scripts

### Automated Startup

- **start-app.bat**: Windows batch script
- **start-app.ps1**: PowerShell script
- **start-app.sh**: Cross-platform shell script

### Script Features

- **Backend Startup**: Maven install + Spring Boot run
- **Frontend Startup**: npm install + dev server
- **Test Skipping**: -DskipTests flag for faster startup
- **Separate Testing**: run-tests.bat for dedicated testing

---

## Known Dependencies

### Backend Dependencies

- Spring Boot Starter Web
- Spring Boot Starter Security
- Spring Boot Starter Data JPA
- MySQL Connector
- H2 Database (testing)
- JWT Library
- SendGrid SDK

### Frontend Dependencies

- React 18+
- React Router DOM
- Axios
- Tailwind CSS
- Vite
- Testing libraries

---

## Development Workflow

### Setup Process

1. **Database**: MySQL setup with keycodehelpdb
2. **Backend**: Maven install and Spring Boot startup
3. **Frontend**: npm install and Vite dev server
4. **Environment**: .env file configuration

### Development Commands

- **Backend**: `mvn spring-boot:run`
- **Frontend**: `npm run dev`
- **Testing**: `mvn test` (backend), `npm test` (frontend)
- **Build**: `mvn clean install` (backend), `npm run build` (frontend)

### Code Quality

- **Linting**: ESLint + Prettier
- **Testing**: Unit tests for components and services
- **Formatting**: Consistent code style enforcement

---

## Current Status & Notes

### Working Features

- ✅ User authentication (login/register)
- ✅ Role-based access control
- ✅ Landing page as primary entry point
- ✅ Responsive navigation
- ✅ CORS configuration for multiple ports
- ✅ Database connectivity
- ✅ Automated startup scripts

### Known Issues

- ⚠️ Maven tests may fail during startup (mitigated with -DskipTests)
- ⚠️ Dynamic frontend ports require CORS updates
- ⚠️ Some CSS spacing adjustments may be needed for new components

### Optimization Opportunities

- 🔄 Component reusability analysis
- 🔄 State management consolidation
- 🔄 CSS class standardization
- 🔄 API endpoint optimization

---

## Maintenance Guidelines

### Adding New Features

1. **Component Creation**: Follow MCP pattern
2. **Routing**: Add to App.jsx Routes
3. **Styling**: Use Tailwind CSS with component-specific CSS if needed
4. **Testing**: Include unit tests and Storybook stories
5. **Documentation**: Update this file

### Code Review Checklist

- [ ] Follows established patterns
- [ ] Includes proper error handling
- [ ] Responsive design implementation
- [ ] Accessibility considerations
- [ ] Performance optimization
- [ ] Security validation

### Deployment Considerations

- **Environment Variables**: Secure configuration management
- **Database Migrations**: Schema update procedures
- **Build Optimization**: Production build optimization
- **Monitoring**: Application health monitoring

---

_This documentation should be updated whenever new components, features, or architectural changes are made to maintain accuracy and prevent duplication._
