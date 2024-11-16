
``# Setup Guide

## 1. Environment Setup

- **Node.js**: Version 14+ (recommend using `nvm` for Node version management)
- **MySQL**: Version 8+ for relational database
- **Nodemon**: For automatic server restarts during development

---

## 2. Local Development Setup

### 2.1 Clone the Repository
```bash
git clone https://github.com/Keycode-Help/KeycodeHelpDev1.git
cd keycode-help`` 

### 2.2 Navigate to Backend and Install Dependencies

bash

Copy code

`cd backend
npm install` 

## 2.3 Navigate to Frontend and Install Dependencies

bash

Copy code

`cd ../frontend
npm install` 

### 2.4 Set Up Environment Variables

-   Create a `.env` file in the `backend` directory with the following content:
    
    
    Copy code
    
    `DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=keycode_help
    JWT_SECRET=your_jwt_secret
    PORT=5000` 
    

----------

## 3. Running the Application

### 3.1 Start the Backend

-   Navigate to the `backend` directory:
    
    bash
    
    Copy code
    
    `cd backend
    npm run dev` 
    
-   The backend server will start on `http://localhost:5000`.

### 3.2 Start the Frontend

-   Navigate to the `frontend` directory:
    
    bash
    
    Copy code
    
    `cd ../frontend
    npm run dev` 
    
-   The frontend application will be accessible at `http://localhost:3000`.

----------

## 4. Database Setup

### 4.1 Initialize Database Schema

-   Navigate to the `backend` directory:
    
    bash
    
    Copy code
    
    `cd backend` 
    
-   Run migrations to create tables and set up the schema:
    
    bash
    
    Copy code
    
    `npm run db:migrate` 
    

### 4.2 Seed Database

-   Populate the database with initial data:
    
    bash
    
    Copy code
    
    `npm run db:seed` 
    

----------

## 5. Testing Commands

### 5.1 Run Unit Tests

-   Navigate to the appropriate directory and run:
    
    bash
    
    Copy code
    
    `npm run test:unit` 
    

### 5.2 Run Integration Tests

-   Run integration tests:
    
    bash
    
    Copy code
    
    `npm run test:integration` 
    

----------

## 6. Troubleshooting

### Common Issues:

-   **MySQL Connection**: If MySQL fails to connect, ensure the `.env` file has the correct credentials and the MySQL server is running.
-   **Port Conflicts**: If ports `5000` or `3000` are in use, update the `PORT` in the `.env` file or modify the scripts in `package.json`.

----------

This guide ensures that all collaborators can set up their local environment and run the project seamlessly.
If you encounter any issues, please raise them via the GitHub Issues page.
