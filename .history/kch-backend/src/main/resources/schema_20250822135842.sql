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

-- Create make table
CREATE TABLE IF NOT EXISTS make (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    non_member_price DECIMAL(10,2) NOT NULL,
    member_price DECIMAL(10,2) NOT NULL
);

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

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    cart_total DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_item table
CREATE TABLE IF NOT EXISTS cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES cart(id) ON DELETE CASCADE,
    vehicle_id BIGINT REFERENCES vehicle(id) ON DELETE CASCADE,
    subscription_id BIGINT REFERENCES subscription(id) ON DELETE CASCADE,
    cart_item_final_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transaction table
CREATE TABLE IF NOT EXISTS transaction (
    id BIGSERIAL PRIMARY KEY,
    confirmation_number VARCHAR(255) UNIQUE NOT NULL,
    transaction_amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE
);

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
