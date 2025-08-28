-- Create admin_registration_code table for storing admin registration codes
CREATE TABLE IF NOT EXISTS admin_registration_code (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP,
    used_by_email VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_registration_code_email ON admin_registration_code(email);
CREATE INDEX IF NOT EXISTS idx_admin_registration_code_code ON admin_registration_code(code);
CREATE INDEX IF NOT EXISTS idx_admin_registration_code_expiry ON admin_registration_code(expiry_time);
CREATE INDEX IF NOT EXISTS idx_admin_registration_code_used ON admin_registration_code(is_used);

-- Add comment to table
COMMENT ON TABLE admin_registration_code IS 'Stores admin registration codes for new admin signups';
COMMENT ON COLUMN admin_registration_code.code IS '8-character unique registration code';
COMMENT ON COLUMN admin_registration_code.email IS 'Email address the code was sent to';
COMMENT ON COLUMN admin_registration_code.applicant_name IS 'Full name of the applicant';
COMMENT ON COLUMN admin_registration_code.expiry_time IS 'When the code expires (24 hours from creation)';
COMMENT ON COLUMN admin_registration_code.is_used IS 'Whether the code has been used for registration';
COMMENT ON COLUMN admin_registration_code.used_at IS 'When the code was used';
COMMENT ON COLUMN admin_registration_code.used_by_email IS 'Email of the user who used the code';
