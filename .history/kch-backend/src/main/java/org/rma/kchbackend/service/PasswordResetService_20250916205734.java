package org.rma.kchbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.rma.kchbackend.model.PasswordResetToken;
import org.rma.kchbackend.repository.PasswordResetTokenRepository;
import org.rma.kchbackend.model.KeycodeUser;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BrevoEmailService brevoEmailService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EnvironmentService environmentService;

    public boolean sendPasswordResetEmail(String email, String resetUrl) {
        try {
            System.out.println("📧 PasswordResetService: Starting password reset for email: " + email);
            
            // Generate reset token
            String token = UUID.randomUUID().toString();
            System.out.println("🔑 Generated reset token: " + token.substring(0, 8) + "...");
            
            // Store token with expiry (24 hours)
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setEmail(email);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
            tokenRepository.save(resetToken);
            System.out.println("💾 Stored reset token in database");

            // Send email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Password Reset Request - Keycode Help");
            message.setText(
                "You have requested a password reset for your Keycode Help account.\n\n" +
                "Click the following link to reset your password:\n" +
                resetUrl + "?token=" + token + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't request this reset, please ignore this email.\n\n" +
                "Best regards,\nKeycode Help Team"
            );

            System.out.println("📤 Attempting to send email via Brevo SMTP...");
            System.out.println("📧 Email details:");
            System.out.println("   To: " + email);
            System.out.println("   Subject: " + message.getSubject());
            System.out.println("   Reset URL: " + resetUrl + "?token=" + token.substring(0, 8) + "...");
            
            // Log environment configuration for debugging
            System.out.println("🔧 Environment Configuration:");
            System.out.println("   MAIL_HOST: " + environmentService.get("MAIL_HOST", "not set"));
            System.out.println("   MAIL_PORT: " + environmentService.get("MAIL_PORT", "not set"));
            System.out.println("   MAIL_USERNAME: " + environmentService.get("MAIL_USERNAME", "not set"));
            System.out.println("   MAIL_PASSWORD: " + (environmentService.has("MAIL_PASSWORD") ? "***SET***" : "not set"));
            
            mailSender.send(message);
            System.out.println("✅ Email sent successfully via Brevo SMTP!");
            return true;
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email: " + e.getMessage());
            System.err.println("❌ Exception type: " + e.getClass().getSimpleName());
            System.err.println("❌ Full stack trace:");
            e.printStackTrace();
            
            // Additional debugging for common issues
            if (e.getMessage() != null) {
                if (e.getMessage().contains("Authentication failed")) {
                    System.err.println("❌ SMTP Authentication failed - check MAIL_USERNAME and MAIL_PASSWORD");
                } else if (e.getMessage().contains("Connection refused")) {
                    System.err.println("❌ SMTP Connection refused - check MAIL_HOST and MAIL_PORT");
                } else if (e.getMessage().contains("timeout")) {
                    System.err.println("❌ SMTP Timeout - check network connection");
                }
            }
            
            return false;
        }
    }

    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        if (tokenOptional.isPresent()) {
            PasswordResetToken resetToken = tokenOptional.get();
            return resetToken.getExpiryDate().isAfter(LocalDateTime.now());
        }
        return false;
    }

    public String getEmailFromToken(String token) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        return tokenOptional.map(PasswordResetToken::getEmail).orElse(null);
    }

    public void deleteResetToken(String token) {
        tokenRepository.deleteByToken(token);
    }
}
