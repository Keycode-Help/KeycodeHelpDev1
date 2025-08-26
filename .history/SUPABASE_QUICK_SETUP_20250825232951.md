# 🚀 Supabase Super Admin Quick Setup

## Your Credentials

- **Email**: `5epmgllc@gmail.com`
- **Password**: `Mrguru2054`
- **Role**: `SUPER_ADMIN`

## ⚡ Quick Setup (5 minutes)

### 1. Go to Supabase Dashboard

- Visit [supabase.com](https://supabase.com)
- Sign in to your account
- Select your KeyCode Help project

### 2. Open SQL Editor

- Click "SQL Editor" in left sidebar
- Click "New Query"

### 3. Run This Script

```sql
-- Copy and paste this entire script
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM keycode_user
        WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN'
    ) THEN
        INSERT INTO keycode_user (
            fname, lname, email, password, role,
            company, admin_approved, is_active, state,
            validated_user, admin_code
        ) VALUES (
            'Super', 'Admin', '5epmgllc@gmail.com',
            '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
            'SUPER_ADMIN', 'KeyCode Help', true, true, 'N/A', true, 'SUPER_ADMIN_2024'
        );
        RAISE NOTICE 'Super admin account created successfully';
    ELSE
        RAISE NOTICE 'Super admin account already exists';
        UPDATE keycode_user
        SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa'
        WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN';
        RAISE NOTICE 'Super admin password updated';
    END IF;
END $$;
```

### 4. Click "Run" Button

- The script will execute and create your account
- You should see success messages

### 5. Verify Account

```sql
-- Run this to verify your account
SELECT id, fname, lname, email, role, admin_approved, is_active, validated_user
FROM keycode_user
WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN';
```

## ✅ Expected Result

- `role`: `SUPER_ADMIN`
- `admin_approved`: `true`
- `is_active`: `true`
- `validated_user`: `true`

## 🔐 Test Login

1. Deploy your backend with Supabase configuration
2. Go to `/admin-login` or `/login`
3. Enter: `5epmgllc@gmail.com` / `Mrguru2054`
4. You should be logged in as Super Admin!

## 📚 Full Documentation

- **Supabase Guide**: `docs/SUPABASE_SUPER_ADMIN_SETUP.md`
- **Deployment Checklist**: `docs/DEPLOYMENT_CHECKLIST.md`
- **General Setup**: `docs/SUPER_ADMIN_SETUP.md`

## 🆘 Need Help?

- Check the full Supabase guide for troubleshooting
- Verify your backend is configured for Supabase
- Ensure the `keycode_user` table exists

---

**Time to Complete**: ~5 minutes
**Difficulty**: Easy
**Database**: Supabase (PostgreSQL)
