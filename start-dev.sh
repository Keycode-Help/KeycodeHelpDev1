#!/bin/bash

# KCH Development Environment Startup Script
# This script kills existing processes and starts fresh backend + frontend

echo "🚀 KCH Development Environment Startup"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Step 1: Kill existing processes
echo ""
print_info "Step 1: Cleaning up existing processes..."

# Kill processes on port 8080 (backend)
print_info "Killing processes on port 8080..."
sudo lsof -ti :8080 | xargs sudo kill -9 2>/dev/null && print_status "Killed processes on port 8080" || print_info "No processes found on port 8080"

# Kill processes on port 5173 (frontend)
print_info "Killing processes on port 5173..."
sudo lsof -ti :5173 | xargs sudo kill -9 2>/dev/null && print_status "Killed processes on port 5173" || print_info "No processes found on port 5173"

# Kill any remaining Node, npm, Vite, Java, Maven processes
print_info "Killing remaining development processes..."
pkill -9 -f "vite" 2>/dev/null && print_status "Killed Vite processes" || print_info "No Vite processes found"
pkill -9 -f "spring-boot" 2>/dev/null && print_status "Killed Spring Boot processes" || print_info "No Spring Boot processes found"
pkill -9 -f "mvn" 2>/dev/null && print_status "Killed Maven processes" || print_info "No Maven processes found"

# Wait for processes to fully terminate
print_info "Waiting for processes to terminate..."
sleep 3

# Step 2: Verify ports are free
echo ""
print_info "Step 2: Verifying ports are free..."

if lsof -i :8080 >/dev/null 2>&1; then
    print_error "Port 8080 is still in use!"
    lsof -i :8080
    exit 1
else
    print_status "Port 8080 is free"
fi

if lsof -i :5173 >/dev/null 2>&1; then
    print_error "Port 5173 is still in use!"
    lsof -i :5173
    exit 1
else
    print_status "Port 5173 is free"
fi

# Step 3: Start Backend
echo ""
print_info "Step 3: Starting Backend (Spring Boot on port 8080)..."
cd kch-backend

# Check if backend directory exists
if [ ! -d "$(pwd)" ]; then
    print_error "Backend directory not found: $(pwd)"
    exit 1
fi

print_info "Starting backend in background..."
nohup mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!

print_status "Backend started with PID: $BACKEND_PID"
print_info "Backend logs: tail -f backend.log"

# Wait a moment for backend to initialize
print_info "Waiting for backend to initialize..."
sleep 10

# Check if backend is responding
print_info "Checking backend health..."
for i in {1..30}; do
    if curl -s http://localhost:8080/actuator/health >/dev/null 2>&1; then
        print_status "Backend is responding on port 8080!"
        break
    else
        if [ $i -eq 30 ]; then
            print_warning "Backend health check timeout (still starting...)"
        else
            printf "."
            sleep 2
        fi
    fi
done

# Step 4: Start Frontend
echo ""
print_info "Step 4: Starting Frontend (Vite on port 5173)..."
cd ../kch-frontend

# Check if frontend directory exists
if [ ! -d "$(pwd)" ]; then
    print_error "Frontend directory not found: $(pwd)"
    exit 1
fi

print_info "Starting frontend in background..."
nohup npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

print_status "Frontend started with PID: $FRONTEND_PID"
print_info "Frontend logs: tail -f frontend.log"

# Wait a moment for frontend to initialize
print_info "Waiting for frontend to initialize..."
sleep 5

# Check if frontend is responding
print_info "Checking frontend availability..."
for i in {1..15}; do
    if curl -s http://localhost:5173 >/dev/null 2>&1; then
        print_status "Frontend is responding on port 5173!"
        break
    else
        if [ $i -eq 15 ]; then
            print_warning "Frontend check timeout (still starting...)"
        else
            printf "."
            sleep 2
        fi
    fi
done

# Step 5: Success Summary
echo ""
echo "🎉 Development Environment Ready!"
echo "================================="
print_status "Backend:  http://localhost:8080"
print_status "Frontend: http://localhost:5173"
print_status "Health:   http://localhost:8080/actuator/health"
echo ""
print_info "Process IDs:"
echo "  Backend PID:  $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
print_info "Log files:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
print_info "To stop all services:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  or run: ./stop-dev.sh"
echo ""
print_status "Happy coding! 🚀"
