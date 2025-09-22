# Transponder Database Setup for Supabase

This document provides complete instructions for setting up the transponder database in Supabase with all vehicle data properly organized.

## 📊 Data Overview

- **Total Entries**: 1,534 transponder records
- **Vehicle Makes**: 56 manufacturers (Toyota, Ford, Nissan, Chevrolet, Honda, Lexus, etc.)
- **Data Quality**: 100% complete Make/Model data, 91.9% with year information
- **Coverage**: All major automotive brands including Asian, American, and European manufacturers

## 🗂️ Generated Files

### Database Schema

- `supabase_transponder_schema.sql` - Complete database schema with normalized tables
- `supabase_import_data.sql` - Sample data import with helper functions
- `bulk_import_transponder_data.sql` - Bulk import script for CSV data

### Data Files

- `transponder_data_final.csv` - Complete dataset (1,534 entries)
- `import_vehicle_makes.csv` - Normalized vehicle makes (56 entries)
- `import_transponder_families.csv` - Transponder families (414 entries)
- `import_system_types.csv` - System types (4 entries)
- `import_transponder_entries.csv` - Main data for bulk import

## 🏗️ Database Structure

### Core Tables

#### 1. `vehicle_makes`

- `id` (UUID, Primary Key)
- `make_name` (VARCHAR) - Original make name
- `make_name_normalized` (VARCHAR) - Normalized for searching
- Timestamps and audit fields

#### 2. `transponder_families`

- `id` (UUID, Primary Key)
- `family_name` (VARCHAR) - Transponder type/family
- `family_description` (TEXT) - Optional description
- Timestamps and audit fields

#### 3. `system_types`

- `id` (UUID, Primary Key)
- `system_name` (VARCHAR) - Anti-theft system type
- `system_description` (TEXT) - Optional description
- Timestamps and audit fields

#### 4. `transponder_entries` (Main Table)

- `id` (UUID, Primary Key)
- `make_id` (UUID, Foreign Key) - References vehicle_makes
- `model_name` (VARCHAR) - Vehicle model
- `year_from` (INTEGER) - Starting year
- `year_to` (INTEGER) - Ending year
- `year_note` (VARCHAR) - Year-related notes
- `system_type_id` (UUID, Foreign Key) - References system_types
- `transponder_family_id` (UUID, Foreign Key) - References transponder_families
- `transponder_detail` (TEXT) - Detailed transponder information
- `cross_references` (TEXT) - Cross-reference part numbers
- `oem_keys` (TEXT) - OEM key information
- `notes` (TEXT) - Additional notes
- `is_active` (BOOLEAN) - Soft delete flag
- Timestamps and audit fields

### Views and Functions

#### `transponder_data_view`

Pre-joined view for easy querying with all related data.

#### `search_vehicles(make, model, year)`

Function to search vehicles by make, model, and year with intelligent year range matching.

## 🚀 Setup Instructions

### Step 1: Create Database Schema

```sql
-- Run this in Supabase SQL Editor
\i supabase_transponder_schema.sql
```

### Step 2: Import Data (Option A - SQL Script)

```sql
-- Run sample data import
\i supabase_import_data.sql
```

### Step 3: Import Data (Option B - CSV Bulk Import)

1. Upload CSV files to Supabase Storage or use psql:

```bash
psql -h your-supabase-host -U postgres -d postgres
\copy temp_vehicle_makes FROM 'import_vehicle_makes.csv' CSV HEADER;
\copy temp_transponder_families FROM 'import_transponder_families.csv' CSV HEADER;
\copy temp_system_types FROM 'import_system_types.csv' CSV HEADER;
\copy temp_transponder_entries FROM 'import_transponder_entries.csv' CSV HEADER;
```

2. Run bulk import script:

```sql
\i bulk_import_transponder_data.sql
```

## 🔍 Usage Examples

### Search for Lexus ES models from 2010

```sql
SELECT * FROM search_vehicles('LEXUS', 'ES', 2010);
```

### Get all Toyota entries

```sql
SELECT * FROM transponder_data_view
WHERE make_name = 'TOYOTA'
ORDER BY model_name, year_from;
```

### Find entries with specific transponder family

```sql
SELECT make_name, model_name, year_from, year_to
FROM transponder_data_view
WHERE transponder_family LIKE '%Hitag2%'
ORDER BY make_name, model_name;
```

### Vehicle make summary

```sql
SELECT * FROM vehicle_summary ORDER BY model_count DESC;
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Authenticated users have read access
- Admin users have full CRUD access
- UUID-based primary keys for security
- Soft delete functionality

## 📈 Data Coverage by Make

Top 15 manufacturers by entry count:

1. **TOYOTA**: 135 entries
2. **FORD**: 102 entries
3. **NISSAN**: 96 entries
4. **Chevrolet**: 81 entries
5. **MITSUBISHI**: 73 entries
6. **HYUNDAI**: 67 entries
7. **VW**: 65 entries
8. **Fiat**: 63 entries
9. **KIA**: 63 entries
10. **HONDA**: 62 entries
11. **RENAULT**: 58 entries
12. **LEXUS**: 56 entries
13. **PEUGEOT**: 51 entries
14. **Isuzu**: 47 entries
15. **MAZDA**: 46 entries

## 🛠️ Maintenance

### Adding New Entries

Use the helper function:

```sql
SELECT import_transponder_entry(
    'TOYOTA', 'Camry', 2020, 2023, NULL,
    'Smart Key System', 'Texas Crypto DST AES 128-bit',
    'Advanced encryption', 'Part123', 'Key456', 'Notes here'
);
```

### Updating Entries

```sql
UPDATE transponder_entries
SET transponder_detail = 'Updated info'
WHERE make_id = (SELECT id FROM vehicle_makes WHERE make_name = 'TOYOTA')
  AND model_name = 'Camry';
```

### Soft Delete

```sql
UPDATE transponder_entries SET is_active = FALSE WHERE id = 'entry-uuid';
```

## ✅ Validation Results

- ✅ All 1,534 entries successfully processed
- ✅ No data loss from original markdown format
- ✅ All major automotive brands included
- ✅ 100% Make/Model completeness
- ✅ 91.9% entries have year information
- ✅ 86.3% entries have transponder family data
- ✅ Proper normalization and relationships
- ✅ Optimized for search performance

## 🔧 Integration with KCH Frontend

This database structure is designed to integrate seamlessly with your Next.js frontend:

```typescript
// Example API call
const searchVehicles = async (make: string, model: string, year: number) => {
  const { data } = await supabase.rpc("search_vehicles", {
    p_make: make,
    p_model: model,
    p_year: year,
  });
  return data;
};

// Example component usage
const vehicleData = await searchVehicles("TOYOTA", "Camry", 2020);
```

The normalized structure ensures fast queries and easy maintenance while preserving all original transponder data from your markdown file.
