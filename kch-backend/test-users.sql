-- Test users for validation and trial status testing
-- Insert test users with different validation and trial statuses

-- Test user 1: Pending validation (not validated)
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
    phone
) VALUES (
    'John', 
    'Doe', 
    'john.doe@test.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- test password
    'BASEUSER', 
    'Test Company', 
    false, 
    true, 
    'CA', 
    false,
    '555-0101'
) ON CONFLICT (email) DO NOTHING;

-- Test user 2: Validated user with active trial
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
    phone
) VALUES (
    'Jane', 
    'Smith', 
    'jane.smith@test.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'BASEUSER', 
    'Test Company 2', 
    true, 
    true, 
    'NY', 
    true,
    '555-0102'
) ON CONFLICT (email) DO NOTHING;

-- Test user 3: Validated user with expired trial
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
    phone
) VALUES (
    'Bob', 
    'Johnson', 
    'bob.johnson@test.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'BASEUSER', 
    'Test Company 3', 
    true, 
    true, 
    'TX', 
    true,
    '555-0103'
) ON CONFLICT (email) DO NOTHING;

-- Test user 4: Inactive user
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
    phone
) VALUES (
    'Alice', 
    'Brown', 
    'alice.brown@test.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'BASEUSER', 
    'Test Company 4', 
    true, 
    false, 
    'FL', 
    true,
    '555-0104'
) ON CONFLICT (email) DO NOTHING;

-- Create subscription records for trial users
-- Active trial for Jane Smith (expires in 3 days)
INSERT INTO subscription (
    user_id,
    is_trial,
    trial_ends_at,
    activated,
    created_at
) VALUES (
    (SELECT id FROM keycode_user WHERE email = 'jane.smith@test.com'),
    true,
    NOW() + INTERVAL '3 days',
    false,
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    is_trial = true,
    trial_ends_at = NOW() + INTERVAL '3 days',
    activated = false;

-- Expired trial for Bob Johnson (expired 1 day ago)
INSERT INTO subscription (
    user_id,
    is_trial,
    trial_ends_at,
    activated,
    created_at
) VALUES (
    (SELECT id FROM keycode_user WHERE email = 'bob.johnson@test.com'),
    true,
    NOW() - INTERVAL '1 day',
    false,
    NOW() - INTERVAL '4 days'
) ON CONFLICT (user_id) DO UPDATE SET
    is_trial = true,
    trial_ends_at = NOW() - INTERVAL '1 day',
    activated = false;

-- Pro user subscription for Alice Brown
INSERT INTO subscription (
    user_id,
    is_trial,
    trial_ends_at,
    activated,
    created_at
) VALUES (
    (SELECT id FROM keycode_user WHERE email = 'alice.brown@test.com'),
    false,
    NULL,
    true,
    NOW() - INTERVAL '30 days'
) ON CONFLICT (user_id) DO UPDATE SET
    is_trial = false,
    trial_ends_at = NULL,
    activated = true;

