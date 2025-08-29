package org.rma.kchbackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication(scanBasePackages = "org.rma.kchbackend")
@EnableScheduling
@EntityScan("org.rma.kchbackend.model")
@EnableJpaRepositories("org.rma.kchbackend.repository")
public class KchBackendApplication {

    public static void main(String[] args) {
        // Try to load .env file, but don't fail if it's not available
        Dotenv dotenv = null;
        try {
            dotenv = Dotenv.load();
            System.out.println("✅ .env file loaded successfully");
        } catch (Exception e) {
            System.out.println("⚠️  .env file not found, using system environment variables");
            System.out.println("   This is normal when running on Render or other cloud platforms");
        }
        
        // Force load environment variables
        loadEnvironmentVariables(dotenv);
        
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
    
    private static void loadEnvironmentVariables(Dotenv dotenv) {
        // Force load environment variables by setting system properties
        // If dotenv is null (no .env file), use system environment variables instead
        
        String dbUrl = getValue("SPRING_DATASOURCE_URL", dotenv);
        if (dbUrl != null) {
            System.setProperty("spring.datasource.url", dbUrl);
            System.out.println("✅ Set spring.datasource.url: " + dbUrl);
        }
        
        String dbUsername = getValue("SPRING_DATASOURCE_USERNAME", dotenv);
        if (dbUsername != null) {
            System.setProperty("spring.datasource.username", dbUsername);
            System.out.println("✅ Set spring.datasource.username: " + dbUsername);
        }
        
        String dbPassword = getValue("SPRING_DATASOURCE_PASSWORD", dotenv);
        if (dbPassword != null) {
            System.setProperty("spring.datasource.password", dbPassword);
            System.out.println("✅ Set spring.datasource.password: ***SET***");
        }
        
        String profile = getValue("SPRING_PROFILES_ACTIVE", dotenv);
        if (profile != null) {
            System.setProperty("spring.profiles.active", profile);
            System.out.println("✅ Set spring.profiles.active: " + profile);
        }
        
        // Set Brevo email configuration
        String brevoUsername = getValue("BREVO_USERNAME", dotenv);
        if (brevoUsername != null) {
            System.setProperty("BREVO_USERNAME", brevoUsername);
            System.out.println("✅ Set BREVO_USERNAME: " + brevoUsername);
        }
        
        String brevoApiKey = getValue("BREVO_API_KEY", dotenv);
        if (brevoApiKey != null) {
            System.setProperty("BREVO_API_KEY", brevoApiKey);
            System.out.println("✅ Set BREVO_API_KEY: ***SET***");
        }
        
        // Set JWT configuration
        String jwtSecret = getValue("JWT_SECRET", dotenv);
        if (jwtSecret != null) {
            System.setProperty("JWT_SECRET", jwtSecret);
            System.out.println("✅ Set JWT_SECRET: ***SET***");
        }
        
        String jwtExpiration = getValue("JWT_EXPIRATION", dotenv);
        if (jwtExpiration != null) {
            System.setProperty("JWT_EXPIRATION", jwtExpiration);
            System.out.println("✅ Set JWT_EXPIRATION: " + jwtExpiration);
        }
        
        // Set Stripe configuration
        String stripeSecretKey = getValue("STRIPE_SECRET_KEY", dotenv);
        if (stripeSecretKey != null) {
            System.setProperty("STRIPE_SECRET_KEY", stripeSecretKey);
            System.out.println("✅ Set STRIPE_SECRET_KEY: ***SET***");
        }
        
        String stripeWebhookSecret = getValue("STRIPE_WEBHOOK_SECRET", dotenv);
        if (stripeWebhookSecret != null) {
            System.setProperty("STRIPE_WEBHOOK_SECRET", stripeWebhookSecret);
            System.out.println("✅ Set STRIPE_WEBHOOK_SECRET: ***SET***");
        }
        
        // Set OEM credentials for KeycodeService
        String[] oems = {"ACURA", "FCA", "FORD", "GM", "GENESIS", "HONDA", "HYUNDAI", "INFINITI", "KIA", "LEXUS", "NISSAN", "TOYOTA", "VOLVO"};
        
        for (String oem : oems) {
            String userKey = "KCH_" + oem + "_USER";
            String passKey = "KCH_" + oem + "_PASS";
            
            String userValue = getValue(userKey, dotenv);
            String passValue = getValue(passKey, dotenv);
            
            if (userValue != null) {
                System.setProperty(userKey, userValue);
                System.out.println("✅ Set " + userKey + ": " + userValue);
            }
            
            if (passValue != null) {
                System.setProperty(passKey, passValue);
                System.out.println("✅ Set " + passKey + ": ***SET***");
            }
        }
        
        // Temporarily disable schema initialization to get backend running
        // System.setProperty("spring.sql.init.mode", "always");
        // System.setProperty("spring.sql.init.schema-locations", "classpath:schema.sql");
        // Temporarily disable data loading until schema is stable
        // System.setProperty("spring.sql.init.data-locations", "classpath:data.sql");
        // System.setProperty("spring.jpa.defer-datasource-initialization", "true");
        System.out.println("⚠️  Schema initialization temporarily disabled");
        System.out.println("⚠️  schema.sql will need to be applied manually");
        System.out.println("⚠️  data.sql loading temporarily disabled");
    }
    
    /**
     * Helper method to get a value from either dotenv or system environment
     * @param key The environment variable key
     * @param dotenv The dotenv instance (can be null)
     * @return The value from dotenv if available, otherwise from system environment
     */
    private static String getValue(String key, Dotenv dotenv) {
        if (dotenv != null) {
            String value = dotenv.get(key);
            if (value != null) {
                return value;
            }
        }
        // Fall back to system environment variable
        return System.getenv(key);
    }
}
