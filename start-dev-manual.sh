#!/bin/bash

echo "Starting development environment manually..."

# Kill existing processes
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Create logs directory
mkdir -p logs

# Start backend
echo "Starting backend..."
cd kch-backend
mvn spring-boot:run > ../logs/backend.log 2>&1 &
cd ..

# Wait a moment
sleep 3

# Start frontend
echo "Starting frontend..."
cd kch-frontend
npm run dev > ../logs/frontend.log 2>&1 &
cd ..

echo "Development environment started!"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
