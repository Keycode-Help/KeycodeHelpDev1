#!/bin/bash

# Restart Backend Script
# Kills existing backend and starts fresh with new configuration

echo "🔄 Restarting backend with updated Supabase connection settings..."

# Kill existing backend processes
echo "⏹️  Stopping existing backend..."
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "kch-backend" 2>/dev/null || true

# Wait a moment for processes to fully stop
sleep 2

# Kill any remaining processes on port 8080
echo "🧹 Cleaning up port 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Wait for port to be free
sleep 2

# Start backend with new configuration
echo "🚀 Starting backend with ultra-conservative Supabase settings..."
cd kch-backend

# Create logs directory if it doesn't exist
mkdir -p ../logs

# Start backend in background and log output
nohup mvn spring-boot:run > ../logs/backend-restart.log 2>&1 &
BACKEND_PID=$!

# Save PID
echo $BACKEND_PID > ../logs/backend.pid

# Wait a moment for startup
sleep 5

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend restarted successfully!"
    echo "   PID: $BACKEND_PID"
    echo "   URL: http://localhost:8080"
    echo "   Logs: logs/backend-restart.log"
else
    echo "❌ Backend failed to start. Check logs/backend-restart.log"
    exit 1
fi

cd ..


