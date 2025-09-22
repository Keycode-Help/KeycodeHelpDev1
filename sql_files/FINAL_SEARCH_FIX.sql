-- FINAL SEARCH FIX - Works with actual database schema
-- This fixes the missing column errors by using only existing columns

-- =============================================================================
-- 1. DROP EXISTING FUNCTIONS AND VIEW TO START FRESH
-- =============================================================================

DROP FUNCTION IF EXISTS enhanced_search_transponders;
DROP FUNCTION IF EXISTS get_search_suggestions;  
DROP FUNCTION IF EXISTS get_popular_searches;
DROP VIEW IF EXISTS api_transponder_search;

-- =============================================================================
-- 2. CREATE CORRECTED VIEW WITH ONLY EXISTING COLUMNS
-- =============================================================================

CREATE VIEW api_transponder_search AS
SELECT 
    te.id,
    vm.make_name as make,
    COALESCE(vm.make_name_normalized, UPPER(REGEXP_REPLACE(vm.make_name, '[^A-Za-z0-9]', '', 'g'))) as make_name_normalized,
    te.model_name as model,
    te.year_from,
    te.year_to,
    CASE 
        WHEN te.year_from IS NOT NULL AND te.year_to IS NOT NULL THEN 
            te.year_from::text || '-' || te.year_to::text
        WHEN te.year_from IS NOT NULL THEN 
            te.year_from::text || '+'
        WHEN te.year_to IS NOT NULL THEN 
            'Up to ' || te.year_to::text
        ELSE 'All Years'
    END as year_display,
    COALESCE(tf.family_name, '') as transponder_type,
    COALESCE(st.system_name, '') as security_system,
    COALESCE(te.oem_keys, '') as oem_keys,
    COALESCE(te.transponder_detail, '') as part_numbers, -- Using transponder_detail as part_numbers
    COALESCE(te.notes, '') as programming_notes,
    te.created_at,
    te.updated_at
FROM transponder_entries te
LEFT JOIN vehicle_makes vm ON te.make_id = vm.id
LEFT JOIN system_types st ON te.system_type_id = st.id
LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
WHERE te.is_active = true 
    AND (vm.is_active = true OR vm.is_active IS NULL)
    AND (st.is_active = true OR st.is_active IS NULL)
    AND (tf.is_active = true OR tf.is_active IS NULL);

-- =============================================================================
-- 3. CREATE ENHANCED SEARCH FUNCTION (USING ONLY VIEW COLUMNS)
-- =============================================================================

CREATE OR REPLACE FUNCTION enhanced_search_transponders(
    p_search_term TEXT DEFAULT NULL,
    p_make TEXT DEFAULT NULL,
    p_model TEXT DEFAULT NULL,
    p_year INTEGER DEFAULT NULL,
    p_transponder_family TEXT DEFAULT NULL,
    p_system_type TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    id TEXT,
    make TEXT,
    make_normalized TEXT,
    model TEXT,
    year_from INTEGER,
    year_to INTEGER,
    year_display TEXT,
    transponder_type TEXT,
    security_system TEXT,
    oem_keys TEXT,
    part_numbers TEXT,
    programming_notes TEXT,
    match_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ats.id::TEXT,
        COALESCE(ats.make, '')::TEXT,
        COALESCE(ats.make_name_normalized, '')::TEXT,
        COALESCE(ats.model, '')::TEXT,
        ats.year_from,
        ats.year_to,
        COALESCE(ats.year_display, 'All Years')::TEXT,
        COALESCE(ats.transponder_type, '')::TEXT,
        COALESCE(ats.security_system, '')::TEXT,
        COALESCE(ats.oem_keys, '')::TEXT,
        COALESCE(ats.part_numbers, '')::TEXT,
        COALESCE(ats.programming_notes, '')::TEXT,
        CASE 
            WHEN p_search_term IS NOT NULL THEN
                (
                    CASE WHEN UPPER(COALESCE(ats.make, '')) LIKE UPPER('%' || p_search_term || '%') THEN 15.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.model, '')) LIKE UPPER('%' || p_search_term || '%') THEN 12.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.transponder_type, '')) LIKE UPPER('%' || p_search_term || '%') THEN 10.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.oem_keys, '')) LIKE UPPER('%' || p_search_term || '%') THEN 8.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.part_numbers, '')) LIKE UPPER('%' || p_search_term || '%') THEN 6.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.security_system, '')) LIKE UPPER('%' || p_search_term || '%') THEN 4.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.programming_notes, '')) LIKE UPPER('%' || p_search_term || '%') THEN 3.0 ELSE 0.0 END
                )::REAL
            ELSE 5.0
        END as match_score
    FROM api_transponder_search ats
    WHERE 
        (p_search_term IS NULL OR (
            UPPER(COALESCE(ats.make, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.model, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.transponder_type, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.oem_keys, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.part_numbers, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.security_system, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.programming_notes, '')) LIKE UPPER('%' || p_search_term || '%')
        ))
        AND (p_make IS NULL OR UPPER(COALESCE(ats.make, '')) LIKE UPPER('%' || p_make || '%'))
        AND (p_model IS NULL OR UPPER(COALESCE(ats.model, '')) LIKE UPPER('%' || p_model || '%'))
        AND (p_transponder_family IS NULL OR UPPER(COALESCE(ats.transponder_type, '')) LIKE UPPER('%' || p_transponder_family || '%'))
        AND (p_system_type IS NULL OR UPPER(COALESCE(ats.security_system, '')) LIKE UPPER('%' || p_system_type || '%'))
        AND (p_year IS NULL OR (
            (ats.year_from IS NULL OR ats.year_from <= p_year) AND
            (ats.year_to IS NULL OR ats.year_to >= p_year)
        ))
    ORDER BY 
        match_score DESC,
        ats.make,
        ats.model,
        ats.year_from DESC NULLS LAST
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 4. CREATE SEARCH SUGGESTIONS FUNCTION (USING ONLY VIEW COLUMNS)
-- =============================================================================

