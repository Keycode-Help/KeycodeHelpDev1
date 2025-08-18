-- Keycode Help Database Setup Script
-- Run this in your MySQL terminal

-- 1. Create the database if it doesn't exist (expected by Spring config)
CREATE DATABASE IF NOT EXISTS keycodehelpdb CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- 2. Switch to the database
USE keycodehelpdb;

-- 3. Show current tables (should be empty initially)
SHOW TABLES;

-- 4. Check database status
SELECT 
    SCHEMA_NAME as 'Database',
    DEFAULT_CHARACTER_SET_NAME as 'Charset',
    DEFAULT_COLLATION_NAME as 'Collation'
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'keycodehelpdb';

-- 5. Verify we're in the right database
SELECT DATABASE() as 'Current Database';

-- Compliance tables
CREATE TABLE IF NOT EXISTS user_licenses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  state VARCHAR(64) NOT NULL,
  license_number VARCHAR(128) NOT NULL,
  expires_on DATE NULL,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  INDEX idx_user_state_active (user_id, state, active)
);

CREATE TABLE IF NOT EXISTS user_documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  doc_type VARCHAR(64) NOT NULL,
  storage_key VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  INDEX idx_user_doc_verified (user_id, doc_type, verified)
);
