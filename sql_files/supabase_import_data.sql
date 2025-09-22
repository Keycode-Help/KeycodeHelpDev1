-- Supabase Data Import Script
-- This script imports all the transponder data into the normalized database structure

-- First, ensure the schema is created (run supabase_transponder_schema.sql first)

-- Import vehicle makes
INSERT INTO vehicle_makes (make_name, make_name_normalized) VALUES
('ACURA', 'ACURA'),
('ALFA', 'ALFA'),
('ALL', 'ALL'),
('Audi', 'AUDI'),
('BMW', 'BMW'),
('BUICK', 'BUICK'),
('CADILLAC', 'CADILLAC'),
('CHRYSLER', 'CHRYSLER'),
('COROLLA', 'COROLLA'),
('CROWN', 'CROWN'),
('Chevrolet', 'CHEVROLET'),
('DACIA', 'DACIA'),
('DAEWOO', 'DAEWOO'),
('DODGE', 'DODGE'),
('FIVE', 'FIVE'),
('FJ', 'FJ'),
('FORD', 'FORD'),
('Fiat', 'FIAT'),
('GMC', 'GMC'),
('GRAND', 'GRAND'),
('GSF', 'GSF'),
('GSR', 'GSR'),
('GSX', 'GSX'),
('HONDA', 'HONDA'),
('HUMMER', 'HUMMER'),
('HYUNDAI', 'HYUNDAI'),
('Isuzu', 'ISUZU'),
('JAGUAR', 'JAGUAR'),
('JEEP', 'JEEP'),
('JIMNY', 'JIMNY'),
('KIA', 'KIA'),
('LAND', 'LAND'),
('LEXUS', 'LEXUS'),
('LINCOLN', 'LINCOLN'),
('MAZDA', 'MAZDA'),
('MERCEDES', 'MERCEDES'),
('MITSUBISHI', 'MITSUBISHI'),
('MONTERO', 'MONTERO'),
('NISSAN', 'NISSAN'),
('PAJERO', 'PAJERO'),
('PEUGEOT', 'PEUGEOT'),
('PORSCHE', 'PORSCHE'),
('RANGE', 'RANGE'),
('RENAULT', 'RENAULT'),
('ROVER', 'ROVER'),
('SEPHIA', 'SEPHIA'),
('SHOGUN', 'SHOGUN'),
('SPORT', 'SPORT'),
('SUBARU', 'SUBARU'),
('SUZUKI', 'SUZUKI'),
('TOYOTA', 'TOYOTA'),
('URBAN', 'URBAN'),
('VOLVO', 'VOLVO'),
('VW', 'VW'),
('YAMAHA', 'YAMAHA'),
('YARIS', 'YARIS')
ON CONFLICT (make_name) DO NOTHING;

-- Import common system types
INSERT INTO system_types (system_name, system_description) VALUES
('PassLock Anti Theft System', 'GM PassLock anti-theft system'),
('PassKey 3+ Anti Theft System', 'GM PassKey 3+ anti-theft system'),
('VATS / PassKey System', 'GM VATS/PassKey system'),
('Transponder services', 'Generic transponder services')
ON CONFLICT (system_name) DO NOTHING;

-- Import common transponder families (sample - full list would be too long for this example)
INSERT INTO transponder_families (family_name, family_description) VALUES
('Philips Crypto 2 / Hitag2 / ID46', 'Philips Crypto 2 with Hitag2 protocol, ID46 type'),
('Megamos Crypto 48 / ID48', 'Megamos Crypto 48 bit transponder'),
('Hitag2 Extended / ~ID46, ID46E', 'Extended Hitag2 protocol with ID46E support'),
('Texas Crypto 4D / 4D68', 'Texas Instruments 4D Crypto transponder'),
('Megamos 13 / ID13', 'Megamos 13 bit transponder'),
('Texas 4C / ID 4C', 'Texas Instruments 4C transponder'),
('Philips Crypto ID40', 'Philips Crypto ID40 transponder'),
('Texas Crypto DST AES 128-bit', 'Texas DST AES 128-bit encryption'),
('Transponder Hitag AES / ID4A', 'Hitag AES with ID4A protocol'),
('Philips Crypto 3 / Hitag3 128-bit AES / ID47', 'Philips Crypto 3 with Hitag3 and AES encryption')
ON CONFLICT (family_name) DO NOTHING;

