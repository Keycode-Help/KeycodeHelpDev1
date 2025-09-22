-- Bulk Import Script for Transponder Data
-- This script imports ALL transponder data from CSV files into Supabase

-- Create temporary tables for CSV import
CREATE TEMP TABLE temp_vehicle_makes (
    make_name VARCHAR(50),
    make_name_normalized VARCHAR(50)
);

CREATE TEMP TABLE temp_transponder_families (
    family_name VARCHAR(200),
    family_description TEXT
);

CREATE TEMP TABLE temp_system_types (
    system_name VARCHAR(100),
    system_description TEXT
);

CREATE TEMP TABLE temp_transponder_entries (
    make_name VARCHAR(50),
    model_name VARCHAR(100),
    year_from TEXT,
    year_to TEXT,
    year_note VARCHAR(100),
    system_type_name VARCHAR(100),
    transponder_family_name VARCHAR(200),
    transponder_detail TEXT,
    cross_references TEXT,
    oem_keys TEXT,
    notes TEXT
);

-- Note: The actual CSV import would be done via Supabase dashboard or psql COPY commands
-- For example:
-- \copy temp_vehicle_makes FROM 'import_vehicle_makes.csv' DELIMITER ',' CSV HEADER;
-- \copy temp_transponder_families FROM 'import_transponder_families.csv' DELIMITER ',' CSV HEADER;
-- \copy temp_system_types FROM 'import_system_types.csv' DELIMITER ',' CSV HEADER;
-- \copy temp_transponder_entries FROM 'import_transponder_entries.csv' DELIMITER ',' CSV HEADER;

-- Insert into actual tables with conflict resolution
INSERT INTO vehicle_makes (make_name, make_name_normalized)
SELECT DISTINCT make_name, make_name_normalized 
FROM temp_vehicle_makes
WHERE make_name IS NOT NULL AND make_name != ''
ON CONFLICT (make_name) DO NOTHING;

INSERT INTO transponder_families (family_name, family_description)
SELECT DISTINCT family_name, family_description 
FROM temp_transponder_families
WHERE family_name IS NOT NULL AND family_name != ''
ON CONFLICT (family_name) DO NOTHING;

INSERT INTO system_types (system_name, system_description)
SELECT DISTINCT system_name, system_description 
FROM temp_system_types
WHERE system_name IS NOT NULL AND system_name != ''
ON CONFLICT (system_name) DO NOTHING;

-- Insert transponder entries with proper foreign key resolution
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
)
SELECT 
    vm.id as make_id,
    te.model_name,
    CASE 
        WHEN te.year_from ~ '^[0-9]+$' THEN te.year_from::INTEGER 
        ELSE NULL 
    END as year_from,
    CASE 
        WHEN te.year_to ~ '^[0-9]+$' THEN te.year_to::INTEGER 
        ELSE NULL 
    END as year_to,
    te.year_note,
    st.id as system_type_id,
    tf.id as transponder_family_id,
    te.transponder_detail,
    te.cross_references,
    te.oem_keys,
    te.notes
FROM temp_transponder_entries te
LEFT JOIN vehicle_makes vm ON vm.make_name = te.make_name
LEFT JOIN system_types st ON st.system_name = te.system_type_name
LEFT JOIN transponder_families tf ON tf.family_name = te.transponder_family_name
WHERE te.make_name IS NOT NULL 
    AND te.make_name != ''
    AND te.model_name IS NOT NULL 
    AND te.model_name != '';

-- Clean up temporary tables
DROP TABLE temp_vehicle_makes;
DROP TABLE temp_transponder_families;
DROP TABLE temp_system_types;
DROP TABLE temp_transponder_entries;

-- Create summary report
SELECT 
    'vehicle_makes' as table_name,
    COUNT(*) as record_count
FROM vehicle_makes
UNION ALL
SELECT 
    'transponder_families' as table_name,
    COUNT(*) as record_count
FROM transponder_families
UNION ALL
SELECT 
    'system_types' as table_name,
    COUNT(*) as record_count
FROM system_types
UNION ALL
SELECT 
    'transponder_entries' as table_name,
    COUNT(*) as record_count
FROM transponder_entries;

-- Verification queries
SELECT 
    vm.make_name,
    COUNT(te.id) as entry_count
FROM vehicle_makes vm
LEFT JOIN transponder_entries te ON vm.id = te.make_id
GROUP BY vm.id, vm.make_name
ORDER BY entry_count DESC, vm.make_name;
