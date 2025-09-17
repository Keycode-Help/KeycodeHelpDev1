package org.rma.kchbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS configuration is handled by CorsConfig.java
    // This prevents conflicts between WebMvcConfigurer and CorsConfigurationSource approaches
}
