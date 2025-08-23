-- Safe database schema updates for KeycodeHelp backend
-- This file will be executed by Spring Boot on startup

-- Only add missing columns if they don't exist
-- This approach is safer and won't break existing deployments

-- Add missing columns to make table
ALTER TABLE make ADD COLUMN IF NOT EXISTS non_member_price DECIMAL(10,2) DEFAULT 60.00;
ALTER TABLE make ADD COLUMN IF NOT EXISTS member_price DECIMAL(10,2) DEFAULT 45.00;

-- Add missing columns to vehicle table
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS keycode VARCHAR(255);
ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS status VARCHAR(255) DEFAULT 'PENDING';
