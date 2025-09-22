-- Production Migration Script for Transponder Database
-- This script sets up the complete transponder database for production use
-- Run this in your Supabase SQL Editor or via CLI

-- =======================
-- STEP 1: CREATE SCHEMA
-- =======================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For better text search

-- Create sequence for unique ordering (optional)
CREATE SEQUENCE IF NOT EXISTS transponder_entry_seq;

-- Create vehicle makes table
CREATE TABLE IF NOT EXISTS vehicle_makes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make_name VARCHAR(100) NOT NULL UNIQUE,
    make_name_normalized VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transponder families table
CREATE TABLE IF NOT EXISTS transponder_families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_name VARCHAR(200) NOT NULL UNIQUE,
    family_code VARCHAR(50),
    family_description TEXT,
    compatibility_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system types table
CREATE TABLE IF NOT EXISTS system_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_name VARCHAR(150) NOT NULL UNIQUE,
    system_code VARCHAR(50),
    system_description TEXT,
    manufacturer VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main transponder entries table
CREATE TABLE IF NOT EXISTS transponder_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_number BIGINT DEFAULT nextval('transponder_entry_seq'),
    make_id UUID REFERENCES vehicle_makes(id) ON DELETE CASCADE,
    model_name VARCHAR(150) NOT NULL,
    model_variant VARCHAR(100),
    year_from INTEGER,
    year_to INTEGER,
    year_note VARCHAR(150),
    system_type_id UUID REFERENCES system_types(id) ON DELETE SET NULL,
    transponder_family_id UUID REFERENCES transponder_families(id) ON DELETE SET NULL,
    transponder_detail TEXT,
    cross_references TEXT,
    oem_keys TEXT,
    part_numbers TEXT,
    programming_notes TEXT,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_time_minutes INTEGER,
    special_tools_required TEXT,
    notes TEXT,
    source_reference VARCHAR(100),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'needs_review')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_year_range CHECK (
        year_from IS NULL OR year_to IS NULL OR year_from <= year_to
    ),
    CONSTRAINT valid_year_values CHECK (
        (year_from IS NULL OR year_from BETWEEN 1980 AND 2030) AND
        (year_to IS NULL OR year_to BETWEEN 1980 AND 2030)
    )
);

-- ========================
-- STEP 2: CREATE INDEXES
-- ========================

