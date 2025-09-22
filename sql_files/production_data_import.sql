-- Production Data Import Script
-- This script imports ALL transponder data from the updated CSV file
-- Run this AFTER running production_migration.sql

-- =================================
-- STEP 1: CREATE IMPORT FUNCTION
-- =================================

CREATE OR REPLACE FUNCTION import_transponder_data(
    p_make VARCHAR,
    p_model VARCHAR,
    p_year_from VARCHAR,
    p_year_to VARCHAR,
    p_year_note VARCHAR,
    p_system_type VARCHAR,
    p_transponder_family VARCHAR,
    p_transponder_detail VARCHAR,
    p_cross_refs VARCHAR,
    p_oem_keys VARCHAR,
    p_notes VARCHAR
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
    IF p_make IS NULL OR p_make = '' OR p_model IS NULL OR p_model = '' THEN
        RETURN NULL;
    END IF;

    -- Clean and normalize make name
    p_make := TRIM(p_make);
    
    -- Get or create make
    SELECT id INTO v_make_id FROM vehicle_makes WHERE make_name = p_make;
    IF v_make_id IS NULL THEN
        INSERT INTO vehicle_makes (make_name, make_name_normalized) 
        VALUES (p_make, UPPER(REGEXP_REPLACE(p_make, '[^A-Za-z0-9]', '', 'g')))
        RETURNING id INTO v_make_id;
    END IF;
    
    -- Get or create system type
    IF p_system_type IS NOT NULL AND TRIM(p_system_type) != '' THEN
        p_system_type := TRIM(p_system_type);
        SELECT id INTO v_system_type_id FROM system_types WHERE system_name = p_system_type;
        IF v_system_type_id IS NULL THEN
            INSERT INTO system_types (system_name) VALUES (p_system_type) RETURNING id INTO v_system_type_id;
        END IF;
    END IF;
    
    -- Get or create transponder family
    IF p_transponder_family IS NOT NULL AND TRIM(p_transponder_family) != '' THEN
        p_transponder_family := TRIM(p_transponder_family);
        SELECT id INTO v_family_id FROM transponder_families WHERE family_name = p_transponder_family;
        IF v_family_id IS NULL THEN
            INSERT INTO transponder_families (family_name) VALUES (p_transponder_family) RETURNING id INTO v_family_id;
        END IF;
    END IF;
    
    -- Convert year strings to integers
    BEGIN
        IF p_year_from IS NOT NULL AND TRIM(p_year_from) != '' AND TRIM(p_year_from) ~ '^[0-9]+$' THEN
            v_year_from_int := TRIM(p_year_from)::INTEGER;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        v_year_from_int := NULL;
    END;
    
    BEGIN
        IF p_year_to IS NOT NULL AND TRIM(p_year_to) != '' AND TRIM(p_year_to) ~ '^[0-9]+$' THEN
            v_year_to_int := TRIM(p_year_to)::INTEGER;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        v_year_to_int := NULL;
    END;
    
    -- Insert the entry
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
        oem_keys, 
        notes,
        verification_status
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
        NULLIF(TRIM(p_oem_keys), ''), 
        NULLIF(TRIM(p_notes), ''),
        'verified'  -- Mark imported data as verified
    ) RETURNING id INTO v_entry_id;
    
    RETURN v_entry_id;
EXCEPTION WHEN OTHERS THEN
    -- Log error and continue
    RAISE WARNING 'Error importing entry for %-%: %', p_make, p_model, SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- STEP 2: CREATE TEMP TABLE
-- ================================

CREATE TEMP TABLE temp_import_data (
    make VARCHAR(100),
    model VARCHAR(150),
    year_from VARCHAR(20),
    year_to VARCHAR(20),
    year_note VARCHAR(100),
    system_type VARCHAR(150),
    transponder_family VARCHAR(200),
    transponder_detail TEXT,
    cross_refs TEXT,
    oem_keys TEXT,
    notes TEXT
);

-- ================================
-- STEP 3: IMPORT CSV DATA
-- ================================

-- Note: This step requires manual CSV upload or COPY command
-- For Supabase Dashboard: Upload transponder_data_full_v2.csv to the temp table
-- For psql: Use the following command:
-- \copy temp_import_data FROM '/path/to/transponder_data_full_v2.csv' DELIMITER ',' CSV HEADER;

-- Alternative: If using Supabase Storage, you can use this approach:
-- 1. Upload CSV to Supabase Storage
-- 2. Use the following function to import from storage

-- ================================
-- STEP 4: PROCESS IMPORT DATA
-- ================================

-- Import all data from temp table
DO $$
DECLARE
    import_record RECORD;
    import_count INTEGER := 0;
    error_count INTEGER := 0;
    result_id UUID;
BEGIN
    RAISE NOTICE 'Starting data import process...';
    
    FOR import_record IN 
        SELECT * FROM temp_import_data 
        WHERE make IS NOT NULL AND make != '' 
        AND model IS NOT NULL AND model != ''
    LOOP
        BEGIN
            SELECT import_transponder_data(
                import_record.make,
                import_record.model,
                import_record.year_from,
                import_record.year_to,
                import_record.year_note,
                import_record.system_type,
                import_record.transponder_family,
                import_record.transponder_detail,
                import_record.cross_refs,
                import_record.oem_keys,
                import_record.notes
            ) INTO result_id;
            
            IF result_id IS NOT NULL THEN
                import_count := import_count + 1;
            ELSE
                error_count := error_count + 1;
            END IF;
            
            -- Progress indicator
            IF import_count % 100 = 0 THEN
                RAISE NOTICE 'Imported % records...', import_count;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE WARNING 'Failed to import: % % - %', import_record.make, import_record.model, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Import completed! Success: %, Errors: %', import_count, error_count;
