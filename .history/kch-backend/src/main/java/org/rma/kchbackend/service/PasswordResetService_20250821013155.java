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
    private PasswordResetTokenRepository tokenRepository;

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
            
            mailSender.send(message);
            System.out.println("✅ Email sent successfully via Brevo SMTP!");
            return true;
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email: " + e.getMessage());
            System.err.println("❌ Exception type: " + e.getClass().getSimpleName());
            e.printStackTrace();
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