-- Primary search indexes
CREATE INDEX IF NOT EXISTS idx_transponder_entries_make_id ON transponder_entries(make_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_model_name ON transponder_entries USING gin(model_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_year_from ON transponder_entries(year_from);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_year_to ON transponder_entries(year_to);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_year_range ON transponder_entries(year_from, year_to);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_transponder_family_id ON transponder_entries(transponder_family_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_system_type_id ON transponder_entries(system_type_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_is_active ON transponder_entries(is_active);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_verification_status ON transponder_entries(verification_status);

-- Compound indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transponder_entries_make_model ON transponder_entries(make_id, model_name);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_active_verified ON transponder_entries(is_active, verification_status);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_transponder_entries_text_search ON transponder_entries 
USING gin(to_tsvector('english', 
    COALESCE(model_name, '') || ' ' || 
    COALESCE(transponder_detail, '') || ' ' || 
    COALESCE(cross_references, '') || ' ' || 
    COALESCE(oem_keys, '') || ' ' || 
    COALESCE(notes, '')
));

-- Make name search index
CREATE INDEX IF NOT EXISTS idx_vehicle_makes_name_search ON vehicle_makes USING gin(make_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_vehicle_makes_normalized_search ON vehicle_makes USING gin(make_name_normalized gin_trgm_ops);

-- Transponder family search index
CREATE INDEX IF NOT EXISTS idx_transponder_families_name_search ON transponder_families USING gin(family_name gin_trgm_ops);

-- =========================
-- STEP 3: CREATE TRIGGERS
-- =========================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER IF NOT EXISTS update_vehicle_makes_updated_at 
    BEFORE UPDATE ON vehicle_makes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_transponder_families_updated_at 
    BEFORE UPDATE ON transponder_families 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_system_types_updated_at 
    BEFORE UPDATE ON system_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_transponder_entries_updated_at 
    BEFORE UPDATE ON transponder_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =======================
-- STEP 4: CREATE VIEWS
-- =======================

-- Main data view for frontend consumption
CREATE OR REPLACE VIEW transponder_data_view AS
SELECT 
    te.id,
    te.entry_number,
    vm.make_name,
    vm.make_name_normalized,
    te.model_name,
    te.model_variant,
    te.year_from,
    te.year_to,
    te.year_note,
    st.system_name as system_type,
    st.system_code as system_code,
    tf.family_name as transponder_family,
    tf.family_code as transponder_code,
    te.transponder_detail,
    te.cross_references,
    te.oem_keys,
    te.part_numbers,
    te.programming_notes,
    te.difficulty_level,
    te.estimated_time_minutes,
    te.special_tools_required,
    te.notes,
    te.verification_status,
    te.is_active,
    te.created_at,
    te.updated_at
FROM transponder_entries te
LEFT JOIN vehicle_makes vm ON te.make_id = vm.id
LEFT JOIN system_types st ON te.system_type_id = st.id
LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
WHERE te.is_active = TRUE;

-- Summary views for dashboard
CREATE OR REPLACE VIEW vehicle_summary AS
SELECT 
    vm.id,
    vm.make_name,
    vm.make_name_normalized,
    COUNT(te.id) as total_models,
    COUNT(CASE WHEN te.verification_status = 'verified' THEN 1 END) as verified_models,
    MIN(te.year_from) as earliest_year,
    MAX(te.year_to) as latest_year,
    vm.is_active
FROM vehicle_makes vm
LEFT JOIN transponder_entries te ON vm.id = te.make_id AND te.is_active = TRUE
WHERE vm.is_active = TRUE
GROUP BY vm.id, vm.make_name, vm.make_name_normalized, vm.is_active
ORDER BY total_models DESC, vm.make_name;

CREATE OR REPLACE VIEW transponder_family_summary AS
SELECT 
    tf.id,
    tf.family_name,
    tf.family_code,
    COUNT(te.id) as usage_count,
    COUNT(DISTINCT te.make_id) as make_count,
    tf.is_active
FROM transponder_families tf
LEFT JOIN transponder_entries te ON tf.id = te.transponder_family_id AND te.is_active = TRUE
WHERE tf.is_active = TRUE
GROUP BY tf.id, tf.family_name, tf.family_code, tf.is_active
ORDER BY usage_count DESC;

-- ========================
-- STEP 5: CREATE FUNCTIONS
-- ========================

-- Advanced search function
CREATE OR REPLACE FUNCTION search_vehicles(
    p_make VARCHAR DEFAULT NULL,
    p_model VARCHAR DEFAULT NULL,
    p_year INTEGER DEFAULT NULL,
    p_transponder_family VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
) RETURNS TABLE (
    id UUID,
    make_name VARCHAR,
    model_name VARCHAR,
    year_from INTEGER,
    year_to INTEGER,
    year_note VARCHAR,
    transponder_family VARCHAR,
    system_type VARCHAR,
    oem_keys TEXT,
    difficulty_level INTEGER,
    verification_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        te.id,
        vm.make_name,
        te.model_name,
        te.year_from,
        te.year_to,
        te.year_note,
        tf.family_name,
        st.system_name,
        te.oem_keys,
        te.difficulty_level,
        te.verification_status
    FROM transponder_entries te
    JOIN vehicle_makes vm ON te.make_id = vm.id
    LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
    LEFT JOIN system_types st ON te.system_type_id = st.id
    WHERE 
        te.is_active = TRUE
        AND vm.is_active = TRUE
        AND (p_make IS NULL OR vm.make_name ILIKE '%' || p_make || '%' OR vm.make_name_normalized ILIKE '%' || upper(p_make) || '%')
        AND (p_model IS NULL OR te.model_name ILIKE '%' || p_model || '%')
        AND (p_year IS NULL OR (
            (te.year_from IS NULL OR te.year_from <= p_year) AND
            (te.year_to IS NULL OR te.year_to >= p_year)
        ))
        AND (p_transponder_family IS NULL OR tf.family_name ILIKE '%' || p_transponder_family || '%')
    ORDER BY 
        vm.make_name, 
        te.model_name, 
        te.year_from NULLS LAST
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Full-text search function
CREATE OR REPLACE FUNCTION search_transponders_fulltext(
    p_search_term VARCHAR,
    p_limit INTEGER DEFAULT 20
) RETURNS TABLE (
    id UUID,
    make_name VARCHAR,
    model_name VARCHAR,
    year_range TEXT,
    transponder_family VARCHAR,
    match_rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        te.id,
        vm.make_name,
        te.model_name,
        CASE 
            WHEN te.year_from IS NOT NULL AND te.year_to IS NOT NULL 
            THEN te.year_from::TEXT || '-' || te.year_to::TEXT
            WHEN te.year_from IS NOT NULL 
            THEN te.year_from::TEXT || '+'
            ELSE 'Unknown'
        END as year_range,
        tf.family_name,
        ts_rank(
            to_tsvector('english', 
                COALESCE(vm.make_name, '') || ' ' ||
                COALESCE(te.model_name, '') || ' ' || 
                COALESCE(te.transponder_detail, '') || ' ' || 
                COALESCE(te.cross_references, '') || ' ' || 
                COALESCE(te.oem_keys, '') || ' ' || 
                COALESCE(te.notes, '')
            ),
            plainto_tsquery('english', p_search_term)
        ) as match_rank
    FROM transponder_entries te
    JOIN vehicle_makes vm ON te.make_id = vm.id
    LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
    WHERE 
        te.is_active = TRUE
        AND vm.is_active = TRUE
        AND to_tsvector('english', 
            COALESCE(vm.make_name, '') || ' ' ||
            COALESCE(te.model_name, '') || ' ' || 
            COALESCE(te.transponder_detail, '') || ' ' || 
            COALESCE(te.cross_references, '') || ' ' || 
            COALESCE(te.oem_keys, '') || ' ' || 
            COALESCE(te.notes, '')
        ) @@ plainto_tsquery('english', p_search_term)
    ORDER BY match_rank DESC, vm.make_name, te.model_name
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get vehicle by exact match
CREATE OR REPLACE FUNCTION get_vehicle_exact(
    p_make VARCHAR,
    p_model VARCHAR,
    p_year INTEGER
) RETURNS TABLE (
    id UUID,
    make_name VARCHAR,
    model_name VARCHAR,
    year_from INTEGER,
    year_to INTEGER,
    transponder_family VARCHAR,
    system_type VARCHAR,
    transponder_detail TEXT,
    cross_references TEXT,
    oem_keys TEXT,
    programming_notes TEXT,
    difficulty_level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        te.id,
        vm.make_name,
        te.model_name,
        te.year_from,
        te.year_to,
        tf.family_name,
        st.system_name,
        te.transponder_detail,
        te.cross_references,
        te.oem_keys,
        te.programming_notes,
        te.difficulty_level
    FROM transponder_entries te
    JOIN vehicle_makes vm ON te.make_id = vm.id
    LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
    LEFT JOIN system_types st ON te.system_type_id = st.id
    WHERE 
        te.is_active = TRUE
        AND vm.is_active = TRUE
        AND UPPER(vm.make_name) = UPPER(p_make)
        AND UPPER(te.model_name) = UPPER(p_model)
        AND (te.year_from IS NULL OR te.year_from <= p_year)
        AND (te.year_to IS NULL OR te.year_to >= p_year)
    ORDER BY te.year_from DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- STEP 6: ROW LEVEL SECURITY
-- =========================

-- Enable RLS on all tables
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_entries ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to vehicle_makes" ON vehicle_makes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to transponder_families" ON transponder_families
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to system_types" ON system_types
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to transponder_entries" ON transponder_entries
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admin users full access
CREATE POLICY "Allow admin full access to vehicle_makes" ON vehicle_makes
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_app_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Allow admin full access to transponder_families" ON transponder_families
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_app_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Allow admin full access to system_types" ON system_types
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_app_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Allow admin full access to transponder_entries" ON transponder_entries
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_app_meta_data->>'role' = 'admin'
        )
    );

-- ===========================
-- STEP 7: GRANT PERMISSIONS
-- ===========================

-- Grant function permissions
GRANT EXECUTE ON FUNCTION search_vehicles TO authenticated;
GRANT EXECUTE ON FUNCTION search_transponders_fulltext TO authenticated;
GRANT EXECUTE ON FUNCTION get_vehicle_exact TO authenticated;

-- Grant view permissions
GRANT SELECT ON transponder_data_view TO authenticated;
GRANT SELECT ON vehicle_summary TO authenticated;
GRANT SELECT ON transponder_family_summary TO authenticated;

-- ======================
-- STEP 8: COMMENTS
-- ======================

COMMENT ON TABLE vehicle_makes IS 'Normalized table for vehicle manufacturers with search optimization';
COMMENT ON TABLE transponder_families IS 'Normalized table for transponder types and families with compatibility info';
COMMENT ON TABLE system_types IS 'Normalized table for anti-theft system types';
COMMENT ON TABLE transponder_entries IS 'Main table containing all transponder data with enhanced metadata';
COMMENT ON VIEW transponder_data_view IS 'Production-ready view for frontend consumption';
COMMENT ON FUNCTION search_vehicles IS 'Advanced search with multiple filters and fuzzy matching';
COMMENT ON FUNCTION search_transponders_fulltext IS 'Full-text search across all transponder data';
COMMENT ON FUNCTION get_vehicle_exact IS 'Get exact vehicle match for specific make/model/year';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Production transponder database schema created successfully!';
    RAISE NOTICE 'Next: Run the data import script to populate the database.';
END $$;
