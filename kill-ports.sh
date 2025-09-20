#!/bin/bash

# Quick script to kill processes on development ports
# Usage: ./kill-ports.sh

echo "🔪 Killing processes on development ports..."

# Kill port 8080 (backend)
sudo lsof -ti :8080 | xargs sudo kill -9 2>/dev/null && echo "✅ Killed port 8080" || echo "ℹ️  Port 8080 already free"

# Kill port 5173 (frontend) 
sudo lsof -ti :5173 | xargs sudo kill -9 2>/dev/null && echo "✅ Killed port 5173" || echo "ℹ️  Port 5173 already free"

# Kill development processes
pkill -9 -f "vite" 2>/dev/null && echo "✅ Killed Vite" || echo "ℹ️  No Vite processes"
pkill -9 -f "spring-boot" 2>/dev/null && echo "✅ Killed Spring Boot" || echo "ℹ️  No Spring Boot processes"
pkill -9 -f "mvn" 2>/dev/null && echo "✅ Killed Maven" || echo "ℹ️  No Maven processes"

echo "🎯 Ports 8080 and 5173 are now available!"
