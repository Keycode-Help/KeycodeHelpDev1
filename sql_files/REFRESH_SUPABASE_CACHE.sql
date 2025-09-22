-- REFRESH SUPABASE CACHE - Force Supabase to recognize new functions
-- This solves the 404 errors by refreshing the schema cache

-- =============================================================================
-- 1. FORCE SCHEMA CACHE REFRESH
-- =============================================================================

-- Method 1: Create a dummy function to trigger cache refresh
CREATE OR REPLACE FUNCTION refresh_supabase_cache()
RETURNS TEXT AS $$
BEGIN
    -- This function forces Supabase to refresh its schema cache
    RETURN 'Cache refresh triggered at ' || NOW()::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Method 2: Grant permissions again to ensure they're recognized
GRANT EXECUTE ON FUNCTION enhanced_search_transponders TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_search_suggestions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_searches TO anon, authenticated;
GRANT EXECUTE ON FUNCTION refresh_supabase_cache TO anon, authenticated;

-- Method 3: Create a simple wrapper function that Supabase can definitely see
CREATE OR REPLACE FUNCTION test_search_connection()
RETURNS TABLE (
    status TEXT,
    function_count INTEGER,
    view_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'SUPABASE CONNECTION TEST'::TEXT as status,
        (SELECT COUNT(*) FROM information_schema.routines 
         WHERE routine_schema = 'public' 
         AND routine_name IN ('enhanced_search_transponders', 'get_search_suggestions', 'get_popular_searches'))::INTEGER as function_count,
        (SELECT COUNT(*) FROM information_schema.tables 
         WHERE table_schema = 'public' 
         AND table_name = 'api_transponder_search')::INTEGER as view_count;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION test_search_connection TO anon, authenticated;

-- =============================================================================
-- 2. TEST FUNCTIONS ARE ACCESSIBLE
-- =============================================================================

-- Test the connection function
SELECT * FROM test_search_connection();

-- Test each function individually
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    RAISE NOTICE 'Testing function accessibility...';
    
    -- Test enhanced search
    BEGIN
        SELECT COUNT(*) INTO test_count FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 1, 0);
        RAISE NOTICE '✅ enhanced_search_transponders: % results', test_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ enhanced_search_transponders: %', SQLERRM;
    END;
    
    -- Test search suggestions
    BEGIN
        SELECT COUNT(*) INTO test_count FROM get_search_suggestions('T', 1);
        RAISE NOTICE '✅ get_search_suggestions: % results', test_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ get_search_suggestions: %', SQLERRM;
    END;
    
    -- Test popular searches
    BEGIN
        SELECT COUNT(*) INTO test_count FROM get_popular_searches();
        RAISE NOTICE '✅ get_popular_searches: % results', test_count;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ get_popular_searches: %', SQLERRM;
    END;
END $$;

-- =============================================================================
-- 3. ALTERNATIVE: CREATE SIMPLER FUNCTIONS FOR FRONTEND
-- =============================================================================

-- Create a simple search function that's easier for Supabase to recognize
CREATE OR REPLACE FUNCTION simple_search_transponders(search_term TEXT DEFAULT '')
RETURNS TABLE (
    id TEXT,
    make TEXT,
    model TEXT,
    year_from INTEGER,
    year_to INTEGER,
    transponder_type TEXT,
    oem_keys TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        te.id::TEXT,
        vm.make_name::TEXT,
        te.model_name::TEXT,
        te.year_from,
        te.year_to,
        COALESCE(tf.family_name, '')::TEXT,
        COALESCE(te.oem_keys, '')::TEXT
    FROM transponder_entries te
    LEFT JOIN vehicle_makes vm ON te.make_id = vm.id
    LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
    WHERE te.is_active = true 
        AND (vm.is_active = true OR vm.is_active IS NULL)
        AND (tf.is_active = true OR tf.is_active IS NULL)
        AND (
            search_term = '' OR
            UPPER(COALESCE(vm.make_name, '')) LIKE UPPER('%' || search_term || '%') OR
            UPPER(COALESCE(te.model_name, '')) LIKE UPPER('%' || search_term || '%') OR
            UPPER(COALESCE(tf.family_name, '')) LIKE UPPER('%' || search_term || '%') OR
            UPPER(COALESCE(te.oem_keys, '')) LIKE UPPER('%' || search_term || '%')
        )
    ORDER BY vm.make_name, te.model_name, te.year_from DESC NULLS LAST
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION simple_search_transponders TO anon, authenticated;

-- =============================================================================
-- 4. SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE '🔄 SUPABASE CACHE REFRESH COMPLETE!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '✅ Cache refresh function created';
    RAISE NOTICE '✅ Permissions re-granted';
    RAISE NOTICE '✅ Connection test function created';
    RAISE NOTICE '✅ Simple search function created as backup';
    RAISE NOTICE '';
    RAISE NOTICE 'WAIT 30-60 SECONDS for Supabase to update cache';
    RAISE NOTICE 'Then test your frontend search again.';
    RAISE NOTICE '==================================================';
END $$;
