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
            System.out.println("🔧 Force initializing database tables...");
            
            // Force Hibernate to create tables by executing a simple query
            entityManager.createNativeQuery("SELECT 1").getResultList();
            System.out.println("✅ Database connection successful");
            
            // Force table creation by checking if they exist
            try {
                entityManager.createNativeQuery("SELECT COUNT(*) FROM keycode_user").getResultList();
                System.out.println("✅ keycode_user table exists");
            } catch (Exception e) {
                System.out.println("❌ keycode_user table does not exist - Hibernate should create it");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Database initialization failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
