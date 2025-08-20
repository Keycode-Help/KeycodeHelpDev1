package org.rma.kchbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.rma.kchbackend.repository.PasswordResetTokenRepository;

import java.time.LocalDateTime;

@Service
public class TokenCleanupService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    // Clean up expired tokens every hour
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void cleanupExpiredTokens() {
        try {
            tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        } catch (Exception e) {
            // Log error but don't throw to prevent service interruption
            System.err.println("Error cleaning up expired tokens: " + e.getMessage());
        }
    }
}
