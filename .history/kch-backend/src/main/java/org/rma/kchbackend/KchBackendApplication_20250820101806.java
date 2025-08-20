package org.rma.kchbackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class KchBackendApplication {

    public static void main(String[] args) {
        // Load environment variables from .env file
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // Set environment variables to be used by Spring (only if they exist)
        String sendgridApiKey = dotenv.get("SENDGRID_API_KEY");
        if (sendgridApiKey != null) {
            System.setProperty("SENDGRID_API_KEY", sendgridApiKey);
        }
        
        String mysqlPassword = dotenv.get("MYSQL_PASSWORD");
        if (mysqlPassword != null) {
            System.setProperty("MYSQL_PASSWORD", mysqlPassword);
        }

        // Optional: Spring profile from .env (e.g., prod)
        String springProfile = dotenv.get("SPRING_PROFILES_ACTIVE");
        if (springProfile != null && System.getProperty("spring.profiles.active") == null) {
            System.setProperty("spring.profiles.active", springProfile);
        }

        // Optional: Brevo SMTP credentials from .env
        String brevoUser = dotenv.get("BREVO_USERNAME");
        if (brevoUser != null) {
            System.setProperty("BREVO_USERNAME", brevoUser);
        }
        String brevoKey = dotenv.get("BREVO_API_KEY");
        if (brevoKey != null) {
            System.setProperty("BREVO_API_KEY", brevoKey);
        }

        SpringApplication.run(KchBackendApplication.class, args);
    }
}
