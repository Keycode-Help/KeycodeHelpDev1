#!/bin/bash

# Test Super Admin Setup Script
# This script tests the super admin setup functionality

echo "🔐 Testing Super Admin Setup for KeyCode Help"
echo "=============================================="

# Configuration
EMAIL="5epmgllc@gmail.com"
PASSWORD="Mrguru2054"
BASE_URL="http://localhost:8080"  # Change this to your production URL

echo "📧 Email: $EMAIL"
echo "🔑 Password: $PASSWORD"
echo "🌐 Base URL: $BASE_URL"
echo ""

# Test 1: Check if the setup endpoint is accessible
echo "🧪 Test 1: Checking setup endpoint accessibility..."
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/auth/setup-super-admin" | grep -q "405\|400\|403"; then
    echo "✅ Setup endpoint is accessible"
else
    echo "❌ Setup endpoint may not be accessible"
fi

# Test 2: Test super admin login (if account exists)
echo ""
echo "🧪 Test 2: Testing super admin login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    echo "✅ Super admin login successful!"
    echo "🔑 Access token received"
    
    # Extract token for further testing
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    
    # Test 3: Verify super admin role
    echo ""
    echo "🧪 Test 3: Verifying super admin role..."
    USER_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/me" \
        -H "Authorization: Bearer $TOKEN")
    
    if echo "$USER_RESPONSE" | grep -q "SUPER_ADMIN"; then
        echo "✅ User role verified as SUPER_ADMIN"
    else
        echo "❌ User role is not SUPER_ADMIN"
        echo "Response: $USER_RESPONSE"
    fi
    
    # Test 4: Test super admin dashboard access
    echo ""
    echo "🧪 Test 4: Testing super admin dashboard access..."
    DASHBOARD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X GET "$BASE_URL/super-admin" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$DASHBOARD_RESPONSE" = "200" ]; then
        echo "✅ Super admin dashboard accessible"
    else
        echo "❌ Super admin dashboard not accessible (HTTP $DASHBOARD_RESPONSE)"
    fi
    
else
    echo "❌ Super admin login failed"
    echo "Response: $LOGIN_RESPONSE"
    echo ""
    echo "💡 The account may not exist yet. You need to:"
    echo "   1. Run the SQL script: super-admin-setup.sql"
    echo "   2. Or use the setup endpoint with proper setup key"
fi

echo ""
echo "📋 Summary:"
echo "==========="
echo "• Email: $EMAIL"
echo "• Password: $PASSWORD"
echo "• Base URL: $BASE_URL"
echo ""
echo "🔧 Next Steps:"
echo "=============="
echo "1. If tests failed, run the SQL setup script"
echo "2. Check the SUPER_ADMIN_SETUP.md guide"
echo "3. Verify database connection and schema"
echo "4. Test with production URL when deployed"
echo ""
echo "📚 Documentation: docs/SUPER_ADMIN_SETUP.md"
