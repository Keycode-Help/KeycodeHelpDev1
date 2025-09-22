-- COMPLETE WORKING SETUP - No Data Excluded, Full Functionality
-- This script ensures ALL your data is accessible and searchable

-- =============================================================================
-- 1. CREATE OR UPDATE ALL REQUIRED TABLES
-- =============================================================================

-- Vehicle Makes Table
CREATE TABLE IF NOT EXISTS vehicle_makes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make_name VARCHAR(100) UNIQUE NOT NULL,
    make_name_normalized VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System Types Table  
CREATE TABLE IF NOT EXISTS system_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_name VARCHAR(150) UNIQUE NOT NULL,
    system_code VARCHAR(20),
    system_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transponder Families Table
CREATE TABLE IF NOT EXISTS transponder_families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_name VARCHAR(200) UNIQUE NOT NULL,
    family_code VARCHAR(50),
    family_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transponder Entries Table (with ALL columns your data needs)
CREATE TABLE IF NOT EXISTS transponder_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make_id UUID REFERENCES vehicle_makes(id),
    model_name VARCHAR(150),
    year_from INTEGER,
    year_to INTEGER,
    year_note VARCHAR(100),
    system_type_id UUID REFERENCES system_types(id),
    transponder_family_id UUID REFERENCES transponder_families(id),
    transponder_detail TEXT,
    cross_references TEXT,
    oem_keys TEXT,
    part_numbers TEXT,           -- This column for full compatibility
    programming_notes TEXT,      -- This column for full compatibility  
    difficulty_level INTEGER DEFAULT 1,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$
BEGIN
    -- Add part_numbers column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'transponder_entries' AND column_name = 'part_numbers'
    ) THEN
        ALTER TABLE transponder_entries ADD COLUMN part_numbers TEXT;
        RAISE NOTICE '✅ Added part_numbers column';
    END IF;
    
    -- Add programming_notes column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'transponder_entries' AND column_name = 'programming_notes'
    ) THEN
        ALTER TABLE transponder_entries ADD COLUMN programming_notes TEXT;
        RAISE NOTICE '✅ Added programming_notes column';
    END IF;
    
    -- Add make_name_normalized if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'vehicle_makes' AND column_name = 'make_name_normalized'
    ) THEN
        ALTER TABLE vehicle_makes ADD COLUMN make_name_normalized VARCHAR(100);
        RAISE NOTICE '✅ Added make_name_normalized column';
    END IF;
END $$;

-- Update existing data to populate new columns
UPDATE transponder_entries 
SET part_numbers = cross_references 
WHERE part_numbers IS NULL AND cross_references IS NOT NULL;

UPDATE transponder_entries 
SET programming_notes = notes 
WHERE programming_notes IS NULL AND notes IS NOT NULL;

UPDATE vehicle_makes 
SET make_name_normalized = UPPER(REGEXP_REPLACE(make_name, '[^A-Za-z0-9]', '', 'g'))
WHERE make_name_normalized IS NULL;

