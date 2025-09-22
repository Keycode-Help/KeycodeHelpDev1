-- Fix Supabase Permissions - Run this in SQL Editor
-- This will allow public read access to the transponder database

-- DROP existing restrictive policies
DROP POLICY IF EXISTS "Allow read access to vehicle_makes" ON vehicle_makes;
DROP POLICY IF EXISTS "Allow read access to transponder_families" ON transponder_families;
DROP POLICY IF EXISTS "Allow read access to system_types" ON system_types;
DROP POLICY IF EXISTS "Allow read access to transponder_entries" ON transponder_entries;

-- CREATE new permissive policies for public read access
CREATE POLICY "Public read access to vehicle_makes" ON vehicle_makes
    FOR SELECT USING (true);

CREATE POLICY "Public read access to transponder_families" ON transponder_families
    FOR SELECT USING (true);

CREATE POLICY "Public read access to system_types" ON system_types
    FOR SELECT USING (true);

CREATE POLICY "Public read access to transponder_entries" ON transponder_entries
    FOR SELECT USING (true);

-- Alternative: Disable RLS entirely for these tables (less secure but simpler)
-- Uncomment these lines if the above doesn't work:
-- ALTER TABLE vehicle_makes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE transponder_families DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE system_types DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE transponder_entries DISABLE ROW LEVEL SECURITY;

-- Ensure views inherit proper permissions
-- Views should automatically work if the underlying tables have proper permissions

-- Grant explicit permissions to anon role (public access)
GRANT SELECT ON vehicle_makes TO anon;
GRANT SELECT ON transponder_families TO anon;
GRANT SELECT ON system_types TO anon;
GRANT SELECT ON transponder_entries TO anon;

-- Grant permissions on views
GRANT SELECT ON vehicle_summary TO anon;
GRANT SELECT ON transponder_family_summary TO anon;
GRANT SELECT ON api_transponder_search TO anon;

-- Grant to authenticated users as well
GRANT SELECT ON vehicle_makes TO authenticated;
GRANT SELECT ON transponder_families TO authenticated;
GRANT SELECT ON system_types TO authenticated;
GRANT SELECT ON transponder_entries TO authenticated;
GRANT SELECT ON vehicle_summary TO authenticated;
GRANT SELECT ON transponder_family_summary TO authenticated;
GRANT SELECT ON api_transponder_search TO authenticated;

-- Test query to verify permissions
SELECT 'Permissions fixed! Table counts:' as message;
SELECT 'vehicle_makes' as table_name, COUNT(*) as count FROM vehicle_makes
UNION ALL
SELECT 'system_types', COUNT(*) FROM system_types
UNION ALL
SELECT 'transponder_families', COUNT(*) FROM transponder_families
UNION ALL
SELECT 'transponder_entries', COUNT(*) FROM transponder_entries;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Permissions fixed successfully!';
    RAISE NOTICE 'Public read access granted to all tables and views';
    RAISE NOTICE 'Your frontend should now work without 401/permission errors';
END $$;
