package org.rma.kchbackend.controller;

import org.rma.kchbackend.service.AdminRegistrationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:51731", "http://localhost:51732", "http://localhost:51733", "http://localhost:51734"})
@RestController
@RequestMapping("/admin-registration-code")
public class AdminRegistrationCodeController {

    private final AdminRegistrationCodeService adminRegistrationCodeService;

    @Autowired
    public AdminRegistrationCodeController(AdminRegistrationCodeService adminRegistrationCodeService) {
        this.adminRegistrationCodeService = adminRegistrationCodeService;
    }

    /**
     * Request an admin registration code
     */
    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> requestAdminRegistrationCode(@RequestBody Map<String, String> request, Authentication authentication) {
        // Check if user is authenticated and has admin role
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        String userRole = getCurrentUserRole(authentication);
        if (userRole == null || (!userRole.equalsIgnoreCase("admin") && !userRole.equalsIgnoreCase("super_admin"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }
        try {
            String email = request.get("email");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");

            if (email == null || firstName == null || lastName == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email, firstName, and lastName are required"
                ));
            }

            // Send the registration code
            adminRegistrationCodeService.sendAdminRegistrationCode(email, firstName + " " + lastName);

            return ResponseEntity.ok(Map.of(
                "message", "Admin registration code sent successfully to " + email,
                "email", email
            ));

        } catch (Exception e) {
            System.err.println("Error requesting admin registration code: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to send registration code: " + e.getMessage()
            ));
        }
    }

    /**
     * Validate an admin registration code
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateAdminRegistrationCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            if (email == null || code == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email and code are required"
                ));
            }

            boolean isValid = adminRegistrationCodeService.validateAdminRegistrationCode(email, code);

            if (isValid) {
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "message", "Registration code is valid"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "message", "Invalid or expired registration code"
                ));
            }

        } catch (Exception e) {
            System.err.println("Error validating admin registration code: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to validate registration code: " + e.getMessage()
            ));
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "Admin Registration Code Service is running"));
    }
    
    /**
     * Helper method to get the current user's role from authentication
     */
    private String getCurrentUserRole(Authentication authentication) {
        try {
            if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
                org.springframework.security.core.userdetails.UserDetails userDetails = 
                    (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
                return userDetails.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .filter(authority -> authority.startsWith("ROLE_"))
                    .map(authority -> authority.substring(5)) // Remove "ROLE_" prefix
                    .findFirst()
                    .orElse(null);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
