
### `setup_guide.md`

```markdown
# Setup Guide

## 1. Environment Setup

- **Java**: Version 11+
- **Node.js**: Version 14+ (recommend using `nvm` for Node version management)
- **PostgreSQL**: Version 12+ for database
- **Firebase CLI**: Required for interacting with Firebase services

## 2. Local Development Setup

### 2.1. Clone the Repository
```bash
git clone https://github.com/YourUsername/keycode-help.git
cd keycode-help
```

### 2.2. Install Dependencies
```bash
npm install
```

### 2.3. Environment Variables
- Create a `.env.local` file in the root directory.
- Add required variables, including Firebase configuration, Stripe keys, etc.

## 3. Running the Application

### 3.1. Start the Backend
```bash
npm run start:backend
```

### 3.2. Start the Frontend
```bash
npm run dev
```
- Access the app at `http://localhost:3000`

## 4. Database Setup

### 4.1. Initialize Database Schema
- Run migrations to create tables and set up the schema.
```bash
npm run db:migrate
```

### 4.2. Seed Database
- Populate the database with initial data.
```bash
npm run db:seed
```

## 5. Testing Commands

### 5.1. Run Unit Tests
```bash
npm run test:unit
```

### 5.2. Run Integration Tests
```bash
npm run test:integration
```
```
