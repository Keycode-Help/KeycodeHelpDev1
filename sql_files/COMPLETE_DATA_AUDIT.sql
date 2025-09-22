-- COMPLETE DATA AUDIT - Check all your current data
-- Run this first to understand your current database structure

-- =============================================================================
-- 1. CHECK ALL EXISTING TABLES
-- =============================================================================

SELECT 'EXISTING TABLES:' as section;
SELECT 
    table_name,
    table_type,
    CASE 
        WHEN table_type = 'BASE TABLE' THEN '📊 Table'
        WHEN table_type = 'VIEW' THEN '👁️ View'
        ELSE table_type
    END as type_display
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_type, table_name;

-- =============================================================================
-- 2. CHECK ALL COLUMNS IN EACH TABLE
-- =============================================================================

-- Check transponder_entries columns
SELECT 'TRANSPONDER_ENTRIES COLUMNS:' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'transponder_entries'
ORDER BY ordinal_position;

-- Check vehicle_makes columns
SELECT 'VEHICLE_MAKES COLUMNS:' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'vehicle_makes'
ORDER BY ordinal_position;

-- Check system_types columns
SELECT 'SYSTEM_TYPES COLUMNS:' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'system_types'
ORDER BY ordinal_position;

-- Check transponder_families columns
SELECT 'TRANSPONDER_FAMILIES COLUMNS:' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'transponder_families'
ORDER BY ordinal_position;

-- Check api_transponder_search view columns (if exists)
SELECT 'API_TRANSPONDER_SEARCH VIEW COLUMNS:' as section;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'api_transponder_search'
ORDER BY ordinal_position;

-- =============================================================================
-- 3. CHECK DATA COUNTS
-- =============================================================================

DO $$
DECLARE
    table_exists BOOLEAN;
    row_count INTEGER;
BEGIN
    -- Check transponder_entries
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'transponder_entries'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM transponder_entries' INTO row_count;
        RAISE NOTICE 'transponder_entries: % rows', row_count;
        
        EXECUTE 'SELECT COUNT(*) FROM transponder_entries WHERE is_active = true' INTO row_count;
        RAISE NOTICE 'transponder_entries (active): % rows', row_count;
    ELSE
        RAISE NOTICE 'transponder_entries: TABLE DOES NOT EXIST';
    END IF;

    -- Check vehicle_makes
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'vehicle_makes'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM vehicle_makes' INTO row_count;
        RAISE NOTICE 'vehicle_makes: % rows', row_count;
    ELSE
        RAISE NOTICE 'vehicle_makes: TABLE DOES NOT EXIST';
    END IF;

    -- Check system_types
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'system_types'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM system_types' INTO row_count;
        RAISE NOTICE 'system_types: % rows', row_count;
    ELSE
        RAISE NOTICE 'system_types: TABLE DOES NOT EXIST';
    END IF;

    -- Check transponder_families
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'transponder_families'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM transponder_families' INTO row_count;
        RAISE NOTICE 'transponder_families: % rows', row_count;
    ELSE
        RAISE NOTICE 'transponder_families: TABLE DOES NOT EXIST';
    END IF;

    -- Check api_transponder_search view
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'api_transponder_search'
    ) INTO table_exists;
    
    IF table_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM api_transponder_search' INTO row_count;
        RAISE NOTICE 'api_transponder_search view: % rows', row_count;
    ELSE
        RAISE NOTICE 'api_transponder_search: VIEW DOES NOT EXIST';
    END IF;
END $$;

-- =============================================================================
-- 4. SAMPLE DATA CHECK
-- =============================================================================

-- Show sample transponder entries (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'transponder_entries') THEN
        RAISE NOTICE 'SAMPLE TRANSPONDER ENTRIES:';
    END IF;
END $$;

SELECT 'Sample transponder_entries data:' as section;
SELECT 
    id,
    make_id,
    model_name,
    year_from,
    year_to,
    oem_keys,
    notes,
    CASE WHEN length(cross_references) > 50 THEN left(cross_references, 50) || '...' ELSE cross_references END as cross_refs_sample
FROM transponder_entries 
WHERE is_active = true 
LIMIT 5;

-- Show sample vehicle makes (if table exists)  
SELECT 'Sample vehicle_makes data:' as section;
SELECT 
    id,
    make_name,
    make_name_normalized,
    is_active
FROM vehicle_makes 
WHERE is_active = true 
LIMIT 10;

-- =============================================================================
-- 5. CHECK EXISTING FUNCTIONS
-- =============================================================================

SELECT 'EXISTING FUNCTIONS:' as section;
SELECT 
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name LIKE '%search%' THEN '🔍 Search Function'
        ELSE '⚙️ Function'
    END as function_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- =============================================================================
-- 6. SUMMARY REPORT
-- =============================================================================

DO $$
DECLARE
    total_entries INTEGER := 0;
    total_makes INTEGER := 0;
    total_families INTEGER := 0;
    total_systems INTEGER := 0;
    has_view BOOLEAN := false;
    has_functions BOOLEAN := false;
BEGIN
    -- Get counts
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'transponder_entries') THEN
        EXECUTE 'SELECT COUNT(*) FROM transponder_entries WHERE is_active = true' INTO total_entries;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vehicle_makes') THEN
        EXECUTE 'SELECT COUNT(*) FROM vehicle_makes WHERE is_active = true' INTO total_makes;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'transponder_families') THEN
        EXECUTE 'SELECT COUNT(*) FROM transponder_families WHERE is_active = true' INTO total_families;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_types') THEN
        EXECUTE 'SELECT COUNT(*) FROM system_types WHERE is_active = true' INTO total_systems;
    END IF;
    
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_transponder_search') INTO has_view;
    
    SELECT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'enhanced_search_transponders') INTO has_functions;
    
    RAISE NOTICE '==================================================';
    RAISE NOTICE '📊 DATABASE AUDIT SUMMARY';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Total Active Transponder Entries: %', total_entries;
    RAISE NOTICE 'Total Active Vehicle Makes: %', total_makes;
    RAISE NOTICE 'Total Active Transponder Families: %', total_families;
    RAISE NOTICE 'Total Active System Types: %', total_systems;
    RAISE NOTICE 'API Search View Exists: %', CASE WHEN has_view THEN 'YES ✅' ELSE 'NO ❌' END;
    RAISE NOTICE 'Search Functions Exist: %', CASE WHEN has_functions THEN 'YES ✅' ELSE 'NO ❌' END;
    RAISE NOTICE '==================================================';
    
    IF total_entries < 1000 THEN
        RAISE NOTICE '⚠️ You have % entries. Expected ~1,939 from full dataset.', total_entries;
        RAISE NOTICE '💡 Consider importing your full CSV data.';
    ELSE
        RAISE NOTICE '✅ Good data volume - % entries found.', total_entries;
    END IF;
    
    IF NOT has_view THEN
        RAISE NOTICE '❌ Missing api_transponder_search view - needed for frontend.';
    END IF;
    
    IF NOT has_functions THEN
        RAISE NOTICE '❌ Missing search functions - needed for autocomplete.';
    END IF;
    
END $$;
