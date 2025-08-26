# Production Deployment Checklist - Super Admin Access

## Pre-Deployment

### ✅ Backend Compilation

- [ ] Backend compiles without errors: `mvn compile`
- [ ] All new endpoints are accessible
- [ ] Security configuration is properly set

### ✅ Supabase Database Preparation

- [ ] Supabase project is active and accessible
- [ ] Database connection strings are configured for Supabase
- [ ] `keycode_user` table exists with required columns
- [ ] PostgreSQL dialect is configured in `application.properties`

### ✅ Environment Variables

- [ ] `SUPER_ADMIN_SETUP_KEY` is set (for initial setup)
- [ ] Database connection strings are configured
- [ ] JWT secrets are properly set

## Deployment Steps

### 1. Deploy Backend

```bash
# Build and deploy your backend application
# Ensure the new AuthController endpoints are available
```

### 2. Setup Super Admin Account

**Option A: Supabase SQL Editor (Recommended for Supabase)**

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your KeyCode Help project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the contents of `super-admin-setup.sql`
6. Click "Run" to execute the script

**Option B: Supabase CLI (Alternative)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link to your project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Run the SQL script
supabase db push --linked
```

**Option C: API Endpoint**

```bash
# Set environment variable
export SUPER_ADMIN_SETUP_KEY="your-secure-key"

# Call setup endpoint
curl -X POST "https://your-domain.com/auth/setup-super-admin" \
  -d "email=5epmgllc@gmail.com" \
  -d "password=Mrguru2054" \
  -d "fname=Super" \
  -d "lname=Admin" \
  -d "setupKey=your-secure-key"
```

### 3. Verify Account Creation

```sql
-- Check if super admin account exists
SELECT
    id, fname, lname, email, role,
    admin_approved, is_active, validated_user
FROM keycode_user
WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN';
```

**Expected Result:**

- `role`: `SUPER_ADMIN`
- `admin_approved`: `true`
- `is_active`: `true`
- `validated_user`: `true`

## Post-Deployment Testing

### ✅ Login Test

- [ ] Navigate to `/admin-login` or `/login`
- [ ] Enter credentials: `5epmgllc@gmail.com` / `Mrguru2054`
- [ ] Verify successful login
- [ ] Check redirect to appropriate dashboard

### ✅ Role Verification

- [ ] User role is displayed as `SUPER_ADMIN`
- [ ] Admin approval status is `true`
- [ ] Account is active and validated

### ✅ Access Control Test

- [ ] Can access `/super-admin` dashboard
- [ ] Can access `/admin` dashboard
- [ ] Can access all protected endpoints
- [ ] Proper permissions are enforced

### ✅ API Endpoint Test

```bash
# Test login endpoint
curl -X POST "https://your-domain.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"5epmgllc@gmail5@gmail.com","password":"Mrguru2054"}'

# Test user info endpoint (with token from login)
curl -X GET "https://your-domain.com/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Security Verification

### ✅ Endpoint Security

- [ ] `/setup-super-admin` requires valid setup key
- [ ] `/dev-upsert-admin` is secured or removed in production
- [ ] All admin endpoints require proper authentication
- [ ] Role-based access control is working

### ✅ Password Security

- [ ] Password is properly hashed in database
- [ ] No plain text passwords in logs
- [ ] Password meets security requirements

### ✅ Session Management

- [ ] JWT tokens are properly generated
- [ ] Token expiration is configured
- [ ] Refresh tokens work correctly

## Troubleshooting

### Common Issues

#### 1. Login Fails

- Check if account exists in database
- Verify password hash is correct
- Ensure account is active and approved

#### 2. Access Denied

- Verify user role is `SUPER_ADMIN`
- Check `admin_approved` status
- Ensure `is_active` is `true`

#### 3. Endpoint Not Found

- Verify backend is deployed correctly
- Check URL routing configuration
- Ensure security configuration allows access

### Debug Commands

```bash
# Check application logs
tail -f your-app.log

# Test database connection
psql -h your-host -U your-user -d your-database -c "SELECT version();"

# Verify endpoint accessibility
curl -v "https://your-domain.com/auth/login"
```

## Rollback Plan

If issues occur:

1. **Immediate Rollback**

   - Revert to previous backend version
   - Restore database from backup

2. **Investigation**

   - Check application logs
   - Verify database state
   - Test with known working configuration

3. **Fix and Redeploy**
   - Address identified issues
   - Test in staging environment
   - Redeploy to production

## Monitoring

### Key Metrics

- [ ] Super admin login success rate
- [ ] Failed authentication attempts
- [ ] Endpoint response times
- [ ] Database connection status

### Alerts

- [ ] Multiple failed login attempts
- [ ] Unusual access patterns
- [ ] Database connection failures
- [ ] Application errors

## Documentation

### Files Created

- [ ] `super-admin-setup.sql` - Database setup script
- [ ] `SUPER_ADMIN_SETUP.md` - Detailed setup guide
- `test-super-admin-setup.sh` - Testing script
- `DEPLOYMENT_CHECKLIST.md` - This checklist

### Next Steps

1. **Test locally** before production deployment
2. **Follow this checklist** step by step
3. **Document any issues** encountered
4. **Update team** on deployment status

---

**Last Updated**: December 2024
**Version**: 1.0
**Maintainer**: Development Team
