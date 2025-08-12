# Phase 0 - Alignment & Risk Fixes

This document outlines the changes made during Phase 0 to align the codebase and fix critical risks.

## Overview

Phase 0 focused on:

1. Unifying role models across backend and frontend
2. Standardizing API endpoints
3. Normalizing database structure
4. Implementing secure authentication
5. Consolidating UI components
6. Adding modern frontend tooling

## Changes Made

### 1. Role Model Unification

- **Backend**: Updated `SecurityConfig` to use proper role-based guards
- **Frontend**: Created `utils/roles.js` with helper functions
- **Components**: Updated `Navbar`, `Login`, `AdminLogin` to use role helpers

### 2. API Standardization

- **New Controller**: `KeycodeController` with `/api/v1/keycodes/*` endpoints
- **DTOs**: Created standardized request/response objects
- **Frontend Services**: Updated to use new API structure

### 3. Database Normalization

- **New Table**: `vehicle_info` for normalized vehicle data
- **Migration**: `V1_1__normalize_vehicle_info.sql`
- **Entities**: `VehicleInfo` and `KeycodeRequest` with proper relationships

### 4. CORS Configuration

- **Profile-based**: Dev profile uses wildcard localhost, prod uses strict origins
- **Config**: `CorsConfig` with `@Profile` annotations
- **Properties**: `application-prod.properties` for production settings

### 5. Authentication Security

- **Cookies**: Switched from localStorage to httpOnly cookies
- **Refresh Flow**: Automatic token refresh with axios interceptor
- **Security**: Removed token exposure in frontend

### 6. UI Consolidation

- **SubscriptionManager**: Unified membership and subscription pages
- **Routes**: Updated to use `/subscriptions` with legacy redirects
- **Navigation**: Updated navbar links

### 7. Reusable Forms

- **FormField**: Base input component with validation
- **AuthForm**: Unified form for all authentication types
- **ProfileForm**: Reusable profile update form

### 8. React Query Integration

- **Installation**: Added `@tanstack/react-query`
- **Provider**: Wrapped app with `QueryClientProvider`
- **Example**: `KeycodeRequestsHistory` component using `useQuery`

## Updated Run Commands

### Backend (Dev Profile + Wildcard CORS)

```bash
cd kch-backend
./mvnw -q spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend

```bash
cd kch-frontend
npm i
npm run dev
```

### Optional Tests

```bash
cd kch-backend && ./mvnw -q test
cd ../kch-frontend && npm test
```

## Startup Scripts

All startup scripts have been updated to use the dev profile:

- **Windows**: `start-app.bat`
- **PowerShell**: `start-app.ps1`
- **Shell**: `start-app.sh`

## Acceptance Checklist

- [ ] Role gates: BASEUSER can't access `/admin/*`; ADMIN can't access `/super-admin/*`; SUPER_ADMIN can access all
- [ ] `POST /api/v1/keycodes/lookup` succeeds for valid VIN
- [ ] `GET /api/v1/keycodes/requests` returns current user history
- [ ] Creating a request persists/links a `vehicle_info` row by VIN (unique by VIN)
- [ ] Cookies present (`access_token`, `refresh_token`); 401 triggers silent `/auth/refresh` once
- [ ] CORS works from any `localhost:*` in dev; prod origins read from properties
- [ ] `/subscriptions` replaces Membership/Subscription pages; legacy links redirect

## File Structure

```
kch-backend/
├── src/main/java/org/rma/kchbackend/
│   ├── controller/
│   │   ├── KeycodeController.java          # NEW: v1 API endpoints
│   │   └── AuthController.java             # UPDATED: cookie auth
│   ├── model/
│   │   ├── VehicleInfo.java                # NEW: normalized vehicle data
│   │   └── KeycodeRequest.java             # NEW: with FK relationships
│   ├── dto/                                # NEW: standardized DTOs
│   └── config/
│       └── CorsConfig.java                 # UPDATED: profile-based CORS
├── src/main/resources/
│   ├── application-prod.properties         # NEW: production config
│   └── db/migration/
│       └── V1_1__normalize_vehicle_info.sql # NEW: database migration

kch-frontend/
├── src/
│   ├── components/
│   │   ├── forms/                          # NEW: reusable form components
│   │   │   ├── FormField.jsx
│   │   │   ├── AuthForm.jsx
│   │   │   └── ProfileForm.jsx
│   │   └── KeycodeRequestsHistory.jsx      # NEW: React Query example
│   ├── pages/
│   │   └── SubscriptionManager.jsx         # NEW: unified subscriptions
│   ├── services/
│   │   ├── request.js                      # NEW: axios instance
│   │   └── keycodes.js                     # NEW: v1 API service
│   ├── utils/
│   │   └── roles.js                        # NEW: role helpers
│   ├── context/
│   │   └── AuthContext.jsx                 # UPDATED: cookie auth
│   ├── App.jsx                             # UPDATED: new routes
│   └── main.jsx                            # UPDATED: React Query provider
└── package.json                            # UPDATED: React Query dependency
```

## Next Steps

After Phase 0 completion:

1. Test all acceptance criteria
2. Deploy to staging environment
3. Begin Phase 1 feature development
4. Implement actual business logic in placeholder endpoints
5. Add comprehensive error handling and logging
6. Implement real subscription management system
