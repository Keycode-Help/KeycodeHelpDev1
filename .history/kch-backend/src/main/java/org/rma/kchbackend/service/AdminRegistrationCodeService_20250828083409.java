package org.rma.kchbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminRegistrationCodeService {

    private final JavaMailSender mailSender;
    private final Map<String, RegistrationCodeInfo> activeCodes = new HashMap<>();
    
    // In production, this should be stored in a database
    private static final int CODE_LENGTH = 8;
    private static final int CODE_EXPIRY_HOURS = 24;

    @Autowired
    public AdminRegistrationCodeService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Generate a new admin registration code for a specific email
     */
    public String generateAdminRegistrationCode(String email) {
        // Generate a secure random code
        String code = generateSecureCode();
        
        // Store the code with expiry information
        RegistrationCodeInfo codeInfo = new RegistrationCodeInfo(
            code,
            LocalDateTime.now().plusHours(CODE_EXPIRY_HOURS),
            email
        );
        
        activeCodes.put(email, codeInfo);
        
        return code;
    }

    /**
     * Validate an admin registration code
     */
    public boolean validateAdminRegistrationCode(String email, String code) {
        RegistrationCodeInfo codeInfo = activeCodes.get(email);
        
        if (codeInfo == null) {
            return false;
        }
        
        // Check if code has expired
        if (LocalDateTime.now().isAfter(codeInfo.getExpiryTime())) {
            activeCodes.remove(email);
            return false;
        }
        
        // Check if code matches
        if (codeInfo.getCode().equals(code)) {
            // Remove the code after successful validation
            activeCodes.remove(email);
            return true;
        }
        
        return false;
    }

    /**
     * Send admin registration code to applicant and notify super admins
     */
    public void sendAdminRegistrationCode(String applicantEmail, String applicantName) {
        try {
            // Generate the registration code
            String code = generateAdminRegistrationCode(applicantEmail);
            
            // For local development, just log the code instead of sending emails
            if (isLocalDevelopment()) {
                System.out.println("=== LOCAL DEVELOPMENT MODE ===");
                System.out.println("Admin Registration Code for " + applicantEmail + ": " + code);
                System.out.println("=================================");
                return;
            }
            
            // Send code to applicant
            sendCodeToApplicant(applicantEmail, applicantName, code);
            
            // Notify super admins
            notifySuperAdmins(applicantEmail, applicantName, code);
            
        } catch (Exception e) {
            // Log the error (in production, use proper logging)
            System.err.println("Error sending admin registration code: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send registration code: " + e.getMessage(), e);
        }
    }

    /**
     * Send registration code to the applicant
     */
    private void sendCodeToApplicant(String email, String name, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Admin Registration Code - KeyCode Help");
        message.setText(
            "Dear " + name + ",\n\n" +
            "Your admin registration code is: " + code + "\n\n" +
            "This code will expire in " + CODE_EXPIRY_HOURS + " hours.\n" +
            "Please use this code to complete your admin registration.\n\n" +
            "If you did not request this code, please ignore this email.\n\n" +
            "Best regards,\n" +
            "KeyCode Help Team"
        );
        
        mailSender.send(message);
    }

    /**
     * Notify super admins about new admin registration request
     */
    private void notifySuperAdmins(String applicantEmail, String applicantName, String code) {
        // In production, this should fetch super admin emails from the database
        // For now, we'll send to a configured email or the system admin
        String superAdminEmail = "mytech@metrepairs.com"; // Anthony's email
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(superAdminEmail);
        message.setSubject("New Admin Registration Request - KeyCode Help");
        message.setText(
            "A new admin registration request has been submitted:\n\n" +
            "Applicant Name: " + applicantName + "\n" +
            "Applicant Email: " + applicantEmail + "\n" +
            "Registration Code: " + code + "\n\n" +
            "The applicant will use this code to complete their registration.\n" +
            "Once registered, their account will require your approval.\n\n" +
            "You can review and approve/reject the account from the Super Admin Dashboard.\n\n" +
            "Best regards,\n" +
            "KeyCode Help System"
        );
        
        mailSender.send(message);
    }

    /**
     * Generate a secure random code
     */
    private String generateSecureCode() {
        SecureRandom random = new SecureRandom();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return code.toString();
    }

    /**
     * Clean up expired codes (should be called periodically)
     */
    public void cleanupExpiredCodes() {
        LocalDateTime now = LocalDateTime.now();
        activeCodes.entrySet().removeIf(entry -> 
            now.isAfter(entry.getValue().getExpiryTime())
        );
    }

    /**
     * Inner class to store code information
     */
    private static class RegistrationCodeInfo {
        private final String code;
        private final LocalDateTime expiryTime;
        private final String email;

        public RegistrationCodeInfo(String code, LocalDateTime expiryTime, String email) {
            this.code = code;
            this.expiryTime = expiryTime;
            this.email = email;
        }

        public String getCode() { return code; }
        public LocalDateTime getExpiryTime() { return expiryTime; }
        public String getEmail() { return email; }
    }
}
