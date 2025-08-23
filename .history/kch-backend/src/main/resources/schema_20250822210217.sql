-- Safe database schema updates for KeycodeHelp backend
-- This file will be executed by Spring Boot on startup

-- Only add missing columns if they don't exist
-- This approach is safer and won't break existing deployments

-- Add missing columns to make table if they don't exist
DO $$ 
BEGIN
    -- Add non_member_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'make' AND column_name = 'non_member_price') THEN
        ALTER TABLE make ADD COLUMN non_member_price DECIMAL(10,2) DEFAULT 60.00;
    END IF;
    
    -- Add member_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'make' AND column_name = 'member_price') THEN
        ALTER TABLE make ADD COLUMN member_price DECIMAL(10,2) DEFAULT 45.00;
    END IF;
    
    -- Update existing makes with default pricing if prices are null
    UPDATE make SET 
        non_member_price = 60.00,
        member_price = 45.00
    WHERE non_member_price IS NULL OR member_price IS NULL;
END $$;

-- Add missing columns to vehicle table if they don't exist
DO $$ 
BEGIN
    -- Add keycode column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicle' AND column_name = 'keycode') THEN
        ALTER TABLE vehicle ADD COLUMN keycode VARCHAR(255);
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicle' AND column_name = 'status') THEN
        ALTER TABLE vehicle ADD COLUMN status VARCHAR(255) DEFAULT 'PENDING';
    END IF;
    
    -- Add year column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicle' AND column_name = 'year') THEN
        ALTER TABLE vehicle ADD COLUMN year INTEGER;
    END IF;
    
    -- Add keycode_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicle' AND column_name = 'keycode_price') THEN
        ALTER TABLE vehicle ADD COLUMN keycode_price DECIMAL(10,2);
    END IF;
    
    -- Add make_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicle' AND column_name = 'make_id') THEN
        ALTER TABLE vehicle ADD COLUMN make_id BIGINT;
    END IF;
    
    -- Add cart_item_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicle' AND column_name = 'cart_item_id') THEN
        ALTER TABLE vehicle ADD COLUMN cart_item_id BIGINT;
    END IF;
    
    -- Add transaction_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicle' AND column_name = 'transaction_id') THEN
        ALTER TABLE vehicle ADD COLUMN transaction_id BIGINT;
    END IF;
END $$;

-- Add missing columns to subscription table if they don't exist
DO $$ 
BEGIN
    -- Add activated column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription' AND column_name = 'activated') THEN
        ALTER TABLE subscription ADD COLUMN activated BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add cart_item_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscription' AND column_name = 'cart_item_id') THEN
        ALTER TABLE subscription ADD COLUMN cart_item_id BIGINT;
    END IF;
END $$;

-- Add missing columns to keycode_user table if they don't exist
DO $$ 
BEGIN
    -- Add subscription_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'keycode_user' AND column_name = 'subscription_id') THEN
        ALTER TABLE keycode_user ADD COLUMN subscription_id BIGINT;
    END IF;
END $$;

-- Add missing columns to transaction table if they don't exist
DO $$ 
BEGIN
    -- Add confirmation_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transaction' AND column_name = 'confirmation_number') THEN
        ALTER TABLE transaction ADD COLUMN confirmation_number VARCHAR(255) DEFAULT 'TXN-' || EXTRACT(EPOCH FROM NOW())::BIGINT;
    END IF;
    
    -- Add transaction_amount column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transaction' AND column_name = 'transaction_amount') THEN
        ALTER TABLE transaction ADD COLUMN transaction_amount DECIMAL(10,2);
    END IF;
END $$;

-- Create cart table if it doesn't exist
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    keycode_user_id BIGINT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    cart_total DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_item table if it doesn't exist
CREATE TABLE IF NOT EXISTS cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT,
    vehicle_id BIGINT,
    subscription_id BIGINT,
    cart_item_final_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create password_reset_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    -- Add foreign key for keycode_user.subscription_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_user_subscription') THEN
        ALTER TABLE keycode_user ADD CONSTRAINT fk_user_subscription 
            FOREIGN KEY (subscription_id) REFERENCES subscription(id) ON DELETE SET NULL;
    END IF;
    
    -- Add foreign key for subscription.cart_item_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_subscription_cart_item') THEN
        ALTER TABLE subscription ADD CONSTRAINT fk_subscription_cart_item 
            FOREIGN KEY (cart_item_id) REFERENCES cart_item(id) ON DELETE SET NULL;
    END IF;
    
    -- Add foreign key for cart_item.vehicle_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_cart_item_vehicle') THEN
        ALTER TABLE cart_item ADD CONSTRAINT fk_cart_item_vehicle 
            FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key for vehicle.transaction_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_vehicle_transaction') THEN
        ALTER TABLE vehicle ADD CONSTRAINT fk_vehicle_transaction 
            FOREIGN KEY (transaction_id) REFERENCES transaction(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
    -- Create indexes for better performance
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_keycode_user_email') THEN
        CREATE INDEX idx_keycode_user_email ON keycode_user(email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vehicle_user_id') THEN
        CREATE INDEX idx_vehicle_user_id ON vehicle(keycode_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscription_user_id') THEN
        CREATE INDEX idx_subscription_user_id ON subscription(keycode_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transaction_user_id') THEN
        CREATE INDEX idx_transaction_user_id ON transaction(keycode_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_make_name') THEN
        CREATE INDEX idx_make_name ON make(name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vehicle_make_id') THEN
        CREATE INDEX idx_vehicle_make_id ON vehicle(make_id);
    END IF;
END $$;
