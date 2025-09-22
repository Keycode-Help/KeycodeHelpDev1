#!/bin/bash

echo "Killing processes on ports 8080 and 5173..."

echo "Killing processes on port 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || echo "No process on port 8080"

echo "Killing processes on port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No process on port 5173"

echo "Killing processes on ports 5174-5176..."
lsof -ti:5174 | xargs kill -9 2>/dev/null || echo "No process on port 5174"
lsof -ti:5175 | xargs kill -9 2>/dev/null || echo "No process on port 5175"
lsof -ti:5176 | xargs kill -9 2>/dev/null || echo "No process on port 5176"

echo "All processes killed!"