-- Minimal database schema for KeycodeHelp backend
-- This file will be executed by Spring Boot on startup

-- Create tables only if they don't exist
CREATE TABLE IF NOT EXISTS make (id BIGSERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS keycode_user (id BIGSERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, fname VARCHAR(255), lname VARCHAR(255), phone VARCHAR(255), state VARCHAR(255), role VARCHAR(50) DEFAULT 'USER', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS vehicle (id BIGSERIAL PRIMARY KEY, make_id BIGINT, model VARCHAR(255), year INTEGER, vin VARCHAR(255) UNIQUE NOT NULL, keycode_user_id BIGINT, status VARCHAR(255) DEFAULT 'PENDING', keycode VARCHAR(255), keycode_price DECIMAL(10,2), front_id BYTEA, back_id BYTEA, registration BYTEA);

-- Add missing cart and cart_item tables
CREATE TABLE IF NOT EXISTS cart (id BIGSERIAL PRIMARY KEY, keycode_user_id BIGINT NOT NULL, status VARCHAR(255) DEFAULT 'ACTIVE', cart_total DECIMAL(10,2) DEFAULT 0.00);
CREATE TABLE IF NOT EXISTS cart_item (id BIGSERIAL PRIMARY KEY, cart_id BIGINT NOT NULL, vehicle_id BIGINT, subscription_id BIGINT, cart_item_final_price DECIMAL(10,2) DEFAULT 0.00);

-- Add missing subscription table
CREATE TABLE IF NOT EXISTS subscription (id BIGSERIAL PRIMARY KEY, keycode_user_id BIGINT NOT NULL, plan_type VARCHAR(255), is_activated BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Add missing columns to existing tables if they don't exist
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'BASEUSER';
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS is_validated_user BOOLEAN DEFAULT FALSE;
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS is_admin_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS admin_approval_notes TEXT;
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS admin_code VARCHAR(255);
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS front_id BYTEA;
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS back_id BYTEA;
ALTER TABLE IF NOT EXISTS keycode_user ADD COLUMN IF NOT EXISTS insurance BYTEA;

-- Add missing columns to make table if they don't exist
ALTER TABLE IF NOT EXISTS make ADD COLUMN IF NOT EXISTS non_member_price DECIMAL(10,2) DEFAULT 99.99;
ALTER TABLE IF NOT EXISTS make ADD COLUMN IF NOT EXISTS member_price DECIMAL(10,2) DEFAULT 79.99;

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    -- Add foreign key for vehicle.make_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'vehicle_make_id_fkey') THEN
        ALTER TABLE vehicle ADD CONSTRAINT vehicle_make_id_fkey FOREIGN KEY (make_id) REFERENCES make(id);
    END IF;
    
    -- Add foreign key for vehicle.keycode_user_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'vehicle_keycode_user_id_fkey') THEN
        ALTER TABLE vehicle ADD CONSTRAINT vehicle_keycode_user_id_fkey FOREIGN KEY (keycode_user_id) REFERENCES keycode_user(id);
    END IF;
    
    -- Add foreign key for cart.keycode_user_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cart_keycode_user_id_fkey') THEN
        ALTER TABLE cart ADD CONSTRAINT cart_keycode_user_id_fkey FOREIGN KEY (keycode_user_id) REFERENCES keycode_user(id);
    END IF;
    
    -- Add foreign key for cart_item.cart_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cart_item_cart_id_fkey') THEN
        ALTER TABLE cart_item ADD CONSTRAINT cart_item_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES cart(id);
    END IF;
    
    -- Add foreign key for cart_item.vehicle_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cart_item_vehicle_id_fkey') THEN
        ALTER TABLE cart_item ADD CONSTRAINT cart_item_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicle(id);
    END IF;
    
    -- Add foreign key for cart_item.subscription_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cart_item_subscription_id_fkey') THEN
        ALTER TABLE cart_item ADD CONSTRAINT cart_item_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES subscription(id);
    END IF;
    
    -- Add foreign key for subscription.keycode_user_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'subscription_keycode_user_id_fkey') THEN
        ALTER TABLE subscription ADD CONSTRAINT subscription_keycode_user_id_fkey FOREIGN KEY (keycode_user_id) REFERENCES keycode_user(id);
    END IF;
END $$;
