-- Check Data Completeness in Supabase
-- Run this in Supabase SQL Editor to verify your data

-- 1. Check total counts
SELECT 'Data Completeness Check' as status;

SELECT 
  'vehicle_makes' as table_name, 
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM vehicle_makes
UNION ALL
SELECT 
  'system_types' as table_name, 
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM system_types
UNION ALL
SELECT 
  'transponder_families' as table_name, 
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM transponder_families
UNION ALL
SELECT 
  'transponder_entries' as table_name, 
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_records
FROM transponder_entries;

-- 2. Check if we have the expected 1,939 entries
SELECT 
  CASE 
    WHEN COUNT(*) >= 1900 THEN '✅ Full dataset appears to be imported'
    WHEN COUNT(*) >= 100 THEN '⚠️ Partial dataset imported'
    WHEN COUNT(*) >= 10 THEN '⚠️ Only sample data present'
    ELSE '❌ Very little data imported'
  END as import_status,
  COUNT(*) as actual_entries,
  1939 as expected_entries
FROM transponder_entries WHERE is_active = true;

-- 3. Check vehicle make distribution (should have major brands)
SELECT 'Top 10 Vehicle Makes:' as section;
SELECT 
  vm.make_name,
  COUNT(te.id) as entry_count
FROM vehicle_makes vm
LEFT JOIN transponder_entries te ON vm.id = te.make_id AND te.is_active = true
WHERE vm.is_active = true
GROUP BY vm.id, vm.make_name
ORDER BY entry_count DESC
LIMIT 10;

-- 4. Check transponder family distribution
SELECT 'Top 10 Transponder Families:' as section;
SELECT 
  tf.family_name,
  COUNT(te.id) as usage_count
FROM transponder_families tf
LEFT JOIN transponder_entries te ON tf.id = te.transponder_family_id AND te.is_active = true
WHERE tf.is_active = true
GROUP BY tf.id, tf.family_name
ORDER BY usage_count DESC
LIMIT 10;

-- 5. Test search functionality (sample queries)
SELECT 'Search Test Results:' as section;

-- Test 1: Search by make
SELECT 'Toyota entries:' as test, COUNT(*) as count
FROM api_transponder_search 
WHERE UPPER(make) LIKE '%TOYOTA%';

-- Test 2: Search by transponder type
SELECT 'Hitag2 transponders:' as test, COUNT(*) as count
FROM api_transponder_search 
WHERE UPPER(transponder_type) LIKE '%HITAG2%';

-- Test 3: Search by OEM keys
SELECT 'Entries with OEM keys:' as test, COUNT(*) as count
FROM api_transponder_search 
WHERE oem_keys IS NOT NULL AND oem_keys != '';

-- Test 4: Search by year range
SELECT 'Entries 2018-2023:' as test, COUNT(*) as count
FROM api_transponder_search 
WHERE (year_from <= 2023 OR year_from IS NULL) 
  AND (year_to >= 2018 OR year_to IS NULL);

-- 6. Check data quality
SELECT 'Data Quality Check:' as section;

SELECT 
  'Complete entries (Make+Model)' as metric,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transponder_entries WHERE is_active = true), 2) as percentage
FROM transponder_entries 
WHERE is_active = true 
  AND make_id IS NOT NULL 
  AND model_name IS NOT NULL 
  AND TRIM(model_name) != ''

UNION ALL

SELECT 
  'Entries with year info' as metric,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transponder_entries WHERE is_active = true), 2) as percentage
FROM transponder_entries 
WHERE is_active = true 
  AND (year_from IS NOT NULL OR year_to IS NOT NULL)

UNION ALL

SELECT 
  'Entries with transponder family' as metric,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transponder_entries WHERE is_active = true), 2) as percentage
FROM transponder_entries 
WHERE is_active = true 
  AND transponder_family_id IS NOT NULL

UNION ALL

SELECT 
  'Entries with OEM keys' as metric,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transponder_entries WHERE is_active = true), 2) as percentage
FROM transponder_entries 
WHERE is_active = true 
  AND oem_keys IS NOT NULL 
  AND TRIM(oem_keys) != '';

-- Success message
DO $$
DECLARE
    total_entries INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_entries FROM transponder_entries WHERE is_active = true;
    
    IF total_entries >= 1900 THEN
        RAISE NOTICE '✅ Database appears fully populated with % entries!', total_entries;
    ELSIF total_entries >= 100 THEN
        RAISE NOTICE '⚠️ Database partially populated with % entries. Expected ~1,939.', total_entries;
    ELSE
        RAISE NOTICE '❌ Database has only % entries. Need to import full dataset.', total_entries;
    END IF;
END $$;