-- =============================================================================
-- 2. CREATE PERFORMANCE INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_transponder_entries_make_id ON transponder_entries(make_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_system_type_id ON transponder_entries(system_type_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_transponder_family_id ON transponder_entries(transponder_family_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_model_name ON transponder_entries(model_name);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_year_range ON transponder_entries(year_from, year_to);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_active ON transponder_entries(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicle_makes_normalized ON vehicle_makes(make_name_normalized);

-- Text search indexes for ALL searchable content
CREATE INDEX IF NOT EXISTS idx_transponder_entries_text_search ON transponder_entries USING gin(
    to_tsvector('english', 
        COALESCE(model_name, '') || ' ' || 
        COALESCE(cross_references, '') || ' ' || 
        COALESCE(oem_keys, '') || ' ' || 
        COALESCE(part_numbers, '') || ' ' ||
        COALESCE(programming_notes, '') || ' ' ||
        COALESCE(notes, '') || ' ' ||
        COALESCE(transponder_detail, '')
    )
);

-- =============================================================================
-- 3. CREATE COMPREHENSIVE VIEWS (All Data Accessible)
-- =============================================================================

-- Vehicle Summary View
CREATE OR REPLACE VIEW vehicle_summary AS
SELECT 
    vm.id,
    vm.make_name,
    vm.make_name_normalized,
    COUNT(te.id) as total_models,
    COUNT(DISTINCT te.model_name) as unique_models,
    COUNT(CASE WHEN te.model_name IS NOT NULL AND TRIM(te.model_name) != '' THEN 1 END) as verified_models,
    MIN(te.year_from) as earliest_year,
    MAX(te.year_to) as latest_year,
    vm.is_active,
    vm.created_at,
    vm.updated_at
FROM vehicle_makes vm
LEFT JOIN transponder_entries te ON vm.id = te.make_id AND te.is_active = true
WHERE vm.is_active = true
GROUP BY vm.id, vm.make_name, vm.make_name_normalized, vm.is_active, vm.created_at, vm.updated_at;

-- Transponder Family Summary View
CREATE OR REPLACE VIEW transponder_family_summary AS
SELECT 
    tf.id,
    tf.family_name,
    tf.family_code,
    COUNT(te.id) as usage_count,
    COUNT(DISTINCT te.make_id) as make_count,
    tf.is_active,
    tf.created_at,
    tf.updated_at
FROM transponder_families tf
LEFT JOIN transponder_entries te ON tf.id = te.transponder_family_id AND te.is_active = true
WHERE tf.is_active = true
GROUP BY tf.id, tf.family_name, tf.family_code, tf.is_active, tf.created_at, tf.updated_at;

-- Complete API Search View (ALL data fields included)
CREATE OR REPLACE VIEW api_transponder_search AS
SELECT 
    te.id,
    vm.make_name as make,
    vm.make_name_normalized,
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
    tf.family_name as transponder_type,
    st.system_name as security_system,
    te.oem_keys,
    COALESCE(te.part_numbers, te.cross_references) as part_numbers, -- Use part_numbers or fallback to cross_references
    COALESCE(te.programming_notes, te.notes) as programming_notes,   -- Use programming_notes or fallback to notes
    te.cross_references,
    te.transponder_detail,
    te.difficulty_level,
    te.notes,
    te.year_note,
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
-- 4. CREATE ENHANCED SEARCH FUNCTIONS (All Data Searchable)
-- =============================================================================

-- Drop existing functions to recreate them properly
DROP FUNCTION IF EXISTS enhanced_search_transponders;
DROP FUNCTION IF EXISTS get_search_suggestions;  
DROP FUNCTION IF EXISTS get_popular_searches;

-- Enhanced Search Function with ALL fields searchable
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
                    -- Score based on field importance and match quality
                    CASE WHEN UPPER(COALESCE(ats.make, '')) LIKE UPPER('%' || p_search_term || '%') THEN 15.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.model, '')) LIKE UPPER('%' || p_search_term || '%') THEN 12.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.transponder_type, '')) LIKE UPPER('%' || p_search_term || '%') THEN 10.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.oem_keys, '')) LIKE UPPER('%' || p_search_term || '%') THEN 8.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.part_numbers, '')) LIKE UPPER('%' || p_search_term || '%') THEN 6.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.security_system, '')) LIKE UPPER('%' || p_search_term || '%') THEN 4.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.programming_notes, '')) LIKE UPPER('%' || p_search_term || '%') THEN 3.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.cross_references, '')) LIKE UPPER('%' || p_search_term || '%') THEN 2.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.notes, '')) LIKE UPPER('%' || p_search_term || '%') THEN 1.0 ELSE 0.0 END +
                    CASE WHEN UPPER(COALESCE(ats.transponder_detail, '')) LIKE UPPER('%' || p_search_term || '%') THEN 1.0 ELSE 0.0 END
                )::REAL
            ELSE 5.0
        END as match_score
    FROM api_transponder_search ats
    WHERE 
        -- Global search across ALL fields
        (p_search_term IS NULL OR (
            UPPER(COALESCE(ats.make, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.model, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.transponder_type, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.oem_keys, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.part_numbers, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.security_system, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.programming_notes, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.cross_references, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.notes, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.transponder_detail, '')) LIKE UPPER('%' || p_search_term || '%') OR
            UPPER(COALESCE(ats.year_note, '')) LIKE UPPER('%' || p_search_term || '%')
        ))
        -- Specific filters
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

