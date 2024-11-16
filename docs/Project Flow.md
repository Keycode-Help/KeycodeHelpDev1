
# Keycode Help Project Workflow

## Branch Structure Overview

The **Keycode Help** project follows a structured branching strategy to maintain code quality, testing, and deployment across environments. Here’s an overview of the three main branches:

- **`dev` branch**: Used for active development and integration of new features. All feature branches should be merged into `dev` after initial testing.
- **`main` branch**: Serves as the staging environment. This branch is considered stable and contains features ready for final testing before going live.
- **`production` branch**: Represents the live codebase. Only thoroughly tested and approved changes from the `main` branch should be merged here.

---

## Workflow Outline

### 1. Setting Up Your Local Development Environment

1. **Clone the Repository**:
   ```bash
   git clone <repo_url>
   cd keycode-help
   ```

2. **Switch to the `dev` Branch**:
   ```bash
   git checkout dev
   ```

3. **Install Dependencies**:
   - Make sure you have **Node.js** and **Java** (for backend work) installed.
   - Run the following commands based on the stack:
     ```bash
     # For front-end
     npm install
     
     # For back-end (if using Spring Boot)
     ./mvnw install
     ```

4. **Set Up Environment Variables**:
   - Refer to the `README.md` or `.env.example` file for necessary environment variables.
   - Create a `.env` file at the project root and add your local configurations.

---

### 2. Working on a New Feature / Bug Fix

1. **Create a New Feature Branch**:
   - Always branch off from `dev`.
   - Use a descriptive branch name based on the feature or issue, e.g., `feature/login-system` or `bugfix/api-timeout`.
   ```bash
   git checkout -b feature/branch-name dev
   ```

2. **Develop & Test Your Code**:
   - Use **Figma** for UI designs, **VSCode** as the primary editor, and follow project coding standards.
   - Ensure your feature is thoroughly tested locally.

3. **Commit Your Changes**:
   - Follow a clear and consistent commit message format:
     - **For features**: `feat: added user login flow`
     - **For bug fixes**: `fix: resolved API timeout issue`
   ```bash
   git add .
   git commit -m "feat: detailed commit message"
   ```

4. **Push Your Branch**:
   ```bash
   git push origin feature/branch-name
   ```

5. **Create a Pull Request (PR) into `dev`**:
   - Open a pull request from your feature branch into `dev`.
   - Make sure to include a clear description of your changes, any dependencies, and testing notes.
   - Assign a reviewer and label appropriately.

---

### 3. Merging Workflow

#### Merging from Feature Branch to `dev` Branch

- **Pre-Merge Checklist**:
  - Ensure the code passes all unit tests and linting requirements.
  - Update any relevant documentation (e.g., README, comments, or inline documentation).

- **Merge**:
  - The reviewer will approve the PR after verifying that all tests pass.
  - Squash and merge into `dev` to keep commit history clean.

#### Merging from `dev` Branch to `main` Branch (Staging)

- **Testing in `dev`**:
  - Once features are merged into `dev`, conduct integration testing.
  - Confirm that all features are stable and functioning as expected in the dev environment.

- **Open a PR into `main`**:
  - Only stable, tested features should be moved to `main`.
  - Once approved, merge into `main` to prepare for staging and pre-production testing.

#### Merging from `main` Branch to `production` Branch

- **Final Review**:
  - Before merging `main` into `production`, perform final checks and tests in the staging environment.

- **Open a PR into `production`**:
  - Ensure all critical tests are complete.
  - Only merge `main` into `production` after the code has been verified to be fully stable.

---

### 4. Deployment Process

1. **Automatic Deployments**:
   - **`dev` branch** may deploy automatically to a dev environment for ongoing testing.
   - **`main` branch** deploys to the staging environment for final approval and testing.
   - **`production` branch** deploys to the live environment upon merge.

   > Ensure all secrets and configurations are properly set up in CI/CD for smooth deployments.

2. **Manual Deployment Steps** (if needed):
   - In case automatic deployment fails or is disabled, follow the manual deployment steps outlined in the **deployment documentation**.

---

### 5. Code Review and Quality Assurance

- **Code Review**: All pull requests should be reviewed by at least one other team member before merging. Pay attention to readability, performance, and adherence to coding standards.
- **Testing Requirements**:
  - Unit tests for all new functionality.
  - Run end-to-end tests for critical user flows.
  - Confirm that no breaking changes are introduced by running regression tests in staging.

---

### 6. Hotfixes

1. **Creating a Hotfix**:
   - In urgent cases (e.g., critical bugs in production), create a branch directly from `production`, e.g., `hotfix/login-issue`.
   ```bash
   git checkout production
   git checkout -b hotfix/branch-name
   ```

2. **Merge and Deploy**:
   - Once fixed, open a PR to `production`.
   - After merging, backport the hotfix to `main` and `dev` branches to keep all branches in sync.

---

### 7. Release Management

- **Release Notes**: Document all changes in `main` before merging to `production`.
- **Tagging**: Tag each production release with a version number, e.g., `v1.0.0`.
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```

---

## Summary

- **Feature/Bugfix Workflow**: `feature/branch-name` → `dev` → `main` → `production`
- **Hotfix Workflow**: `hotfix/branch-name` (from `production`) → `production` → backport to `main` and `dev`
- **Branch Protection**:
  - `production` branch is protected; only approved PRs can be merged.
  - `main` and `dev` require at least one code review approval.

