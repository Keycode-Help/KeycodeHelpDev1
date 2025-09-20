#!/bin/bash

# KCH Development Environment Stop Script
# This script cleanly stops all development processes

echo "🛑 Stopping KCH Development Environment"
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

# Kill processes on specific ports
print_info "Stopping processes on development ports..."

# Kill backend (port 8080)
if lsof -ti :8080 >/dev/null 2>&1; then
    sudo lsof -ti :8080 | xargs sudo kill -9 2>/dev/null
    print_status "Stopped backend processes (port 8080)"
else
    print_info "No backend processes found on port 8080"
fi

# Kill frontend (port 5173)
if lsof -ti :5173 >/dev/null 2>&1; then
    sudo lsof -ti :5173 | xargs sudo kill -9 2>/dev/null
    print_status "Stopped frontend processes (port 5173)"
else
    print_info "No frontend processes found on port 5173"
fi

# Kill development processes by name
print_info "Stopping development processes by name..."

# Kill Vite processes
if pgrep -f "vite" >/dev/null 2>&1; then
    pkill -9 -f "vite" 2>/dev/null
    print_status "Stopped Vite processes"
else
    print_info "No Vite processes found"
fi

# Kill Spring Boot processes
if pgrep -f "spring-boot" >/dev/null 2>&1; then
    pkill -9 -f "spring-boot" 2>/dev/null
    print_status "Stopped Spring Boot processes"
else
    print_info "No Spring Boot processes found"
fi

# Kill Maven processes
if pgrep -f "mvn" >/dev/null 2>&1; then
    pkill -9 -f "mvn" 2>/dev/null
    print_status "Stopped Maven processes"
else
    print_info "No Maven processes found"
fi

# Wait for cleanup
sleep 2

# Verify ports are free
echo ""
print_info "Verifying ports are free..."

if lsof -i :8080 >/dev/null 2>&1; then
    print_warning "Port 8080 still has active connections (may be normal)"
else
    print_status "Port 8080 is free"
fi

if lsof -i :5173 >/dev/null 2>&1; then
    print_warning "Port 5173 still has active connections (may be normal)"
else
    print_status "Port 5173 is free"
fi

# Clean up log files
print_info "Cleaning up log files..."
rm -f backend.log frontend.log 2>/dev/null && print_status "Cleaned up log files" || print_info "No log files to clean"

echo ""
print_status "Development environment stopped successfully!"
print_info "Run ./start-dev.sh to start again"
