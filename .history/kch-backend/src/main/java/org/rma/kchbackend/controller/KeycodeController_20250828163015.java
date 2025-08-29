package org.rma.kchbackend.controller;

import org.rma.kchbackend.service.KeycodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/keycodes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class KeycodeController {

    private static final Logger logger = Logger.getLogger(KeycodeController.class.getName());
    
    @Autowired
    private KeycodeService keycodeService;

    @PostMapping("/creds")
    public ResponseEntity<?> getCredentials(@RequestBody Map<String, String> request, 
                                         @RequestHeader(value = "Origin", required = false) String origin) {
        
        try {
            // Get current user authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warning("Unauthorized access attempt to /api/keycodes/creds");
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String email = authentication.getName();
            if (email == null || email.equals("anonymousUser")) {
                logger.warning("Invalid user authentication for /api/keycodes/creds");
                return ResponseEntity.status(401).body(Map.of("error", "Invalid authentication"));
            }

            // Validate request body
            if (request == null || !request.containsKey("oem")) {
                logger.warning("Invalid request body for /api/keycodes/creds from user: " + email);
                return ResponseEntity.status(400).body(Map.of("error", "Invalid body"));
            }

            String oem = request.get("oem");
            if (oem == null || oem.trim().isEmpty()) {
                logger.warning("Missing OEM parameter for /api/keycodes/creds from user: " + email);
                return ResponseEntity.status(400).body(Map.of("error", "Missing OEM parameter"));
            }

            logger.info("🔍 DEBUG: Credentials request - User: " + email + ", OEM: " + oem);

            // Get user details and validate role
            Map<String, Object> userDetails = keycodeService.getUserDetails(email);
            if (userDetails == null) {
                logger.warning("User not found for /api/keycodes/creds: " + email);
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            String userRole = (String) userDetails.get("role");
            if (userRole == null || (!userRole.equalsIgnoreCase("admin") && !userRole.equalsIgnoreCase("super_admin"))) {
                logger.warning("Unauthorized role access attempt to /api/keycodes/creds by user: " + email + " with role: " + userRole);
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }

            logger.info("✅ DEBUG: User authorized - Role: " + userRole + ", requesting credentials for OEM: " + oem);

            // Validate origin (basic CORS check)
            String allowedOrigin = System.getenv("FRONTEND_URL");
            if (allowedOrigin != null && origin != null && !origin.equals(allowedOrigin)) {
                logger.warning("Origin mismatch for /api/keycodes/creds. Expected: " + allowedOrigin + ", Got: " + origin);
                return ResponseEntity.status(403).body(Map.of("error", "Invalid origin"));
            }

            // Get credentials for the specified OEM
            Map<String, String> credentials = keycodeService.getCredentials(oem);
            if (credentials == null) {
                logger.warning("Unknown OEM requested for /api/keycodes/creds: " + oem + " by user: " + email);
                return ResponseEntity.status(404).body(Map.of("error", "Unknown OEM"));
            }

            // Ensure credentials have the required fields
            String username = credentials.get("username");
            String password = credentials.get("password");
            
            if (username == null || password == null) {
                logger.warning("Missing credentials for OEM: " + oem + " requested by user: " + email);
                return ResponseEntity.status(409).body(Map.of("error", "Missing credentials. Update environment variables for this OEM."));
            }

            logger.info("✅ DEBUG: Credentials retrieved successfully for OEM: " + oem);

            // Log access metadata (without secrets)
            logger.info(String.format("Keycode credentials accessed - User: %s, Role: %s, OEM: %s, IP: %s", 
                email, userRole, oem, getClientIP()));

            // Return credentials
            Map<String, String> response = new HashMap<>();
            response.put("username", username);
            response.put("password", password);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.severe("Error in /api/keycodes/creds: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @GetMapping("/portals")
    public ResponseEntity<?> getPortals() {
        try {
            // Get current user authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String email = authentication.getName();
            if (email == null || email.equals("anonymousUser")) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid authentication"));
            }

            // Get user details and validate role
            Map<String, Object> userDetails = keycodeService.getUserDetails(email);
            if (userDetails == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            // Fix: Convert Role enum to string properly
            Object roleObj = userDetails.get("role");
            String userRole;
            if (roleObj instanceof org.rma.kchbackend.model.Role) {
                userRole = ((org.rma.kchbackend.model.Role) roleObj).name();
            } else {
                userRole = roleObj != null ? roleObj.toString() : null;
            }
            
            if (userRole == null || (!userRole.equalsIgnoreCase("admin") && !userRole.equalsIgnoreCase("super_admin"))) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }

            // Return portals list (without credentials)
            return ResponseEntity.ok(keycodeService.getPortalsList());

        } catch (Exception e) {
            logger.severe("Error in /api/keycodes/portals: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    private String getClientIP() {
        // This is a placeholder - in production you'd get the actual client IP
        // from the request headers or servlet context
        return "unknown";
    }
}