-- Comprehensive Search Suggestions (All searchable content)
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
      AND UPPER(ats.transponder_type) LIKE UPPER('%' || p_search_term || '%')
    GROUP BY ats.transponder_type
    
    UNION ALL
    
    -- OEM Keys
    SELECT DISTINCT
        split_part(ats.oem_keys, ',', 1)::TEXT as suggestion,
        'oem_key'::TEXT as suggestion_type,
        COUNT(*)::INTEGER as count
    FROM api_transponder_search ats
    WHERE ats.oem_keys IS NOT NULL 
      AND UPPER(ats.oem_keys) LIKE UPPER('%' || p_search_term || '%')
      AND split_part(ats.oem_keys, ',', 1) != ''
    GROUP BY split_part(ats.oem_keys, ',', 1)
    
    ORDER BY count DESC, suggestion
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Popular Searches with ALL data types
CREATE OR REPLACE FUNCTION get_popular_searches()
RETURNS TABLE (
    search_term TEXT,
    category TEXT,
    entry_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    -- Popular makes
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
-- 5. SET UP PERMISSIONS (Full Access)
-- =============================================================================

-- Enable RLS
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON vehicle_makes;
DROP POLICY IF EXISTS "Public read access" ON system_types;
DROP POLICY IF EXISTS "Public read access" ON transponder_families;
DROP POLICY IF EXISTS "Public read access" ON transponder_entries;

-- Create public access policies
CREATE POLICY "Public read access" ON vehicle_makes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON system_types FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transponder_families FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transponder_entries FOR SELECT USING (true);

-- Grant all necessary permissions
GRANT SELECT ON vehicle_makes TO anon, authenticated;
GRANT SELECT ON system_types TO anon, authenticated;
GRANT SELECT ON transponder_families TO anon, authenticated;
GRANT SELECT ON transponder_entries TO anon, authenticated;
GRANT SELECT ON vehicle_summary TO anon, authenticated;
GRANT SELECT ON transponder_family_summary TO anon, authenticated;
GRANT SELECT ON api_transponder_search TO anon, authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION enhanced_search_transponders TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_search_suggestions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_searches TO anon, authenticated;

-- =============================================================================
-- 6. DATA IMPORT HELPER FUNCTION
-- =============================================================================

-- Function to import CSV data properly
CREATE OR REPLACE FUNCTION import_transponder_data(
    p_make VARCHAR(100),
    p_model VARCHAR(150),
    p_year_from VARCHAR(20),
    p_year_to VARCHAR(20),
    p_year_note VARCHAR(100),
    p_system_type VARCHAR(150),
    p_transponder_family VARCHAR(200),
    p_transponder_detail TEXT,
    p_cross_refs TEXT,
    p_oem_keys TEXT,
    p_notes TEXT
) RETURNS UUID AS $$
DECLARE
    v_make_id UUID;
    v_system_type_id UUID;
    v_family_id UUID;
    v_entry_id UUID;
    v_year_from_int INTEGER;
    v_year_to_int INTEGER;
BEGIN
    -- Skip empty entries
    IF p_make IS NULL OR TRIM(p_make) = '' OR p_model IS NULL OR TRIM(p_model) = '' THEN
        RETURN NULL;
    END IF;

    -- Get or create vehicle make
    SELECT id INTO v_make_id FROM vehicle_makes WHERE make_name = TRIM(p_make);
    IF v_make_id IS NULL THEN
        INSERT INTO vehicle_makes (make_name, make_name_normalized) 
        VALUES (TRIM(p_make), UPPER(REGEXP_REPLACE(TRIM(p_make), '[^A-Za-z0-9]', '', 'g')))
        ON CONFLICT (make_name) DO UPDATE SET make_name_normalized = EXCLUDED.make_name_normalized
        RETURNING id INTO v_make_id;
    END IF;
    
    -- Get or create system type
    IF p_system_type IS NOT NULL AND TRIM(p_system_type) != '' THEN
        SELECT id INTO v_system_type_id FROM system_types WHERE system_name = TRIM(p_system_type);
        IF v_system_type_id IS NULL THEN
            INSERT INTO system_types (system_name) 
            VALUES (TRIM(p_system_type)) 
            ON CONFLICT (system_name) DO NOTHING
            RETURNING id INTO v_system_type_id;
            
            IF v_system_type_id IS NULL THEN
                SELECT id INTO v_system_type_id FROM system_types WHERE system_name = TRIM(p_system_type);
            END IF;
        END IF;
    END IF;
    
    -- Get or create transponder family
    IF p_transponder_family IS NOT NULL AND TRIM(p_transponder_family) != '' THEN
        SELECT id INTO v_family_id FROM transponder_families WHERE family_name = TRIM(p_transponder_family);
        IF v_family_id IS NULL THEN
            INSERT INTO transponder_families (family_name) 
            VALUES (TRIM(p_transponder_family)) 
            ON CONFLICT (family_name) DO NOTHING
            RETURNING id INTO v_family_id;
            
            IF v_family_id IS NULL THEN
                SELECT id INTO v_family_id FROM transponder_families WHERE family_name = TRIM(p_transponder_family);
            END IF;
        END IF;
    END IF;
    
    -- Convert years safely
    BEGIN
        IF p_year_from IS NOT NULL AND TRIM(p_year_from) != '' AND TRIM(p_year_from) ~ '^[0-9]+$' THEN
            v_year_from_int := TRIM(p_year_from)::INTEGER;
            IF v_year_from_int < 1980 OR v_year_from_int > 2030 THEN
                v_year_from_int := NULL;
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        v_year_from_int := NULL;
    END;
    
    BEGIN
        IF p_year_to IS NOT NULL AND TRIM(p_year_to) != '' AND TRIM(p_year_to) ~ '^[0-9]+$' THEN
            v_year_to_int := TRIM(p_year_to)::INTEGER;
            IF v_year_to_int < 1980 OR v_year_to_int > 2030 THEN
                v_year_to_int := NULL;
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        v_year_to_int := NULL;
    END;
    
    -- Insert entry with ALL fields
    INSERT INTO transponder_entries (
        make_id, 
        model_name, 
        year_from, 
        year_to, 
        year_note,
        system_type_id, 
        transponder_family_id, 
        transponder_detail,
        cross_references, 
        part_numbers,  -- Store as both
        oem_keys, 
        programming_notes,  -- Store as both
        notes
    ) VALUES (
        v_make_id, 
        TRIM(p_model), 
        v_year_from_int, 
        v_year_to_int, 
        NULLIF(TRIM(p_year_note), ''),
        v_system_type_id, 
        v_family_id, 
        NULLIF(TRIM(p_transponder_detail), ''),
        NULLIF(TRIM(p_cross_refs), ''), 
        NULLIF(TRIM(p_cross_refs), ''),  -- part_numbers = cross_refs
        NULLIF(TRIM(p_oem_keys), ''), 
        NULLIF(TRIM(p_notes), ''),     -- programming_notes = notes
        NULLIF(TRIM(p_notes), '')
    ) RETURNING id INTO v_entry_id;
    
    RETURN v_entry_id;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error importing: % % - %', p_make, p_model, SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 7. FINAL VERIFICATION AND SUMMARY
-- =============================================================================

DO $$
DECLARE
    v_entries INTEGER;
    v_makes INTEGER;
    v_families INTEGER;
    v_systems INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_entries FROM transponder_entries WHERE is_active = true;
    SELECT COUNT(*) INTO v_makes FROM vehicle_makes WHERE is_active = true;
    SELECT COUNT(*) INTO v_families FROM transponder_families WHERE is_active = true;
    SELECT COUNT(*) INTO v_systems FROM system_types WHERE is_active = true;
    
    RAISE NOTICE '==================================================';
    RAISE NOTICE '🎉 COMPLETE WORKING SETUP FINISHED!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '✅ ALL tables created/updated with complete schema';
    RAISE NOTICE '✅ ALL columns available (part_numbers, programming_notes)';
    RAISE NOTICE '✅ ALL indexes created for performance';
    RAISE NOTICE '✅ ALL views created with complete data access';
    RAISE NOTICE '✅ ALL search functions created with full field coverage';
    RAISE NOTICE '✅ ALL permissions granted for public access';
    RAISE NOTICE '✅ Data import function available';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Current Data:';
    RAISE NOTICE '   - Transponder Entries: %', v_entries;
    RAISE NOTICE '   - Vehicle Makes: %', v_makes;
    RAISE NOTICE '   - Transponder Families: %', v_families;
    RAISE NOTICE '   - System Types: %', v_systems;
    RAISE NOTICE '';
    
    IF v_entries < 1000 THEN
        RAISE NOTICE '💡 To import your full 1,939 entry dataset:';
        RAISE NOTICE '   1. Use the import_transponder_data() function';
        RAISE NOTICE '   2. Or import via Supabase Dashboard CSV upload';
    ELSE
        RAISE NOTICE '✅ Good data volume - ready for production use!';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Your search bar will now work with ALL data - no exclusions!';
    RAISE NOTICE 'Clear browser cache and test comprehensive search functionality.';
    RAISE NOTICE '==================================================';
END $$;
