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

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        
        // Fix JDBC URL if missing jdbc: prefix
        if (databaseUrl != null && !databaseUrl.startsWith("jdbc:")) {
            String fixedUrl = "jdbc:" + databaseUrl;
            System.out.println("🔧 Fixed DATABASE_URL: " + databaseUrl + " -> " + fixedUrl);
            properties.setUrl(fixedUrl);
        } else {
            properties.setUrl(databaseUrl);
        }
        
        return properties;
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
