-- Check existing database structure
-- Run this in your MySQL terminal

-- 1. Switch to the existing database
USE keycodehelpdb;

-- 2. Show all tables
SHOW TABLES;

-- 3. Check table structures (if any exist)
-- This will show you what tables are already there
SHOW TABLES LIKE '%user%';
SHOW TABLES LIKE '%keycode%';
SHOW TABLES LIKE '%cart%';

-- 4. Show database info
SELECT DATABASE() as 'Current Database';
