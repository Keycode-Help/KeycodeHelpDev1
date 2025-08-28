package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.AdminRegistrationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRegistrationCodeRepository extends JpaRepository<AdminRegistrationCode, Long> {
    
    /**
     * Find active registration code by email and code
     */
    @Query("SELECT arc FROM AdminRegistrationCode arc WHERE arc.email = :email AND arc.code = :code AND arc.isUsed = false AND arc.expiryTime > :now")
    Optional<AdminRegistrationCode> findActiveCodeByEmailAndCode(@Param("email") String email, @Param("code") String code, @Param("now") LocalDateTime now);
    
    /**
     * Find all active codes for an email
     */
    @Query("SELECT arc FROM AdminRegistrationCode arc WHERE arc.email = :email AND arc.isUsed = false AND arc.expiryTime > :now")
    List<AdminRegistrationCode> findActiveCodesByEmail(@Param("email") String email, @Param("now") LocalDateTime now);
    
    /**
     * Find expired codes
     */
    @Query("SELECT arc FROM AdminRegistrationCode arc WHERE arc.expiryTime <= :now")
    List<AdminRegistrationCode> findExpiredCodes(@Param("now") LocalDateTime now);
    
    /**
     * Find unused codes
     */
    @Query("SELECT arc FROM AdminRegistrationCode arc WHERE arc.isUsed = false")
    List<AdminRegistrationCode> findUnusedCodes();
}
