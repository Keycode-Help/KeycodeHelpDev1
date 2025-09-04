package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.NotificationPreferences;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.NotificationPreferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notification-preferences")
public class NotificationPreferencesController {

    @Autowired
    private NotificationPreferencesService notificationPreferencesService;

    @Autowired
    private KeycodeUserService keycodeUserService;

    /**
     * Get current user's notification preferences
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotificationPreferences() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            KeycodeUser user = keycodeUserService.findByEmail(email).orElse(null);
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }
            
            NotificationPreferences preferences = notificationPreferencesService.getNotificationPreferences(user);
            
            response.put("success", true);
            response.put("preferences", preferences);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get notification preferences: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Update current user's notification preferences
     */
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateNotificationPreferences(@RequestBody NotificationPreferences preferences) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            KeycodeUser user = keycodeUserService.findByEmail(email).orElse(null);
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }
            
            NotificationPreferences updatedPreferences = notificationPreferencesService.updateNotificationPreferences(user, preferences);
            
            response.put("success", true);
            response.put("message", "Notification preferences updated successfully");
            response.put("preferences", updatedPreferences);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update notification preferences: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Reset notification preferences to defaults
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetNotificationPreferences() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            KeycodeUser user = keycodeUserService.findByEmail(email).orElse(null);
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }
            
            NotificationPreferences defaultPreferences = notificationPreferencesService.createDefaultPreferences(user);
            
            response.put("success", true);
            response.put("message", "Notification preferences reset to defaults");
            response.put("preferences", defaultPreferences);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to reset notification preferences: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get notification preferences for a specific user (admin only)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserNotificationPreferences(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if current user is admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();
            
            KeycodeUser currentUser = keycodeUserService.findByEmail(currentUserEmail).orElse(null);
            if (currentUser == null || (!currentUser.getRole().equals("ADMIN") && !currentUser.getRole().equals("SUPER_ADMIN"))) {
                response.put("success", false);
                response.put("message", "Access denied. Admin privileges required.");
                return ResponseEntity.status(403).body(response);
            }
            
            KeycodeUser targetUser = keycodeUserService.findById(userId).orElse(null);
            if (targetUser == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }
            
            NotificationPreferences preferences = notificationPreferencesService.getNotificationPreferences(targetUser);
            
            response.put("success", true);
            response.put("preferences", preferences);
            response.put("user", Map.of(
                "id", targetUser.getId(),
                "email", targetUser.getEmail(),
                "name", targetUser.getFname() + " " + targetUser.getLname()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get user notification preferences: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
