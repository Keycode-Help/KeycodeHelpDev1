-- Export script to get data from your current MySQL database
-- Run this in your local MySQL database to export data for migration

-- Export keycode_user data
SELECT 
    CONCAT(
        'INSERT INTO keycode_user (fname, lname, email, phone, password, role, is_active, is_validated_user, is_admin_approved, admin_approval_notes, company, admin_code, state, created_at, updated_at) VALUES (',
        QUOTE(fname), ', ',
        QUOTE(lname), ', ',
        QUOTE(email), ', ',
        QUOTE(phone), ', ',
        QUOTE(password), ', ',
        QUOTE(role), ', ',
        is_active, ', ',
        is_validated_user, ', ',
        is_admin_approved, ', ',
        QUOTE(COALESCE(admin_approval_notes, '')), ', ',
        QUOTE(COALESCE(company, '')), ', ',
        QUOTE(COALESCE(admin_code, '')), ', ',
        QUOTE(COALESCE(state, '')), ', ',
        QUOTE(created_at), ', ',
        QUOTE(updated_at)
    ) as insert_statement
FROM keycode_user;

-- Export admin_action_log data
SELECT 
    CONCAT(
        'INSERT INTO admin_action_log (admin_id, action_type, target_user_id, action_details, timestamp) VALUES (',
        admin_id, ', ',
        QUOTE(action_type), ', ',
        target_user_id, ', ',
        QUOTE(COALESCE(action_details, '')), ', ',
        QUOTE(timestamp)
    ) as insert_statement
FROM admin_action_log;

-- Export cart data
SELECT 
    CONCAT(
        'INSERT INTO cart (user_id, created_at, updated_at) VALUES (',
        user_id, ', ',
        QUOTE(created_at), ', ',
        QUOTE(updated_at)
    ) as insert_statement
FROM cart;

-- Export cart_item data
SELECT 
    CONCAT(
        'INSERT INTO cart_item (cart_id, keycode_request_id, subscription_type, quantity, price, created_at) VALUES (',
        cart_id, ', ',
        COALESCE(keycode_request_id, 'NULL'), ', ',
        QUOTE(COALESCE(subscription_type, '')), ', ',
        quantity, ', ',
        COALESCE(price, 'NULL'), ', ',
        QUOTE(created_at)
    ) as insert_statement
FROM cart_item;

-- Export keycode_request data
SELECT 
    CONCAT(
        'INSERT INTO keycode_request (user_id, vehicle_make, vehicle_model, vehicle_year, keycode_type, request_status, created_at, updated_at) VALUES (',
        user_id, ', ',
        QUOTE(COALESCE(vehicle_make, '')), ', ',
        QUOTE(COALESCE(vehicle_model, '')), ', ',
        COALESCE(vehicle_year, 'NULL'), ', ',
        QUOTE(COALESCE(keycode_type, '')), ', ',
        QUOTE(COALESCE(request_status, 'PENDING')), ', ',
        QUOTE(created_at), ', ',
        QUOTE(updated_at)
    ) as insert_statement
FROM keycode_request;

-- Export admin_registration_code data
SELECT 
    CONCAT(
        'INSERT INTO admin_registration_code (code, is_used, created_by, used_by, created_at, used_at) VALUES (',
        QUOTE(code), ', ',
        is_used, ', ',
        COALESCE(created_by, 'NULL'), ', ',
        COALESCE(used_by, 'NULL'), ', ',
        QUOTE(created_at), ', ',
        CASE WHEN used_at IS NULL THEN 'NULL' ELSE QUOTE(used_at) END
    ) as insert_statement
FROM admin_registration_code;

-- Show table structure for reference
SHOW CREATE TABLE keycode_user;
SHOW CREATE TABLE admin_action_log;
SHOW CREATE TABLE cart;
SHOW CREATE TABLE cart_item;
SHOW CREATE TABLE keycode_request;
SHOW CREATE TABLE admin_registration_code;
