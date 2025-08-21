package org.rma.kchbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME:}")
    private String databaseUsername;

    @Value("${DATABASE_PASSWORD:}")
    private String databasePassword;

    @Bean
    @Primary
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        
        // Fix JDBC URL if missing jdbc: prefix
        if (databaseUrl != null && !databaseUrl.startsWith("jdbc:")) {
            String fixedUrl = "jdbc:" + databaseUrl;
            System.out.println("🔧 Fixed DATABASE_URL: " + databaseUrl + " -> " + fixedUrl);
            properties.setUrl(fixedUrl);
        } else {
            System.out.println("🔧 Using DATABASE_URL: " + databaseUrl);
            properties.setUrl(databaseUrl);
        }
        
        // Set username and password
        properties.setUsername(databaseUsername);
        properties.setPassword(databasePassword);
        
        // Set driver class
        properties.setDriverClassName("org.postgresql.Driver");
        
        System.out.println("🔧 DatabaseConfig - URL: " + properties.getUrl());
        System.out.println("🔧 DatabaseConfig - Username: " + properties.getUsername());
        System.out.println("🔧 DatabaseConfig - Password: " + (properties.getPassword() != null ? "***SET***" : "NULL"));
        
        return properties;
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
