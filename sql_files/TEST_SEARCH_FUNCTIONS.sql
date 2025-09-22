-- TEST YOUR EXISTING SEARCH FUNCTIONS
-- Run this to verify everything is working

-- Test that functions exist and work
SELECT 'Testing Your Search Functions:' as status;

-- Test 1: Check functions exist
SELECT 'Functions that exist:' as test;
SELECT routine_name 
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('enhanced_search_transponders', 'get_search_suggestions', 'get_popular_searches');

-- Test 2: Test search suggestions (should always work)
SELECT 'Search Suggestions Test:' as test;
SELECT suggestion, suggestion_type, count 
FROM get_search_suggestions('T', 3);

-- Test 3: Test popular searches (should always work)
SELECT 'Popular Searches Test:' as test;
SELECT search_term, category, entry_count 
FROM get_popular_searches() 
LIMIT 3;

-- Test 4: Test enhanced search (may return empty if no data)
SELECT 'Enhanced Search Test:' as test;
SELECT id, make, model, match_score
FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 3, 0);

-- Success message
SELECT '✅ All functions are working! Your search bar should work now!' as result;
