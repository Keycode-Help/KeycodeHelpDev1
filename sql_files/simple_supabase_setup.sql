-- Simple Supabase Setup Script
-- Copy and paste this into Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vehicle makes table
CREATE TABLE IF NOT EXISTS vehicle_makes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make_name VARCHAR(100) NOT NULL UNIQUE,
    make_name_normalized VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transponder families table
CREATE TABLE IF NOT EXISTS transponder_families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_name VARCHAR(200) NOT NULL UNIQUE,
    family_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system types table
CREATE TABLE IF NOT EXISTS system_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_name VARCHAR(150) NOT NULL UNIQUE,
    system_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create main transponder entries table
CREATE TABLE IF NOT EXISTS transponder_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make_id UUID REFERENCES vehicle_makes(id) ON DELETE CASCADE,
    model_name VARCHAR(150) NOT NULL,
    year_from INTEGER,
    year_to INTEGER,
    year_note VARCHAR(150),
    system_type_id UUID REFERENCES system_types(id) ON DELETE SET NULL,
    transponder_family_id UUID REFERENCES transponder_families(id) ON DELETE SET NULL,
    transponder_detail TEXT,
    cross_references TEXT,
    oem_keys TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transponder_entries_make_id ON transponder_entries(make_id);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_model_name ON transponder_entries(model_name);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_year_from ON transponder_entries(year_from);
CREATE INDEX IF NOT EXISTS idx_transponder_entries_is_active ON transponder_entries(is_active);

-- Create the views that the frontend expects
CREATE OR REPLACE VIEW vehicle_summary AS
SELECT 
    vm.id,
    vm.make_name,
    vm.make_name_normalized,
    COUNT(te.id) as total_models,
    COUNT(CASE WHEN te.is_active THEN 1 END) as verified_models,
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
    te.notes as programming_notes,
    te.created_at,
    te.updated_at
FROM transponder_entries te
JOIN vehicle_makes vm ON te.make_id = vm.id
LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
LEFT JOIN system_types st ON te.system_type_id = st.id
WHERE te.is_active = TRUE AND vm.is_active = TRUE
ORDER BY vm.make_name, te.model_name, te.year_from;

-- Insert some sample data to test the structure
INSERT INTO vehicle_makes (make_name, make_name_normalized) VALUES 
('TOYOTA', 'TOYOTA'),
('HONDA', 'HONDA'),
('FORD', 'FORD'),
('CHEVROLET', 'CHEVROLET'),
('NISSAN', 'NISSAN')
ON CONFLICT (make_name) DO NOTHING;

INSERT INTO system_types (system_name) VALUES 
('PassLock Anti Theft System'),
('VATS / PassKey System'),
('Transponder System'),
('Smart Key System')
ON CONFLICT (system_name) DO NOTHING;

INSERT INTO transponder_families (family_name) VALUES 
('Philips Crypto 2 / Hitag2 / ID46'),
('Texas Crypto 4D / 4D68'),
('Megamos Crypto 48 / ID48'),
('Texas 4C / ID 4C'),
('Hitag2 Extended / ~ID46E')
ON CONFLICT (family_name) DO NOTHING;

-- Insert a few sample transponder entries for testing
DO $$
DECLARE
    toyota_id UUID;
    honda_id UUID;
    system_id UUID;
    family_id UUID;
BEGIN
    -- Get IDs for sample data
    SELECT id INTO toyota_id FROM vehicle_makes WHERE make_name = 'TOYOTA' LIMIT 1;
    SELECT id INTO honda_id FROM vehicle_makes WHERE make_name = 'HONDA' LIMIT 1;
    SELECT id INTO system_id FROM system_types WHERE system_name = 'Transponder System' LIMIT 1;
    SELECT id INTO family_id FROM transponder_families WHERE family_name = 'Texas Crypto 4D / 4D68' LIMIT 1;
    
    -- Insert sample entries
    INSERT INTO transponder_entries (make_id, model_name, year_from, year_to, system_type_id, transponder_family_id, oem_keys)
    VALUES 
    (toyota_id, 'Camry', 2018, 2023, system_id, family_id, 'HYQ12BDM, 89904-06140'),
    (toyota_id, 'Corolla', 2020, 2024, system_id, family_id, 'HYQ12BDP, 89904-02370'),
    (honda_id, 'Accord', 2018, 2023, system_id, family_id, 'KR5V2X, 72147-TCA-A01')
    ON CONFLICT DO NOTHING;
END $$;

-- Enable Row Level Security (optional)
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_entries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access
CREATE POLICY "Allow read access to vehicle_makes" ON vehicle_makes FOR SELECT USING (true);
CREATE POLICY "Allow read access to transponder_families" ON transponder_families FOR SELECT USING (true);
CREATE POLICY "Allow read access to system_types" ON system_types FOR SELECT USING (true);
CREATE POLICY "Allow read access to transponder_entries" ON transponder_entries FOR SELECT USING (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Supabase database setup completed successfully!';
    RAISE NOTICE 'Tables created: vehicle_makes, transponder_families, system_types, transponder_entries';
    RAISE NOTICE 'Views created: vehicle_summary, transponder_family_summary, api_transponder_search';
    RAISE NOTICE 'Sample data inserted for testing';
    RAISE NOTICE 'Your frontend should now work!';
END $$;
