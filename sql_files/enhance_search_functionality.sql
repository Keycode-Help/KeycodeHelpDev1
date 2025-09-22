-- Enhance Search Functionality for KCH Database
-- This improves search performance and capabilities

-- Create enhanced search function with better text matching
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
        ats.make_name_normalized as make_normalized,
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
                -- Calculate match score based on how well the search term matches
                (
                    CASE WHEN UPPER(ats.make) LIKE UPPER('%' || p_search_term || '%') THEN 10.0 ELSE 0.0 END +
                    CASE WHEN UPPER(ats.model) LIKE UPPER('%' || p_search_term || '%') THEN 8.0 ELSE 0.0 END +
                    CASE WHEN UPPER(ats.transponder_type) LIKE UPPER('%' || p_search_term || '%') THEN 6.0 ELSE 0.0 END +
                    CASE WHEN UPPER(ats.oem_keys) LIKE UPPER('%' || p_search_term || '%') THEN 4.0 ELSE 0.0 END +
                    CASE WHEN UPPER(ats.part_numbers) LIKE UPPER('%' || p_search_term || '%') THEN 3.0 ELSE 0.0 END +
                    CASE WHEN UPPER(ats.security_system) LIKE UPPER('%' || p_search_term || '%') THEN 2.0 ELSE 0.0 END +
                    CASE WHEN UPPER(ats.programming_notes) LIKE UPPER('%' || p_search_term || '%') THEN 1.0 ELSE 0.0 END
                )::REAL
            ELSE 5.0 -- Default score when no search term
        END as match_score
    FROM api_transponder_search ats
    WHERE 
        -- Text search across multiple fields
        (p_search_term IS NULL OR (
            UPPER(ats.make) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(ats.model) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(ats.transponder_type) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(ats.oem_keys) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(ats.part_numbers) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(ats.security_system) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(ats.programming_notes) LIKE UPPER('%' || p_search_term || '%')
        ))
        -- Specific filters
        AND (p_make IS NULL OR UPPER(ats.make) LIKE UPPER('%' || p_make || '%'))
        AND (p_model IS NULL OR UPPER(ats.model) LIKE UPPER('%' || p_model || '%'))
        AND (p_transponder_family IS NULL OR UPPER(ats.transponder_type) LIKE UPPER('%' || p_transponder_family || '%'))
        AND (p_system_type IS NULL OR UPPER(ats.security_system) LIKE UPPER('%' || p_system_type || '%'))
        -- Year range filter
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

-- Create indexes to improve search performance
CREATE INDEX IF NOT EXISTS idx_transponder_entries_text_search 
ON transponder_entries USING gin(
    (make_id::text || ' ' || 
     COALESCE(model_name, '') || ' ' || 
     COALESCE(cross_references, '') || ' ' || 
     COALESCE(oem_keys, '') || ' ' || 
     COALESCE(notes, ''))
);

-- Create function for quick autocomplete suggestions
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
    SELECT 
        vm.make_name as suggestion,
        'make'::TEXT as suggestion_type,
        COUNT(te.id)::INTEGER as count
    FROM vehicle_makes vm
    LEFT JOIN transponder_entries te ON vm.id = te.make_id AND te.is_active = true
    WHERE vm.is_active = true 
      AND UPPER(vm.make_name) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY vm.id, vm.make_name
    HAVING COUNT(te.id) > 0
    
    UNION ALL
    
    -- Model suggestions
    SELECT DISTINCT
        te.model_name as suggestion,
        'model'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM transponder_entries te
    JOIN vehicle_makes vm ON te.make_id = vm.id
    WHERE te.is_active = true 
      AND vm.is_active = true
      AND UPPER(te.model_name) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY te.model_name
    
    UNION ALL
    
    -- Transponder family suggestions
    SELECT 
        tf.family_name as suggestion,
        'transponder'::TEXT as suggestion_type,
        COUNT(te.id)::INTEGER as count
    FROM transponder_families tf
    LEFT JOIN transponder_entries te ON tf.id = te.transponder_family_id AND te.is_active = true
    WHERE tf.is_active = true 
      AND UPPER(tf.family_name) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY tf.id, tf.family_name
    HAVING COUNT(te.id) > 0
    
    ORDER BY count DESC, suggestion
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Create function to get popular search terms
CREATE OR REPLACE FUNCTION get_popular_searches()
RETURNS TABLE (
    search_term TEXT,
    category TEXT,
    entry_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Most common makes
    SELECT 
        vm.make_name as search_term,
        'Popular Makes'::TEXT as category,
        COUNT(te.id)::INTEGER as entry_count
    FROM vehicle_makes vm
    LEFT JOIN transponder_entries te ON vm.id = te.make_id AND te.is_active = true
    WHERE vm.is_active = true
    GROUP BY vm.id, vm.make_name
    HAVING COUNT(te.id) > 0
    ORDER BY entry_count DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for the new functions
GRANT EXECUTE ON FUNCTION enhanced_search_transponders TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_search_suggestions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_searches TO anon, authenticated;

-- Test the enhanced search functionality
SELECT 'Testing Enhanced Search Functions:' as section;

-- Test 1: Search for Toyota
SELECT 'Search Test - Toyota:' as test;
SELECT make, model, year_display, match_score
FROM enhanced_search_transponders('Toyota', NULL, NULL, NULL, NULL, NULL, 5, 0)
ORDER BY match_score DESC;

-- Test 2: Search suggestions for 'hit'
SELECT 'Suggestion Test - hit:' as test;
SELECT suggestion, suggestion_type, count
FROM get_search_suggestions('hit', 5);

-- Test 3: Popular searches
SELECT 'Popular Searches:' as test;
SELECT search_term, entry_count
FROM get_popular_searches()
LIMIT 5;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Enhanced search functionality created!';
    RAISE NOTICE 'New functions available:';
    RAISE NOTICE '- enhanced_search_transponders() - Advanced search with scoring';
    RAISE NOTICE '- get_search_suggestions() - Autocomplete suggestions'; 
    RAISE NOTICE '- get_popular_searches() - Popular search terms';
    RAISE NOTICE 'Your frontend search bar will now be much more responsive!';
END $$;
