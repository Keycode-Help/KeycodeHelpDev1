package org.rma.kchbackend.util;

import org.rma.kchbackend.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String requestMethod = request.getMethod();
        
        // Debug logging
        System.out.println("JWT Filter - Request URI: " + requestURI);
        System.out.println("JWT Filter - Request Method: " + requestMethod);

        // Skip JWT processing for public endpoints
        if (isPublicEndpoint(requestURI, requestMethod)) {
            System.out.println("JWT Filter - Skipping JWT processing for public endpoint: " + requestURI);
            chain.doFilter(request, response);
            return;
        }
        
        System.out.println("JWT Filter - Processing protected endpoint: " + requestURI);

        String username = null;
        String jwt = null;

        // First try to get JWT from Authorization header
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            System.out.println("JWT Filter - Found JWT in Authorization header");
        } else {
            // If no Authorization header, try to get JWT from cookies
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                System.out.println("JWT Filter - Cookies found: " + cookies.length);
                for (Cookie cookie : cookies) {
                    System.out.println("JWT Filter - Cookie: " + cookie.getName() + " = " + 
                        (cookie.getName().contains("token") ? "[TOKEN_VALUE]" : cookie.getValue()));
                }
                for (Cookie cookie : cookies) {
                    if ("access_token".equals(cookie.getName())) {
                        jwt = cookie.getValue();
                        System.out.println("JWT Filter - Found JWT in cookie: " + cookie.getName());
                        break;
                    }
                }
            } else {
                System.out.println("JWT Filter - No cookies found in request");
            }
            if (jwt == null) {
                System.out.println("JWT Filter - No JWT found in headers or cookies");
            }
        }

        if (jwt != null) {
            // Check if JWT is well-formed
            if (!jwt.contains(".")) {
                System.out.println("JWT Filter - Invalid JWT format");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid JWT format.");
                return;
            }

            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("JWT Filter - Extracted username: " + username);
            } catch (Exception e) {
                System.out.println("JWT Filter - Error extracting username: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                    System.out.println("JWT Filter - Authentication successful for user: " + username);
                } else {
                    System.out.println("JWT Filter - Token validation failed for user: " + username);
                }
            } catch (Exception e) {
                System.out.println("JWT Filter - Error during authentication: " + e.getMessage());
                e.printStackTrace();
            }
        } else if (jwt != null && username == null) {
            System.out.println("JWT Filter - JWT token found but could not extract username");
        } else if (jwt == null) {
            System.out.println("JWT Filter - No JWT token found in request");
        }
        chain.doFilter(request, response);
    }

    /**
     * Check if the endpoint is public and should skip JWT processing
     */
    private boolean isPublicEndpoint(String requestURI, String requestMethod) {
        // Public endpoints that don't require JWT
        if (requestURI.equals("/") ||  // Only the root path, not all paths starting with /
            requestURI.startsWith("/auth/login") || 
            requestURI.startsWith("/auth/register") || 
            requestURI.startsWith("/auth/admin-register") ||
            requestURI.startsWith("/auth/refresh") ||
            requestURI.startsWith("/auth/reset-password") ||
            requestURI.startsWith("/auth/dev-") ||  // Allow dev endpoints
            requestURI.startsWith("/auth/setup-super-admin") ||
            requestURI.startsWith("/actuator/health") ||
            requestURI.startsWith("/css/") ||
            requestURI.startsWith("/js/") ||
            requestURI.startsWith("/images/") ||
            requestURI.startsWith("/makes/") ||
            requestURI.startsWith("/compliance/status") ||
            requestURI.startsWith("/cart/items/public") ||
            requestURI.startsWith("/api/payments/create-checkout-session") ||
            requestURI.startsWith("/api/kch/")) {  // Allow public access to transponder database endpoints
            return true;
        }
        
        // OPTIONS requests (CORS preflight)
        if ("OPTIONS".equals(requestMethod)) {
            return true;
        }
        
        return false;
    }
}
