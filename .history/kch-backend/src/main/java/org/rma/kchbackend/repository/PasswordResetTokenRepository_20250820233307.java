package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);
    
    Optional<PasswordResetToken> findByEmail(String email);
    
    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiryDate < :now")
    @org.springframework.transaction.annotation.Transactional
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.token = :token")
    @org.springframework.transaction.annotation.Transactional
    void deleteByToken(@Param("token") String token);
    
    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.email = :email")
    void deleteByEmail(@Param("email") String email);
}
