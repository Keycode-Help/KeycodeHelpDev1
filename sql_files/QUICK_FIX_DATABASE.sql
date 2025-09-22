-- QUICK FIX FOR SEARCH BAR - Run this in Supabase SQL Editor
-- This script fixes the immediate issues without complex setup

-- =============================================================================
-- 1. CREATE ENHANCED SEARCH FUNCTION (The missing function causing 404)
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
    id UUID,
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
        ats.id,
        ats.make,
        COALESCE(ats.make_name_normalized, UPPER(REGEXP_REPLACE(ats.make, '[^A-Za-z0-9]', '', 'g'))) as make_normalized,
        ats.model,
        ats.year_from,
        ats.year_to,
        ats.year_display,
        ats.transponder_type,
        ats.security_system,
        ats.oem_keys,
        ats.part_numbers,
        ats.programming_notes,
        CASE 
            WHEN p_search_term IS NOT NULL THEN
                (
                    CASE WHEN UPPER(ats.make) LIKE UPPER('%' || p_search_term || '%') THEN 10.0 ELSE 0.0 END +
                    CASE WHEN UPPER(ats.model) LIKE UPPER('%' || p_search_term || '%') THEN 8.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.transponder_type, '')) LIKE UPPER('%' || p_search_term || '%') THEN 6.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.oem_keys, '')) LIKE UPPER('%' || p_search_term || '%') THEN 4.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.part_numbers, '')) LIKE UPPER('%' || p_search_term || '%') THEN 3.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.security_system, '')) LIKE UPPER('%' || p_search_term || '%') THEN 2.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.programming_notes, '')) LIKE UPPER('%' || p_search_term || '%') THEN 1.0 ELSE 0.0 END
                )::REAL
            ELSE 5.0
        END as match_score
    FROM api_transponder_search ats
    WHERE 
        (p_search_term IS NULL OR (
            UPPER(ats.make) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(ats.model) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.transponder_type, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.oem_keys, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.part_numbers, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.security_system, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.programming_notes, '')) LIKE UPPER('%' || p_search_term || '%')
        ))
        AND (p_make IS NULL OR UPPER(ats.make) LIKE UPPER('%' || p_make || '%'))
        AND (p_model IS NULL OR UPPER(ats.model) LIKE UPPER('%' || p_model || '%'))
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
-- 2. CREATE SEARCH SUGGESTIONS FUNCTION 
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
    -- Vehicle make suggestions
    SELECT DISTINCT
        ats.make as suggestion,
        'make'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM api_transponder_search ats
    WHERE UPPER(ats.make) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY ats.make
    
    UNION ALL
    
    -- Model suggestions
    SELECT DISTINCT
        ats.model as suggestion,
        'model'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM api_transponder_search ats
    WHERE UPPER(ats.model) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY ats.model
    
    UNION ALL
    
    -- Transponder type suggestions
    SELECT DISTINCT
        ats.transponder_type as suggestion,
        'transponder'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM api_transponder_search ats
    WHERE ats.transponder_type IS NOT NULL 
      AND UPPER(ats.transponder_type) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY ats.transponder_type
    
    ORDER BY count DESC, suggestion
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 3. CREATE POPULAR SEARCHES FUNCTION
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
        ats.make as search_term,
        'Popular Makes'::TEXT as category,
        COUNT(*)::INTEGER as entry_count
    FROM api_transponder_search ats
    GROUP BY ats.make
    ORDER BY entry_count DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 4. GRANT PERMISSIONS
-- =============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION enhanced_search_transponders TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_search_suggestions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_searches TO anon, authenticated;

-- =============================================================================
-- 5. TEST THE FUNCTIONS
-- =============================================================================

-- Test enhanced search (should return results if you have data)
SELECT 'Testing Enhanced Search Function:' as status;
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_count FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 5, 0);
    RAISE NOTICE 'Enhanced search test returned % results', test_count;
    
    IF test_count > 0 THEN
        RAISE NOTICE '✅ Enhanced search function works!';
    ELSE
        RAISE NOTICE '⚠️ Enhanced search function created but no data found. Import your CSV data.';
    END IF;
END $$;

-- Test search suggestions
SELECT 'Testing Search Suggestions Function:' as status;
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_count FROM get_search_suggestions('T', 5);
    RAISE NOTICE 'Search suggestions test returned % results', test_count;
    
    IF test_count > 0 THEN
        RAISE NOTICE '✅ Search suggestions function works!';
    ELSE
        RAISE NOTICE '⚠️ Search suggestions function created but no data found.';
    END IF;
END $$;

-- Final status
DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE '🎉 QUICK FIX COMPLETE!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '✅ enhanced_search_transponders() function created';
    RAISE NOTICE '✅ get_search_suggestions() function created';
    RAISE NOTICE '✅ get_popular_searches() function created';
    RAISE NOTICE '✅ Permissions granted to anon and authenticated';
    RAISE NOTICE '';
    RAISE NOTICE 'Your search bar should now work without 404 errors!';
    RAISE NOTICE 'Clear browser cache and test: Toyota, Honda, Hitag2';
    RAISE NOTICE '==================================================';
END $$;
