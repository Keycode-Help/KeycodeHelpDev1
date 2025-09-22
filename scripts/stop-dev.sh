#!/bin/bash

echo "Stopping development environment..."

echo "Stopping backend..."
pkill -f "spring-boot:run" 2>/dev/null || echo "No backend process found"
lsof -ti:8080 | xargs kill -9 2>/dev/null || echo "No process on port 8080"

echo "Stopping frontend..."
pkill -f "vite" 2>/dev/null || echo "No frontend process found"
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No process on port 5173"
lsof -ti:5174 | xargs kill -9 2>/dev/null || echo "No process on port 5174"
lsof -ti:5175 | xargs kill -9 2>/dev/null || echo "No process on port 5175"
lsof -ti:5176 | xargs kill -9 2>/dev/null || echo "No process on port 5176"

echo "Development environment stopped!"
echo "Logs are preserved in logs/ directory"