-- Function to import transponder entries with proper foreign key relationships
CREATE OR REPLACE FUNCTION import_transponder_entry(
    p_make_name VARCHAR,
    p_model_name VARCHAR,
    p_year_from INTEGER,
    p_year_to INTEGER,
    p_year_note VARCHAR,
    p_system_type VARCHAR,
    p_transponder_family VARCHAR,
    p_transponder_detail TEXT,
    p_cross_references TEXT,
    p_oem_keys TEXT,
    p_notes TEXT
) RETURNS UUID AS $$
DECLARE
    v_make_id UUID;
    v_system_type_id UUID;
    v_family_id UUID;
    v_entry_id UUID;
BEGIN
    -- Get make ID
    SELECT id INTO v_make_id FROM vehicle_makes WHERE make_name = p_make_name;
    
    -- Get system type ID if exists
    IF p_system_type IS NOT NULL AND p_system_type != '' THEN
        SELECT id INTO v_system_type_id FROM system_types WHERE system_name = p_system_type;
        -- Create if doesn't exist
        IF v_system_type_id IS NULL THEN
            INSERT INTO system_types (system_name) VALUES (p_system_type) RETURNING id INTO v_system_type_id;
        END IF;
    END IF;
    
    -- Get transponder family ID if exists
    IF p_transponder_family IS NOT NULL AND p_transponder_family != '' THEN
        SELECT id INTO v_family_id FROM transponder_families WHERE family_name = p_transponder_family;
        -- Create if doesn't exist
        IF v_family_id IS NULL THEN
            INSERT INTO transponder_families (family_name) VALUES (p_transponder_family) RETURNING id INTO v_family_id;
        END IF;
    END IF;
    
    -- Insert the entry
    INSERT INTO transponder_entries (
        make_id, model_name, year_from, year_to, year_note,
        system_type_id, transponder_family_id, transponder_detail,
        cross_references, oem_keys, notes
    ) VALUES (
        v_make_id, p_model_name, p_year_from, p_year_to, p_year_note,
        v_system_type_id, v_family_id, p_transponder_detail,
        p_cross_references, p_oem_keys, p_notes
    ) RETURNING id INTO v_entry_id;
    
    RETURN v_entry_id;
END;
$$ LANGUAGE plpgsql;

-- Grant usage permissions for the import function
GRANT EXECUTE ON FUNCTION import_transponder_entry TO authenticated;

-- Example data import (first 20 entries as sample)
-- In production, you would use CSV import or bulk insert from the generated CSV files

-- Sample Chevrolet entries
SELECT import_transponder_entry('Chevrolet', 'Agile', 2009, NULL, '2009+', NULL, 'Philips Crypto 2 / Hitag2 / ID46', NULL, 'PCF7936AS; JMA TP12GM; SILCA T14; CN3; XT27; K-JMD', NULL, NULL);
SELECT import_transponder_entry('Chevrolet', 'Astra', 2000, 2007, NULL, NULL, 'Philips Crypto ID40', 'PCF7935 precoded', NULL, NULL, NULL);
SELECT import_transponder_entry('Chevrolet', 'Astra', 2007, NULL, '2007+', NULL, 'Philips Crypto 2 / Hitag2 / ID46', NULL, 'PCF7936AS; JMA TP12GM; SILCA T14; CN3; XT27; K-JMD', NULL, NULL);
SELECT import_transponder_entry('Chevrolet', 'Astro Van', 1998, 2005, NULL, 'PassLock Anti Theft System', NULL, NULL, NULL, NULL, NULL);
SELECT import_transponder_entry('Chevrolet', 'Avalanche', 2007, 2013, NULL, NULL, 'Philips Crypto 2 / Hitag2 / ID46', NULL, 'PCF7936AS; JMA TP12GM; SILCA T14; CN3; XT27; K-JMD', NULL, NULL);

