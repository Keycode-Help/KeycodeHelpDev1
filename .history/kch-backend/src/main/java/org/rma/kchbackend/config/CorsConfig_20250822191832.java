package org.rma.kchbackend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    @Primary
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        // Allow both localhost and production domains
        c.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "https://keycode-help-dev1.vercel.app",
            "https://keycode-help-dev1-mrguru2024s-projects.vercel.app",
            "https://keycode.help",
            "https://www.keycode.help"
        ));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("*"));
        c.setAllowCredentials(true);
        c.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }

    @Bean
    @Profile("dev")
    public CorsConfigurationSource devCors() {
        return corsConfigurationSource();
    }

    @Bean
    @Profile("prod")
    public CorsConfigurationSource prodCors(
        @Value("${app.cors.allowed-origins:}") List<String> origins) {
        // For production, just use the primary CORS configuration
        return corsConfigurationSource();
    }

}