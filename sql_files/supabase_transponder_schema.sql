-- Supabase Transponder Database Schema
-- This schema is designed to organize transponder data efficiently for the KCH application

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vehicle makes table for normalization
CREATE TABLE vehicle_makes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make_name VARCHAR(50) NOT NULL UNIQUE,
    make_name_normalized VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transponder families table for normalization
CREATE TABLE transponder_families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_name VARCHAR(100) NOT NULL UNIQUE,
    family_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system types table for normalization
CREATE TABLE system_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_name VARCHAR(100) NOT NULL UNIQUE,
    system_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main transponder entries table
CREATE TABLE transponder_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make_id UUID REFERENCES vehicle_makes(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,
    year_from INTEGER,
    year_to INTEGER,
    year_note VARCHAR(100),
    system_type_id UUID REFERENCES system_types(id) ON DELETE SET NULL,
    transponder_family_id UUID REFERENCES transponder_families(id) ON DELETE SET NULL,
    transponder_detail TEXT,
    cross_references TEXT,
    oem_keys TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT valid_year_range CHECK (
        year_from IS NULL OR year_to IS NULL OR year_from <= year_to
    )
);

-- Create indexes for better query performance
CREATE INDEX idx_transponder_entries_make_id ON transponder_entries(make_id);
CREATE INDEX idx_transponder_entries_model_name ON transponder_entries(model_name);
CREATE INDEX idx_transponder_entries_year_from ON transponder_entries(year_from);
CREATE INDEX idx_transponder_entries_year_to ON transponder_entries(year_to);
CREATE INDEX idx_transponder_entries_transponder_family_id ON transponder_entries(transponder_family_id);
CREATE INDEX idx_transponder_entries_system_type_id ON transponder_entries(system_type_id);
CREATE INDEX idx_transponder_entries_is_active ON transponder_entries(is_active);

-- Create a compound index for common search patterns
CREATE INDEX idx_transponder_entries_make_model ON transponder_entries(make_id, model_name);
CREATE INDEX idx_transponder_entries_year_range ON transponder_entries(year_from, year_to);

-- Create a text search index for model names and notes
CREATE INDEX idx_transponder_entries_text_search ON transponder_entries 
USING gin(to_tsvector('english', model_name || ' ' || COALESCE(notes, '')));

-- View for easy querying with joined data
CREATE VIEW transponder_data_view AS
SELECT 
    te.id,
    vm.make_name,
    te.model_name,
    te.year_from,
    te.year_to,
    te.year_note,
    st.system_name as system_type,
    tf.family_name as transponder_family,
    te.transponder_detail,
    te.cross_references,
    te.oem_keys,
    te.notes,
    te.is_active,
    te.created_at,
    te.updated_at
FROM transponder_entries te
LEFT JOIN vehicle_makes vm ON te.make_id = vm.id
LEFT JOIN system_types st ON te.system_type_id = st.id
LEFT JOIN transponder_families tf ON te.transponder_family_id = tf.id
WHERE te.is_active = TRUE;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update timestamps
CREATE TRIGGER update_vehicle_makes_updated_at 
    BEFORE UPDATE ON vehicle_makes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transponder_families_updated_at 
    BEFORE UPDATE ON transponder_families 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_types_updated_at 
    BEFORE UPDATE ON system_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transponder_entries_updated_at 
    BEFORE UPDATE ON transponder_entries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE transponder_entries ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to vehicle_makes" ON vehicle_makes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to transponder_families" ON transponder_families
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to system_types" ON system_types
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to transponder_entries" ON transponder_entries
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admin users to modify data
CREATE POLICY "Allow admin to modify vehicle_makes" ON vehicle_makes
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_app_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Allow admin to modify transponder_families" ON transponder_families
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_app_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Allow admin to modify system_types" ON system_types
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_app_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Allow admin to modify transponder_entries" ON transponder_entries
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Comments for documentation
COMMENT ON TABLE vehicle_makes IS 'Normalized table for vehicle manufacturers';
COMMENT ON TABLE transponder_families IS 'Normalized table for transponder types and families';
COMMENT ON TABLE system_types IS 'Normalized table for anti-theft system types';
COMMENT ON TABLE transponder_entries IS 'Main table containing all transponder data for vehicles';
COMMENT ON VIEW transponder_data_view IS 'Convenient view for querying transponder data with joined information';
