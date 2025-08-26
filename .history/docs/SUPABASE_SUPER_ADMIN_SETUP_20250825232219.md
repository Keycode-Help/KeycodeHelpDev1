# Supabase Super Admin Setup Guide

## Overview

This guide is specifically tailored for **Supabase** (PostgreSQL) deployment. It ensures your super admin account (`5epmgllc@gmail.com`) can successfully log in to production with the credentials:
- **Email**: `5epmgllc@gmail.com`
- **Password**: `Mrguru2054`

## Supabase Setup Methods

### Method 1: SQL Editor (Recommended for Supabase)

1. **Access Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your KeyCode Help project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Setup Script**
   - Copy and paste the contents of `super-admin-setup.sql`
   - Click "Run" to execute the script

4. **Verify Account Creation**
   - Run this verification query:
   ```sql
   SELECT 
       id, fname, lname, email, role, 
       admin_approved, is_active, validated_user
   FROM keycode_user 
   WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN';
   ```

### Method 2: Supabase CLI (Alternative)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link to Your Project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Run the SQL Script**
   ```bash
   supabase db reset --linked
   # Or run specific SQL file
   supabase db push --linked
   ```

### Method 3: API Endpoint (Production Setup)

1. **Set Environment Variable** in your Supabase project:
   ```bash
   # In your Supabase project settings or environment
   SUPER_ADMIN_SETUP_KEY="your-secure-setup-key-here"
   ```

2. **Call the Setup Endpoint**:
   ```bash
   curl -X POST "https://your-domain.com/auth/setup-super-admin" \
     -d "email=5epmgllc@gmail.com" \
     -d "password=Mrguru2054" \
     -d "fname=Super" \
     -d "lname=Admin" \
     -d "setupKey=your-secure-setup-key-here"
   ```

## Supabase-Specific Configuration

### 1. Database Connection

Ensure your backend `application.properties` has the correct Supabase connection:

```properties
# Supabase Database Configuration
spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_DATABASE_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration for PostgreSQL
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
```

### 2. Supabase Row Level Security (RLS)

If you have RLS enabled, ensure the super admin can access all data:

```sql
-- Create policy for super admin access
CREATE POLICY "Super Admin Full Access" ON keycode_user
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'SUPER_ADMIN'
    );

-- Or disable RLS for admin tables if needed
ALTER TABLE keycode_user DISABLE ROW LEVEL SECURITY;
```

### 3. Supabase Auth Integration

If using Supabase Auth alongside your custom auth:

```sql
-- Ensure your custom user table can work with Supabase Auth
-- You may need to sync user data between systems
```

## Verification in Supabase

### 1. Check Database Tables

In Supabase SQL Editor, verify the table structure:

```sql
-- Check if keycode_user table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'keycode_user';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'keycode_user'
ORDER BY ordinal_position;
```

### 2. Verify Super Admin Account

```sql
-- Check super admin account
SELECT 
    id,
    fname,
    lname,
    email,
    role,
    admin_approved,
    is_active,
    validated_user,
    created_at
FROM keycode_user 
WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN';
```

**Expected Result:**
- `role`: `SUPER_ADMIN`
- `admin_approved`: `true`
- `is_active`: `true`
- `validated_user`: `true`

### 3. Test Database Connection

```sql
-- Test basic database functionality
SELECT version();
SELECT current_database();
SELECT current_user;
```

## Supabase Deployment Steps

### 1. Update Backend Configuration

1. **Modify `application.properties`** for Supabase connection
2. **Deploy backend** with updated configuration
3. **Ensure all endpoints** are accessible

### 2. Run Super Admin Setup

1. **Use Supabase SQL Editor** (Method 1 - Recommended)
2. **Execute the setup script**
3. **Verify account creation**

### 3. Test Authentication

1. **Test login endpoint** with your credentials
2. **Verify JWT token** generation
3. **Check role-based access** control

## Troubleshooting Supabase Issues

### Common Supabase Problems

#### 1. Connection Issues

**Symptoms**: Database connection errors
**Solutions**:
- Verify Supabase project is active
- Check connection string in `application.properties`
- Ensure database password is correct
- Verify IP allowlist if configured

#### 2. Table Not Found

**Symptoms**: "relation does not exist" errors
**Solutions**:
- Check if tables were created during backend startup
- Verify `spring.jpa.hibernate.ddl-auto` setting
- Run table creation scripts manually if needed

#### 3. Permission Issues

**Symptoms**: Access denied errors
**Solutions**:
- Check Supabase RLS policies
- Verify user permissions in Supabase
- Ensure super admin role has proper access

### Debug Commands

```bash
# Check Supabase project status
supabase status

# View logs
supabase logs

# Test database connection
psql "postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

## Supabase Security Best Practices

### 1. Environment Variables

- **Never commit** database credentials to version control
- **Use Supabase secrets** for sensitive configuration
- **Rotate passwords** regularly

### 2. Network Security

- **Configure IP allowlist** if needed
- **Use SSL connections** (enabled by default in Supabase)
- **Monitor access logs** in Supabase dashboard

### 3. Database Security

- **Enable RLS** for production tables
- **Create proper policies** for different user roles
- **Regular backups** using Supabase backup features

## Monitoring in Supabase

### 1. Supabase Dashboard

Monitor these metrics:
- **Database performance** and query times
- **Connection count** and pool usage
- **Storage usage** and growth
- **API request** patterns

### 2. Custom Logging

Set up logging for:
- **Authentication attempts** (success/failure)
- **Super admin actions** and changes
- **Database operations** and performance
- **Error rates** and patterns

## Backup and Recovery

### 1. Supabase Backups

- **Automatic backups** are handled by Supabase
- **Point-in-time recovery** available for Pro plans
- **Manual exports** can be created via SQL Editor

### 2. Super Admin Recovery

If super admin access is lost:

1. **Use Supabase SQL Editor** to recreate account
2. **Run the setup script** again
3. **Contact Supabase support** if needed
4. **Use API endpoint** as alternative

## Next Steps

1. **Update your backend** configuration for Supabase
2. **Deploy the backend** with new endpoints
3. **Run the super admin setup** in Supabase SQL Editor
4. **Test authentication** with your credentials
5. **Verify access** to super admin features

---

**Last Updated**: December 2024
**Version**: 1.0
**Database**: Supabase (PostgreSQL)
**Maintainer**: Development Team
