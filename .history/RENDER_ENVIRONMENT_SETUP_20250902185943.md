# 🚀 Render Environment Variables Setup

## ⚠️ CRITICAL: Missing Database Configuration

The backend is failing with **502 Bad Gateway** because the required database environment variables are not set in your Render dashboard.

## 🔧 Required Environment Variables

Go to your Render dashboard → Backend Service → Environment tab and add these variables:

### **Database Configuration (REQUIRED)**

```
DATABASE_URL=postgresql://postgres:[YOUR_DB_PASSWORD]@[YOUR_SUPABASE_HOST]:5432/postgres
SPRING_DATASOURCE_URL=${DATABASE_URL}
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=[YOUR_DB_PASSWORD]
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[YOUR_DB_PASSWORD]
```

### **JWT Configuration (REQUIRED)**

```
JWT_SECRET=[YOUR_SECURE_JWT_SECRET_AT_LEAST_32_CHARACTERS_LONG]
```

### **Spring Profile**

```
SPRING_PROFILES_ACTIVE=supabase
```

### **CORS Configuration**

```
APP_CORS_ALLOWED_ORIGINS=https://keycode.help,https://app.keycode.help,https://keycode-help-dev1.vercel.app
```

### **App Configuration**

```
FRONTEND_URL=https://www.keycode.help
KCH_VSP_ID=4E1B0D2W
```

### **Super Admin Setup (for initial setup only)**

```
SUPER_ADMIN_SETUP_KEY=[YOUR_SECURE_SETUP_KEY]
```

### **Email Configuration (Brevo/Sendinblue)**

```
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
BREVO_USERNAME=[YOUR_BREVO_USERNAME]
BREVO_API_KEY=[YOUR_BREVO_API_KEY]
```

### **Stripe Configuration**

```
STRIPE_SECRET_KEY=[YOUR_STRIPE_SECRET_KEY]
STRIPE_PUBLISHABLE_KEY=[YOUR_STRIPE_PUBLISHABLE_KEY]
STRIPE_WEBHOOK_SECRET=[YOUR_STRIPE_WEBHOOK_SECRET]
```

### **Vehicle Manufacturer Credentials**

```
# Acura
KCH_ACURA_USER=Mrguru
KCH_ACURA_PASS=Destiny@2026

# FCA
KCH_FCA_USER=mytech@metrepairs.com
KCH_FCA_PASS=Destiny@2025

# Ford
KCH_FORD_USER=mytech@metrepairs.com
KCH_FORD_PASS=Destiny@2025

# GM
KCH_GM_USER=MrGuru2024
KCH_GM_PASS=Keycodehelp@2028

# Genesis
KCH_GENESIS_USER=your_genesis_username
KCH_GENESIS_PASS=Destiny2025

# Honda
KCH_HONDA_USER=Mrguru
KCH_HONDA_PASS=Destiny@2026

# Hyundai
KCH_HYUNDAI_USER=Mrguru
KCH_HYUNDAI_PASS=Destiny2025

# Infiniti
KCH_INFINITI_USER=Metrepairs
KCH_INFINITI_PASS=Keycodehelp@2028

# KIA
KCH_KIA_USER=Mrguru
KCH_KIA_PASS=Destiny2025

# Lexus
KCH_LEXUS_USER=mrguru@metrepairs.com
KCH_LEXUS_PASS=Keycodehelp@2028

# Nissan
KCH_NISSAN_USER=Mrguru2025
KCH_NISSAN_PASS=Keycodehelp@2028

# Toyota
KCH_TOYOTA_USER=mrguru@metrepairs.com
KCH_TOYOTA_PASS=Keycodehelp@2028

# Volvo
KCH_VOLVO_USER=mytech@metrepairs.com
KCH_VOLVO_PASS=Destiny@2025
```

## 🔍 How to Get Your Supabase Database URL

1. Go to your Supabase dashboard
2. Select your project
3. Go to Settings → Database
4. Copy the connection string from "Connection string" section
5. Replace `[YOUR-PASSWORD]` with your actual database password

## 🔑 How to Generate JWT Secret

Generate a secure JWT secret (at least 32 characters):

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

## ✅ After Adding Variables

1. **Save** the environment variables in Render
2. **Redeploy** your backend service
3. **Test** the endpoints:
   - `GET https://keycodehelpdev1-backend.onrender.com/auth/test` (should return 200)
   - `GET https://keycodehelpdev1-backend.onrender.com/auth/me` (should return 401 without token, 200 with valid token)

## 🚨 Current Error

```
Unable to determine Dialect without JDBC metadata (please set 'jakarta.persistence.jdbc.url' for common cases or 'hibernate.dialect' when a custom Dialect implementation must be provided)
```

This error means the database connection is not configured. Adding the environment variables above will fix this.

## 📞 Need Help?

If you need help getting your Supabase database credentials, check:

- `docs/SUPABASE_QUICK_SETUP.md`
- `docs/SUPABASE_SETUP_INSTRUCTIONS.md`
