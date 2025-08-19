-- Corrected Supabase migration script - PostgreSQL compatible
-- Run this in your Supabase SQL Editor after setting up the database

-- Enable UUID extension (Supabase standard)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_action_log table
CREATE TABLE IF NOT EXISTS admin_action_log (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT REFERENCES keycode_user(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    target_user_id BIGINT REFERENCES keycode_user(id) ON DELETE SET NULL,
    action_details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_item table
CREATE TABLE IF NOT EXISTS cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES cart(id) ON DELETE CASCADE,
    keycode_request_id BIGINT,
    subscription_type VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create keycode_requests table
CREATE TABLE IF NOT EXISTS keycode_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INTEGER,
    keycode_type VARCHAR(100),
    request_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create make table
CREATE TABLE IF NOT EXISTS make (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription table
CREATE TABLE IF NOT EXISTS subscription (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    subscription_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transaction table (quoted name for reserved word)
CREATE TABLE IF NOT EXISTS "transaction" (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_documents table
CREATE TABLE IF NOT EXISTS user_documents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    document_type VARCHAR(100),
    document_data BYTEA,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_licenses table
CREATE TABLE IF NOT EXISTS user_licenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    license_number VARCHAR(255),
    license_type VARCHAR(100),
    state VARCHAR(100),
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicle table
CREATE TABLE IF NOT EXISTS vehicle (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    vin VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicle_info table
CREATE TABLE IF NOT EXISTS vehicle_info (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicle(id) ON DELETE CASCADE,
    info_type VARCHAR(100),
    info_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert your admin user
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
    '$2b$10$Z9Sk3W9GXIuZso2L/IZSneFJ21boIs8mQArPELaG6h7Z1/Xk6Ms52',
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
CREATE INDEX IF NOT EXISTS idx_transaction_user_id ON "transaction"(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_user_id ON vehicle(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_keycode_user_updated_at 
    BEFORE UPDATE ON keycode_user 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at 
    BEFORE UPDATE ON cart 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keycode_requests_updated_at 
    BEFORE UPDATE ON keycode_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
