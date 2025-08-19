-- Complete Supabase migration script based on your actual MySQL database
-- Run this in your Supabase SQL Editor after setting up the database

-- Create keycode_user table (main user table)
CREATE TABLE IF NOT EXISTS keycode_user (
    id BIGSERIAL PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'BASEUSER',
    is_active BOOLEAN DEFAULT TRUE,
    is_validated_user BOOLEAN DEFAULT FALSE,
    is_admin_approved BOOLEAN DEFAULT FALSE,
    admin_approval_notes VARCHAR(255),
    company VARCHAR(255),
    admin_code VARCHAR(255),
    state VARCHAR(255) NOT NULL,
    back_id BYTEA,
    front_id BYTEA,
    insurance BYTEA,
    user_type VARCHAR(31) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_action_log table
CREATE TABLE IF NOT EXISTS admin_action_log (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT REFERENCES keycode_user(id),
    action_type VARCHAR(100) NOT NULL,
    target_user_id BIGINT REFERENCES keycode_user(id),
    action_details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_item table
CREATE TABLE IF NOT EXISTS cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES cart(id),
    keycode_request_id BIGINT,
    subscription_type VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id),
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create keycode_requests table (note: different name from your MySQL)
CREATE TABLE IF NOT EXISTS keycode_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id),
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INTEGER,
    keycode_type VARCHAR(100),
    request_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create make table
CREATE TABLE IF NOT EXISTS make (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subscription table
CREATE TABLE IF NOT EXISTS subscription (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id),
    subscription_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transaction table
CREATE TABLE IF NOT EXISTS transaction (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id),
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_documents table
CREATE TABLE IF NOT EXISTS user_documents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id),
    document_type VARCHAR(100),
    document_data BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_licenses table
CREATE TABLE IF NOT EXISTS user_licenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id),
    license_number VARCHAR(255),
    license_type VARCHAR(100),
    state VARCHAR(100),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicle table
CREATE TABLE IF NOT EXISTS vehicle (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id),
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    vin VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicle_info table
CREATE TABLE IF NOT EXISTS vehicle_info (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicle(id),
    info_type VARCHAR(100),
    info_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert your admin user (update with your actual password hash)
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
    admin_approval_notes, 
    company, 
    admin_code, 
    state,
    user_type
) VALUES (
    'Anthony',
    'Feaster',
    'mytech@metrepairs.com',
    'N/A',
    '$2b$10$Z9Sk3W9GXIuZso2L/IZSneFJ21boIs8mQArPELaG6h7Z1/Xk6Ms52', -- Your actual password hash
    'SUPER_ADMIN',
    true,
    true,
    true,
    '',
    'Met Repairs',
    '',
    'N/A',
    'SUPER_ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Insert your other user
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
    admin_approval_notes, 
    company, 
    admin_code, 
    state,
    user_type
) VALUES (
    'ANTHONY',
    'Feaster',
    '5epmgllc@gmail.com',
    '6782165112',
    '$2a$10$cy6fQekWaQB9j9f73ESRbuMGIEEhtvyiwnyWkAQiP.MWR0Nv4iY66',
    'BASEUSER',
    true,
    true,
    false,
    '',
    '',
    '',
    'Georgia',
    'BASEUSER'
) ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_keycode_user_email ON keycode_user(email);
CREATE INDEX IF NOT EXISTS idx_keycode_user_role ON keycode_user(role);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id ON cart_item(cart_id);
CREATE INDEX IF NOT EXISTS idx_keycode_requests_user_id ON keycode_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_user_id ON subscription(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_user_id ON transaction(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_user_id ON vehicle(user_id);

-- Verify the admin user was created
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
