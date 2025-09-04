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
    industry VARCHAR(255),
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
    business_document BYTEA,
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

-- KCH Transponder Database Schema
-- ===============================

-- Model table (extends existing make table)
CREATE TABLE IF NOT EXISTS model (
    id SERIAL PRIMARY KEY,
    make_id BIGINT NOT NULL REFERENCES make(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(make_id, name)
);

-- Vehicle range table
CREATE TABLE IF NOT EXISTS vehicle_range (
    id SERIAL PRIMARY KEY,
    model_id BIGINT NOT NULL REFERENCES model(id) ON DELETE CASCADE,
    year_from INTEGER NOT NULL,
    year_to INTEGER,
    year_note VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System type table
CREATE TABLE IF NOT EXISTS system_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transponder family table
CREATE TABLE IF NOT EXISTS transponder_family (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transponder detail table
CREATE TABLE IF NOT EXISTS transponder_detail (
    id SERIAL PRIMARY KEY,
    detail TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cross reference table
CREATE TABLE IF NOT EXISTS cross_ref (
    id SERIAL PRIMARY KEY,
    label VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OEM key table
CREATE TABLE IF NOT EXISTS oem_key (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note table
CREATE TABLE IF NOT EXISTS note (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main entry table (fact table)
CREATE TABLE IF NOT EXISTS entry (
    id SERIAL PRIMARY KEY,
    vehicle_range_id BIGINT NOT NULL REFERENCES vehicle_range(id) ON DELETE CASCADE,
    system_type_id BIGINT REFERENCES system_type(id) ON DELETE SET NULL,
    transponder_family_id BIGINT REFERENCES transponder_family(id) ON DELETE SET NULL,
    transponder_detail_id BIGINT REFERENCES transponder_detail(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction tables for many-to-many relationships
CREATE TABLE IF NOT EXISTS entry_cross_ref (
    entry_id BIGINT NOT NULL REFERENCES entry(id) ON DELETE CASCADE,
    cross_ref_id BIGINT NOT NULL REFERENCES cross_ref(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, cross_ref_id)
);

CREATE TABLE IF NOT EXISTS entry_oem_key (
    entry_id BIGINT NOT NULL REFERENCES entry(id) ON DELETE CASCADE,
    oem_key_id BIGINT NOT NULL REFERENCES oem_key(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, oem_key_id)
);

CREATE TABLE IF NOT EXISTS entry_note (
    entry_id BIGINT NOT NULL REFERENCES entry(id) ON DELETE CASCADE,
    note_id BIGINT NOT NULL REFERENCES note(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, note_id)
);

-- ETL tracking table
CREATE TABLE IF NOT EXISTS etl_log (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    records_processed INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'running',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_model_make_id ON model(make_id);
CREATE INDEX IF NOT EXISTS idx_model_name ON model(name);
CREATE INDEX IF NOT EXISTS idx_vehicle_range_model_id ON vehicle_range(model_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_range_years ON vehicle_range(year_from, year_to);
CREATE INDEX IF NOT EXISTS idx_entry_vehicle_range_id ON entry(vehicle_range_id);
CREATE INDEX IF NOT EXISTS idx_entry_system_type_id ON entry(system_type_id);
CREATE INDEX IF NOT EXISTS idx_entry_transponder_family_id ON entry(transponder_family_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_transponder_family_fts ON transponder_family USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_transponder_detail_fts ON transponder_detail USING gin(to_tsvector('english', detail));
CREATE INDEX IF NOT EXISTS idx_cross_ref_fts ON cross_ref USING gin(to_tsvector('english', label));
CREATE INDEX IF NOT EXISTS idx_oem_key_fts ON oem_key USING gin(to_tsvector('english', code));

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    keycode_request_notifications BOOLEAN DEFAULT TRUE,
    keycode_status_notifications BOOLEAN DEFAULT TRUE,
    keycode_completion_notifications BOOLEAN DEFAULT TRUE,
    admin_notifications BOOLEAN DEFAULT FALSE,
    marketing_notifications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES keycode_user(id) ON DELETE CASCADE
);

-- Trigram indexes for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_model_name_trgm ON model USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_oem_key_trgm ON oem_key USING gin(code gin_trgm_ops);

-- Index for notification preferences
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
