package org.rma.kchbackend;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "org.rma.kchbackend")
@EnableScheduling
@EntityScan("org.rma.kchbackend.model")
@EnableJpaRepositories("org.rma.kchbackend.repository")
public class KchBackendApplication {

    public static void main(String[] args) {
        // Force load environment variables
        loadEnvironmentVariables();
        
        // Debug: Print environment variables for troubleshooting
        System.out.println("=== Environment Variables Debug ===");
        System.out.println("SPRING_DATASOURCE_URL: " + System.getenv("SPRING_DATASOURCE_URL"));
        System.out.println("SPRING_DATASOURCE_USERNAME: " + System.getenv("SPRING_DATASOURCE_USERNAME"));
        System.out.println("SPRING_DATASOURCE_PASSWORD: " + (System.getenv("SPRING_DATASOURCE_PASSWORD") != null ? "***SET***" : "NULL"));
        System.out.println("SPRING_PROFILES_ACTIVE: " + System.getenv("SPRING_PROFILES_ACTIVE"));
        System.out.println("BREVO_USERNAME: " + System.getenv("BREVO_USERNAME"));
        System.out.println("BREVO_API_KEY: " + (System.getenv("BREVO_API_KEY") != null ? "***SET***" : "NULL"));
        
        // Check if SPRING_DATASOURCE_URL has jdbc: prefix
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl != null) {
            if (dbUrl.startsWith("jdbc:")) {
                System.out.println("✅ SPRING_DATASOURCE_URL has jdbc: prefix");
            } else {
                System.out.println("❌ SPRING_DATASOURCE_URL is missing jdbc: prefix");
                System.out.println("   Current: " + dbUrl);
                System.out.println("   Should be: jdbc:" + dbUrl);
            }
        } else {
            System.out.println("❌ SPRING_DATASOURCE_URL is NULL");
        }
        System.out.println("==================================");
        
        SpringApplication.run(KchBackendApplication.class, args);
    }
    
    private static void loadEnvironmentVariables() {
        // Force load environment variables by setting system properties
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl != null) {
            System.setProperty("spring.datasource.url", dbUrl);
            System.out.println("✅ Set spring.datasource.url: " + dbUrl);
        }
        
        String dbUsername = System.getenv("SPRING_DATASOURCE_USERNAME");
        if (dbUsername != null) {
            System.setProperty("spring.datasource.username", dbUsername);
            System.out.println("✅ Set spring.datasource.username: " + dbUsername);
        }
        
        String dbPassword = System.getenv("SPRING_DATASOURCE_PASSWORD");
        if (dbPassword != null) {
            System.setProperty("spring.datasource.password", dbPassword);
            System.out.println("✅ Set spring.datasource.password: ***SET***");
        }
        
        String profile = System.getenv("SPRING_PROFILES_ACTIVE");
        if (profile != null) {
            System.setProperty("spring.profiles.active", profile);
            System.out.println("✅ Set spring.profiles.active: " + profile);
        }
        
        // Set schema initialization properties
        System.setProperty("spring.sql.init.mode", "always");
        System.setProperty("spring.sql.init.schema-locations", "classpath:schema.sql");
        System.setProperty("spring.sql.init.data-locations", "classpath:data.sql");
        System.setProperty("spring.jpa.defer-datasource-initialization", "true");
        System.out.println("✅ Set schema initialization properties");
        System.out.println("✅ schema.sql location: classpath:schema.sql");
        System.out.println("✅ data.sql location: classpath:data.sql");
    }
}

@Component
class DatabaseInitializer {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @PostConstruct
    @Transactional
    public void initializeDatabase() {
        try {
            System.out.println("🔧 Checking database tables after schema.sql execution...");
            
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
