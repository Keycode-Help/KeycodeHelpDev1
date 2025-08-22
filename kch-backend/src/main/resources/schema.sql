-- Manual schema creation since Hibernate DDL is failing
-- This file will be executed by Spring Boot on startup

-- Create keycode_user table
CREATE TABLE IF NOT EXISTS keycode_user (
    id BIGSERIAL PRIMARY KEY,
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'BASEUSER',
    front_id BYTEA,
    back_id BYTEA,
    insurance BYTEA,
    state VARCHAR(255) NOT NULL,
    is_validated_user BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin_approved BOOLEAN DEFAULT FALSE,
    admin_approval_notes TEXT,
    company VARCHAR(255),
    admin_code VARCHAR(255),
    user_type VARCHAR(31) DEFAULT 'KeycodeUser',
    subscription_id BIGINT REFERENCES subscription(id) ON DELETE SET NULL
);

-- Add missing fields to existing tables if they don't exist
ALTER TABLE keycode_user ADD COLUMN IF NOT EXISTS subscription_id BIGINT REFERENCES subscription(id) ON DELETE SET NULL;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS make_id BIGINT REFERENCES make(id) ON DELETE CASCADE;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS keycode_price DECIMAL(10,2);
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS registration BYTEA;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS cart_item_id BIGINT REFERENCES cart_item(id) ON DELETE SET NULL;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS transaction_id BIGINT REFERENCES transaction(id) ON DELETE SET NULL;
ALTER TABLE subscription ADD COLUMN IF NOT EXISTS activated BOOLEAN DEFAULT FALSE;
ALTER TABLE subscription ADD COLUMN IF NOT EXISTS cart_item_id BIGINT REFERENCES cart_item(id) ON DELETE SET NULL;
ALTER TABLE transaction ADD COLUMN IF NOT EXISTS confirmation_number VARCHAR(255) UNIQUE;
ALTER TABLE transaction ADD COLUMN IF NOT EXISTS transaction_amount DECIMAL(10,2);

-- Drop the old make column if it exists (since we're replacing it with make_id)
ALTER TABLE vehicle DROP COLUMN IF EXISTS make;

-- Add missing fields to existing make table if it doesn't exist
ALTER TABLE make ADD COLUMN IF NOT EXISTS non_member_price DECIMAL(10,2);
ALTER TABLE make ADD COLUMN IF NOT EXISTS member_price DECIMAL(10,2);

-- Drop the old key_code_price column if it exists (since we're replacing it)
ALTER TABLE make DROP COLUMN IF EXISTS key_code_price;

-- Create make table
CREATE TABLE IF NOT EXISTS make (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    non_member_price DECIMAL(10,2) NOT NULL,
    member_price DECIMAL(10,2) NOT NULL
);

-- Add missing fields to existing make table if it doesn't exist
ALTER TABLE make ADD COLUMN IF NOT EXISTS non_member_price DECIMAL(10,2);
ALTER TABLE make ADD COLUMN IF NOT EXISTS member_price DECIMAL(10,2);

-- Drop the old key_code_price column if it exists (since we're replacing it)
ALTER TABLE make DROP COLUMN IF EXISTS key_code_price;



-- Create vehicle table
CREATE TABLE IF NOT EXISTS vehicle (
    id BIGSERIAL PRIMARY KEY,
    make_id BIGINT REFERENCES make(id) ON DELETE CASCADE,
    model VARCHAR(255),
    year INTEGER,
    vin VARCHAR(255),
    license_plate VARCHAR(255),
    color VARCHAR(255),
    keycode_price DECIMAL(10,2),
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    front_id BYTEA,
    back_id BYTEA,
    registration BYTEA,
    cart_item_id BIGINT REFERENCES cart_item(id) ON DELETE SET NULL,
    transaction_id BIGINT REFERENCES transaction(id) ON DELETE SET NULL
);

-- Add missing fields to existing vehicle table if it doesn't exist
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS make_id BIGINT REFERENCES make(id) ON DELETE CASCADE;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS keycode_price DECIMAL(10,2);
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS registration BYTEA;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS cart_item_id BIGINT REFERENCES cart_item(id) ON DELETE SET NULL;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS transaction_id BIGINT REFERENCES transaction(id) ON DELETE SET NULL;

-- Create subscription table
CREATE TABLE IF NOT EXISTS subscription (
    id BIGSERIAL PRIMARY KEY,
    tier VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    activated BOOLEAN DEFAULT FALSE,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    cart_item_id BIGINT REFERENCES cart_item(id) ON DELETE SET NULL
);

-- Add missing fields to existing subscription table if it doesn't exist
ALTER TABLE subscription ADD COLUMN IF NOT EXISTS activated BOOLEAN DEFAULT FALSE;
ALTER TABLE subscription ADD COLUMN IF NOT EXISTS cart_item_id BIGINT REFERENCES cart_item(id) ON DELETE SET NULL;



-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    cart_total DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing fields to existing cart table if it doesn't exist
ALTER TABLE cart ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE cart ADD COLUMN IF NOT EXISTS cart_total DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE cart ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE cart ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;



-- Create cart_item table
CREATE TABLE IF NOT EXISTS cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES cart(id) ON DELETE CASCADE,
    vehicle_id BIGINT REFERENCES vehicle(id) ON DELETE CASCADE,
    subscription_id BIGINT REFERENCES subscription(id) ON DELETE CASCADE,
    cart_item_final_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing fields to existing cart_item table if it doesn't exist
ALTER TABLE cart_item ADD COLUMN IF NOT EXISTS cart_item_final_price DECIMAL(10,2);
ALTER TABLE cart_item ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;



-- Create transaction table
CREATE TABLE IF NOT EXISTS transaction (
    id BIGSERIAL PRIMARY KEY,
    confirmation_number VARCHAR(255) UNIQUE NOT NULL,
    transaction_amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE
);

-- Add missing fields to existing transaction table if it doesn't exist
ALTER TABLE transaction ADD COLUMN IF NOT EXISTS confirmation_number VARCHAR(255) UNIQUE;
ALTER TABLE transaction ADD COLUMN IF NOT EXISTS transaction_amount DECIMAL(10,2);



-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_keycode_user_email ON keycode_user(email);
CREATE INDEX IF NOT EXISTS idx_vehicle_user_id ON vehicle(keycode_user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_user_id ON subscription(keycode_user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_user_id ON transaction(keycode_user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);

-- Run migration script to update existing database structure
\i migration.sql
