# Development Workflow

## 1. Branching Strategy

- **Main**: Production-ready code.
- **Dev**: Staging branch for testing.
- **Feature Branches**: Create a new branch for each feature (`feature/feature-name`).

## 2. Code Review Process

- Open a pull request (PR) to merge feature branches into `dev`.
- Assign at least one reviewer and address comments before merging.

## 3. Agile Workflow

### 3.1. Sprint Cycles
- Each sprint lasts for 2 weeks, with planned tasks and deliverables.

### 3.2. Stand-Ups
- Daily check-ins to discuss progress and blockers.

### 3.3. Retrospectives
- Held at the end of each sprint to discuss improvements and lessons learned.

## 4. CI/CD Pipeline

### 4.1. Automated Testing
- **GitHub Actions**: Automatically runs tests on each PR to ensure quality.

### 4.2. Deployment Process
- **Production**: Code merged into `main` is deployed to production.
- **Staging**: Code merged into `dev` is deployed to staging for testing.
