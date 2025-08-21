package org.rma.kchbackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class DatabaseUrlFixConfig implements CommandLineRunner {

    private final Environment environment;

    public DatabaseUrlFixConfig(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(String... args) throws Exception {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        
        if (databaseUrl != null && !databaseUrl.startsWith("jdbc:")) {
            String fixedUrl = "jdbc:" + databaseUrl;
            System.out.println("🔧 DatabaseUrlFixConfig - Fixed DATABASE_URL: " + databaseUrl + " -> " + fixedUrl);
            
            // Set as system property
            System.setProperty("spring.datasource.url", fixedUrl);
            
            // Also try to set the environment variable directly
            try {
                java.lang.reflect.Field field = System.getenv().getClass().getDeclaredField("m");
                field.setAccessible(true);
                java.util.Map<String, String> env = (java.util.Map<String, String>) field.get(System.getenv());
                env.put("DATABASE_URL", fixedUrl);
                System.out.println("🔧 DatabaseUrlFixConfig - Updated environment variable");
            } catch (Exception e) {
                System.out.println("🔧 DatabaseUrlFixConfig - Could not update environment variable: " + e.getMessage());
            }
        } else {
            System.out.println("🔧 DatabaseUrlFixConfig - DATABASE_URL already has jdbc: prefix: " + databaseUrl);
        }
        
        // Print all datasource properties for debugging
        System.out.println("🔧 DatabaseUrlFixConfig - spring.datasource.url: " + environment.getProperty("spring.datasource.url"));
        System.out.println("🔧 DatabaseUrlFixConfig - System property spring.datasource.url: " + System.getProperty("spring.datasource.url"));
    }
}
