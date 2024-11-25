package org.rma.kchbackend.config;

import com.sendgrid.SendGrid;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SendGridConfig {

    @Bean
    public SendGrid sendGrid() {
        String apiKey = System.getenv("SENDGRID_API_KEY");
        if (apiKey == null) {
            throw new RuntimeException("SENDGRID_API_KEY not found in environment variables.");
        }
        return new SendGrid(apiKey);
    }
}