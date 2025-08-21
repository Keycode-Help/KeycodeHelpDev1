package org.rma.kchbackend.config;

import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DatabaseInitializer {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @PostConstruct
    @Transactional
    public void initializeDatabase() {
        try {
            System.out.println("🔧 DatabaseInitializer: Component loaded and starting database initialization...");
            System.out.println("🔧 DatabaseInitializer: @PostConstruct method is executing!");
            
            // Check if tables were created by schema.sql
            try {
                entityManager.createNativeQuery("SELECT COUNT(*) FROM keycode_user").getResultList();
                System.out.println("✅ keycode_user table exists (created by schema.sql)");
            } catch (Exception e) {
                System.out.println("❌ keycode_user table still doesn't exist - trying manual creation");
                createTablesManually();
            }
            
            try {
                entityManager.createNativeQuery("SELECT COUNT(*) FROM vehicle").getResultList();
                System.out.println("✅ vehicle table exists (created by schema.sql)");
            } catch (Exception e) {
                System.out.println("❌ vehicle table still doesn't exist - trying manual creation");
                createTablesManually();
            }
            
            try {
                entityManager.createNativeQuery("SELECT COUNT(*) FROM password_reset_tokens").getResultList();
                System.out.println("✅ password_reset_tokens table exists (created by schema.sql)");
            } catch (Exception e) {
                System.out.println("❌ password_reset_tokens table still doesn't exist - trying manual creation");
                createTablesManually();
            }
            
        } catch (Exception e) {
            System.err.println("❌ Database initialization check failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void createTablesManually() {
        try {
            System.out.println("🔧 Creating tables manually since schema.sql failed...");
            
            // Create keycode_user table
            entityManager.createNativeQuery("""
                CREATE TABLE IF NOT EXISTS keycode_user (
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
                    user_type VARCHAR(31) DEFAULT 'KeycodeUser'
                )
            """).executeUpdate();
            System.out.println("✅ Created keycode_user table manually");
            
            // Create vehicle table
            entityManager.createNativeQuery("""
                CREATE TABLE IF NOT EXISTS vehicle (
                    id BIGSERIAL PRIMARY KEY,
                    make VARCHAR(255),
                    model VARCHAR(255),
                    year INTEGER,
                    vin VARCHAR(255),
                    license_plate VARCHAR(255),
                    color VARCHAR(255),
                    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE,
                    front_id BYTEA,
                    back_id BYTEA
                )
            """).executeUpdate();
            System.out.println("✅ Created vehicle table manually");
            
            // Create subscription table
            entityManager.createNativeQuery("""
                CREATE TABLE IF NOT EXISTS subscription (
                    id BIGSERIAL PRIMARY KEY,
                    tier VARCHAR(50),
                    start_date TIMESTAMP,
                    end_date TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE,
                    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE
                )
            """).executeUpdate();
            System.out.println("✅ Created subscription table manually");
            
            // Create transaction table
            entityManager.createNativeQuery("""
                CREATE TABLE IF NOT EXISTS transaction (
                    id BIGSERIAL PRIMARY KEY,
                    amount DECIMAL(10,2),
                    status VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    keycode_user_id BIGINT REFERENCES keycode_user(id) ON DELETE CASCADE
                )
            """).executeUpdate();
            System.out.println("✅ Created transaction table manually");
            
            System.out.println("✅ All tables created manually!");
            
        } catch (Exception e) {
            System.err.println("❌ Manual table creation failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
