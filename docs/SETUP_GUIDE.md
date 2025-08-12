# 🚀 Keycode Help Setup Guide

This guide will help you set up and run the Keycode Help application in your local development environment.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

1. **Java 21** - Required for Spring Boot backend
2. **Node.js 18+** - Required for React frontend
3. **MySQL 8.0+** - Database server
4. **Maven** - Java dependency management

## 🗄️ Database Setup

### 1. Install MySQL

- Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/)
- Or use Docker: `docker run --name mysql-kch -e MYSQL_ROOT_PASSWORD=your_password -e MYSQL_DATABASE=kchdb -p 3306:3306 -d mysql:8.0`

### 2. Create Database

```sql
CREATE DATABASE kchdb;
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd kch-backend
```

### 2. Configure Environment Variables

The `.env` file has been created with placeholder values. Update it with your actual credentials:

```env
# Database Configuration
MYSQL_PASSWORD=your_actual_mysql_password

# SendGrid API Configuration (Optional for development)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here

# Server Configuration
SERVER_PORT=8080
```

### 3. Install Dependencies

```bash
mvn install
```

### 4. Run the Backend

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd kch-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default port)

## 🔗 API Endpoints

The backend provides the following main endpoints:

- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/vin/{vin}` - VIN to keycode lookup
- `GET /api/keycode/{keycode}` - Keycode to key type lookup
- `POST /api/support/chat` - Tech support chat

## 🛠️ Development Workflow

### Running Both Services

1. **Terminal 1 - Backend:**

   ```bash
   cd kch-backend
   mvn spring-boot:run
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd kch-frontend
   npm run dev
   ```

### Database Migrations

The application uses Hibernate with `ddl-auto=update`, so the database schema will be automatically created/updated when you start the backend.

## 🔍 Troubleshooting

### Common Issues:

1. **MySQL Connection Failed**

   - Verify MySQL is running
   - Check the password in `.env` file
   - Ensure database `kchdb` exists

2. **Port Already in Use**

   - Backend: Change `SERVER_PORT` in `.env`
   - Frontend: Vite will automatically find an available port

3. **Java Version Issues**

   - Ensure Java 21 is installed and set as JAVA_HOME
   - Run `java -version` to verify

4. **Node.js Issues**
   - Ensure Node.js 18+ is installed
   - Run `node --version` to verify

## 📱 Accessing the Application

Once both services are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html (if Swagger is configured)

## 🔐 Environment Variables Reference

| Variable           | Description                  | Required           |
| ------------------ | ---------------------------- | ------------------ |
| `MYSQL_PASSWORD`   | MySQL root password          | Yes                |
| `SENDGRID_API_KEY` | SendGrid API key for emails  | No (for dev)       |
| `JWT_SECRET`       | Secret for JWT token signing | Yes                |
| `SERVER_PORT`      | Backend server port          | No (default: 8080) |

## 🚀 Next Steps

1. Update the `.env` file with your actual credentials
2. Start the backend: `mvn spring-boot:run`
3. Start the frontend: `npm run dev`
4. Access the application at http://localhost:5173

Happy coding! 🎉
