package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.service.KeycodeUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

// CORS is handled globally by CorsConfig.java
@RestController
@RequestMapping("/user-approval")
public class UserApprovalController {

    private final KeycodeUserService keycodeUserService;

    @Autowired
    public UserApprovalController(KeycodeUserService keycodeUserService) {
        this.keycodeUserService = keycodeUserService;
    }

    /**
     * Get all pending user approvals (Admin only)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<KeycodeUser>> getPendingUserApprovals(@RequestParam String adminEmail) {
        try {
            // Verify the requesting user is an admin
            if (!isAdmin(adminEmail)) {
                return ResponseEntity.status(403).body(null);
            }

            List<KeycodeUser> pendingUsers = keycodeUserService.findByRoleAndIsValidatedUser(Role.BASEUSER, false);
            return ResponseEntity.ok(pendingUsers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Get all validated users (Admin only)
     */
    @GetMapping("/validated")
    public ResponseEntity<List<KeycodeUser>> getValidatedUsers(@RequestParam String adminEmail) {
        try {
            // Verify the requesting user is an admin
            if (!isAdmin(adminEmail)) {
                return ResponseEntity.status(403).body(null);
            }

            List<KeycodeUser> validatedUsers = keycodeUserService.findByRoleAndIsValidatedUser(Role.BASEUSER, true);
            return ResponseEntity.ok(validatedUsers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Approve a user account (Admin only)
     */
    @PostMapping("/approve")
    public ResponseEntity<Map<String, Object>> approveUserAccount(@RequestBody Map<String, Object> request) {
        try {
            String adminEmail = (String) request.get("adminEmail");
            Long userId = Long.valueOf((String) request.get("userId"));
            String approvalNotes = (String) request.get("approvalNotes");

            // Verify the requesting user is an admin
            if (!isAdmin(adminEmail)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. Admin privileges required."));
            }

            boolean success = approveUser(userId, approvalNotes, adminEmail);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "User account approved successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to approve user account"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Reject a user account (Admin only)
     */
    @PostMapping("/reject")
    public ResponseEntity<Map<String, Object>> rejectUserAccount(@RequestBody Map<String, Object> request) {
        try {
            String adminEmail = (String) request.get("adminEmail");
            Long userId = Long.valueOf((String) request.get("userId"));
            String rejectionNotes = (String) request.get("rejectionNotes");

            // Verify the requesting user is an admin
            if (!isAdmin(adminEmail)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. Admin privileges required."));
            }

            boolean success = rejectUser(userId, rejectionNotes, adminEmail);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "User account rejected successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject user account"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Check if current user is an admin
     */
    @GetMapping("/is-admin")
    public ResponseEntity<Map<String, Boolean>> checkIsAdmin(@RequestParam String email) {
        try {
            boolean isAdmin = isAdmin(email);
            return ResponseEntity.ok(Map.of("isAdmin", isAdmin));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("isAdmin", false));
        }
    }

    /**
     * Check if a user is an admin
     */
    private boolean isAdmin(String email) {
        Optional<KeycodeUser> userOpt = keycodeUserService.findByEmail(email);
        if (userOpt.isPresent()) {
            KeycodeUser user = userOpt.get();
            return (user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN) && user.isAdminApproved();
        }
        return false;
    }

    /**
     * Approve a user account
     */
    private boolean approveUser(Long userId, String approvalNotes, String adminEmail) {
        Optional<KeycodeUser> userOptional = keycodeUserService.findById(userId);
        
        if (userOptional.isPresent()) {
            KeycodeUser user = userOptional.get();
            
            // Verify the user is actually a base user
            if (user.getRole() != Role.BASEUSER) {
                throw new IllegalArgumentException("User is not a base user");
            }
            
            // Approve the user account
            user.setValidatedUser(true);
            user.setActive(true);
            
            keycodeUserService.saveUser(user);
            
            // Log the approval action
            System.out.println("User account approved by: " + adminEmail + " for user: " + user.getEmail());
            
            return true;
        }
        
        return false;
    }

    /**
     * Reject a user account
     */
    private boolean rejectUser(Long userId, String rejectionNotes, String adminEmail) {
        Optional<KeycodeUser> userOptional = keycodeUserService.findById(userId);
        
        if (userOptional.isPresent()) {
            KeycodeUser user = userOptional.get();
            
            // Verify the user is actually a base user
            if (user.getRole() != Role.BASEUSER) {
                throw new IllegalArgumentException("User is not a base user");
            }
            
            // Reject the user account and deactivate
            user.setValidatedUser(false);
            user.setActive(false);
            
            keycodeUserService.saveUser(user);
            
            // Log the rejection action
            System.out.println("User account rejected by: " + adminEmail + " for user: " + user.getEmail());
            
            return true;
        }
        
        return false;
    }
}
