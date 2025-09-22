#!/bin/bash

# Start Frontend Only Script
# For debugging frontend issues without backend dependencies

echo "🧪 Starting frontend only for debugging..."

# Kill existing frontend processes
echo "⏹️  Stopping existing frontend..."
pkill -f "vite" 2>/dev/null || true

# Wait for processes to stop
sleep 2

# Kill any remaining processes on port 5173
echo "🧹 Cleaning up port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Wait for port to be free
sleep 2

# Start frontend only
echo "🚀 Starting frontend on port 5173..."
cd kch-frontend

# Create logs directory if it doesn't exist
mkdir -p ../logs

# Start frontend in background and log output
nohup npm run dev > ../logs/frontend-only.log 2>&1 &
FRONTEND_PID=$!

# Save PID
echo $FRONTEND_PID > ../logs/frontend-only.pid

# Wait a moment for startup
sleep 5

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend started successfully!"
    echo "   PID: $FRONTEND_PID"
    echo "   URL: http://localhost:5173"
    echo "   Test URL: http://localhost:5173/test"
    echo "   Logs: logs/frontend-only.log"
    echo ""
    echo "🧪 To test without authentication issues:"
    echo "   Visit: http://localhost:5173/test"
else
    echo "❌ Frontend failed to start. Check logs/frontend-only.log"
    exit 1
fi

cd ..
