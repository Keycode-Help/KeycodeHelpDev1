# Release Notes

## 1. Initial Version (v0.1)

### Overview
- This version marks the initial setup of the project repository and configuration.
- Core objectives include defining the architecture, setting up the development environment, and establishing initial project workflows.

### Features
- **Project Setup**: Basic setup of project directories, configuration files, and environment variables.
- **Development Workflow**:
  - Initial Git branching strategy and contribution guidelines.
  - CI/CD setup using GitHub Actions for automated testing and deployments.
- **Documentation**:
  - Created foundational documentation, including setup instructions, development workflows, and user stories.
  - Initial Technical Architecture Document (TAD) outlining project scope and high-level technical requirements.

## 2. Planned Features for v0.2

### 2.1. Authentication Setup
- **Firebase Authentication**: Configure basic email/password authentication.
- **User Roles**: Define initial roles (e.g., Admin, Locksmith) to control access levels.

### 2.2. Core VIN Lookup API
- **Basic API Endpoint**: Implement a mock VIN lookup endpoint to simulate keycode retrieval functionality.
- **Logging and Error Handling**: Introduce basic logging for API requests and initial error handling for common issues.

### 2.3. UI and Frontend Components
- **Basic UI Layout**: Develop a minimal frontend with a form for entering VINs.
- **Responsive Design**: Start using Tailwind CSS to ensure mobile-friendly layouts.

## 3. Known Limitations in v0.1

### 3.1. No Real Data Integration
- The VIN lookup functionality is not yet connected to a real database or external API; data will be simulated in early versions.

### 3.2. Limited User Roles
- Role-based access control is not yet fully implemented; planned for future versions.

## 4. Roadmap for Future Versions

### 4.1. Database Integration (v0.3)
- Set up Firebase Firestore or a similar database to manage VIN data, user information, and subscription details.

### 4.2. Subscription Management (v0.4)
- Integrate Stripe to handle payments and subscription tiers.

### 4.3. Initial User Testing and Feedback (v0.5)
- Gather feedback from initial test users to guide UI/UX improvements and feature prioritization.
