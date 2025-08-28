package org.rma.kchbackend.service;

import org.rma.kchbackend.model.AdminRegistrationCode;
import org.rma.kchbackend.repository.AdminRegistrationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminRegistrationCodeService {

    private final JavaMailSender mailSender;
    private final AdminRegistrationCodeRepository adminRegistrationCodeRepository;
    
    private static final int CODE_LENGTH = 8;
    private static final int CODE_EXPIRY_HOURS = 24;

    @Autowired
    public AdminRegistrationCodeService(JavaMailSender mailSender, AdminRegistrationCodeRepository adminRegistrationCodeRepository) {
        this.mailSender = mailSender;
        this.adminRegistrationCodeRepository = adminRegistrationCodeRepository;
    }

    /**
     * Generate a new admin registration code for a specific email
     */
    public String generateAdminRegistrationCode(String email, String applicantName) {
        // Generate a secure random code
        String code = generateSecureCode();
        
        // Check if code already exists (very unlikely but handle it)
        while (adminRegistrationCodeRepository.findActiveCodeByEmailAndCode(email, code, LocalDateTime.now()).isPresent()) {
            code = generateSecureCode();
        }
        
        // Create and save the registration code
        AdminRegistrationCode codeEntity = new AdminRegistrationCode();
        codeEntity.setCode(code);
        codeEntity.setEmail(email);
        codeEntity.setApplicantName(applicantName);
        codeEntity.setExpiryTime(LocalDateTime.now().plusHours(CODE_EXPIRY_HOURS));
        codeEntity.setIsUsed(false);
        
        adminRegistrationCodeRepository.save(codeEntity);
        
        return code;
    }

    /**
     * Validate an admin registration code
     */
    public boolean validateAdminRegistrationCode(String email, String code) {
        try {
            Optional<AdminRegistrationCode> codeEntity = adminRegistrationCodeRepository
                .findActiveCodeByEmailAndCode(email, code, LocalDateTime.now());
            
            if (codeEntity.isEmpty()) {
                return false;
            }
            
            AdminRegistrationCode foundCode = codeEntity.get();
            
            // Mark the code as used
            foundCode.setIsUsed(true);
            foundCode.setUsedAt(LocalDateTime.now());
            foundCode.setUsedByEmail(email);
            
            adminRegistrationCodeRepository.save(foundCode);
            
            return true;
            
        } catch (Exception e) {
            System.err.println("Error validating admin registration code: " + e.getMessage());
            return false;
        }
    }

    /**
     * Send admin registration code to applicant and notify super admins
     */
    public void sendAdminRegistrationCode(String applicantEmail, String applicantName) {
        try {
            // Generate the registration code
            String code = generateAdminRegistrationCode(applicantEmail, applicantName);
            
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
        try {
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
            System.out.println("✅ Email sent successfully to applicant: " + email);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email to applicant: " + email);
            System.err.println("Error: " + e.getMessage());
            throw new RuntimeException("Failed to send email to applicant: " + e.getMessage(), e);
        }
    }

    /**
     * Notify super admins about new admin registration request
     */
    private void notifySuperAdmins(String applicantEmail, String applicantName, String code) {
        try {
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
            System.out.println("✅ Notification email sent successfully to super admin: " + superAdminEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send notification email to super admin");
            System.err.println("Error: " + e.getMessage());
            // Don't throw here as the main registration code was sent successfully
        }
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
     * Check if running in local development mode
     */
    private boolean isLocalDevelopment() {
        // Force production mode - always send emails
        return false;
        
        // Original logic (commented out for production):
        // String profile = System.getProperty("spring.profiles.active");
        // String env = System.getenv("SPRING_PROFILES_ACTIVE");
        // return "local".equals(profile) || "local".equals(env) || 
        //        "dev".equals(profile) || "dev".equals(env) ||
        //        System.getProperty("user.home").contains("apple"); // Detect local development
    }

    /**
     * Clean up expired codes (runs every hour)
     */
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void cleanupExpiredCodes() {
        try {
            LocalDateTime now = LocalDateTime.now();
            List<AdminRegistrationCode> expiredCodes = adminRegistrationCodeRepository.findExpiredCodes(now);
            
            if (!expiredCodes.isEmpty()) {
                adminRegistrationCodeRepository.deleteAll(expiredCodes);
                System.out.println("🧹 Cleaned up " + expiredCodes.size() + " expired admin registration codes");
            }
        } catch (Exception e) {
            System.err.println("Error cleaning up expired codes: " + e.getMessage());
        }
    }

    /**
     * Get active codes for an email (for debugging/admin purposes)
     */
    public List<AdminRegistrationCode> getActiveCodesForEmail(String email) {
        return adminRegistrationCodeRepository.findActiveCodesByEmail(email, LocalDateTime.now());
    }

    /**
     * Get all unused codes (for debugging/admin purposes)
     */
    public List<AdminRegistrationCode> getAllUnusedCodes() {
        return adminRegistrationCodeRepository.findUnusedCodes();
    }
}
