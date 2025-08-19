-- Corrected export script based on actual table structure
-- Run this in your local MySQL database to export data for migration

-- Export keycode_user data (using actual columns)
SELECT 
    CONCAT(
        'INSERT INTO keycode_user (fname, lname, email, phone, password, role, is_active, is_validated_user, is_admin_approved, admin_approval_notes, company, admin_code, state) VALUES (',
        QUOTE(fname), ', ',
        QUOTE(lname), ', ',
        QUOTE(email), ', ',
        QUOTE(COALESCE(phone, '')), ', ',
        QUOTE(password), ', ',
        QUOTE(COALESCE(role, 'BASEUSER')), ', ',
        CASE WHEN is_active = 1 THEN 'true' ELSE 'false' END, ', ',
        CASE WHEN is_validated_user = 1 THEN 'true' ELSE 'false' END, ', ',
        CASE WHEN is_admin_approved = 1 THEN 'true' ELSE 'false' END, ', ',
        QUOTE(COALESCE(admin_approval_notes, '')), ', ',
        QUOTE(COALESCE(company, '')), ', ',
        QUOTE(COALESCE(admin_code, '')), ', ',
        QUOTE(COALESCE(state, ''))
    ) as insert_statement
FROM keycode_user;

-- Check if other tables exist and export them
SELECT '-- Checking admin_action_log table' as info;
SHOW TABLES LIKE 'admin_action_log';

SELECT '-- Checking cart table' as info;
SHOW TABLES LIKE 'cart';

SELECT '-- Checking cart_item table' as info;
SHOW TABLES LIKE 'cart_item';

SELECT '-- Checking keycode_request table' as info;
SHOW TABLES LIKE 'keycode_request';

SELECT '-- Checking admin_registration_code table' as info;
SHOW TABLES LIKE 'admin_registration_code';

-- Show all tables for reference
SELECT '-- All tables in database:' as info;
SHOW TABLES;
