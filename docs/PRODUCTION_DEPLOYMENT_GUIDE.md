# Production Deployment Guide for Transponder Database

This guide provides step-by-step instructions for deploying the transponder database to production and integrating it with your KCH frontend.

## 📋 Prerequisites

- Supabase account and project
- Node.js 18+ and npm/yarn
- Access to your production hosting (Vercel, Netlify, etc.)
- Git repository access

## 🚀 Quick Start

### 1. Run the Migration Script

```bash
# Make the script executable
chmod +x supabase_production_commands.sh

# Run the migration
./supabase_production_commands.sh
```

This script will:
- ✅ Create database schema
- ✅ Import all transponder data (1,939+ entries)
- ✅ Set up indexes and optimization
- ✅ Configure security policies
- ✅ Generate environment variables

### 2. Manual Migration (Alternative)

If you prefer manual control:

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# 4. Run schema migration
supabase db push

# 5. Import data via SQL
psql "postgresql://postgres:[password]@[host]:5432/postgres" -f production_data_import.sql
```

## 🔧 Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.production.example .env.local
```

### 2. Configure Supabase Keys

Add your Supabase credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to find your keys:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and API keys

## 🏗️ Frontend Integration

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Copy Integration Code

Copy `frontend_integration.ts` to your project:

```bash
# For Next.js App Router
cp frontend_integration.ts app/lib/transponder-api.ts

# For Next.js Pages Router
cp frontend_integration.ts lib/transponder-api.ts
```

### 3. Update Your Components

```typescript
// Example: Vehicle Search Component
import { TransponderAPI, useTransponderSearch } from '@/lib/transponder-api';

export default function VehicleSearch() {
  const { search, results, loading, error } = useTransponderSearch();

  const handleSearch = async (make: string, model: string, year: number) => {
    await search({ make, model, year });
  };

  return (
    <div>
      {/* Your search UI */}
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}
      {results.map(result => (
        <div key={result.id}>
          {result.make_name} {result.model_name} ({result.year_from}-{result.year_to})
        </div>
      ))}
    </div>
  );
}
```

## 📊 Available API Functions

### Search Functions

```typescript
// Advanced vehicle search
const results = await TransponderAPI.searchVehicles({
  make: 'TOYOTA',
  model: 'Camry',
  year: 2020,
  limit: 50
});

// Full-text search
const textResults = await TransponderAPI.fullTextSearch('Hitag2 ID46');

// Exact vehicle match
const exactMatch = await TransponderAPI.getVehicleExact('TOYOTA', 'Camry', 2020);
```

### Data Functions

```typescript
// Get all vehicle makes
const makes = await TransponderAPI.getVehicleMakes();

// Get transponder families
const families = await TransponderAPI.getTransponderFamilies();

// Get models for a specific make
const models = await TransponderAPI.getModelsForMake('TOYOTA');

// Get year range for vehicle
const yearRange = await TransponderAPI.getYearRangeForVehicle('TOYOTA', 'Camry');
```

### Dashboard Functions

```typescript
// Get database statistics
const stats = await TransponderAPI.getDatabaseStats();
// Returns: { totalEntries, totalMakes, totalFamilies, recentEntries }
```

## 🔐 Security Configuration

### Row Level Security (RLS)

The database is configured with RLS policies:

- **Read Access**: All authenticated users
- **Write Access**: Admin users only
- **Data Protection**: Automatic user context filtering

### Admin User Setup

To create admin users, update user metadata in Supabase:

```sql
-- Make a user admin
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@yourcompany.com';
```

## 📈 Performance Optimization

### Database Indexes

The schema includes optimized indexes for:
- ✅ Make/Model searches
- ✅ Year range queries
- ✅ Full-text search
- ✅ Transponder family lookups

### Caching Strategy

Implement caching for better performance:

```typescript
// Example with React Query
import { useQuery } from '@tanstack/react-query';

function useVehicleMakes() {
  return useQuery({
    queryKey: ['vehicle-makes'],
    queryFn: () => TransponderAPI.getVehicleMakes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## 🧪 Testing

### 1. Test Database Connection

```bash
# Test basic connection
supabase db ping

