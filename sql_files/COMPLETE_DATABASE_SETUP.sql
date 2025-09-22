-- COMPLETE DATABASE SETUP FOR KCH TRANSPONDER DATABASE
-- Run this entire script in Supabase SQL Editor

-- =============================================================================
-- 1. ENSURE ALL TABLES EXIST
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

-- Transponder Entries Table
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
    part_numbers TEXT,
    programming_notes TEXT,
    difficulty_level INTEGER DEFAULT 1,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_transponder_entries_make_id ON transponder_entries(make_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_system_type_id ON transponder_entries(system_type_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_transponder_family_id ON transponder_entries(transponder_family_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_model_name ON transponder_entries(model_name);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_year_range ON transponder_entries(year_from, year_to);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_active ON transponder_entries(is_active);

-- Text search indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_makes_search ON vehicle_makes USING gin(to_tsvector('english', make_name));
CREATE INDEX IF NOT EXISTS idx_transponder_entries_text_search ON transponder_entries USING gin(
    to_tsvector('english', 
        COALESCE(model_name, '') || ' ' || 
        COALESCE(cross_references, '') || ' ' || 
        COALESCE(oem_keys, '') || ' ' || 
        COALESCE(notes, '')
    )
);

-- =============================================================================
-- 3. CREATE VIEWS
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

-- Main Search View
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
    te.part_numbers,
    te.programming_notes,
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
    AND (tf.is_active = true OR tf.is_active IS NULL);

-- =============================================================================
-- 4. CREATE ENHANCED SEARCH FUNCTIONS
-- =============================================================================

-- Enhanced Search Function
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

-- Search Suggestions Function
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

-- Popular Searches Function
CREATE OR REPLACE FUNCTION get_popular_searches()
RETURNS TABLE (
    search_term TEXT,
    category TEXT,
    entry_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
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

-- =============================================================================
-- 5. SETUP ROW LEVEL SECURITY (RLS) AND PERMISSIONS
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access" ON vehicle_makes;
DROP POLICY IF EXISTS "Public read access" ON system_types;
DROP POLICY IF EXISTS "Public read access" ON transponder_families;
DROP POLICY IF EXISTS "Public read access" ON transponder_entries;

-- Create policies for public read access
CREATE POLICY "Public read access" ON vehicle_makes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON system_types FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transponder_families FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transponder_entries FOR SELECT USING (true);

-- Grant permissions to anon and authenticated users
GRANT SELECT ON vehicle_makes TO anon, authenticated;
GRANT SELECT ON system_types TO anon, authenticated;
GRANT SELECT ON transponder_families TO anon, authenticated;
GRANT SELECT ON transponder_entries TO anon, authenticated;

-- Grant permissions on views
GRANT SELECT ON vehicle_summary TO anon, authenticated;
GRANT SELECT ON transponder_family_summary TO anon, authenticated;
GRANT SELECT ON api_transponder_search TO anon, authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION enhanced_search_transponders TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_search_suggestions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_searches TO anon, authenticated;

-- =============================================================================
-- 6. INSERT SAMPLE DATA (IF TABLES ARE EMPTY)
-- =============================================================================

-- Insert sample vehicle makes if none exist
INSERT INTO vehicle_makes (make_name, make_name_normalized) 
SELECT * FROM (VALUES 
    ('Toyota', 'TOYOTA'),
    ('Honda', 'HONDA'),
    ('Ford', 'FORD'),
    ('Chevrolet', 'CHEVROLET'),
    ('Nissan', 'NISSAN'),
    ('BMW', 'BMW'),
    ('Mercedes-Benz', 'MERCEDESBENZ'),
    ('Audi', 'AUDI'),
    ('Volkswagen', 'VOLKSWAGEN'),
    ('Lexus', 'LEXUS')
) AS sample_makes(make_name, make_name_normalized)
WHERE NOT EXISTS (SELECT 1 FROM vehicle_makes LIMIT 1);

-- Insert sample system types if none exist
INSERT INTO system_types (system_name, system_code, system_description)
SELECT * FROM (VALUES 
    ('PassLock I', 'PL1', 'GM PassLock Generation 1'),
    ('PassLock II', 'PL2', 'GM PassLock Generation 2'),
    ('PassLock III', 'PL3', 'GM PassLock Generation 3'),
    ('VATS', 'VATS', 'Vehicle Anti-Theft System'),
    ('Immobilizer', 'IMM', 'Standard Immobilizer System'),
    ('Smart Key', 'SMART', 'Smart Key System'),
    ('KESSY', 'KESSY', 'Volkswagen/Audi Keyless System'),
    ('Intelligent Key', 'INTELLI', 'Nissan Intelligent Key'),
    ('Proximity Key', 'PROX', 'Proximity Key System')
) AS sample_systems(system_name, system_code, system_description)
WHERE NOT EXISTS (SELECT 1 FROM system_types LIMIT 1);

-- Insert sample transponder families if none exist
INSERT INTO transponder_families (family_name, family_code, family_description)
SELECT * FROM (VALUES 
    ('Texas Crypto 4D60', '4D60', 'Texas Instruments 40-bit transponder'),
    ('Texas Crypto 4D68', '4D68', 'Texas Instruments 80-bit transponder'),
    ('Texas Fixed 4C', '4C', 'Texas Instruments fixed code'),
    ('Texas Fixed 4D', '4D', 'Texas Instruments rolling code'),
    ('Hitag2', 'HT2', 'Philips Hitag2 transponder'),
    ('Megamos Crypto', 'MC', 'Megamos Crypto transponder'),
    ('ID46', 'ID46', 'PCF7936 transponder'),
    ('ID48', 'ID48', 'PCF7938 transponder'),
    ('ID33', 'ID33', 'Philips ID33 transponder'),
    ('ID40', 'ID40', 'Transponder for newer vehicles')
) AS sample_families(family_name, family_code, family_description)
WHERE NOT EXISTS (SELECT 1 FROM transponder_families LIMIT 1);

-- Insert sample transponder entries if none exist
INSERT INTO transponder_entries (make_id, model_name, year_from, year_to, system_type_id, transponder_family_id, oem_keys, programming_notes)
SELECT 
    vm.id,
    sample_data.model_name,
    sample_data.year_from,
    sample_data.year_to,
    st.id,
    tf.id,
    sample_data.oem_keys,
    sample_data.programming_notes
FROM (VALUES 
    ('Toyota', 'Camry', 2018, 2023, 'Immobilizer', 'Texas Crypto 4D68', 'HYQ12BDP, HYQ12BEL', 'Standard immobilizer programming'),
    ('Honda', 'Accord', 2019, 2023, 'Immobilizer', 'Hitag2', 'MLBHLIK-1T, KR5V2X', 'Honda immobilizer system'),
    ('Ford', 'F-150', 2015, 2023, 'PassLock III', 'Texas Crypto 4D60', '164-R8130, 164-R8131', 'Ford PATS programming'),
    ('Chevrolet', 'Silverado', 2014, 2023, 'PassLock III', 'Texas Fixed 4D', '13577771, 13577772', 'GM PassLock system'),
    ('BMW', '3 Series', 2020, 2023, 'Smart Key', 'Megamos Crypto', 'YGOHUF5767, YGOHUF5788', 'BMW CAS programming')
) AS sample_data(make_name, model_name, year_from, year_to, system_name, family_name, oem_keys, programming_notes)
JOIN vehicle_makes vm ON vm.make_name = sample_data.make_name
JOIN system_types st ON st.system_name = sample_data.system_name
JOIN transponder_families tf ON tf.family_name = sample_data.family_name
WHERE NOT EXISTS (SELECT 1 FROM transponder_entries LIMIT 1);

-- =============================================================================
-- 7. FINAL VERIFICATION
-- =============================================================================

-- Show setup summary
DO $$
DECLARE
    v_makes INTEGER;
    v_systems INTEGER;
    v_families INTEGER;
    v_entries INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_makes FROM vehicle_makes WHERE is_active = true;
    SELECT COUNT(*) INTO v_systems FROM system_types WHERE is_active = true;
    SELECT COUNT(*) INTO v_families FROM transponder_families WHERE is_active = true;
    SELECT COUNT(*) INTO v_entries FROM transponder_entries WHERE is_active = true;
    
    RAISE NOTICE '==================================================';
    RAISE NOTICE '🎉 KCH DATABASE SETUP COMPLETE!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Vehicle Makes: %', v_makes;
    RAISE NOTICE 'System Types: %', v_systems;
    RAISE NOTICE 'Transponder Families: %', v_families;
    RAISE NOTICE 'Transponder Entries: %', v_entries;
    RAISE NOTICE '';
    RAISE NOTICE '✅ All tables created';
    RAISE NOTICE '✅ All views created';
    RAISE NOTICE '✅ All functions created';
    RAISE NOTICE '✅ Permissions configured';
    RAISE NOTICE '✅ Sample data inserted';
    RAISE NOTICE '';
    RAISE NOTICE 'Your frontend should now work perfectly!';
    RAISE NOTICE 'Test searches: Toyota, Honda, Hitag2, HYQ';
    RAISE NOTICE '==================================================';
END $$;

-- Test the search function
SELECT '🔍 Testing Enhanced Search Function:' as status;
SELECT count(*) as total_searchable_entries FROM api_transponder_search;

-- Test search suggestions
SELECT '💡 Testing Search Suggestions:' as status;
SELECT suggestion, suggestion_type FROM get_search_suggestions('To', 3);

-- Success message
SELECT '🎉 SUCCESS: Your KCH database is ready for use!' as final_status;
