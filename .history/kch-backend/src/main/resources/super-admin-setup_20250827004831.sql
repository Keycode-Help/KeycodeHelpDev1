-- Super Admin Account Setup for Supabase (PostgreSQL)
-- This script ensures the super admin account exists with proper credentials
-- Compatible with the current database schema

-- Check if super admin already exists
DO $$
BEGIN
    -- Only create if super admin doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM keycode_user 
        WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN'
    ) THEN
        -- Insert super admin user
        INSERT INTO keycode_user (
            fname, 
            lname, 
            email, 
            password, 
            role, 
            company, 
            is_admin_approved, 
            is_active, 
            state, 
            is_validated_user,
            admin_code
        ) VALUES (
            'Super', 
            'Admin', 
            '5epmgllc@gmail.com', 
            '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- Mrguru2054 encoded
            'SUPER_ADMIN', 
            'KeyCode Help', 
            true, 
            true, 
            'N/A', 
            true,
            'SUPER_ADMIN_2024'
        );
        
        RAISE NOTICE 'Super admin account created successfully';
    ELSE
        RAISE NOTICE 'Super admin account already exists';
        
        -- Update password if needed (for password changes)
        UPDATE keycode_user 
        SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa'
        WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN';
        
        RAISE NOTICE 'Super admin password updated';
    END IF;
END $$;

-- Verify super admin account
SELECT 
    id,
    fname,
    lname,
    email,
    role,
    is_admin_approved,
    is_active,
    is_validated_user,
    created_at
FROM keycode_user 
WHERE email = '5epmgllc@gmail.com' AND role = 'SUPER_ADMIN';

-- Alternative simple insert (if the DO block doesn't work)
-- Uncomment and run this if you get errors with the DO block above:

/*
INSERT INTO keycode_user (
    fname, 
    lname, 
    email, 
    password, 
    role, 
    company, 
    is_admin_approved, 
    is_active, 
    state, 
    is_validated_user,
    admin_code
) VALUES (
    'Super', 
    'Admin', 
    '5epmgllc@gmail.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'SUPER_ADMIN', 
    'KeyCode Help', 
    true, 
    true, 
    'N/A', 
    true,
    'SUPER_ADMIN_2024'
) ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    is_admin_approved = true,
    is_active = true,
    is_validated_user = true;
*/
