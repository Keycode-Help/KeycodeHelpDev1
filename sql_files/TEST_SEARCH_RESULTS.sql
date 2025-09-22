-- Quick test to verify all search functions are working
SELECT '=== TESTING SEARCH FUNCTIONS ===' as test_phase;

-- Test 1: Check if api_transponder_search view exists and has data
SELECT 
    'api_transponder_search view' as test_item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_transponder_search') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as status;

-- Test 2: Count total records in view
SELECT 
    'Total records in api_transponder_search' as test_item,
    COUNT(*)::text || ' records' as status
FROM api_transponder_search;

-- Test 3: Test enhanced search function
SELECT 
    'Enhanced search for "Toyota"' as test_item,
    COUNT(*)::text || ' results' as status
FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 5, 0);

-- Test 4: Test search suggestions
SELECT 
    'Search suggestions for "T"' as test_item,
    COUNT(*)::text || ' suggestions' as status
FROM get_search_suggestions('T', 5);

-- Test 5: Test popular searches  
SELECT 
    'Popular searches' as test_item,
    COUNT(*)::text || ' popular items' as status
FROM get_popular_searches();

-- Test 6: Show sample search results
SELECT '=== SAMPLE SEARCH RESULTS ===' as section;

SELECT 
    make,
    model, 
    year_display,
    transponder_type,
    match_score
FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 3, 0)
ORDER BY match_score DESC;

-- Test 7: Show sample suggestions
SELECT '=== SAMPLE SUGGESTIONS ===' as section;

SELECT 
    suggestion,
    suggestion_type,
    count
FROM get_search_suggestions('Honda', 3)
ORDER BY count DESC;

-- Test 8: Show popular searches
SELECT '=== POPULAR SEARCHES ===' as section;

SELECT 
    search_term,
    category,
    entry_count
FROM get_popular_searches()
LIMIT 5;
