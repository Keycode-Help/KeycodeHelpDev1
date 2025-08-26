package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.model.SubscriptionTier;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.TrialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/trial")
@CrossOrigin(origins = "*")
public class TrialController {

    @Autowired
    private TrialService trialService;

    @Autowired
    private KeycodeUserService keycodeUserService;

    /**
     * Get current trial status for authenticated user
     */
    @GetMapping("/status")
    public ResponseEntity<?> getTrialStatus() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Subscription subscription = user.getSubscription();
            TrialService.TrialStatus trialStatus = trialService.getTrialStatus(subscription);

            Map<String, Object> response = new HashMap<>();
            response.put("hasTrial", trialStatus.isTrial());
            response.put("isActive", trialStatus.isActive());
            response.put("remainingDays", trialStatus.getRemainingDays());
            response.put("trialEndsAt", trialStatus.getTrialEndsAt());
            response.put("hasPremiumAccess", trialStatus.isActive() || (subscription != null && subscription.isActivated()));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting trial status: " + e.getMessage());
        }
    }

    /**
     * Start a trial for the authenticated user
     */
    @PostMapping("/start")
    public ResponseEntity<?> startTrial(@RequestParam String tier) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Parse tier
            SubscriptionTier subscriptionTier;
            try {
                subscriptionTier = SubscriptionTier.valueOf(tier.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid subscription tier: " + tier);
            }

            // Start trial
            Subscription trialSubscription = trialService.startTrial(user, subscriptionTier);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Trial started successfully");
            response.put("trialEndsAt", trialSubscription.getTrialEndsAt());
            response.put("remainingDays", 3);

            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Cannot start trial: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error starting trial: " + e.getMessage());
        }
    }

    /**
     * Check if user has premium access (either active subscription or active trial)
     */
    @GetMapping("/premium-access")
    public ResponseEntity<?> checkPremiumAccess() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Subscription subscription = user.getSubscription();
            boolean hasPremiumAccess = false;
            String accessType = "none";

            if (subscription != null) {
                if (subscription.isTrial() && trialService.isTrialActive(subscription)) {
                    hasPremiumAccess = true;
                    accessType = "trial";
                } else if (subscription.isActivated() && !subscription.isTrial()) {
                    hasPremiumAccess = true;
                    accessType = "paid";
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("hasPremiumAccess", hasPremiumAccess);
            response.put("accessType", accessType);
            response.put("subscription", subscription);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error checking premium access: " + e.getMessage());
        }
    }

    /**
     * Get trial expiration info
     */
    @GetMapping("/expiration")
    public ResponseEntity<?> getTrialExpiration() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Subscription subscription = user.getSubscription();
            
            if (subscription == null || !subscription.isTrial()) {
                return ResponseEntity.ok(Map.of("hasTrial", false));
            }

            boolean isExpired = trialService.isTrialExpired(subscription);
            long remainingDays = trialService.getRemainingTrialDays(subscription);

            Map<String, Object> response = new HashMap<>();
            response.put("hasTrial", true);
            response.put("isExpired", isExpired);
            response.put("remainingDays", remainingDays);
            response.put("trialEndsAt", subscription.getTrialEndsAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting trial expiration: " + e.getMessage());
        }
    }
}
