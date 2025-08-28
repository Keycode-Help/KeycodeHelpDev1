# Keycode Portals Setup Guide

This guide explains how to set up and configure the admin-only keycode portals system for accessing OEM keycode services.

## Overview

The keycode portals system provides secure access to various OEM (Original Equipment Manufacturer) keycode services for admin and super admin users. It includes:

- **Secure credential management** via environment variables
- **RBAC (Role-Based Access Control)** - only admin/super_admin users can access
- **Working portal links** to OEM services
- **Credential copying** functionality
- **Audit logging** for security compliance

## Features

### 🔐 Security Features

- **Role-based access control** - Only admin and super_admin users can access
- **Environment variable storage** - No hardcoded credentials
- **Origin validation** - CORS protection
- **Audit logging** - Track all credential access

### 🚀 Portal Features

- **Direct portal links** - Click to open OEM services in new tabs
- **Credential copying** - Copy username/password to clipboard
- **Status badges** - SDRM, Coming Soon indicators
- **Environment variable display** - Shows which env vars are used

### 📱 User Experience

- **Responsive design** - Works on all devices
- **Authy app instructions** - Guides users to download 2FA app
- **Clear feedback** - Success/error messages for all actions
- **Loading states** - Visual feedback during operations

## Setup Instructions

### 1. Environment Variables

Set the following environment variables in your deployment platform (Render, Vercel, etc.):

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
KCH_VSP_ID=4E1B0D2W

# Acura
KCH_ACURA_USER=your_username
KCH_ACURA_PASS=your_password

# Audi
KCH_AUDI_USER=your_username
KCH_AUDI_PASS=your_password

# BMW
KCH_BMW_USER=your_username
KCH_BMW_PASS=your_password

# FCA
KCH_FCA_USER=your_username
KCH_FCA_PASS=your_password

# Ford
KCH_FORD_USER=your_username
KCH_FORD_PASS=your_password

# GM
KCH_GM_USER=your_username
KCH_GM_PASS=your_password

# Genesis
KCH_GENESIS_USER=your_username
KCH_GENESIS_PASS=your_password

# Honda
KCH_HONDA_USER=your_username
KCH_HONDA_PASS=your_password

# Hyundai
KCH_HYUNDAI_USER=your_username
KCH_HYUNDAI_PASS=your_password

# Infiniti
KCH_INFINITI_USER=your_username
KCH_INFINITI_PASS=your_password

# Isuzu
KCH_ISUZU_USER=your_username
KCH_ISUZU_PASS=your_password

# Jaguar
KCH_JAGUAR_USER=your_username
KCH_JAGUAR_PASS=your_password

# KIA
KCH_KIA_USER=your_username
KCH_KIA_PASS=your_password

# Land Rover
KCH_LAND_ROVER_USER=your_username
KCH_LAND_ROVER_PASS=your_password

# Lexus
KCH_LEXUS_USER=your_username
KCH_LEXUS_PASS=your_password

# Mazda
KCH_MAZDA_USER=your_username
KCH_MAZDA_PASS=your_password

# McLaren
KCH_MCLAREN_USER=your_username
KCH_MCLAREN_PASS=your_password

# Mercedes Benz
KCH_MERCEDES_BENZ_USER=your_username
KCH_MERCEDES_BENZ_PASS=your_password

# Mini
KCH_MINI_USER=your_username
KCH_MINI_PASS=your_password

# Mitsubishi
KCH_MITSUBISHI_USER=your_username
KCH_MITSUBISHI_PASS=your_password

# Nissan
KCH_NISSAN_USER=your_username
KCH_NISSAN_PASS=your_password

# Polestar
KCH_POLESTAR_USER=your_username
KCH_POLESTAR_PASS=your_password

# Porsche
KCH_PORSCHE_USER=your_username
KCH_PORSCHE_PASS=your_password