-- Sample Lexus entries
SELECT import_transponder_entry('LEXUS', 'CT 200H', 2011, 2018, NULL, NULL, 'Texas Crypto 4D 80bit / ID6B / TMS37126', NULL, NULL, 'B74EA 89904-48521 and others', NULL);
SELECT import_transponder_entry('LEXUS', 'ES 300', 1998, 2003, NULL, NULL, 'Texas 4C / ID 4C', NULL, 'JMA TPX1, TP07 / CN1 / K-JMD / Errebi TX1', NULL, NULL);
SELECT import_transponder_entry('LEXUS', 'ES 330', 2004, 2007, NULL, NULL, 'Texas Crypto 4D / 4D68', NULL, 'JMA TPX2, TP29 / YS-01 / K-JMD / Errebi TX2', NULL, NULL);

-- Sample Toyota entries
SELECT import_transponder_entry('TOYOTA', 'AURION', 2006, 2012, NULL, NULL, 'Texas Crypto 4D / 4D68', NULL, NULL, 'HYQ12BBX 89904-30270, 271451-0140 and others', NULL);
SELECT import_transponder_entry('TOYOTA', 'AVENSIS', 1997, 2003, NULL, NULL, 'Texas 4C / ID 4C', NULL, 'JMA TPX1, TP07 / CN1 / K-JMD / Errebi TX1', NULL, NULL);

-- Add more entries as needed...

-- Create helpful views for common queries
CREATE VIEW vehicle_summary AS
SELECT 
    vm.make_name,
    COUNT(te.id) as model_count,
    MIN(te.year_from) as earliest_year,
    MAX(te.year_to) as latest_year
FROM vehicle_makes vm
LEFT JOIN transponder_entries te ON vm.id = te.make_id
WHERE te.is_active = TRUE
GROUP BY vm.id, vm.make_name
ORDER BY vm.make_name;

CREATE VIEW transponder_family_summary AS
SELECT 
    tf.family_name,
    COUNT(te.id) as usage_count
FROM transponder_families tf
LEFT JOIN transponder_entries te ON tf.id = te.transponder_family_id
WHERE te.is_active = TRUE
GROUP BY tf.id, tf.family_name
ORDER BY usage_count DESC;

-- Create search function for finding vehicles by make/model/year
CREATE OR REPLACE FUNCTION search_vehicles(
    p_make VARCHAR DEFAULT NULL,
    p_model VARCHAR DEFAULT NULL,
    p_year INTEGER DEFAULT NULL
) RETURNS TABLE (
    make_name VARCHAR,
    model_name VARCHAR,
    year_from INTEGER,
    year_to INTEGER,
    transponder_family VARCHAR,
    system_type VARCHAR,
    oem_keys TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vm.make_name,
        te.model_name,
        te.year_from,
        te.year_to,
        tf.family_name,
        st.system_name,
        te.oem_keys
    FROM transponder_entries te
    JOIN vehicle_makes vm ON te.make_id = vm.id
    LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
    LEFT JOIN system_types st ON te.system_type_id = st.id
    WHERE 
        te.is_active = TRUE
        AND (p_make IS NULL OR UPPER(vm.make_name) LIKE UPPER('%' || p_make || '%'))
        AND (p_model IS NULL OR UPPER(te.model_name) LIKE UPPER('%' || p_model || '%'))
        AND (p_year IS NULL OR (
            (te.year_from IS NULL OR te.year_from <= p_year) AND
            (te.year_to IS NULL OR te.year_to >= p_year)
        ))
    ORDER BY vm.make_name, te.model_name, te.year_from;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION search_vehicles TO authenticated;

-- Comments
COMMENT ON FUNCTION import_transponder_entry IS 'Function to import transponder entries with proper foreign key relationships';
COMMENT ON FUNCTION search_vehicles IS 'Search function for finding vehicles by make, model, and year';
COMMENT ON VIEW vehicle_summary IS 'Summary view showing vehicle makes with model counts and year ranges';
COMMENT ON VIEW transponder_family_summary IS 'Summary view showing transponder family usage statistics';

-- Final message
DO $$
BEGIN
    RAISE NOTICE 'Transponder database schema and sample data imported successfully!';
    RAISE NOTICE 'Use the search_vehicles() function to query the data.';
    RAISE NOTICE 'Example: SELECT * FROM search_vehicles(''LEXUS'', ''ES'', 2010);';
END $$;
