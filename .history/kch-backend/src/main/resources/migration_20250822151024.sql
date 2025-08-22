-- Migration script to update database structure from old format to new format
-- This runs after data.sql to migrate the existing database

-- Step 1: Add new columns to make table
ALTER TABLE make ADD COLUMN IF NOT EXISTS non_member_price DECIMAL(10,2);
ALTER TABLE make ADD COLUMN IF NOT EXISTS member_price DECIMAL(10,2);

-- Step 2: Update the new columns with calculated values based on current key_code_price
-- For now, set non_member_price = key_code_price and member_price = key_code_price - 15
UPDATE make SET 
    non_member_price = key_code_price,
    member_price = key_code_price - 15.00
WHERE non_member_price IS NULL OR member_price IS NULL;

-- Step 3: Make the new columns NOT NULL after populating them
ALTER TABLE make ALTER COLUMN non_member_price SET NOT NULL;
ALTER TABLE make ALTER COLUMN member_price SET NOT NULL;

-- Step 4: Rename manufacturer_name to name
ALTER TABLE make RENAME COLUMN manufacturer_name TO name;

-- Step 5: Drop the old key_code_price column
ALTER TABLE make DROP COLUMN IF EXISTS key_code_price;

-- Step 6: Add missing columns to vehicle table
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS make_id BIGINT;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS keycode_price DECIMAL(10,2);
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS registration BYTEA;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS cart_item_id BIGINT;
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS transaction_id BIGINT;

-- Step 7: Update vehicle.make_id based on the make name
UPDATE vehicle SET make_id = m.id 
FROM make m 
WHERE vehicle.make = m.name;

-- Step 8: Drop the old make column from vehicle table
ALTER TABLE vehicle DROP COLUMN IF EXISTS make;

-- Step 9: Add foreign key constraints
ALTER TABLE vehicle ADD CONSTRAINT IF NOT EXISTS fk_vehicle_make 
    FOREIGN KEY (make_id) REFERENCES make(id) ON DELETE CASCADE;

-- Step 10: Add missing columns to other tables
ALTER TABLE keycode_user ADD COLUMN IF NOT EXISTS subscription_id BIGINT;
ALTER TABLE subscription ADD COLUMN IF NOT EXISTS activated BOOLEAN DEFAULT FALSE;
ALTER TABLE subscription ADD COLUMN IF NOT EXISTS cart_item_id BIGINT;
ALTER TABLE cart ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE cart ADD COLUMN IF NOT EXISTS cart_total DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE cart ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE cart ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE cart_item ADD COLUMN IF NOT EXISTS cart_item_final_price DECIMAL(10,2);
ALTER TABLE cart_item ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE transaction ADD COLUMN IF NOT EXISTS confirmation_number VARCHAR(255);
ALTER TABLE transaction ADD COLUMN IF NOT EXISTS transaction_amount DECIMAL(10,2);

-- Step 11: Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    cart_total DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES cart(id) ON DELETE CASCADE,
    vehicle_id BIGINT REFERENCES vehicle(id) ON DELETE CASCADE,
    subscription_id BIGINT REFERENCES subscription(id) ON DELETE CASCADE,
    cart_item_final_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 12: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_make_name ON make(name);
CREATE INDEX IF NOT EXISTS idx_vehicle_make_id ON vehicle(make_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(keycode_user_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id ON cart_item(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_vehicle_id ON cart_item(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_subscription_id ON cart_item(subscription_id);
