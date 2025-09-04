package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class KeycodeNotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsNotificationService smsNotificationService;

    /**
     * Send notifications when a new keycode request is submitted
     */
    public void sendKeycodeRequestNotifications(Vehicle vehicle, KeycodeUser user) {
        try {
            String customerName = user != null ? user.getFname() + " " + user.getLname() : "Guest User";
            String customerEmail = user != null ? user.getEmail() : "guest@keycode.help";
            String customerPhone = user != null ? user.getPhone() : null;
            
            String vehicleInfo = String.format("%s %s %d (VIN: %s)", 
                vehicle.getMake().getName(), 
                vehicle.getModel(), 
                vehicle.getYear(),
                generateHashedVin(vehicle.getVin())
            );

            // Send email notification to customer
            sendCustomerEmailNotification(customerEmail, customerName, vehicleInfo, "submitted");

            // Send SMS notification to customer (if phone number available)
            if (customerPhone != null && !customerPhone.trim().isEmpty()) {
                smsNotificationService.sendKeycodeRequestNotification(customerPhone, customerName, vehicleInfo);
            }

            // Send admin notifications
            sendAdminNotifications(customerName, vehicleInfo, customerEmail);

            System.out.println("✅ Keycode request notifications sent successfully for vehicle ID: " + vehicle.getId());

        } catch (Exception e) {
            System.err.println("❌ Failed to send keycode request notifications: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send notifications when keycode request status is updated
     */
    public void sendKeycodeStatusUpdateNotifications(Vehicle vehicle, String status) {
        try {
            KeycodeUser user = vehicle.getKeycodeUser();
            if (user == null) {
                System.out.println("⚠️ No user associated with vehicle - skipping status notifications");
                return;
            }

            String customerName = user.getFname() + " " + user.getLname();
            String customerEmail = user.getEmail();
            String customerPhone = user.getPhone();
            
            String hashedVin = generateHashedVin(vehicle.getVin());
            String vehicleInfo = String.format("%s %s %d", 
                vehicle.getMake().getName(), 
                vehicle.getModel(), 
                vehicle.getYear()
            );

            // Send email notification
            sendCustomerEmailNotification(customerEmail, customerName, vehicleInfo, status);

            // Send SMS notification (if phone number available)
            if (customerPhone != null && !customerPhone.trim().isEmpty()) {
                smsNotificationService.sendKeycodeStatusUpdate(customerPhone, customerName, status, vehicle.getVin());
            }

            System.out.println("✅ Keycode status update notifications sent for vehicle ID: " + vehicle.getId());

        } catch (Exception e) {
            System.err.println("❌ Failed to send keycode status update notifications: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send notifications when keycode is completed
     */
    public void sendKeycodeCompletionNotifications(Vehicle vehicle) {
        try {
            KeycodeUser user = vehicle.getKeycodeUser();
            if (user == null) {
                System.out.println("⚠️ No user associated with vehicle - skipping completion notifications");
                return;
            }

            String customerName = user.getFname() + " " + user.getLname();
            String customerEmail = user.getEmail();
            String customerPhone = user.getPhone();
            
            String hashedVin = generateHashedVin(vehicle.getVin());
            String vehicleInfo = String.format("%s %s %d", 
                vehicle.getMake().getName(), 
                vehicle.getModel(), 
                vehicle.getYear()
            );

            // Send completion email
            sendCustomerCompletionEmail(customerEmail, customerName, vehicleInfo, hashedVin);

            // Send completion SMS (if phone number available)
            if (customerPhone != null && !customerPhone.trim().isEmpty()) {
                smsNotificationService.sendKeycodeCompletionNotification(customerPhone, customerName, vehicle.getVin());
            }

            System.out.println("✅ Keycode completion notifications sent for vehicle ID: " + vehicle.getId());

        } catch (Exception e) {
            System.err.println("❌ Failed to send keycode completion notifications: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send email notification to customer
     */
    private void sendCustomerEmailNotification(String email, String customerName, String vehicleInfo, String status) {
        try {
            String subject = "Keycode Request " + status.substring(0, 1).toUpperCase() + status.substring(1) + " - Keycode Help";
            
            String body = buildCustomerEmailBody(customerName, vehicleInfo, status);
            
            emailService.sendNotificationEmail(customerName, email, subject, body);
            
            System.out.println("✅ Customer email notification sent to: " + email);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send customer email notification: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send completion email to customer
     */
    private void sendCustomerCompletionEmail(String email, String customerName, String vehicleInfo, String hashedVin) {
        try {
            String subject = "Your Keycode is Ready! - Keycode Help";
            
            String body = buildCompletionEmailBody(customerName, vehicleInfo, hashedVin);
            
            emailService.sendNotificationEmail(customerName, email, subject, body);
            
            System.out.println("✅ Customer completion email sent to: " + email);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send customer completion email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send notifications to admin users
     */
    private void sendAdminNotifications(String customerName, String vehicleInfo, String customerEmail) {
        try {
            // Get admin email addresses (you might want to fetch these from database)
            String[] adminEmails = {
                "admin@keycode.help",
                "support@keycode.help"
            };

            String subject = "New Keycode Request - Admin Notification";
            String body = buildAdminEmailBody(customerName, vehicleInfo, customerEmail);

            for (String adminEmail : adminEmails) {
                emailService.sendNotificationEmail("Admin", adminEmail, subject, body);
                System.out.println("✅ Admin email notification sent to: " + adminEmail);
            }

            // Send SMS to primary admin (if configured)
            // You might want to store admin phone numbers in database or environment variables
            String adminPhone = System.getenv("ADMIN_PHONE_NUMBER");
            if (adminPhone != null && !adminPhone.trim().isEmpty()) {
                smsNotificationService.sendAdminNotification(adminPhone, customerName, vehicleInfo);
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to send admin notifications: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Build customer email body
     */
    private String buildCustomerEmailBody(String customerName, String vehicleInfo, String status) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));
        
        return String.format("""
            Dear %s,
            
            Your keycode request has been %s successfully!
            
            Vehicle Details:
            %s
            
            Request Status: %s
            Submitted: %s
            
            What happens next:
            • Our team will review your request and documentation
            • We'll process your keycode request
            • You'll receive updates via email and SMS (if provided)
            • Your keycode will be available in your account when ready
            
            If you have any questions, please don't hesitate to contact our support team.
            
            Thank you for choosing Keycode Help!
            
            Best regards,
            The Keycode Help Team
            
            ---
            This is an automated message. Please do not reply to this email.
            """, customerName, status, vehicleInfo, status.toUpperCase(), timestamp);
    }

    /**
     * Build completion email body
     */
    private String buildCompletionEmailBody(String customerName, String vehicleInfo, String hashedVin) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));
        
        return String.format("""
            Dear %s,
            
            🎉 Great news! Your keycode is ready!
            
            Vehicle Details:
            %s
            VIN: %s
            
            Your keycode has been processed and is now available in your account.
            
            Next Steps:
            1. Log in to your Keycode Help account
            2. Navigate to "My Requests" or "My Keycodes"
            3. Find your request and retrieve your keycode
            
            If you have any questions or need assistance, please contact our support team.
            
            Thank you for your business!
            
            Best regards,
            The Keycode Help Team
            
            ---
            This is an automated message. Please do not reply to this email.
            """, customerName, vehicleInfo, hashedVin);
    }

    /**
     * Build admin email body
     */
    private String buildAdminEmailBody(String customerName, String vehicleInfo, String customerEmail) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));
        
        return String.format("""
            New Keycode Request Received
            
            Customer Information:
            Name: %s
            Email: %s
            
            Vehicle Details:
            %s
            
            Request submitted: %s
            
            Please log in to the admin dashboard to process this request.
            
            ---
            Admin Dashboard: https://keycode.help/admin
            """, customerName, customerEmail, vehicleInfo, timestamp);
    }

    /**
     * Generate hashed VIN for privacy
     */
    private String generateHashedVin(String vin) {
        if (vin == null || vin.length() < 4) {
            return "****";
        }
        return vin.substring(0, 4) + "****" + vin.substring(vin.length() - 4);
    }

    /**
     * Test notification system
     */
    public void testNotificationSystem(String testEmail, String testPhone) {
        try {
            System.out.println("🧪 Testing notification system...");
            
            // Test email
            if (testEmail != null && !testEmail.trim().isEmpty()) {
                emailService.sendNotificationEmail("Test User", testEmail, 
                    "Test Notification - Keycode Help", 
                    "This is a test email to verify the notification system is working correctly.");
                System.out.println("✅ Test email sent to: " + testEmail);
            }
            
            // Test SMS
            if (testPhone != null && !testPhone.trim().isEmpty()) {
                smsNotificationService.testSms(testPhone);
                System.out.println("✅ Test SMS sent to: " + testPhone);
            }
            
            System.out.println("🎉 Notification system test completed!");
            
        } catch (Exception e) {
            System.err.println("❌ Notification system test failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
