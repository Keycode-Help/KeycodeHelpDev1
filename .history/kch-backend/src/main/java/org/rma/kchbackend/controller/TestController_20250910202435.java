package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.model.SubscriptionTier;
import org.rma.kchbackend.repository.KeycodeUserRepository;
import org.rma.kchbackend.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "https://keycode.help", "https://www.keycode.help"})
@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private KeycodeUserRepository keycodeUserRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @PostMapping("/create-test-users")
    public ResponseEntity<String> createTestUsers() {
        try {
            // Create test users with different validation and trial statuses
            
            // Test user 1: Pending validation
            KeycodeUser pendingUser = new KeycodeUser();
            pendingUser.setFname("John");
            pendingUser.setLname("Doe");
            pendingUser.setEmail("john.doe@test.com");
            pendingUser.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
            pendingUser.setRole(Role.BASEUSER);
            pendingUser.setCompany("Test Company");
            pendingUser.setAdminApproved(false);
            pendingUser.setActive(true);
            pendingUser.setState("CA");
            pendingUser.setValidatedUser(false);
            pendingUser.setPhone("555-0101");
            keycodeUserRepository.save(pendingUser);

            // Test user 2: Validated with active trial
            KeycodeUser trialUser = new KeycodeUser();
            trialUser.setFname("Jane");
            trialUser.setLname("Smith");
            trialUser.setEmail("jane.smith@test.com");
            trialUser.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
            trialUser.setRole(Role.BASEUSER);
            trialUser.setCompany("Test Company 2");
            trialUser.setAdminApproved(true);
            trialUser.setActive(true);
            trialUser.setState("NY");
            trialUser.setValidatedUser(true);
            trialUser.setPhone("555-0102");
            keycodeUserRepository.save(trialUser);

            // Create active trial subscription for Jane
            Subscription trialSubscription = new Subscription();
            trialSubscription.setTier(SubscriptionTier.PREMIUM);
            trialSubscription.setKeycodeUser(trialUser);
            trialSubscription.setTrial(true);
            trialSubscription.setTrialEndsAt(OffsetDateTime.now().plusDays(3));
            trialSubscription.setActivated(false);
            subscriptionRepository.save(trialSubscription);

            // Test user 3: Validated with expired trial
            KeycodeUser expiredTrialUser = new KeycodeUser();
            expiredTrialUser.setFname("Bob");
            expiredTrialUser.setLname("Johnson");
            expiredTrialUser.setEmail("bob.johnson@test.com");
            expiredTrialUser.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
            expiredTrialUser.setRole(Role.BASEUSER);
            expiredTrialUser.setCompany("Test Company 3");
            expiredTrialUser.setAdminApproved(true);
            expiredTrialUser.setActive(true);
            expiredTrialUser.setState("TX");
            expiredTrialUser.setValidatedUser(true);
            expiredTrialUser.setPhone("555-0103");
            keycodeUserRepository.save(expiredTrialUser);

            // Create expired trial subscription for Bob
            Subscription expiredTrialSubscription = new Subscription();
            expiredTrialSubscription.setTier(SubscriptionTier.PREMIUM);
            expiredTrialSubscription.setKeycodeUser(expiredTrialUser);
            expiredTrialSubscription.setTrial(true);
            expiredTrialSubscription.setTrialEndsAt(OffsetDateTime.now().minusDays(1));
            expiredTrialSubscription.setActivated(false);
            subscriptionRepository.save(expiredTrialSubscription);

            // Test user 4: Pro user
            KeycodeUser proUser = new KeycodeUser();
            proUser.setFname("Alice");
            proUser.setLname("Brown");
            proUser.setEmail("alice.brown@test.com");
            proUser.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
            proUser.setRole(Role.BASEUSER);
            proUser.setCompany("Test Company 4");
            proUser.setAdminApproved(true);
            proUser.setActive(true);
            proUser.setState("FL");
            proUser.setValidatedUser(true);
            proUser.setPhone("555-0104");
            keycodeUserRepository.save(proUser);

            // Create pro subscription for Alice
            Subscription proSubscription = new Subscription();
            proSubscription.setTier(SubscriptionTier.PREMIUM);
            proSubscription.setKeycodeUser(proUser);
            proSubscription.setTrial(false);
            proSubscription.setTrialEndsAt(null);
            proSubscription.setActivated(true);
            subscriptionRepository.save(proSubscription);

            return ResponseEntity.ok("Test users created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating test users: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<KeycodeUser>> getAllTestUsers() {
        List<KeycodeUser> users = keycodeUserRepository.findAll();
        return ResponseEntity.ok(users);
    }
}
