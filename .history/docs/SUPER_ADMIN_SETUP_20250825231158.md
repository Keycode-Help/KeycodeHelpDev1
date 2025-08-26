# Super Admin Account Setup Guide

## Overview

This guide ensures your super admin account (`5epmgllc@gmail.com`) can successfully log in to production with the credentials:
- **Email**: `5epmgllc@gmail.com`
- **Password**: `Mrguru2054`

## Production Setup Methods

### Method 1: SQL Script (Recommended for Production)

1. **Run the SQL script** `super-admin-setup.sql` in your production database:

```sql
-- This script will create or update your super admin account
-- Run this in your production database during deployment
```

2. **Execute the script** using your database management tool or command line:

```bash
# For PostgreSQL
psql -h your-host -U your-user -d your-database -f super-admin-setup.sql

# For MySQL
mysql -h your-host -u your-user -p your-database < super-admin-setup.sql
```

### Method 2: API Endpoint (Alternative)

1. **Set environment variable** in your production environment:

```bash
export SUPER_ADMIN_SETUP_KEY="your-secure-setup-key-here"
```

2. **Call the setup endpoint** (only once during setup):

```bash
curl -X POST "https://your-domain.com/auth/setup-super-admin" \
  -d "email=5epmgllc@gmail.com" \
  -d "password=Mrguru2054" \
  -d "fname=Super" \
  -d "lname=Admin" \
  -d "setupKey=your-secure-setup-key-here"
```

## Verification Steps

### 1. Check Database

Verify the account exists in your production database:

```sql
SELECT 
    id,
    fname,
    lname,
    email,
    role,
    admin_approved,
    is_active,
    validated_user
FROM keycode_user 
WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN';
```

**Expected Result:**
- `role` should be `SUPER_ADMIN`
- `admin_approved` should be `true`
- `is_active` should be `true`
- `validated_user` should be `true`

### 2. Test Login

1. **Navigate to** `/admin-login` or `/login` in your production app
2. **Enter credentials**:
   - Email: `5epmgllc@gmail.com`
   - Password: `Mrguru2054`
3. **Verify successful login** and redirect to super admin dashboard

### 3. Check Permissions

After login, verify you have access to:
- `/super-admin` - Super admin dashboard
- `/admin` - Admin dashboard
- All protected endpoints

## Security Considerations

### 1. Setup Key Protection

- **Never commit** the `SUPER_ADMIN_SETUP_KEY` to version control
- **Use strong, unique** setup keys for production
- **Rotate keys** periodically if needed

### 2. Account Security

- **Change password** after first login if desired
- **Enable 2FA** if your app supports it
- **Monitor access** logs for suspicious activity

### 3. Production Hardening

- **Remove or secure** the `/dev-upsert-admin` endpoint in production
- **Use HTTPS** for all authentication endpoints
- **Implement rate limiting** on login attempts

## Troubleshooting

### Common Issues

#### 1. Login Fails

**Symptoms**: Invalid credentials error
**Solutions**:
- Verify account exists in database
- Check password hash is correct
- Ensure account is active and approved

#### 2. Access Denied

**Symptoms**: 403 Forbidden after login
**Solutions**:
- Verify role is `SUPER_ADMIN`
- Check `admin_approved` is `true`
- Ensure `is_active` is `true`

#### 3. Account Not Found

**Symptoms**: User not found error
**Solutions**:
- Run the SQL setup script
- Check database connection
- Verify table structure

### Debug Steps

1. **Check application logs** for authentication errors
2. **Verify database connection** and table structure
3. **Test endpoint directly** using curl or Postman
4. **Check security configuration** in `SecurityConfig.java`

## Environment Variables

### Required for Production

```bash
# Database connection
DATABASE_URL=your-database-connection-string
DATABASE_USERNAME=your-database-username
DATABASE_PASSWORD=your-database-password

# Super admin setup (only during initial setup)
SUPER_ADMIN_SETUP_KEY=your-secure-setup-key

# JWT configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=86400000
```

## Database Schema Requirements

Ensure your `keycode_user` table has these columns:

```sql
CREATE TABLE keycode_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    admin_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    state VARCHAR(100) NOT NULL,
    validated_user BOOLEAN DEFAULT FALSE,
    admin_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Backup and Recovery

### 1. Backup Super Admin Account

```sql
-- Backup super admin account
SELECT * FROM keycode_user 
WHERE role = 'SUPER_ADMIN' 
INTO OUTFILE '/backup/super_admin_backup.sql';
```

### 2. Recovery Process

If super admin access is lost:

1. **Restore from backup** if available
2. **Use SQL script** to recreate account
3. **Use API endpoint** with setup key
4. **Contact database administrator** for manual recovery

## Monitoring

### 1. Access Logs

Monitor these events:
- Super admin login attempts
- Failed authentication
- Role changes
- Account modifications

### 2. Security Alerts

Set up alerts for:
- Multiple failed login attempts
- Unusual access patterns
- Role escalation attempts

## Support

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review application logs** for error details
3. **Verify database state** using provided SQL queries
4. **Contact development team** with specific error messages

---

**Last Updated**: December 2024
**Version**: 1.0
**Maintainer**: Development Team
