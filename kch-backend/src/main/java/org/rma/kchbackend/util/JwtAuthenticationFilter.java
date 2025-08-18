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
        String username = null;
        String jwt = null;

        // Debug logging
        System.out.println("JWT Filter - Request URI: " + request.getRequestURI());
        System.out.println("JWT Filter - Request Method: " + request.getMethod());

        // First try to get JWT from Authorization header
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            System.out.println("JWT Filter - Found JWT in Authorization header");
        } else {
            // If no Authorization header, try to get JWT from cookies
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("access_token".equals(cookie.getName())) {
                        jwt = cookie.getValue();
                        System.out.println("JWT Filter - Found JWT in cookie: " + cookie.getName());
                        break;
                    }
                }
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
            }
        }
        chain.doFilter(request, response);
    }

}
