package org.rma.kchbackend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class EnvironmentConfig {

    @Bean
    @Profile("!prod")
    public Dotenv dotenv() {
        return Dotenv.configure()
                .directory("./")
                .filename(".env")
                .ignoreIfMissing()
                .load();
    }

    @Bean
    @Profile("prod")
    public Dotenv dotenvProduction() {
        return Dotenv.configure()
                .directory("./")
                .filename(".env.production")
                .load();
    }
}
