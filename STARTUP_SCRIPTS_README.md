# 🚀 Keycode Help - Startup Scripts

This directory contains convenient scripts to start both the backend and frontend services automatically.

## 📁 Available Scripts

### 🪟 Windows Users

#### Option 1: Batch File (Recommended for most Windows users)

```bash
start-app.bat
```

**How to use:**

- Double-click the `start-app.bat` file
- Or run from command prompt: `start-app.bat`

#### Option 2: PowerShell Script (Better error handling)

```bash
start-app.ps1
```

**How to use:**

- Right-click and "Run with PowerShell"
- Or run from PowerShell: `.\start-app.ps1`

**Note:** If you get a security error, you may need to change the execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 🐧 Linux/Mac Users

#### Shell Script

```bash
start-app.sh
```

**How to use:**

```bash
# Make executable (first time only)
chmod +x start-app.sh

# Run the script
./start-app.sh
```

## ✨ What These Scripts Do

1. **Check Prerequisites** - Verify Java 21, Node.js 18+, and Maven are installed
2. **Start Backend** - Navigate to `kch-backend`, install dependencies (skipping tests), and start Spring Boot
3. **Start Frontend** - Navigate to `kch-frontend`, install dependencies, and start React dev server
4. **Open Separate Windows** - Each service runs in its own terminal window for easy monitoring

## 🧪 Test Handling

**Important:** The startup scripts automatically skip tests (`-DskipTests`) to avoid blocking your application startup. This is useful when:

- Tests are failing due to configuration issues
- You want to get the app running quickly
- You're in development mode

### Running Tests Separately

If you want to run tests to check for issues:

**Windows:**

```bash
run-tests.bat
```

**Manual:**

```bash
cd kch-backend
mvn test
```

## 🎯 Quick Start

### Windows (Easiest)

1. Double-click `start-app.bat`
2. Wait for both services to start
3. Access your app:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080

### Linux/Mac

1. Open terminal in project directory
2. Run: `./start-app.sh`
3. Press `Ctrl+C` to stop all services

## 🛠️ Manual Alternative

If you prefer to run services manually:

**Terminal 1 (Backend):**

```bash
cd kch-backend
mvn install -DskipTests
mvn spring-boot:run
```

**Terminal 2 (Frontend):**

```bash
cd kch-frontend
npm install
npm run dev
```

## 🔧 Troubleshooting

### Common Issues

1. **"Java not found"** - Install Java 21
2. **"Node.js not found"** - Install Node.js 18+
3. **"Maven not found"** - Install Maven
4. **Port conflicts** - Make sure ports 8080 and 5173 are available
5. **Database connection** - Ensure MySQL is running

### Test Failures

If you encounter test failures when running `mvn test`:

1. **Check test configuration** in `src/test/resources/application.properties`
2. **Verify H2 database dependency** is in `pom.xml`
3. **Check for missing environment variables** in test setup
4. **Common causes:**
   - Database connection issues
   - Missing test data
   - Security configuration conflicts
   - JWT token issues

### PowerShell Execution Policy Error

If you get a security error with PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📝 Notes

- **Tests are automatically skipped** during startup to ensure the app runs
- Each service runs in a separate terminal window for easy monitoring
- Services can be stopped individually by closing their respective terminal windows
- The PowerShell version provides the best error handling and user experience on Windows
- Use `run-tests.bat` to debug test issues without blocking app startup
