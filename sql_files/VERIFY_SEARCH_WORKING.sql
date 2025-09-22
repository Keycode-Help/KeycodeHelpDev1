-- VERIFY SEARCH IS WORKING - Simple test to check all functions
-- Run this to see if everything is working properly

-- =============================================================================
-- 1. CHECK IF VIEW EXISTS AND HAS DATA
-- =============================================================================

SELECT '=== VIEW STATUS ===' as section;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_transponder_search') 
        THEN '✅ api_transponder_search view EXISTS' 
        ELSE '❌ api_transponder_search view MISSING' 
    END as view_status;

SELECT 'Total records: ' || COUNT(*)::text as data_count
FROM api_transponder_search;

-- =============================================================================
-- 2. CHECK IF FUNCTIONS EXIST
-- =============================================================================

SELECT '=== FUNCTIONS STATUS ===' as section;

SELECT 
    function_name,
    CASE WHEN function_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (
    VALUES 
        ('enhanced_search_transponders'),
        ('get_search_suggestions'),
        ('get_popular_searches')
) AS expected_functions(function_name)
LEFT JOIN (
    SELECT routine_name as function_name
    FROM information_schema.routines
    WHERE routine_schema = 'public' 
    AND routine_type = 'FUNCTION'
    AND routine_name IN ('enhanced_search_transponders', 'get_search_suggestions', 'get_popular_searches')
) AS actual_functions USING (function_name);

-- =============================================================================
-- 3. TEST ENHANCED SEARCH FUNCTION
-- =============================================================================

SELECT '=== TESTING ENHANCED SEARCH ===' as section;

-- Test 1: Search for Toyota
SELECT 
    'Search for "Toyota"' as test_name,
    COUNT(*)::text || ' results' as result
FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 5, 0);

-- Test 2: Search for Honda  
SELECT 
    'Search for "Honda"' as test_name,
    COUNT(*)::text || ' results' as result
FROM enhanced_search_transponders('Honda', NULL, NULL, NULL, NULL, NULL, 5, 0);

-- Test 3: Show sample results
SELECT 
    make,
    model,
    year_display,
    transponder_type,
    ROUND(match_score::NUMERIC, 1) as score
FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 3, 0)
ORDER BY match_score DESC;

-- =============================================================================
-- 4. TEST SEARCH SUGGESTIONS
-- =============================================================================

SELECT '=== TESTING SEARCH SUGGESTIONS ===' as section;

-- Test suggestions for "T"
SELECT 
    'Suggestions for "T"' as test_name,
    COUNT(*)::text || ' suggestions' as result
FROM get_search_suggestions('T', 5);

-- Show sample suggestions
SELECT 
    suggestion,
    suggestion_type,
    count
FROM get_search_suggestions('Honda', 3)
ORDER BY count DESC;

-- =============================================================================
-- 5. TEST POPULAR SEARCHES
-- =============================================================================

SELECT '=== TESTING POPULAR SEARCHES ===' as section;

-- Count popular searches
SELECT 
    'Total popular searches' as test_name,
    COUNT(*)::text || ' items' as result
FROM get_popular_searches();

-- Show top 5 popular searches
SELECT 
    search_term,
    category,
    entry_count
FROM get_popular_searches()
LIMIT 5;

-- =============================================================================
-- 6. FINAL STATUS
-- =============================================================================

SELECT '=== FINAL STATUS ===' as section;

DO $$
DECLARE
    view_exists BOOLEAN;
    search_count INTEGER;
    suggestions_count INTEGER;
    popular_count INTEGER;
BEGIN
    -- Check view
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'api_transponder_search'
    ) INTO view_exists;
    
    -- Test functions
    IF view_exists THEN
        BEGIN
            SELECT COUNT(*) INTO search_count FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 1, 0);
        EXCEPTION WHEN OTHERS THEN
            search_count := -1;
        END;
        
        BEGIN
            SELECT COUNT(*) INTO suggestions_count FROM get_search_suggestions('T', 1);
        EXCEPTION WHEN OTHERS THEN
            suggestions_count := -1;
        END;
        
        BEGIN
            SELECT COUNT(*) INTO popular_count FROM get_popular_searches();
        EXCEPTION WHEN OTHERS THEN
            popular_count := -1;
        END;
    END IF;
    
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'SEARCH SYSTEM STATUS:';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'View exists: %', CASE WHEN view_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Enhanced search: %', CASE WHEN search_count >= 0 THEN '✅ WORKING' ELSE '❌ ERROR' END;
    RAISE NOTICE 'Search suggestions: %', CASE WHEN suggestions_count >= 0 THEN '✅ WORKING' ELSE '❌ ERROR' END;
    RAISE NOTICE 'Popular searches: %', CASE WHEN popular_count >= 0 THEN '✅ WORKING' ELSE '❌ ERROR' END;
    RAISE NOTICE '==================================================';
    
    IF view_exists AND search_count >= 0 AND suggestions_count >= 0 AND popular_count >= 0 THEN
        RAISE NOTICE '🎉 ALL SYSTEMS WORKING! Your frontend search should work now.';
        RAISE NOTICE 'Clear browser cache and test your search bar.';
    ELSE
        RAISE NOTICE '⚠️  Some functions may have issues. Check the results above.';
    END IF;
    RAISE NOTICE '==================================================';
END $$;
