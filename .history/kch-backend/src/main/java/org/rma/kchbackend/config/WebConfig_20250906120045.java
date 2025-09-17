package org.rma.kchbackend.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {
    // CORS configuration is handled by CorsConfig.java
    // This prevents conflicts between WebMvcConfigurer and CorsConfigurationSource approaches
}