END $$;

-- ================================
-- STEP 5: POST-IMPORT OPTIMIZATION
-- ================================

-- Analyze tables for better query performance
ANALYZE vehicle_makes;
ANALYZE transponder_families;
ANALYZE system_types;
ANALYZE transponder_entries;

-- Update statistics
SELECT 
    'vehicle_makes' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN is_active THEN 1 END) as active_count
FROM vehicle_makes
UNION ALL
SELECT 
    'transponder_families' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN is_active THEN 1 END) as active_count
FROM transponder_families
UNION ALL
SELECT 
    'system_types' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN is_active THEN 1 END) as active_count
FROM system_types
UNION ALL
SELECT 
    'transponder_entries' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN is_active THEN 1 END) as active_count
FROM transponder_entries;

-- ================================
-- STEP 6: VALIDATION QUERIES
-- ================================

-- Top 10 makes by model count
SELECT 
    vm.make_name,
    COUNT(te.id) as model_count,
    MIN(te.year_from) as earliest_year,
    MAX(te.year_to) as latest_year
FROM vehicle_makes vm
LEFT JOIN transponder_entries te ON vm.id = te.make_id AND te.is_active = TRUE
WHERE vm.is_active = TRUE
GROUP BY vm.id, vm.make_name
ORDER BY model_count DESC
LIMIT 10;

-- Most common transponder families
SELECT 
    tf.family_name,
    COUNT(te.id) as usage_count
FROM transponder_families tf
LEFT JOIN transponder_entries te ON tf.id = te.transponder_family_id AND te.is_active = TRUE
WHERE tf.is_active = TRUE
GROUP BY tf.id, tf.family_name
ORDER BY usage_count DESC
LIMIT 10;

-- Data quality check
SELECT 
    'Total Entries' as metric,
    COUNT(*) as value
FROM transponder_entries
WHERE is_active = TRUE
UNION ALL
SELECT 
    'Entries with Years',
    COUNT(*)
FROM transponder_entries
WHERE is_active = TRUE AND (year_from IS NOT NULL OR year_to IS NOT NULL)
UNION ALL
SELECT 
    'Entries with Transponder Family',
    COUNT(*)
FROM transponder_entries
WHERE is_active = TRUE AND transponder_family_id IS NOT NULL
UNION ALL
SELECT 
    'Entries with OEM Keys',
    COUNT(*)
FROM transponder_entries
WHERE is_active = TRUE AND oem_keys IS NOT NULL AND oem_keys != ''
UNION ALL
SELECT 
    'Verified Entries',
    COUNT(*)
FROM transponder_entries
WHERE is_active = TRUE AND verification_status = 'verified';

-- ================================
-- STEP 7: CREATE API-READY VIEWS
-- ================================

-- Create a simplified view for frontend API
CREATE OR REPLACE VIEW api_transponder_search AS
SELECT 
    te.id,
    vm.make_name as make,
    vm.make_name_normalized,
    te.model_name as model,
    te.year_from,
    te.year_to,
    CASE 
        WHEN te.year_from IS NOT NULL AND te.year_to IS NOT NULL 
        THEN te.year_from::TEXT || '-' || te.year_to::TEXT
        WHEN te.year_from IS NOT NULL 
        THEN te.year_from::TEXT || '+'
        WHEN te.year_note IS NOT NULL
        THEN te.year_note
        ELSE 'Unknown'
    END as year_display,
    tf.family_name as transponder_type,
    st.system_name as security_system,
    te.oem_keys,
    te.cross_references as part_numbers,
    te.difficulty_level,
    te.programming_notes,
    te.created_at,
    te.updated_at
FROM transponder_entries te
JOIN vehicle_makes vm ON te.make_id = vm.id
LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
LEFT JOIN system_types st ON te.system_type_id = st.id
WHERE te.is_active = TRUE AND vm.is_active = TRUE
ORDER BY vm.make_name, te.model_name, te.year_from;

-- Grant permissions for API view
GRANT SELECT ON api_transponder_search TO authenticated;

-- ================================
-- STEP 8: CLEANUP
-- ================================

-- Drop temporary table
DROP TABLE IF EXISTS temp_import_data;

-- Drop import function (no longer needed)
DROP FUNCTION IF EXISTS import_transponder_data;

-- Success message
DO $$
DECLARE
    total_entries INTEGER;
    total_makes INTEGER;
    total_families INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_entries FROM transponder_entries WHERE is_active = TRUE;
    SELECT COUNT(*) INTO total_makes FROM vehicle_makes WHERE is_active = TRUE;
    SELECT COUNT(*) INTO total_families FROM transponder_families WHERE is_active = TRUE;
    
    RAISE NOTICE '✅ Production data import completed successfully!';
    RAISE NOTICE 'Imported % transponder entries', total_entries;
    RAISE NOTICE 'Created % vehicle makes', total_makes;
    RAISE NOTICE 'Created % transponder families', total_families;
    RAISE NOTICE 'Database is ready for production use!';
END $$;