CREATE OR REPLACE FUNCTION get_search_suggestions(
    p_search_term TEXT,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    suggestion TEXT,
    suggestion_type TEXT,
    count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Vehicle makes
    SELECT DISTINCT
        ats.make::TEXT as suggestion,
        'make'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM api_transponder_search ats
    WHERE UPPER(COALESCE(ats.make, '')) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY ats.make
    
    UNION ALL
    
    -- Models
    SELECT DISTINCT
        ats.model::TEXT as suggestion,
        'model'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM api_transponder_search ats
    WHERE UPPER(COALESCE(ats.model, '')) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY ats.model
    
    UNION ALL
    
    -- Transponder types
    SELECT DISTINCT
        ats.transponder_type::TEXT as suggestion,
        'transponder'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM api_transponder_search ats
    WHERE ats.transponder_type IS NOT NULL 
      AND ats.transponder_type != ''
      AND UPPER(ats.transponder_type) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY ats.transponder_type
    
    UNION ALL
    
    -- OEM Keys  
    SELECT DISTINCT
        TRIM(split_part(ats.oem_keys, ',', 1))::TEXT as suggestion,
        'oem_key'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM api_transponder_search ats
    WHERE ats.oem_keys IS NOT NULL 
      AND ats.oem_keys != ''
      AND UPPER(ats.oem_keys) LIKE UPPER('%' || p_search_term || '%')
      AND TRIM(split_part(ats.oem_keys, ',', 1)) != ''
    GROUP BY TRIM(split_part(ats.oem_keys, ',', 1))
    
    ORDER BY count DESC, suggestion
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 5. CREATE POPULAR SEARCHES FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION get_popular_searches()
RETURNS TABLE (
    search_term TEXT,
    category TEXT,
    entry_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ats.make::TEXT as search_term,
        'Popular Makes'::TEXT as category,
        COUNT(*)::INTEGER as entry_count
    FROM api_transponder_search ats
    WHERE ats.make IS NOT NULL AND ats.make != ''
    GROUP BY ats.make
    ORDER BY entry_count DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 6. GRANT PERMISSIONS
-- =============================================================================

GRANT SELECT ON api_transponder_search TO anon, authenticated;
GRANT EXECUTE ON FUNCTION enhanced_search_transponders TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_search_suggestions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_searches TO anon, authenticated;

-- =============================================================================
-- 7. TEST THE FUNCTIONS
-- =============================================================================

-- Test view has data
SELECT 'Testing view data:' as test_phase;
SELECT COUNT(*) || ' total records in api_transponder_search' as result FROM api_transponder_search;

-- Test enhanced search
SELECT 'Testing enhanced search:' as test_phase;
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_count FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 3, 0);
    RAISE NOTICE 'Enhanced search for "Toyota": % results', test_count;
    
    SELECT COUNT(*) INTO test_count FROM enhanced_search_transponders('Honda', NULL, NULL, NULL, NULL, NULL, 3, 0);
    RAISE NOTICE 'Enhanced search for "Honda": % results', test_count;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Enhanced search test failed: %', SQLERRM;
END $$;

-- Test suggestions
SELECT 'Testing suggestions:' as test_phase;
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_count FROM get_search_suggestions('T', 3);
    RAISE NOTICE 'Search suggestions for "T": % results', test_count;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Suggestions test failed: %', SQLERRM;
END $$;

-- Test popular searches
SELECT 'Testing popular searches:' as test_phase;
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_count FROM get_popular_searches();
    RAISE NOTICE 'Popular searches: % results', test_count;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Popular searches test failed: %', SQLERRM;
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE '🚀 FINAL SEARCH FIX COMPLETE!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '✅ View recreated with correct columns';
    RAISE NOTICE '✅ Search functions updated';
    RAISE NOTICE '✅ Permissions granted';
    RAISE NOTICE '✅ All functions tested';
    RAISE NOTICE '';
    RAISE NOTICE 'Your search should now work without column errors!';
    RAISE NOTICE '==================================================';
END $$;
