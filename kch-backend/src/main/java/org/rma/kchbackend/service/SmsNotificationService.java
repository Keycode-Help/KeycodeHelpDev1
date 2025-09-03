package org.rma.kchbackend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class SmsNotificationService {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String fromPhoneNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty() && 
            authToken != null && !authToken.isEmpty()) {
            Twilio.init(accountSid, authToken);
            System.out.println("📱 Twilio SMS Service initialized successfully");
        } else {
            System.out.println("⚠️ Twilio SMS Service not configured - SMS notifications disabled");
        }
    }

    /**
     * Send SMS notification for keycode request submission
     */
    public boolean sendKeycodeRequestNotification(String phoneNumber, String customerName, String vehicleInfo) {
        if (!isSmsConfigured()) {
            System.out.println("⚠️ SMS not configured - skipping SMS notification");
            return false;
        }

        try {
            String message = String.format(
                "🔑 Keycode Help: New keycode request from %s for %s. " +
                "Request submitted successfully. We'll process it shortly. " +
                "Thank you for choosing Keycode Help!",
                customerName, vehicleInfo
            );

            return sendSms(phoneNumber, message);
        } catch (Exception e) {
            System.err.println("❌ Failed to send keycode request SMS: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Send SMS notification for keycode request status update
     */
    public boolean sendKeycodeStatusUpdate(String phoneNumber, String customerName, String status, String vin) {
        if (!isSmsConfigured()) {
            System.out.println("⚠️ SMS not configured - skipping SMS notification");
            return false;
        }

        try {
            String hashedVin = generateHashedVin(vin);
            String message = String.format(
                "🔑 Keycode Help: Your keycode request for VIN %s is now %s. " +
                "We'll notify you when it's ready. Thank you!",
                hashedVin, status
            );

            return sendSms(phoneNumber, message);
        } catch (Exception e) {
            System.err.println("❌ Failed to send keycode status SMS: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Send SMS notification for keycode completion
     */
    public boolean sendKeycodeCompletionNotification(String phoneNumber, String customerName, String vin) {
        if (!isSmsConfigured()) {
            System.out.println("⚠️ SMS not configured - skipping SMS notification");
            return false;
        }

        try {
            String hashedVin = generateHashedVin(vin);
            String message = String.format(
                "🎉 Keycode Help: Your keycode for VIN %s is ready! " +
                "Please log in to your account to retrieve it. Thank you for your business!",
                hashedVin
            );

            return sendSms(phoneNumber, message);
        } catch (Exception e) {
            System.err.println("❌ Failed to send keycode completion SMS: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Send SMS notification to admin about new keycode request
     */
    public boolean sendAdminNotification(String adminPhoneNumber, String customerName, String vehicleInfo) {
        if (!isSmsConfigured()) {
            System.out.println("⚠️ SMS not configured - skipping admin SMS notification");
            return false;
        }

        try {
            String message = String.format(
                "🔔 Keycode Help Admin: New keycode request from %s for %s. " +
                "Please check the admin dashboard to process this request.",
                customerName, vehicleInfo
            );

            return sendSms(adminPhoneNumber, message);
        } catch (Exception e) {
            System.err.println("❌ Failed to send admin SMS notification: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Generic SMS sending method
     */
    private boolean sendSms(String toPhoneNumber, String message) {
        try {
            // Format phone number (ensure it starts with +1 for US numbers)
            String formattedNumber = formatPhoneNumber(toPhoneNumber);
            
            Message twilioMessage = Message.creator(
                new PhoneNumber(formattedNumber),
                new PhoneNumber(fromPhoneNumber),
                message
            ).create();

            System.out.println("✅ SMS sent successfully to " + formattedNumber);
            System.out.println("📱 Message SID: " + twilioMessage.getSid());
            return true;

        } catch (Exception e) {
            System.err.println("❌ Failed to send SMS to " + toPhoneNumber + ": " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Format phone number for Twilio
     */
    private String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }

        // Remove all non-digit characters
        String digits = phoneNumber.replaceAll("[^0-9]", "");
        
        // If it's 10 digits, add +1
        if (digits.length() == 10) {
            return "+1" + digits;
        }
        // If it's 11 digits and starts with 1, add +
        else if (digits.length() == 11 && digits.startsWith("1")) {
            return "+" + digits;
        }
        // If it already has country code, just add + if missing
        else if (digits.length() > 11) {
            return phoneNumber.startsWith("+") ? phoneNumber : "+" + phoneNumber;
        }
        else {
            throw new IllegalArgumentException("Invalid phone number format: " + phoneNumber);
        }
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
     * Check if SMS service is properly configured
     */
    private boolean isSmsConfigured() {
        return accountSid != null && !accountSid.isEmpty() &&
               authToken != null && !authToken.isEmpty() &&
               fromPhoneNumber != null && !fromPhoneNumber.isEmpty();
    }

    /**
     * Test SMS functionality
     */
    public boolean testSms(String phoneNumber) {
        if (!isSmsConfigured()) {
            System.out.println("⚠️ SMS not configured - cannot send test SMS");
            return false;
        }

        try {
            String message = "🔧 Keycode Help: This is a test SMS from your notification system. " +
                           "If you received this, SMS notifications are working correctly!";
            
            return sendSms(phoneNumber, message);
        } catch (Exception e) {
            System.err.println("❌ Failed to send test SMS: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
