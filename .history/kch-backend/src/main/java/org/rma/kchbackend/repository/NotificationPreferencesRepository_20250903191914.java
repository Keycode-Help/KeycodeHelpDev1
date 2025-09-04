package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.NotificationPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferencesRepository extends JpaRepository<NotificationPreferences, Long> {
    
    Optional<NotificationPreferences> findByUserId(Long userId);
    
    Optional<NotificationPreferences> findByUser_Email(String email);
}
