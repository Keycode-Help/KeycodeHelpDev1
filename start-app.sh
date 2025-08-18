#!/bin/bash

# Keycode Help - Application Startup Script
# Cross-platform shell script

echo "========================================"
echo "   Keycode Help - Starting Application"
echo "========================================"
echo ""

# Check if Java is installed
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "✓ Java found: $JAVA_VERSION"
else
    echo "✗ Java not found! Please install Java 21"
    exit 1
fi

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js found: $NODE_VERSION"
else
    echo "✗ Node.js not found! Please install Node.js 18+"
    exit 1
fi

# Check if Maven is installed
if command -v mvn &> /dev/null; then
    MVN_VERSION=$(mvn --version | head -n 1)
    echo "✓ Maven found: $MVN_VERSION"
else
    echo "✗ Maven not found! Please install Maven"
    exit 1
fi

echo ""
echo "Starting Backend (Spring Boot)..."
echo ""

# Start Backend in background
cd kch-backend
echo "Installing Maven dependencies (skipping tests)..."
mvn install -DskipTests
echo "Starting Spring Boot application with dev profile..."
mvn spring-boot:run -Dspring-boot.run.profiles=dev &
BACKEND_PID=$!

echo ""
echo "Starting Frontend (React)..."
echo ""

# Start Frontend in background
cd ../kch-frontend
echo "Installing npm dependencies..."
npm install
echo "Starting React development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "    Both services are starting up..."
echo "========================================"
echo ""
echo "Backend will be available at: http://localhost:8080"
echo "Frontend will be available at: http://localhost:5173"
echo ""
echo "Note: Tests are skipped during startup to avoid blocking the app."
echo "To run tests separately, use: mvn test"
echo ""
echo "Services are running in background (PIDs: $BACKEND_PID, $FRONTEND_PID)"
echo "To stop services, press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Services stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
echo "Press Ctrl+C to stop all services..."
wait
