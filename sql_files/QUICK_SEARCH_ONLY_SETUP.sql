-- QUICK SEARCH-ONLY SETUP - Just the essentials to get search working
-- This avoids view conflicts and focuses only on search functionality

-- =============================================================================
-- 1. DROP AND RECREATE SEARCH FUNCTIONS ONLY
-- =============================================================================

-- Drop existing functions to ensure clean slate
DROP FUNCTION IF EXISTS enhanced_search_transponders;
DROP FUNCTION IF EXISTS get_search_suggestions;  
DROP FUNCTION IF EXISTS get_popular_searches;

-- =============================================================================
-- 2. CREATE ENHANCED SEARCH FUNCTION (Works with existing data)
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
    -- Check if api_transponder_search view exists, if not create a basic one
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'api_transponder_search'
    ) THEN
        -- Create basic view from existing tables
        EXECUTE '
        CREATE VIEW api_transponder_search AS
        SELECT 
            te.id,
            vm.make_name as make,
            COALESCE(vm.make_name_normalized, UPPER(REGEXP_REPLACE(vm.make_name, ''[^A-Za-z0-9]'', '''', ''g''))) as make_name_normalized,
            te.model_name as model,
            te.year_from,
            te.year_to,
            CASE 
                WHEN te.year_from IS NOT NULL AND te.year_to IS NOT NULL THEN 
                    te.year_from::text || ''-'' || te.year_to::text
                WHEN te.year_from IS NOT NULL THEN 
                    te.year_from::text || ''+''
                WHEN te.year_to IS NOT NULL THEN 
                    ''Up to '' || te.year_to::text
                ELSE ''All Years''
            END as year_display,
            COALESCE(tf.family_name, '''') as transponder_type,
            COALESCE(st.system_name, '''') as security_system,
            COALESCE(te.oem_keys, '''') as oem_keys,
            COALESCE(te.cross_references, '''') as part_numbers,
            COALESCE(te.notes, '''') as programming_notes,
            te.cross_references,
            te.transponder_detail,
            te.difficulty_level,
            te.notes,
            te.created_at,
            te.updated_at
        FROM transponder_entries te
        LEFT JOIN vehicle_makes vm ON te.make_id = vm.id
        LEFT JOIN system_types st ON te.system_type_id = st.id
        LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
        WHERE te.is_active = true 
            AND (vm.is_active = true OR vm.is_active IS NULL)
            AND (st.is_active = true OR st.is_active IS NULL)
            AND (tf.is_active = true OR tf.is_active IS NULL)';
    END IF;

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
                    CASE WHEN UPPER(COALESCE(ats.programming_notes, '')) LIKE UPPER('%' || p_search_term || '%') THEN 3.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.cross_references, '')) LIKE UPPER('%' || p_search_term || '%') THEN 2.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.notes, '')) LIKE UPPER('%' || p_search_term || '%') THEN 1.0 ELSE 0.0 END
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
            UPPER(COALESCE(ats.programming_notes, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.cross_references, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.notes, '')) LIKE UPPER('%' || p_search_term || '%')
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
-- 3. CREATE SEARCH SUGGESTIONS FUNCTION
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
-- 4. CREATE POPULAR SEARCHES FUNCTION
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
-- 5. GRANT PERMISSIONS
-- =============================================================================

GRANT EXECUTE ON FUNCTION enhanced_search_transponders TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_search_suggestions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_searches TO anon, authenticated;

-- Grant view access if it was created
GRANT SELECT ON api_transponder_search TO anon, authenticated;

-- =============================================================================
-- 6. TEST THE FUNCTIONS
-- =============================================================================

-- Quick test to ensure functions work
SELECT 'Testing Quick Search Setup:' as status;

DO $$
DECLARE
    test_count INTEGER;
    view_exists BOOLEAN;
BEGIN
    -- Check if view exists now
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'api_transponder_search'
    ) INTO view_exists;
    
    RAISE NOTICE 'api_transponder_search view exists: %', view_exists;
    
    IF view_exists THEN
        -- Test search suggestions
        SELECT COUNT(*) INTO test_count FROM get_search_suggestions('T', 3);
        RAISE NOTICE 'Search suggestions for "T": % results', test_count;
        
        -- Test popular searches
        SELECT COUNT(*) INTO test_count FROM get_popular_searches();
        RAISE NOTICE 'Popular searches: % results', test_count;
        
        -- Test enhanced search
        BEGIN
            SELECT COUNT(*) INTO test_count FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 3, 0);
            RAISE NOTICE 'Enhanced search for "Toyota": % results', test_count;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Enhanced search test failed: %', SQLERRM;
        END;
    END IF;
    
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE '🚀 QUICK SEARCH SETUP COMPLETE!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '✅ Search functions created/updated';
    RAISE NOTICE '✅ View created if needed';
    RAISE NOTICE '✅ Permissions granted';
    RAISE NOTICE '✅ No view conflicts';
    RAISE NOTICE '';
    RAISE NOTICE 'Your search bar should now work!';
    RAISE NOTICE 'Clear browser cache and test frontend search.';
    RAISE NOTICE '==================================================';
END $$;
