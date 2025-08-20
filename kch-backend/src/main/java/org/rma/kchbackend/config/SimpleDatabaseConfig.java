package org.rma.kchbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class SimpleDatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @PostConstruct
    public void fixDatabaseUrl() {
        if (databaseUrl != null && !databaseUrl.startsWith("jdbc:")) {
            String fixedUrl = "jdbc:" + databaseUrl;
            System.out.println("🔧 Fixed DATABASE_URL: " + databaseUrl + " -> " + fixedUrl);
            System.setProperty("spring.datasource.url", fixedUrl);
        } else {
            System.out.println("🔧 DATABASE_URL already has jdbc: prefix: " + databaseUrl);
        }
    }
}
