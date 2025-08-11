-- Keycode Help Database Setup Script
-- Run this in your MySQL terminal

-- 1. Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS kchdb;

-- 2. Switch to the database
USE kchdb;

-- 3. Show current tables (should be empty initially)
SHOW TABLES;

-- 4. Check database status
SELECT 
    SCHEMA_NAME as 'Database',
    DEFAULT_CHARACTER_SET_NAME as 'Charset',
    DEFAULT_COLLATION_NAME as 'Collation'
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'kchdb';

-- 5. Verify we're in the right database
SELECT DATABASE() as 'Current Database';
