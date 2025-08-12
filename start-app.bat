@echo off
echo ========================================
echo    Keycode Help - Starting Application
echo ========================================
echo.

echo Starting Backend (Spring Boot)...
echo.
cd kch-backend
start "Backend - Spring Boot" cmd /k "echo Installing dependencies (skipping tests)... && mvn install -DskipTests && echo Starting Spring Boot application with dev profile... && mvn spring-boot:run -Dspring-boot.run.profiles=dev"

echo.
echo Starting Frontend (React)...
echo.
cd ..\kch-frontend
start "Frontend - React" cmd /k "echo Installing dependencies... && npm install && echo Starting React development server... && npm run dev"

echo.
echo ========================================
echo    Both services are starting up...
echo ========================================
echo.
echo Backend will be available at: http://localhost:8080
echo Frontend will be available at: http://localhost:5173
echo.
echo Note: Tests are skipped during startup to avoid blocking the app.
echo To run tests separately, use: mvn test
echo.
echo Press any key to close this window...
pause >nul
