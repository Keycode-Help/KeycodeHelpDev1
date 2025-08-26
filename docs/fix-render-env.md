# Fix Render Environment Variables

## The Problem

Your backend is failing to start because the `DATABASE_URL` environment variable in Render is missing the `jdbc:` prefix.

## The Error

```
Unable to determine Dialect without JDBC metadata (please set 'jakarta.persistence.jdbc.url' for common cases or 'hibernate.dialect' when a custom Dialect implementation must be provided)
```

## The Solution

You need to manually update the environment variables in your Render dashboard.

### Step 1: Go to Render Dashboard

1. Open [https://dashboard.render.com](https://dashboard.render.com)
2. Sign in to your account
3. Click on your service: **KeycodeHelpDev1-Backend**

### Step 2: Update Environment Variables

1. Click on the **Environment** tab
2. Add or update these environment variables:

#### Required Variables:

```
DATABASE_URL=jdbc:postgresql://postgres:Me@2025$@db.chgpiymqsdxnulmtitdh.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=Me@2025$
SPRING_PROFILES_ACTIVE=supabase
```

#### Important Notes:

- **CRITICAL**: The `DATABASE_URL` MUST start with `jdbc:postgresql://`
- **DO NOT** include the `jdbc:` prefix in the value - Render will add it automatically
- The format should be: `postgresql://postgres:Me@2025$@db.chgpiymqsdxnulmtitdh.supabase.co:5432/postgres`

#### Optional Variables (if you have them):

```
JWT_SECRET=your_jwt_secret_here
BREVO_USERNAME=your_brevo_username
BREVO_API_KEY=your_brevo_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Step 3: Redeploy

1. After updating the environment variables, click **Manual Deploy**
2. Select **Deploy latest commit**
3. Wait for the build to complete

### Step 4: Verify

1. Check the logs to ensure the application starts successfully
2. Look for this message in the logs:
   ```
   ✅ DATABASE_URL has jdbc: prefix
   ```

## Why This Happens

- Spring Boot expects the `DATABASE_URL` to have the `jdbc:` prefix
- Render automatically adds the `jdbc:` prefix to the value you provide
- If you include `jdbc:` in the value, it becomes `jdbc:jdbc:postgresql://...` which is invalid
- If you don't provide the value, Spring Boot can't connect to the database

## Current Status

- ✅ Build successful
- ❌ Application startup failed due to missing database connection
- 🔧 Environment variables need to be configured in Render dashboard
