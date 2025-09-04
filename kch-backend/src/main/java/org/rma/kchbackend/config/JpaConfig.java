package org.rma.kchbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "org.rma.kchbackend.repository")
@EnableTransactionManagement
public class JpaConfig {
    // This configuration class ensures proper JPA setup
}
