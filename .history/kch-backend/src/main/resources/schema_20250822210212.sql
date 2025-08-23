-- Database schema updates for KeycodeHelp backend
-- This file will be executed by Spring Boot on startup

-- Only add missing columns if they don't exist
-- This approach is safer and won't break existing deployments

-- Create keycode_user table
CREATE TABLE keycode_user (
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
    subscription_id BIGINT
);

-- Create make table
CREATE TABLE make (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    non_member_price DECIMAL(10,2) NOT NULL,
    member_price DECIMAL(10,2) NOT NULL
);

-- Create subscription table
CREATE TABLE subscription (
    id BIGSERIAL PRIMARY KEY,
    tier VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    activated BOOLEAN DEFAULT FALSE,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    cart_item_id BIGINT
);

-- Create cart table
CREATE TABLE cart (
    id BIGSERIAL PRIMARY KEY,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    cart_total DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_item table
CREATE TABLE cart_item (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES cart(id) ON DELETE CASCADE,
    vehicle_id BIGINT,
    subscription_id BIGINT REFERENCES subscription(id) ON DELETE CASCADE,
    cart_item_final_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicle table
CREATE TABLE vehicle (
    id BIGSERIAL PRIMARY KEY,
    make_id BIGINT REFERENCES make(id) ON DELETE CASCADE,
    model VARCHAR(255),
    year INTEGER,
    vin VARCHAR(255),
    license_plate VARCHAR(255),
    color VARCHAR(255),
    keycode VARCHAR(255),
    keycode_price DECIMAL(10,2),
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
    front_id BYTEA,
    back_id BYTEA,
    registration BYTEA,
    status VARCHAR(255) DEFAULT 'PENDING',
    cart_item_id BIGINT REFERENCES cart_item(id) ON DELETE SET NULL,
    transaction_id BIGINT
);

-- Create transaction table
CREATE TABLE transaction (
    id BIGSERIAL PRIMARY KEY,
    confirmation_number VARCHAR(255) UNIQUE NOT NULL,
    transaction_amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE
);

-- Create password_reset_tokens table
CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints that were deferred
ALTER TABLE keycode_user ADD CONSTRAINT fk_user_subscription 
    FOREIGN KEY (subscription_id) REFERENCES subscription(id) ON DELETE SET NULL;

ALTER TABLE subscription ADD CONSTRAINT fk_subscription_cart_item 
    FOREIGN KEY (cart_item_id) REFERENCES cart_item(id) ON DELETE SET NULL;

ALTER TABLE cart_item ADD CONSTRAINT fk_cart_item_vehicle 
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE;

ALTER TABLE vehicle ADD CONSTRAINT fk_vehicle_transaction 
    FOREIGN KEY (transaction_id) REFERENCES transaction(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_keycode_user_email ON keycode_user(email);
CREATE INDEX idx_vehicle_user_id ON vehicle(keycode_user_id);
CREATE INDEX idx_subscription_user_id ON subscription(keycode_user_id);
CREATE INDEX idx_transaction_user_id ON transaction(keycode_user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX idx_make_name ON make(name);
CREATE INDEX idx_vehicle_make_id ON vehicle(make_id);
CREATE INDEX idx_cart_user_id ON cart(keycode_user_id);
CREATE INDEX idx_cart_item_cart_id ON cart_item(cart_id);
CREATE INDEX idx_cart_item_vehicle_id ON cart_item(vehicle_id);
CREATE INDEX idx_cart_item_subscription_id ON cart_item(subscription_id);
