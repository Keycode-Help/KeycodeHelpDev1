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
            // Generate reset token
            String token = UUID.randomUUID().toString();
            
            // Store token with expiry (24 hours)
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setEmail(email);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
            tokenRepository.save(resetToken);

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

            mailSender.send(message);
            return true;
        } catch (Exception e) {
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
