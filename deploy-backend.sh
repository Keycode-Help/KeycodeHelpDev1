#!/bin/bash

echo "🚀 Deploying KCH Backend to Render..."

# Check if we're in the right directory
if [ ! -f "kch-backend/pom.xml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to backend directory
cd kch-backend

echo "📦 Building the backend..."
./mvnw clean package -DskipTests

if [ $? -eq 0 ]; then
    echo "✅ Backend built successfully!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Commit and push your changes to your Git repository"
    echo "2. Render will automatically deploy the changes"
    echo "3. Make sure these environment variables are set in Render:"
    echo "   - JWT_SECRET (32+ character string)"
    echo "   - DATABASE_URL"
    echo "   - DATABASE_USERNAME" 
    echo "   - DATABASE_PASSWORD"
    echo "   - APP_CORS_ALLOWED_ORIGINS"
    echo ""
    echo "📋 To check deployment status:"
    echo "   - Visit your Render dashboard"
    echo "   - Check the service logs for JWT initialization messages"
    echo ""
    echo "🔍 To test the fix:"
    echo "   - Wait for deployment to complete"
    echo "   - Check browser console for JWT validation logs"
    echo "   - The 403 error should be resolved"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
