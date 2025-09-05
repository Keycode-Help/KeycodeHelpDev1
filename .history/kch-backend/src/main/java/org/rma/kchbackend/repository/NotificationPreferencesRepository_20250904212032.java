package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.NotificationPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferencesRepository extends JpaRepository<NotificationPreferences, Long> {
    
    @Query("SELECT np FROM NotificationPreferences np WHERE np.user.id = :userId")
    Optional<NotificationPreferences> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT np FROM NotificationPreferences np WHERE np.user.email = :email")
    Optional<NotificationPreferences> findByUserEmail(@Param("email") String email);
}
