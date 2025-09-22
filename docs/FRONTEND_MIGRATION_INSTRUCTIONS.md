# Frontend Migration Instructions

Follow these steps to migrate your KCH frontend from the Java backend to Supabase.

## 🚀 Quick Fix for Current 403 Errors

### Step 1: Set Up Environment Variables

1. **Copy the environment template:**
   ```bash
   cd kch-frontend
   cp .env.local.example .env.local
   ```

2. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and API keys

3. **Update `.env.local`:**
   ```bash
   # Replace with your actual values
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Step 2: Run Database Migration (if not done yet)

```bash
# Make sure you're in the project root
cd /Users/apple/Documents/projects/KCH/KeycodeHelpDev1-1

# Run the migration script
./supabase_production_commands.sh
```

### Step 3: Restart Your Frontend

```bash
cd kch-frontend

# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## ✅ What Was Fixed

The migration includes:

### 🔄 **API Migration**
- **Before:** `GET http://localhost:8080/api/kch/system-types`
- **After:** Direct Supabase database queries

### 📁 **New Files Added**
- `src/services/supabaseClient.js` - Supabase configuration
- `src/services/transponderApi.js` - New API service
- `.env.local.example` - Environment template

### 🔧 **Updated Files**
- `src/pages/KchDatabase.jsx` - Now uses Supabase API
- Uses new TransponderAPI instead of axios requests

## 🗄️ API Mapping

### Old Java Backend → New Supabase

| Old Endpoint | New Function | Description |
|-------------|-------------|-------------|
| `GET /api/kch/makes` | `TransponderAPI.getVehicleMakes()` | Get vehicle makes |
| `GET /api/kch/system-types` | `TransponderAPI.getSystemTypes()` | Get system types |
| `GET /api/kch/transponder-families` | `TransponderAPI.getTransponderFamilies()` | Get transponder families |
| `GET /api/kch/makes/{id}/models` | `TransponderAPI.getModelsForMake(id)` | Get models for make |
| `GET /api/kch/search` | `TransponderAPI.searchEntries(params)` | Search entries |

## 🧪 Testing

### 1. Verify Environment Setup
```bash
# Check if environment variables are loaded
cd kch-frontend
npm run dev
# Open browser console and check for Supabase connection errors
```

### 2. Test Database Connection
Open your browser's developer console and run:
```javascript
// Should not show any CORS or 403 errors
console.log('Environment check:', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});
```

### 3. Test API Functions
In the browser console:
```javascript
// Test the new API (after the page loads)
TransponderAPI.getDatabaseStats().then(stats => {
  console.log('Database stats:', stats);
});
```

## 🔧 Troubleshooting

### Issue: Still getting 403 errors
**Solution:** Make sure `.env.local` exists and has correct values
```bash
# Check if file exists
ls -la kch-frontend/.env.local

# Verify content
cat kch-frontend/.env.local
```

### Issue: "Missing VITE_SUPABASE_URL" error
**Solution:** 
1. Verify environment file is named `.env.local` (not `.env.local.example`)
2. Restart the dev server after creating `.env.local`
3. Make sure variables start with `VITE_`

### Issue: Database connection errors
**Solution:**
1. Verify Supabase project is active
2. Check API keys are correct and not expired
3. Ensure database migration was successful

### Issue: No data showing
**Solution:**
1. Check if database migration imported data correctly
2. Verify RLS policies allow read access
3. Check browser network tab for actual error responses

## 📊 Data Structure Changes

### Vehicle Makes
```javascript
// Old format
{ id: 1, name: "Toyota" }

// New format  
{ 
  id: "uuid", 
  name: "Toyota", 
  normalizedName: "TOYOTA",
  totalModels: 135,
  verifiedModels: 135
}
```

### Search Results
```javascript
// Old format
{
  content: [...],
  totalPages: 10,
  totalElements: 200,
  currentPage: 0
}

// New format (same structure)
{
  content: [...],
  totalPages: 10, 
  totalElements: 200,
  currentPage: 0
}
```

## 🎯 Next Steps

1. **Test thoroughly** - Try all search filters and functionality
2. **Update authentication** - Integrate Supabase auth if needed
3. **Performance optimization** - Add caching and pagination improvements
4. **Error handling** - Improve user feedback for errors
5. **Deployment** - Update production environment variables

## 🔗 Related Files

- `production_migration.sql` - Database schema
- `production_data_import.sql` - Data import script  
- `frontend_integration.ts` - TypeScript types and additional functions
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Full deployment guide

## 📞 Support

If you encounter issues:

1. Check the browser console for specific error messages
2. Verify your Supabase project is accessible
3. Ensure the database migration completed successfully
4. Check that RLS policies are configured correctly

The new system should be significantly faster and more reliable than the Java backend! 🚀
