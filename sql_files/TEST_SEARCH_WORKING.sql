-- TEST SEARCH FUNCTIONS WITH YOUR DATA
-- Run this to verify your search functions work with real data

SELECT 'Testing Search Functions with Your Data:' as status;

-- =============================================================================
-- 1. TEST SEARCH SUGGESTIONS
-- =============================================================================

SELECT 'Test 1: Search Suggestions for "T"' as test;
SELECT suggestion, suggestion_type, count 
FROM get_search_suggestions('T', 5)
ORDER BY count DESC;

SELECT 'Test 2: Search Suggestions for "Toyota"' as test;  
SELECT suggestion, suggestion_type, count 
FROM get_search_suggestions('Toyota', 5)
ORDER BY count DESC;

-- =============================================================================
-- 2. TEST POPULAR SEARCHES
-- =============================================================================

SELECT 'Test 3: Popular Searches' as test;
SELECT search_term, category, entry_count 
FROM get_popular_searches() 
LIMIT 5;

-- =============================================================================
-- 3. TEST ENHANCED SEARCH
-- =============================================================================

SELECT 'Test 4: Enhanced Search for "Toyota"' as test;
SELECT 
    id, 
    make, 
    model, 
    year_display,
    transponder_type,
    oem_keys,
    match_score
FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 5, 0)
ORDER BY match_score DESC;

SELECT 'Test 5: Enhanced Search for "Honda"' as test;
SELECT 
    id, 
    make, 
    model, 
    year_display,
    transponder_type,
    match_score
FROM enhanced_search_transponders('Honda', NULL, NULL, NULL, NULL, NULL, 3, 0)
ORDER BY match_score DESC;

SELECT 'Test 6: Enhanced Search for "Hitag"' as test;
SELECT 
    id, 
    make, 
    model, 
    transponder_type,
    oem_keys,
    match_score
FROM enhanced_search_transponders('Hitag', NULL, NULL, NULL, NULL, NULL, 3, 0)
ORDER BY match_score DESC;

-- =============================================================================
-- 4. TEST DATA AVAILABILITY
-- =============================================================================

-- Check if api_transponder_search view has data
SELECT 'Data Availability Check:' as test;

DO $$
DECLARE
    total_count INTEGER;
    make_count INTEGER;
    model_count INTEGER;
    transponder_count INTEGER;
BEGIN
    -- Count total entries
    SELECT COUNT(*) INTO total_count FROM api_transponder_search;
    RAISE NOTICE 'Total searchable entries: %', total_count;
    
    -- Count unique makes
    SELECT COUNT(DISTINCT make) INTO make_count FROM api_transponder_search WHERE make IS NOT NULL;
    RAISE NOTICE 'Unique vehicle makes: %', make_count;
    
    -- Count unique models
    SELECT COUNT(DISTINCT model) INTO model_count FROM api_transponder_search WHERE model IS NOT NULL;
    RAISE NOTICE 'Unique vehicle models: %', model_count;
    
    -- Count unique transponder types
    SELECT COUNT(DISTINCT transponder_type) INTO transponder_count FROM api_transponder_search WHERE transponder_type IS NOT NULL;
    RAISE NOTICE 'Unique transponder types: %', transponder_count;
    
    -- Provide feedback
    IF total_count = 0 THEN
        RAISE NOTICE '❌ No data found in search view - need to import data';
    ELSIF total_count < 100 THEN
        RAISE NOTICE '⚠️ Limited data (% entries) - consider importing full dataset', total_count;
    ELSIF total_count < 1000 THEN
        RAISE NOTICE '✅ Good data volume (% entries) - search should work well', total_count;
    ELSE
        RAISE NOTICE '🎉 Excellent data volume (% entries) - full search capabilities!', total_count;
    END IF;
END $$;

-- =============================================================================
-- 5. SAMPLE DATA DISPLAY
-- =============================================================================

SELECT 'Sample Data Available for Search:' as test;
SELECT 
    make,
    model,
    year_display,
    transponder_type,
    LEFT(oem_keys, 30) as oem_keys_sample,
    LEFT(part_numbers, 30) as part_numbers_sample
FROM api_transponder_search 
WHERE make IS NOT NULL 
ORDER BY make, model 
LIMIT 10;

-- =============================================================================
-- 6. FINAL STATUS
-- =============================================================================

DO $$
DECLARE
    has_data BOOLEAN;
    search_ready BOOLEAN;
BEGIN
    -- Check if we have searchable data
    SELECT COUNT(*) > 0 INTO has_data FROM api_transponder_search;
    
    -- Check if search functions work
    SELECT COUNT(*) > 0 INTO search_ready FROM get_popular_searches();
    
    RAISE NOTICE '==================================================';
    IF has_data AND search_ready THEN
        RAISE NOTICE '🎉 SEARCH IS FULLY OPERATIONAL!';
        RAISE NOTICE '✅ Functions exist and work';
        RAISE NOTICE '✅ Data is available and searchable';
        RAISE NOTICE '✅ Frontend search bar should work perfectly';
        RAISE NOTICE '';
        RAISE NOTICE '🚀 Next Step: Clear browser cache and test frontend!';
    ELSIF search_ready THEN
        RAISE NOTICE '⚠️ SEARCH FUNCTIONS WORK BUT LIMITED DATA';
        RAISE NOTICE '✅ Functions exist and work';
        RAISE NOTICE '❌ Limited or no searchable data';
        RAISE NOTICE '💡 Import your CSV data for full functionality';
    ELSE
        RAISE NOTICE '❌ SEARCH FUNCTIONS NEED ATTENTION';
        RAISE NOTICE '❌ Functions may not be working properly';
    END IF;
    RAISE NOTICE '==================================================';
END $$;
