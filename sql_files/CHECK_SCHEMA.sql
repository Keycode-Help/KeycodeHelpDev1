-- CHECK ACTUAL DATABASE SCHEMA
-- Run this first to see what columns exist in your tables

-- Check what tables exist
SELECT 'Existing Tables:' as section;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check what views exist
SELECT 'Existing Views:' as section;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'VIEW'
ORDER BY table_name;

-- Check columns in transponder_entries table (if it exists)
SELECT 'Columns in transponder_entries:' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'transponder_entries'
ORDER BY ordinal_position;

-- Check columns in vehicle_makes table (if it exists)
SELECT 'Columns in vehicle_makes:' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'vehicle_makes'
ORDER BY ordinal_position;

-- Check columns in system_types table (if it exists)
SELECT 'Columns in system_types:' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'system_types'
ORDER BY ordinal_position;

-- Check columns in transponder_families table (if it exists)
SELECT 'Columns in transponder_families:' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'transponder_families'
ORDER BY ordinal_position;

-- Check columns in api_transponder_search view (if it exists)
SELECT 'Columns in api_transponder_search view:' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'api_transponder_search'
ORDER BY ordinal_position;

-- Check what functions exist
SELECT 'Existing Functions:' as section;
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%search%'
ORDER BY routine_name;

-- Sample data check (if tables exist)
DO $$
DECLARE
    table_count INTEGER;
    entry_count INTEGER;
BEGIN
    -- Check if transponder_entries exists and has data
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'transponder_entries';
    
    IF table_count > 0 THEN
        EXECUTE 'SELECT COUNT(*) FROM transponder_entries' INTO entry_count;
        RAISE NOTICE 'transponder_entries table exists with % rows', entry_count;
    ELSE
        RAISE NOTICE 'transponder_entries table does not exist';
    END IF;
    
    -- Check if api_transponder_search view exists
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'api_transponder_search';
    
    IF table_count > 0 THEN
        EXECUTE 'SELECT COUNT(*) FROM api_transponder_search' INTO entry_count;
        RAISE NOTICE 'api_transponder_search view exists with % rows', entry_count;
    ELSE
        RAISE NOTICE 'api_transponder_search view does not exist';
    END IF;
    
END $$;
