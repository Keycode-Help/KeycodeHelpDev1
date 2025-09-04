package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.NotificationPreferences;
import org.rma.kchbackend.repository.NotificationPreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationPreferencesService {

    @Autowired
    private NotificationPreferencesRepository notificationPreferencesRepository;

    /**
     * Get notification preferences for a user
     */
    public NotificationPreferences getNotificationPreferences(KeycodeUser user) {
        if (user == null) {
            return null;
        }

        Optional<NotificationPreferences> preferences = notificationPreferencesRepository.findByUserId(user.getId());
        
        if (preferences.isPresent()) {
            return preferences.get();
        } else {
            // Create default preferences for new users
            return createDefaultPreferences(user);
        }
    }

    /**
     * Create default notification preferences for a new user
     */
    public NotificationPreferences createDefaultPreferences(KeycodeUser user) {
        NotificationPreferences preferences = new NotificationPreferences();
        preferences.setUser(user);
        preferences.setEmailNotifications(true);
        preferences.setSmsNotifications(true);
        preferences.setKeycodeRequestNotifications(true);
        preferences.setKeycodeStatusNotifications(true);
        preferences.setKeycodeCompletionNotifications(true);
        preferences.setAdminNotifications(false);
        preferences.setMarketingNotifications(false);
        
        return notificationPreferencesRepository.save(preferences);
    }

    /**
     * Update notification preferences for a user
     */
    public NotificationPreferences updateNotificationPreferences(KeycodeUser user, NotificationPreferences newPreferences) {
        NotificationPreferences existingPreferences = getNotificationPreferences(user);
        
        if (existingPreferences == null) {
            existingPreferences = createDefaultPreferences(user);
        }
        
        // Update preferences
        existingPreferences.setEmailNotifications(newPreferences.isEmailNotifications());
        existingPreferences.setSmsNotifications(newPreferences.isSmsNotifications());
        existingPreferences.setKeycodeRequestNotifications(newPreferences.isKeycodeRequestNotifications());
        existingPreferences.setKeycodeStatusNotifications(newPreferences.isKeycodeStatusNotifications());
        existingPreferences.setKeycodeCompletionNotifications(newPreferences.isKeycodeCompletionNotifications());
        existingPreferences.setAdminNotifications(newPreferences.isAdminNotifications());
        existingPreferences.setMarketingNotifications(newPreferences.isMarketingNotifications());
        
        return notificationPreferencesRepository.save(existingPreferences);
    }

    /**
     * Check if user wants to receive email notifications for keycode requests
     */
    public boolean shouldSendEmailNotification(KeycodeUser user, String notificationType) {
        if (user == null) {
            return false;
        }

        NotificationPreferences preferences = getNotificationPreferences(user);
        if (preferences == null || !preferences.isEmailNotifications()) {
            return false;
        }

        switch (notificationType.toLowerCase()) {
            case "request":
                return preferences.isKeycodeRequestNotifications();
            case "status":
                return preferences.isKeycodeStatusNotifications();
            case "completion":
                return preferences.isKeycodeCompletionNotifications();
            case "admin":
                return preferences.isAdminNotifications();
            case "marketing":
                return preferences.isMarketingNotifications();
            default:
                return true; // Default to sending if type is unknown
        }
    }

    /**
     * Check if user wants to receive SMS notifications for keycode requests
     */
    public boolean shouldSendSmsNotification(KeycodeUser user, String notificationType) {
        if (user == null) {
            return false;
        }

        NotificationPreferences preferences = getNotificationPreferences(user);
        if (preferences == null || !preferences.isSmsNotifications()) {
            return false;
        }

        switch (notificationType.toLowerCase()) {
            case "request":
                return preferences.isKeycodeRequestNotifications();
            case "status":
                return preferences.isKeycodeStatusNotifications();
            case "completion":
                return preferences.isKeycodeCompletionNotifications();
            case "admin":
                return preferences.isAdminNotifications();
            case "marketing":
                return preferences.isMarketingNotifications();
            default:
                return true; // Default to sending if type is unknown
        }
    }

    /**
     * Delete notification preferences for a user
     */
    public void deleteNotificationPreferences(KeycodeUser user) {
        if (user != null) {
            notificationPreferencesRepository.findByUserId(user.getId())
                .ifPresent(preferences -> notificationPreferencesRepository.delete(preferences));
        }
    }
}
