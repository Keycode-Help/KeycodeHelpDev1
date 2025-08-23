-- Minimal database schema for KeycodeHelp backend
-- This file will be executed by Spring Boot on startup

-- Create tables only if they don't exist
CREATE TABLE IF NOT EXISTS make (id BIGSERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS keycode_user (id BIGSERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, fname VARCHAR(255), lname VARCHAR(255), phone VARCHAR(255), state VARCHAR(255), role VARCHAR(50) DEFAULT 'USER', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS vehicle (id BIGSERIAL PRIMARY KEY, make_id BIGINT, model VARCHAR(255), year INTEGER, vin VARCHAR(255) UNIQUE NOT NULL, keycode_user_id BIGINT, status VARCHAR(255) DEFAULT 'PENDING', keycode VARCHAR(255), keycode_price DECIMAL(10,2), front_id BYTEA, back_id BYTEA, registration BYTEA);
