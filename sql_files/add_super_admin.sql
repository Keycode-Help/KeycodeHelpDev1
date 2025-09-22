-- Script to add Anthony Feaster as a Super Admin
-- Run this in your MySQL database

-- First, let's check if the user already exists
SELECT * FROM keycode_user WHERE email = 'mytech@metrepairs.com';

-- If user doesn't exist, insert as super admin
INSERT INTO keycode_user (
    fname, 
    lname, 
    email, 
    phone, 
    password, 
    role, 
    is_active, 
    is_validated_user, 
    is_admin_approved, 
    state, 
    company
) VALUES (
    'Anthony',
    'Feaster',
    'mytech@metrepairs.com',
    'N/A', -- You can update this later
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- This is 'admin123' encoded with BCrypt
    'SUPER_ADMIN',
    true,
    true,
    true,
    'N/A',
    'Met Repairs'
);

-- Verify the user was created
SELECT 
    id, 
    fname, 
    lname, 
    email, 
    role, 
    is_active, 
    is_admin_approved,
    company
FROM keycode_user 
WHERE email = 'mytech@metrepairs.com';

-- Update existing users to have the new fields if they don't exist
-- This handles the case where the database schema was updated
ALTER TABLE keycode_user 
ADD COLUMN IF NOT EXISTS is_admin_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_approval_notes VARCHAR(500),
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS admin_code VARCHAR(255);

-- Set existing ADMIN users to be approved (if any exist)
UPDATE keycode_user 
SET is_admin_approved = true, 
    admin_approval_notes = 'Legacy admin account - auto-approved during system upgrade'
WHERE role = 'ADMIN' AND is_admin_approved IS NULL;
