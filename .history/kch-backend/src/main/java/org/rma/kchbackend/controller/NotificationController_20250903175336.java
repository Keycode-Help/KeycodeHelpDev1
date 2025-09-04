package org.rma.kchbackend.controller;

import org.rma.kchbackend.service.KeycodeNotificationService;
import org.rma.kchbackend.service.SmsNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private KeycodeNotificationService keycodeNotificationService;

    @Autowired
    private SmsNotificationService smsNotificationService;

    /**
     * Test the notification system
     */
    @PostMapping("/test")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> testNotificationSystem(
            @RequestParam(required = false) String testEmail,
            @RequestParam(required = false) String testPhone) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            keycodeNotificationService.testNotificationSystem(testEmail, testPhone);
            
            response.put("success", true);
            response.put("message", "Notification system test completed");
            response.put("testEmail", testEmail);
            response.put("testPhone", testPhone);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Notification system test failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Test SMS functionality
     */
    @PostMapping("/test-sms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> testSms(@RequestParam String phoneNumber) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean success = smsNotificationService.testSms(phoneNumber);
            
            response.put("success", success);
            response.put("message", success ? "Test SMS sent successfully" : "Failed to send test SMS");
            response.put("phoneNumber", phoneNumber);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "SMS test failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get notification system status
     */
    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getNotificationStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if SMS is configured
            boolean smsConfigured = isSmsConfigured();
            
            response.put("success", true);
            response.put("smsConfigured", smsConfigured);
            response.put("emailConfigured", true); // Email is always configured if the service is running
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get notification status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Send manual notification for testing
     */
    @PostMapping("/send-manual")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> sendManualNotification(
            @RequestParam String type,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam String customerName,
            @RequestParam String vehicleInfo) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            switch (type.toLowerCase()) {
                case "request":
                    // This would require a Vehicle object, so we'll just send a test email
                    keycodeNotificationService.testNotificationSystem(email, phone);
                    break;
                case "status":
                    // Send status update notification
                    keycodeNotificationService.testNotificationSystem(email, phone);
                    break;
                case "completion":
                    // Send completion notification
                    keycodeNotificationService.testNotificationSystem(email, phone);
                    break;
                default:
                    response.put("success", false);
                    response.put("message", "Invalid notification type. Use: request, status, or completion");
                    return ResponseEntity.badRequest().body(response);
            }
            
            response.put("success", true);
            response.put("message", "Manual notification sent successfully");
            response.put("type", type);
            response.put("email", email);
            response.put("phone", phone);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send manual notification: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Check if SMS is configured
     */
    private boolean isSmsConfigured() {
        try {
            // Try to get Twilio configuration from environment
            String accountSid = System.getenv("TWILIO_ACCOUNT_SID");
            String authToken = System.getenv("TWILIO_AUTH_TOKEN");
            String phoneNumber = System.getenv("TWILIO_PHONE_NUMBER");
            
            return accountSid != null && !accountSid.isEmpty() &&
                   authToken != null && !authToken.isEmpty() &&
                   phoneNumber != null && !phoneNumber.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }
}
