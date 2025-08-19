-- Migration script from MySQL to Supabase PostgreSQL
-- Run this in your Supabase SQL Editor after setting up the database

-- First, create the tables (Hibernate will do this automatically with ddl-auto=update)
-- But you can also run these manually if needed

-- Create keycode_user table
CREATE TABLE IF NOT EXISTS keycode_user (
    id BIGSERIAL PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    is_validated_user BOOLEAN DEFAULT FALSE,
    is_admin_approved BOOLEAN DEFAULT FALSE,
    admin_approval_notes TEXT,
    company VARCHAR(255),
    admin_code VARCHAR(255),
    state VARCHAR(100),
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

-- Create keycode_request table
CREATE TABLE IF NOT EXISTS keycode_request (
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

-- Create admin_registration_code table
CREATE TABLE IF NOT EXISTS admin_registration_code (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_by BIGINT REFERENCES keycode_user(id),
    used_by BIGINT REFERENCES keycode_user(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP
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
    state, 
    company
) VALUES (
    'Anthony',
    'Feaster',
    'mytech@metrepairs.com',
    'N/A',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', -- 'admin123' encoded with BCrypt
    'SUPER_ADMIN',
    true,
    true,
    true,
    'N/A',
    'Met Repairs'
) ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_keycode_user_email ON keycode_user(email);
CREATE INDEX IF NOT EXISTS idx_keycode_user_role ON keycode_user(role);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id ON cart_item(cart_id);
CREATE INDEX IF NOT EXISTS idx_keycode_request_user_id ON keycode_request(user_id);

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
