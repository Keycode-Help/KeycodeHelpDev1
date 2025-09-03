package org.rma.kchbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notification_preferences")
public class NotificationPreferences {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private KeycodeUser user;
    
    @Column(name = "email_notifications", nullable = false)
    private boolean emailNotifications = true;
    
    @Column(name = "sms_notifications", nullable = false)
    private boolean smsNotifications = true;
    
    @Column(name = "keycode_request_notifications", nullable = false)
    private boolean keycodeRequestNotifications = true;
    
    @Column(name = "keycode_status_notifications", nullable = false)
    private boolean keycodeStatusNotifications = true;
    
    @Column(name = "keycode_completion_notifications", nullable = false)
    private boolean keycodeCompletionNotifications = true;
    
    @Column(name = "admin_notifications", nullable = false)
    private boolean adminNotifications = false;
    
    @Column(name = "marketing_notifications", nullable = false)
    private boolean marketingNotifications = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
