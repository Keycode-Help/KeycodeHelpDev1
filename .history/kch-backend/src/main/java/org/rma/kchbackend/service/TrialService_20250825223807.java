package org.rma.kchbackend.service;

import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class TrialService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    /**
     * Check if a user's trial is still active
     */
    public boolean isTrialActive(Subscription subscription) {
        if (subscription == null || !subscription.isTrial()) {
            return false;
        }
        
        OffsetDateTime trialEndsAt = subscription.getTrialEndsAt();
        if (trialEndsAt == null) {
            return false;
        }
        
        return OffsetDateTime.now().isBefore(trialEndsAt);
    }

    /**
     * Check if a user's trial has expired
     */
    public boolean isTrialExpired(Subscription subscription) {
        if (subscription == null || !subscription.isTrial()) {
            return false;
        }
        
        OffsetDateTime trialEndsAt = subscription.getTrialEndsAt();
        if (trialEndsAt == null) {
            return false;
        }
        
        return OffsetDateTime.now().isAfter(trialEndsAt);
    }

    /**
     * Get remaining trial time in days
     */
    public long getRemainingTrialDays(Subscription subscription) {
        if (subscription == null || !subscription.isTrial()) {
            return 0;
        }
        
        OffsetDateTime trialEndsAt = subscription.getTrialEndsAt();
        if (trialEndsAt == null) {
            return 0;
        }
        
        OffsetDateTime now = OffsetDateTime.now();
        if (now.isAfter(trialEndsAt)) {
            return 0;
        }
        
        return ChronoUnit.DAYS.between(now, trialEndsAt);
    }

    /**
     * Start a 3-day trial for a user
     */
    public Subscription startTrial(KeycodeUser user, SubscriptionTier tier) {
        // Check if user already has an active trial
        Subscription existingSubscription = user.getSubscription();
        if (existingSubscription != null && existingSubscription.isTrial() && isTrialActive(existingSubscription)) {
            throw new IllegalStateException("User already has an active trial");
        }
        
        // Create new trial subscription
        Subscription trialSubscription = new Subscription(tier);
        trialSubscription.setKeycodeUser(user);
        trialSubscription.setTrial(true);
        trialSubscription.setActivated(true);
        trialSubscription.setTrialEndsAt(OffsetDateTime.now().plusDays(3));
        
        return subscriptionRepository.save(trialSubscription);
    }

    /**
     * Convert trial to paid subscription
     */
    public Subscription convertTrialToPaid(Subscription trialSubscription, SubscriptionTier paidTier) {
        if (trialSubscription == null || !trialSubscription.isTrial()) {
            throw new IllegalStateException("Subscription is not a trial");
        }
        
        trialSubscription.setTrial(false);
        trialSubscription.setTrialEndsAt(null);
        trialSubscription.setTier(paidTier);
        
        return subscriptionRepository.save(trialSubscription);
    }

    /**
     * Handle trial expiration - deactivate trial benefits
     */
    public void handleTrialExpiration(Subscription subscription) {
        if (subscription != null && subscription.isTrial() && isTrialExpired(subscription)) {
            // Deactivate trial benefits
            subscription.setActivated(false);
            subscriptionRepository.save(subscription);
        }
    }

    /**
     * Check and handle expired trials for all users
     */
    public void checkAndHandleExpiredTrials() {
        // This could be called by a scheduled task
        // For now, we'll handle it when checking individual subscriptions
    }

    /**
     * Get trial status summary for a user
     */
    public TrialStatus getTrialStatus(Subscription subscription) {
        if (subscription == null || !subscription.isTrial()) {
            return new TrialStatus(false, false, 0, null);
        }
        
        boolean isActive = isTrialActive(subscription);
        boolean isExpired = isTrialExpired(subscription);
        long remainingDays = getRemainingTrialDays(subscription);
        
        return new TrialStatus(true, isActive, remainingDays, subscription.getTrialEndsAt());
    }

    /**
     * Trial status data class
     */
    public static class TrialStatus {
        private final boolean isTrial;
        private final boolean isActive;
        private final long remainingDays;
        private final OffsetDateTime trialEndsAt;

        public TrialStatus(boolean isTrial, boolean isActive, long remainingDays, OffsetDateTime trialEndsAt) {
            this.isTrial = isTrial;
            this.isActive = isActive;
            this.remainingDays = remainingDays;
            this.trialEndsAt = trialEndsAt;
        }

        // Getters
        public boolean isTrial() { return isTrial; }
        public boolean isActive() { return isActive; }
        public long getRemainingDays() { return remainingDays; }
        public OffsetDateTime getTrialEndsAt() { return trialEndsAt; }
    }
}
