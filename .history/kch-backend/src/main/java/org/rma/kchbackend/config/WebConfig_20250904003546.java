package org.rma.kchbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "https://keycode-help-dev1.vercel.app",
                    "https://keycode-help-dev1-mrguru2024s-projects.vercel.app",
                    "https://keycode.help",
                    "https://www.keycode.help"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .exposedHeaders("Authorization", "Set-Cookie");
    }
}
