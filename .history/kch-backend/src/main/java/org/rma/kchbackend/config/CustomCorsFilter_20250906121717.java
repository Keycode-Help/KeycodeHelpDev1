package org.rma.kchbackend.config;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CustomCorsFilter extends OncePerRequestFilter {

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://keycode-help-dev1.vercel.app",
        "https://keycode-help-dev1-mrguru2024s-projects.vercel.app",
        "https://keycode.help",
        "https://www.keycode.help"
    );

    private static final List<String> ALLOWED_METHODS = Arrays.asList(
        "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
    );

    private static final List<String> ALLOWED_HEADERS = Arrays.asList(
        "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin",
        "Access-Control-Request-Method", "Access-Control-Request-Headers"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String origin = request.getHeader(HttpHeaders.ORIGIN);
        
        // Allow requests from allowed origins
        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }
        
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", String.join(", ", ALLOWED_METHODS));
        response.setHeader("Access-Control-Allow-Headers", String.join(", ", ALLOWED_HEADERS));
        response.setHeader("Access-Control-Expose-Headers", "Authorization, Set-Cookie");
        response.setHeader("Access-Control-Max-Age", "3600");

        // Handle preflight requests
        if (HttpMethod.OPTIONS.name().equals(request.getMethod())) {
            response.setStatus(HttpStatus.OK.value());
            return;
        }

        filterChain.doFilter(request, response);
    }
}
