-- Import Full Transponder Dataset (1,939 entries)
-- This will import all data from transponder_data_full_v2.csv

-- First, create a temporary table for CSV import
CREATE TEMP TABLE temp_csv_import (
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

-- NOTE: You'll need to upload the CSV data to this temp table
-- In Supabase Dashboard:
-- 1. Go to Database > Tables
-- 2. Find temp_csv_import table
-- 3. Click "Insert" > "Import data from CSV"
-- 4. Upload transponder_data_full_v2.csv
-- 5. Then run the rest of this script

-- Function to safely import each row
CREATE OR REPLACE FUNCTION import_single_entry(
    p_make VARCHAR,
    p_model VARCHAR,
    p_year_from VARCHAR,
    p_year_to VARCHAR,
    p_year_note VARCHAR,
    p_system_type VARCHAR,
    p_transponder_family VARCHAR,
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
    v_normalized_make VARCHAR;
BEGIN
    -- Skip empty entries
    IF p_make IS NULL OR TRIM(p_make) = '' OR p_model IS NULL OR TRIM(p_model) = '' THEN
        RETURN NULL;
    END IF;

    -- Clean and normalize make name
    p_make := TRIM(p_make);
    v_normalized_make := UPPER(REGEXP_REPLACE(p_make, '[^A-Za-z0-9]', '', 'g'));
    
    -- Get or create vehicle make
    SELECT id INTO v_make_id FROM vehicle_makes WHERE make_name = p_make;
    IF v_make_id IS NULL THEN
        INSERT INTO vehicle_makes (make_name, make_name_normalized) 
        VALUES (p_make, v_normalized_make)
        ON CONFLICT (make_name) DO UPDATE SET make_name_normalized = v_normalized_make
        RETURNING id INTO v_make_id;
    END IF;
    
    -- Get or create system type
    IF p_system_type IS NOT NULL AND TRIM(p_system_type) != '' THEN
        p_system_type := TRIM(p_system_type);
        SELECT id INTO v_system_type_id FROM system_types WHERE system_name = p_system_type;
        IF v_system_type_id IS NULL THEN
            INSERT INTO system_types (system_name) 
            VALUES (p_system_type) 
            ON CONFLICT (system_name) DO NOTHING
            RETURNING id INTO v_system_type_id;
            
            -- Get the ID if it was created by another concurrent transaction
            IF v_system_type_id IS NULL THEN
                SELECT id INTO v_system_type_id FROM system_types WHERE system_name = p_system_type;
            END IF;
        END IF;
    END IF;
    
    -- Get or create transponder family
    IF p_transponder_family IS NOT NULL AND TRIM(p_transponder_family) != '' THEN
        p_transponder_family := TRIM(p_transponder_family);
        SELECT id INTO v_family_id FROM transponder_families WHERE family_name = p_transponder_family;
        IF v_family_id IS NULL THEN
            INSERT INTO transponder_families (family_name) 
            VALUES (p_transponder_family) 
            ON CONFLICT (family_name) DO NOTHING
            RETURNING id INTO v_family_id;
            
            -- Get the ID if it was created by another concurrent transaction
            IF v_family_id IS NULL THEN
                SELECT id INTO v_family_id FROM transponder_families WHERE family_name = p_transponder_family;
            END IF;
        END IF;
    END IF;
    
    -- Convert year strings to integers safely
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
    
    -- Insert the transponder entry
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
        NULLIF(TRIM(p_oem_keys), ''), 
        NULLIF(TRIM(p_notes), '')
    ) RETURNING id INTO v_entry_id;
    
    RETURN v_entry_id;
EXCEPTION WHEN OTHERS THEN
    -- Log error and continue
    RAISE WARNING 'Error importing entry for % %: %', p_make, p_model, SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Process all data from temp table
DO $$
DECLARE
    import_record RECORD;
    import_count INTEGER := 0;
    error_count INTEGER := 0;
    result_id UUID;
    total_rows INTEGER;
BEGIN
    -- Check if temp table has data
    SELECT COUNT(*) INTO total_rows FROM temp_csv_import;
    
    IF total_rows = 0 THEN
        RAISE NOTICE '❌ No data found in temp_csv_import table!';
        RAISE NOTICE 'Please import your CSV file first:';
        RAISE NOTICE '1. Go to Database > Tables in Supabase Dashboard';
        RAISE NOTICE '2. Find temp_csv_import table';
        RAISE NOTICE '3. Click Insert > Import data from CSV';
        RAISE NOTICE '4. Upload transponder_data_full_v2.csv';
        RAISE NOTICE '5. Run this script again';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Starting import of % rows from CSV...', total_rows;
    
    FOR import_record IN 
        SELECT * FROM temp_csv_import 
        WHERE make IS NOT NULL AND make != '' 
        AND model IS NOT NULL AND model != ''
    LOOP
        BEGIN
            SELECT import_single_entry(
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
                RAISE NOTICE 'Imported % of % records...', import_count, total_rows;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE WARNING 'Failed to import: % % - %', import_record.make, import_record.model, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '✅ Import completed!';
    RAISE NOTICE 'Successfully imported: % entries', import_count;
    RAISE NOTICE 'Errors: % entries', error_count;
    RAISE NOTICE 'Total in database: % entries', (SELECT COUNT(*) FROM transponder_entries WHERE is_active = true);
END $$;

-- Clean up
DROP FUNCTION IF EXISTS import_single_entry;

-- Final verification
SELECT 'Import Summary:' as section;

SELECT 
    COUNT(*) as total_entries,
    COUNT(DISTINCT make_id) as unique_makes,
    COUNT(DISTINCT transponder_family_id) as unique_families,
    COUNT(CASE WHEN year_from IS NOT NULL OR year_to IS NOT NULL THEN 1 END) as entries_with_years,
    COUNT(CASE WHEN oem_keys IS NOT NULL AND oem_keys != '' THEN 1 END) as entries_with_oem_keys
FROM transponder_entries 
WHERE is_active = true;

-- Show top makes
SELECT 'Top 5 Vehicle Makes:' as section;
SELECT 
    vm.make_name,
    COUNT(te.id) as entry_count
FROM vehicle_makes vm
LEFT JOIN transponder_entries te ON vm.id = te.make_id AND te.is_active = true
WHERE vm.is_active = true
GROUP BY vm.id, vm.make_name
ORDER BY entry_count DESC
LIMIT 5;

RAISE NOTICE '✅ If you see ~1,939 total entries above, your database is fully populated!';
RAISE NOTICE '✅ Your frontend search should now recognize all vehicle data!';
