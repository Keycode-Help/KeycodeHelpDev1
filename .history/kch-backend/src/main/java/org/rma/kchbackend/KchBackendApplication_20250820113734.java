package org.rma.kchbackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KchBackendApplication {

    public static void main(String[] args) {
        // Debug: Print environment variables for troubleshooting
        System.out.println("=== Environment Variables Debug ===");
        System.out.println("DATABASE_URL: " + System.getenv("DATABASE_URL"));
        System.out.println("DATABASE_USERNAME: " + System.getenv("DATABASE_USERNAME"));
        System.out.println("DATABASE_PASSWORD: " + (System.getenv("DATABASE_PASSWORD") != null ? "***SET***" : "NULL"));
        System.out.println("SPRING_PROFILES_ACTIVE: " + System.getenv("SPRING_PROFILES_ACTIVE"));
        System.out.println("BREVO_USERNAME: " + System.getenv("BREVO_USERNAME"));
        System.out.println("BREVO_API_KEY: " + (System.getenv("BREVO_API_KEY") != null ? "***SET***" : "NULL"));
        System.out.println("==================================");
        
        SpringApplication.run(KchBackendApplication.class, args);
    }
}
