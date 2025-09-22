#!/bin/bash

echo "Killing existing processes on ports 8080 and 5173..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || echo "No process on port 8080"
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No process on port 5173"
lsof -ti:5174 | xargs kill -9 2>/dev/null || echo "No process on port 5174"
lsof -ti:5175 | xargs kill -9 2>/dev/null || echo "No process on port 5175"
lsof -ti:5176 | xargs kill -9 2>/dev/null || echo "No process on port 5176"

echo "Starting development environment..."

mkdir -p logs

echo "Starting backend on port 8080..."
cd kch-backend
mvn spring-boot:run > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

sleep 5

echo "Starting frontend on port 5173..."
cd ../kch-frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo "Development environment started!"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo "Logs: logs/backend.log and logs/frontend.log"
echo ""
echo "To stop: ./scripts/stop-dev.sh"