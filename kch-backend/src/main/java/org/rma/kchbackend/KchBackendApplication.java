package org.rma.kchbackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KchBackendApplication {

    public static void main(String[] args) {
        // Load environment variables from .env file
        Dotenv dotenv = Dotenv.configure().load();

        // Set environment variables to be used by Spring (only if they exist)
        String sendgridApiKey = dotenv.get("SENDGRID_API_KEY");
        if (sendgridApiKey != null) {
            System.setProperty("SENDGRID_API_KEY", sendgridApiKey);
        }
        
        String mysqlPassword = dotenv.get("MYSQL_PASSWORD");
        if (mysqlPassword != null) {
            System.setProperty("MYSQL_PASSWORD", mysqlPassword);
        }

        SpringApplication.run(KchBackendApplication.class, args);
    }
}
