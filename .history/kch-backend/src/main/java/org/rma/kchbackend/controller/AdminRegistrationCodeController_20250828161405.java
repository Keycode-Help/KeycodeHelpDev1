package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.AdminRegistrationCode;
import org.rma.kchbackend.service.AdminRegistrationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        System.out.println("🔍 DEBUG: Admin registration code request received");
        System.out.println("🔍 DEBUG: Request body: " + request);
        System.out.println("🔍 DEBUG: Authentication: " + authentication);
        
        // Check if user is authenticated and has admin role
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("❌ DEBUG: Not authenticated");
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        String userRole = getCurrentUserRole(authentication);
        System.out.println("🔍 DEBUG: User role: " + userRole);
        
        if (userRole == null || (!userRole.equalsIgnoreCase("admin") && !userRole.equalsIgnoreCase("super_admin"))) {
            System.out.println("❌ DEBUG: Forbidden - user role: " + userRole);
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }
        
        try {
            String email = request.get("email");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");

            System.out.println("🔍 DEBUG: Email: " + email + ", FirstName: " + firstName + ", LastName: " + lastName);

            if (email == null || firstName == null || lastName == null) {
                System.out.println("❌ DEBUG: Missing required fields");
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email, firstName, and lastName are required"
                ));
            }

            System.out.println("🔍 DEBUG: Calling adminRegistrationCodeService.sendAdminRegistrationCode");
            // Send the registration code
            adminRegistrationCodeService.sendAdminRegistrationCode(email, firstName + " " + lastName);
            System.out.println("✅ DEBUG: adminRegistrationCodeService.sendAdminRegistrationCode completed successfully");

            return ResponseEntity.ok(Map.of(
                "message", "Admin registration code sent successfully to " + email,
                "email", email
            ));

        } catch (Exception e) {
            System.err.println("❌ DEBUG: Error requesting admin registration code: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to send registration code: " + e.getMessage()
            ));
        }
    }

    /**
     * Validate an admin registration code
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateAdminRegistrationCode(@RequestBody Map<String, String> request, Authentication authentication) {
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
     * Get active codes for an email (for debugging/admin purposes)
     */
    @GetMapping("/active/{email}")
    public ResponseEntity<Map<String, Object>> getActiveCodesForEmail(@PathVariable String email, Authentication authentication) {
        // Check if user is authenticated and has admin role
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        String userRole = getCurrentUserRole(authentication);
        if (userRole == null || (!userRole.equalsIgnoreCase("admin") && !userRole.equalsIgnoreCase("super_admin"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }
        
        try {
            List<AdminRegistrationCode> activeCodes = adminRegistrationCodeService.getActiveCodesForEmail(email);
            
            return ResponseEntity.ok(Map.of(
                "email", email,
                "activeCodes", activeCodes,
                "count", activeCodes.size()
            ));
            
        } catch (Exception e) {
            System.err.println("Error getting active codes for email: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to get active codes: " + e.getMessage()
            ));
        }
    }

    /**
     * Get all unused codes (for debugging/admin purposes)
     */
    @GetMapping("/unused")
    public ResponseEntity<Map<String, Object>> getAllUnusedCodes(Authentication authentication) {
        // Check if user is authenticated and has admin role
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        String userRole = getCurrentUserRole(authentication);
        if (userRole == null || (!userRole.equalsIgnoreCase("admin") && !userRole.equalsIgnoreCase("super_admin"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }
        
        try {
            List<AdminRegistrationCode> unusedCodes = adminRegistrationCodeService.getAllUnusedCodes();
            
            return ResponseEntity.ok(Map.of(
                "unusedCodes", unusedCodes,
                "count", unusedCodes.size()
            ));
            
        } catch (Exception e) {
            System.err.println("Error getting unused codes: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to get unused codes: " + e.getMessage()
            ));
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "healthy", "service", "AdminRegistrationCode"));
    }

    /**
     * Get current user role from authentication
     */
    private String getCurrentUserRole(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities() == null) {
            return null;
        }
        
        return authentication.getAuthorities().stream()
            .findFirst()
            .map(authority -> {
                String role = authority.toString();
                // Remove "ROLE_" prefix if present for comparison
                if (role.startsWith("ROLE_")) {
                    return role.substring(5);
                }
                return role;
            })
            .orElse(null);
    }
}
