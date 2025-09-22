# Keycode Help: Technical Architecture Document (TAD)

## Project Overview
Keycode Help is a SaaS platform providing automotive locksmith services by converting Vehicle Identification Numbers (VIN) into key codes for automotive professionals. Target users include locksmiths, automotive repair shops, and tow truck operators, offering emergency keycode services and regular access to resources like guides and support.

This document outlines the architecture, technical requirements, and guidelines for the Keycode Help web application, designed to facilitate collaboration between frontend and backend developers, DevOps, and business stakeholders.

---

## 1. Project Scope
The scope of this project is to build a web application that provides automotive professionals with on-demand access to keycodes. Core features include user authentication, VIN-to-keycode service, subscription models, real-time updates, and secure payment processing.

**Core Features**:
- **VIN to Key Code Conversion Service**: Users enter a VIN to retrieve the corresponding key code.
- **User Management**: Registration, authentication, role-based access, and Multi-Factor Authentication (MFA).
- **Subscription Management**: Implement various membership tiers (e.g., free, basic, premium) with different feature access.
- **Real-Time Data**: MySQL stores user activity logs, VIN lookups, and keycodes.
- **Payment Processing**: Stripe integration for payments and subscription management.
- **Security**: JWT-based authentication with secure role-based access control.
- **24/7 Emergency Access**: Priority access to emergency services for premium users.
- **Analytics and Monitoring**: Track user activity and system logs.

---

## 2. Technical Requirements

### 2.1. Frontend Requirements
- **Framework**: Vanilla JavaScript with Tailwind CSS  
  *Why*: Ensures lightweight, fast, and straightforward development for the MVP.
- **Styling**: Tailwind CSS for flexible, utility-first styling.
- **Pages**:
  - **Landing Page**: Inform users about services.
  - **Login/Register Pages**: Allow user authentication.
  - **Dashboard**: Display VIN lookups and account details.

### 2.2. Backend Requirements
- **Framework**: Node.js with Express.js  
  *Why*: Lightweight framework for REST API development, handling authentication, VIN lookups, and subscription logic.
- **Database**: MySQL  
  *Why*: Structured relational database suitable for storing VIN lookups, user data, and subscription details.
- **Authentication**: JSON Web Tokens (JWT) with bcrypt for password hashing.  
- **Payment Integration**: Stripe for payment processing and subscription management.

### 2.3. Hosting and Deployment
- **Frontend Hosting**: Vercel  
  *Why*: Provides fast, CDN-backed hosting with automatic CI/CD pipelines for static sites.
- **Backend Hosting**: Railway or Render  
  *Why*: Scalable, cost-effective Node.js hosting with minimal server management.

### 2.4. Development Tools
- **Postman**: For API testing during backend development.
- **GitHub Actions**: Automates testing and deployment pipelines.

---

## 3. Business Logic

### 3.1. User Registration and Authentication
- **Registration**: Users register via a secure form. Passwords are hashed with bcrypt before storage.
- **Role-Based Access**: Admin and locksmith roles restrict access to certain endpoints.

### 3.2. VIN to Key Code Service
- **Keycode Lookup**:
  - Users input a VIN.
  - Backend validates the VIN format and checks subscription status.
  - Keycode is retrieved from the database and returned.
- **Logging**: All VIN lookups are logged with user and timestamp data.

### 3.3. Subscription Management
- **Membership Tiers**:
  - **Free Tier**: Limited VIN lookups.
  - **Basic Tier**: More VIN lookups with support access.
  - **Premium Tier**: Unlimited lookups with 24/7 emergency access.
- **Billing**: Stripe handles subscription renewals, downgrades, and cancellations.

### 3.4. Emergency Keycode Service
- Premium users receive priority queueing for VIN lookups.
- Non-premium users are deferred during emergencies.

---

## 4. Architecture Summary

**Simplified Architecture**:
- **Frontend**: Vanilla JavaScript with Tailwind CSS for responsive, lightweight UI.
- **Backend**: Node.js with Express.js for API development.
- **Database**: MySQL for storing structured data like VIN lookups and user profiles.
- **Authentication**: JWT and bcrypt for secure authentication.
- **Payment**: Stripe for handling subscriptions and transactions.

---

## 5. Guidelines and Best Practices

- **Version Control**: Use GitHub with a clear branching strategy:
  - `main` for production-ready code.
  - `dev` for active development.
  - Feature branches for individual tasks.
- **Code Quality**: Use ESLint and Prettier for consistent formatting and error checking.
- **Testing**:
  - **Backend**: Mocha/Chai for API testing.
  - **Frontend**: Manual testing for user flows and responsiveness.
- **Documentation**:
  - Use Postman to document APIs.
  - Update README files to reflect changes and new features.
- **Security**:
  - Use HTTPS for all API calls.
  - Enforce strong password policies and MFA for users.

---

## 6. Deployment and Monitoring

### Frontend Deployment
- Hosted on **Vercel**.
- Automatically builds and deploys from the `main` branch.

### Backend Deployment
- Hosted on **Railway** or **Render**.
- Deployment triggers from pushes to the `main` branch.

### Monitoring
- Use **Vercel Analytics** for frontend performance insights.
- Integrate **Railway/Render logs** to monitor API usage and errors.

---

## 7. Conclusion
This updated TAD aligns with lightweight, robust technology choices, ensuring a fast path to delivering the MVP while maintaining scalability for future growth. By following this architecture, collaborators can focus on delivering the best experience for automotive professionals. Updates to this document will reflect new requirements and refinements as the project evolves.
