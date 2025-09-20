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
        // Allow specific origins for production and development
        c.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "https://*.vercel.app",
            "https://keycode.help",
            "https://www.keycode.help",
            "https://keycode-help-dev1.vercel.app",
            "https://keycode-help-dev1-mrguru2024s-projects.vercel.app"
        ));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        c.setAllowedHeaders(List.of("*")); // Allow all headers for better compatibility
        c.setAllowCredentials(true);
        c.setExposedHeaders(List.of("Authorization", "Set-Cookie", "Content-Type"));
        c.setMaxAge(3600L); // Cache preflight response for 1 hour
        
        System.out.println("🔧 CORS Configuration loaded for origins: " + c.getAllowedOriginPatterns());
        
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
        CorsConfiguration c = new CorsConfiguration();
        
        // Use the origins from environment variable if provided, otherwise use default list
        if (origins != null && !origins.isEmpty()) {
            c.setAllowedOrigins(origins);
        } else {
            // Fallback to default origins
            c.setAllowedOrigins(List.of(
                "https://keycode.help",
                "https://www.keycode.help",
                "https://keycode-help-dev1.vercel.app"
            ));
        }
        
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("*")); // Allow all headers for better compatibility
        c.setAllowCredentials(true);
        c.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
        c.setMaxAge(3600L); // Cache preflight response for 1 hour
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }

}