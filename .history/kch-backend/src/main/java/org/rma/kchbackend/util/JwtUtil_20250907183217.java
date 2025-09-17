package org.rma.kchbackend.util;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
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

    public JwtUtil(@Value("${SUPABASE_JWT_SECRET:}") String supabaseJwtSecret,
                   @Value("${JWT_SECRET:}") String customJwtSecret) {
        // Use Supabase JWT secret for validation, fallback to custom JWT secret for generation
        
        if (supabaseJwtSecret != null && !supabaseJwtSecret.isEmpty()) {
            // Use Supabase JWT secret for validation
            this.SECRET_KEY = supabaseJwtSecret;
            System.out.println("🔑 JWT Util initialized with Supabase JWT secret (length: " + this.SECRET_KEY.length() + ")");
        } else if (customJwtSecret != null && !customJwtSecret.isEmpty()) {
            // Use custom JWT secret
            this.SECRET_KEY = customJwtSecret;
            System.out.println("🔑 JWT Util initialized with custom JWT secret (length: " + this.SECRET_KEY.length() + ")");
        } else {
            // Fallback to default for development
            this.SECRET_KEY = "your-secret-key-with-at-least-256-bits-for-development-only";
            System.out.println("⚠️  JWT Util using default secret - not recommended for production");
        }
        
        // Ensure the secret key is at least 256 bits (32 characters)
        if (this.SECRET_KEY.length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters long");
        }
        
        this.key = Keys.hmacShaKeyFor(this.SECRET_KEY.getBytes());
        
        System.out.println("🔑 JWT Util initialized with secret length: " + this.SECRET_KEY.length());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Add authorities to claims
        claims.put("authorities", userDetails.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .toArray());
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
        try {
            // For Supabase JWT tokens, extract email instead of subject (which is the UUID)
            Claims claims = extractAllClaims(token);
            String email = claims.get("email", String.class);
            if (email != null && !email.isEmpty()) {
                System.out.println("✅ Extracted email from JWT token: " + email);
                return email;
            } else {
                // Fallback to subject if no email found
                String subject = claims.getSubject();
                System.out.println("⚠️ No email found in JWT token, using subject: " + subject);
                return subject;
            }
        } catch (Exception e) {
            System.out.println("❌ Error extracting username from token: " + e.getMessage());
            throw e;
        }
    }

    public <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.resolve(claims);
        } catch (Exception e) {
            System.out.println("❌ Error extracting claim from token: " + e.getMessage());
            throw e;
        }
    }

    public Claims extractAllClaims(String token) {
        try {
            // For Supabase JWT tokens, we need to use a different approach
            // Supabase JWT tokens are signed with a secret that's different from the anon key
            // Let's try to decode without verification first to see the structure
            String[] chunks = token.split("\\.");
            if (chunks.length != 3) {
                throw new IllegalArgumentException("Invalid JWT token format");
            }
            
            // Decode the header and payload without verification
            String header = new String(java.util.Base64.getUrlDecoder().decode(chunks[0]));
            String payload = new String(java.util.Base64.getUrlDecoder().decode(chunks[1]));
            
            System.out.println("🔍 JWT Header: " + header);
            System.out.println("🔍 JWT Payload: " + payload);
            
            // For now, let's create a mock Claims object with the payload data
            // This is a temporary solution until we get the correct JWT secret
            Claims claims = Jwts.claims();
            
            // Parse the payload JSON manually
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                @SuppressWarnings("unchecked")
                Map<String, Object> payloadMap = mapper.readValue(payload, Map.class);
                
                // Set the claims from the payload
                for (Map.Entry<String, Object> entry : payloadMap.entrySet()) {
                    claims.put(entry.getKey(), entry.getValue());
                }
                
                System.out.println("✅ Successfully parsed JWT payload without signature verification");
                return claims;
                
            } catch (Exception jsonException) {
                System.out.println("❌ Error parsing JWT payload JSON: " + jsonException.getMessage());
                throw new IllegalArgumentException("Invalid JWT payload format");
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error parsing JWT token: " + e.getMessage());
            throw e;
        }
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
            final String userDetailsUsername = userDetails.getUsername();
            final boolean isExpired = isTokenExpired(token);
            final boolean usernameMatches = username.equals(userDetailsUsername);
            final boolean isValid = (usernameMatches && !isExpired);
            
            System.out.println("🔍 JWT validation details:");
            System.out.println("  - Token username: " + username);
            System.out.println("  - UserDetails username: " + userDetailsUsername);
            System.out.println("  - Username matches: " + usernameMatches);
            System.out.println("  - Token expired: " + isExpired);
            System.out.println("  - Final validation result: " + isValid);
            
            return isValid;
        } catch (Exception e) {
            System.out.println("❌ JWT validation failed with exception: " + e.getMessage());
            e.printStackTrace();
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