# Saab
KCH_SAAB_USER=your_username
KCH_SAAB_PASS=your_password

# Smart
KCH_SMART_USER=your_username
KCH_SMART_PASS=your_password

# Sprinter
KCH_SPRINTER_USER=your_username
KCH_SPRINTER_PASS=your_password

# Subaru
KCH_SUBARU_USER=your_username
KCH_SUBARU_PASS=your_password

# Suzuki
KCH_SUZUKI_USER=your_username
KCH_SUZUKI_PASS=your_password

# Toyota
KCH_TOYOTA_USER=your_username
KCH_TOYOTA_PASS=your_password

# Volkswagen
KCH_VOLKSWAGEN_USER=your_username
KCH_VOLKSWAGEN_PASS=your_password

# Volvo
KCH_VOLVO_USER=your_username
KCH_VOLVO_PASS=your_password
```

### 2. Backend Configuration

Ensure your Spring Boot backend has the following:

- **KeycodeController** - Handles API requests
- **KeycodeService** - Business logic for credentials
- **Environment variables** - Set the same variables as frontend
- **CORS configuration** - Allow your frontend domain

### 3. Frontend Configuration

The frontend automatically:

- Loads portal configuration from `src/config/keycode-portals.json`
- Routes to `/keycodes` for admin/super_admin users
- Integrates with existing navigation

## Usage

### For Admin Users

1. **Navigate to Keycode Portals**

   - Click "Keycode Portals" in admin navigation
   - Or go directly to `/keycodes`

2. **Access OEM Services**

   - Click "Launch" to open OEM portal in new tab
   - Click "Copy Creds" to get username/password

3. **Download Authy App**
   - Follow instructions to download 2FA app
   - Required for many OEM portals

### For Super Admin Users

- Same access as admin users
- Can manage admin accounts
- Full system access

## Security Considerations

### ✅ What's Secure

- Credentials stored in environment variables
- Role-based access control
- Origin validation
- Audit logging
- No hardcoded secrets

### ⚠️ Security Notes

- **Never commit credentials** to Git
- **Rotate passwords** regularly
- **Monitor access logs** for suspicious activity
- **Use HTTPS** in production
- **Limit admin access** to trusted users

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**

   - Check user role (must be admin or super_admin)
   - Verify authentication is working

2. **404 Unknown OEM Error**

   - Check OEM ID in request
   - Verify OEM exists in configuration

3. **409 Missing Credentials Error**

   - Check environment variables are set
   - Verify variable names match configuration

4. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Verify backend CORS configuration

### Debug Steps

1. **Check browser console** for frontend errors
2. **Check backend logs** for API errors
3. **Verify environment variables** are loaded
4. **Test authentication** with simple API call
5. **Check user role** in database

## File Structure

```
kch-frontend/
├── src/
│   ├── components/
│   │   └── KeycodeGrid.jsx          # Portal grid component
│   ├── pages/
│   │   └── KeycodePortals.jsx       # Main portals page
│   ├── services/
│   │   └── keycodeService.js        # API service
│   ├── styles/
│   │   └── keycode-portals.css      # Styling
│   └── config/
│       └── keycode-portals.json     # Portal configuration
├── secrets.env.template              # Environment variables template
└── KEYCODE_PORTALS_SETUP.md         # This file

kch-backend/
├── src/main/java/
│   └── org/rma/kchbackend/
│       ├── controller/
│       │   └── KeycodeController.java    # API endpoints
│       └── service/
│           └── KeycodeService.java       # Business logic
```

## Support

For issues or questions:

1. Check this documentation
2. Review error logs
3. Verify environment variables
4. Test with known working credentials
5. Contact system administrator

## Updates

- **v1.0.0** - Initial release with basic portal access
- **v1.1.0** - Added SDRM and Coming Soon badges
- **v1.2.0** - Enhanced security and audit logging
- **v1.3.0** - Added Authy app instructions and mobile optimization