# Run test queries
supabase sql --db-url="your-connection-string" \
  --query="SELECT COUNT(*) FROM transponder_entries;"
```

### 2. Test API Functions

```typescript
// Test file: __tests__/transponder-api.test.ts
import { TransponderAPI } from '@/lib/transponder-api';

describe('TransponderAPI', () => {
  test('should search vehicles', async () => {
    const results = await TransponderAPI.searchVehicles({
      make: 'TOYOTA',
      limit: 10
    });
    expect(results).toHaveLength(10);
  });
});
```

## 🚢 Deployment

### Vercel Deployment

1. **Set Environment Variables in Vercel Dashboard:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### Netlify Deployment

1. **Add environment variables in Netlify dashboard**
2. **Deploy via Git or CLI**

### Other Platforms

For other hosting platforms, ensure:
- Environment variables are properly set
- Node.js 18+ is supported
- Build command includes database setup

## 📊 Data Management

### Backup Strategy

```bash
# Backup database
supabase db dump --file=backup.sql

# Restore database
supabase db reset --linked
psql "connection-string" -f backup.sql
```

### Data Updates

```typescript
// Add new transponder entry (admin only)
const newEntry = await supabase
  .from('transponder_entries')
  .insert({
    make_id: makeId,
    model_name: 'New Model',
    year_from: 2024,
    transponder_family_id: familyId
  });
```

## 🔍 Monitoring

### Health Checks

```typescript
// API health check endpoint
export async function GET() {
  try {
    const stats = await TransponderAPI.getDatabaseStats();
    return Response.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      stats 
    });
  } catch (error) {
    return Response.json({ 
      status: 'error', 
      error: error.message 
    }, { status: 500 });
  }
}
```

### Performance Monitoring

Monitor these metrics:
- Query response times
- Database connection pool usage
- API error rates
- User search patterns

## 🛠️ Troubleshooting

### Common Issues

**Connection Errors:**
```typescript
// Check if Supabase URL and keys are correct
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

**RLS Policy Issues:**
```sql
-- Check if user is authenticated
SELECT auth.uid(), auth.role();

-- Test policy manually
SELECT * FROM transponder_entries LIMIT 1;
```

**Performance Issues:**
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM search_vehicles('TOYOTA', NULL, NULL, NULL, 10);
```

## 📚 API Reference

### Core Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `searchVehicles()` | Advanced search with filters | `{make?, model?, year?, transponder_family?, limit?}` |
| `fullTextSearch()` | Full-text search | `searchTerm, limit?` |
| `getVehicleExact()` | Exact vehicle match | `make, model, year` |
| `getVehicleMakes()` | All vehicle makes with stats | none |
| `getTransponderFamilies()` | All transponder families | none |
| `getDatabaseStats()` | Database statistics | none |

### Data Views

| View | Description | Use Case |
|------|-------------|----------|
| `transponder_data_view` | Complete data with joins | Admin dashboards |
| `api_transponder_search` | Optimized for frontend | Search results |
| `vehicle_summary` | Make statistics | Dashboard widgets |
| `transponder_family_summary` | Family usage stats | Analytics |

## ✅ Production Checklist

- [ ] Database schema deployed
- [ ] All data imported (1,939+ entries)
- [ ] Environment variables configured
- [ ] Frontend integration complete
- [ ] Security policies enabled
- [ ] Performance monitoring setup
- [ ] Backup strategy implemented
- [ ] Health checks configured
- [ ] Error tracking enabled
- [ ] Documentation updated

## 🎉 Success!

Your transponder database is now ready for production with:

- **1,939+ transponder entries** across 56 vehicle makes
- **Advanced search capabilities** with fuzzy matching
- **Optimized performance** with proper indexing
- **Secure access** with RLS policies
- **Complete TypeScript integration** for your frontend
- **Production-ready monitoring** and health checks

Your KCH application now has access to comprehensive transponder data for all major vehicle manufacturers! 🚗🔑
