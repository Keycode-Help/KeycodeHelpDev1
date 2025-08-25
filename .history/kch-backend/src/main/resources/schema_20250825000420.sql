-- Minimal database schema for KeycodeHelp backend
-- This file will be executed by Spring Boot on startup

-- Create tables only if they don't exist
CREATE TABLE IF NOT EXISTS make (
    id BIGSERIAL PRIMARY KEY, 
    name VARCHAR(255) UNIQUE NOT NULL,
    non_member_price DECIMAL(10,2) DEFAULT 99.99,
    member_price DECIMAL(10,2) DEFAULT 79.99
);

CREATE TABLE IF NOT EXISTS keycode_user (
    id BIGSERIAL PRIMARY KEY, 
    email VARCHAR(255) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    fname VARCHAR(255), 
    lname VARCHAR(255), 
    phone VARCHAR(255), 
    state VARCHAR(255), 
    role VARCHAR(50) DEFAULT 'BASEUSER',
    is_validated_user BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin_approved BOOLEAN DEFAULT FALSE,
    admin_approval_notes TEXT,
    company VARCHAR(255),
    admin_code VARCHAR(255),
    front_id BYTEA,
    back_id BYTEA,
    insurance BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicle (
    id BIGSERIAL PRIMARY KEY, 
    make_id BIGINT, 
    model VARCHAR(255), 
    year INTEGER, 
    vin VARCHAR(255) UNIQUE NOT NULL, 
    keycode_user_id BIGINT, 
    status VARCHAR(255) DEFAULT 'PENDING', 
    keycode VARCHAR(255), 
    keycode_price DECIMAL(10,2), 
    front_id BYTEA, 
    back_id BYTEA, 
    registration BYTEA
);

-- Add missing cart and cart_item tables
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY, 
    keycode_user_id BIGINT NOT NULL, 
    status VARCHAR(255) DEFAULT 'ACTIVE', 
    cart_total DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS cart_item (
    id BIGSERIAL PRIMARY KEY, 
    cart_id BIGINT NOT NULL, 
    vehicle_id BIGINT, 
    subscription_id BIGINT, 
    cart_item_final_price DECIMAL(10,2) DEFAULT 0.00
);

-- Add missing subscription table
CREATE TABLE IF NOT EXISTS subscription (
    id BIGSERIAL PRIMARY KEY, 
    keycode_user_id BIGINT NOT NULL, 
    plan_type VARCHAR(255), 
    is_activated BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints if they don't exist
-- Note: These will be added by Hibernate/JPA automatically
