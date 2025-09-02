package org.rma.kchbackend.util;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final String SECRET_KEY;
    private final Key key;

    public JwtUtil() {
        // Use environment variable for JWT secret, fallback to default for development
        this.SECRET_KEY = System.getenv("JWT_SECRET") != null ? 
            System.getenv("JWT_SECRET") : 
            "your-secret-key-with-at-least-256-bits-for-development-only";
        
        // Ensure the secret key is at least 256 bits (32 characters)
        if (this.SECRET_KEY.length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters long");
        }
        
        this.key = Keys.hmacShaKeyFor(this.SECRET_KEY.getBytes());
        
        System.out.println("🔑 JWT Util initialized with secret length: " + this.SECRET_KEY.length());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.resolve(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            boolean isValid = (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
            System.out.println("🔍 JWT validation for user " + username + ": " + isValid);
            return isValid;
        } catch (Exception e) {
            System.out.println("❌ JWT validation failed: " + e.getMessage());
            return false;
        }
    }

    public boolean validateToken(String token) {
        try {
            boolean isValid = !isTokenExpired(token);
            System.out.println("🔍 JWT token validation: " + isValid);
            return isValid;
        } catch (Exception e) {
            System.out.println("❌ JWT token validation failed: " + e.getMessage());
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return extractUsername(token);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createRefreshToken(claims, userDetails.getUsername());
    }

    private String createRefreshToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    @FunctionalInterface
    public interface ClaimsResolver<T> {
        T resolve(Claims claims);
    }
}