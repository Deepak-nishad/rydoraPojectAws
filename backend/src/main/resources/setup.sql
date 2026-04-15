-- =============================================
-- RYDORA DATABASE SETUP SCRIPT
-- Run this in MySQL before starting the project
-- =============================================

-- Step 1: Create database
CREATE DATABASE IF NOT EXISTS rydora_db;
USE rydora_db;

-- Step 2: After running the Spring Boot project once,
-- tables will be auto created by JPA.
-- Then run this to insert admin user:

-- Admin password is: admin123
-- BCrypt hash of admin123:
INSERT INTO users (
    name,
    email,
    password,
    phone,
    address,
    vehicle_number,
    vehicle_type,
    role,
    created_at
) VALUES (
    'Admin',
    'admin@rydora.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkCfOJyoqKe',
    '9999999999',
    'Pune',
    NULL,
    NULL,
    'ADMIN',
    NOW()
);

-- =============================================
-- ADMIN LOGIN CREDENTIALS
-- Email   : admin@rydora.com
-- Password: admin123
-- =============================================
