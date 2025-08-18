-- Migration: Normalize vehicle_info and link from keycode_requests via FK
-- This migration creates a dedicated vehicle_info table and links it to keycode_requests

CREATE TABLE vehicle_info (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vin VARCHAR(17) NOT NULL,
  year SMALLINT,
  make VARCHAR(64),
  model VARCHAR(64),
  trim VARCHAR(64),
  engine VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_vehicle_info_vin (vin)
);

-- Add vehicle_info_id column to keycode_requests table
ALTER TABLE keycode_requests
  ADD COLUMN vehicle_info_id BIGINT NULL,
  ADD CONSTRAINT fk_kcr_vehicle
    FOREIGN KEY (vehicle_info_id) REFERENCES vehicle_info(id);

-- Create index for better performance
CREATE INDEX idx_keycode_requests_vehicle_info ON keycode_requests(vehicle_info_id);
