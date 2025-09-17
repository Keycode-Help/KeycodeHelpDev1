package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.model.SubscriptionTier;
import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.repository.KeycodeUserRepository;
import org.rma.kchbackend.repository.SubscriptionRepository;
import org.rma.kchbackend.repository.TransactionRepository;
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

    @Autowired
    private TransactionRepository transactionRepository;

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

    @PostMapping("/create-test-transactions")
    public ResponseEntity<String> createTestTransactions() {
        try {
            // Get test users
            KeycodeUser janeUser = keycodeUserRepository.findByEmail("jane.smith@test.com");
            KeycodeUser aliceUser = keycodeUserRepository.findByEmail("alice.brown@test.com");
            KeycodeUser bobUser = keycodeUserRepository.findByEmail("bob.johnson@test.com");

            if (janeUser == null || aliceUser == null || bobUser == null) {
                return ResponseEntity.badRequest().body("Test users not found. Please create test users first.");
            }

            // Create test transaction 1 for Jane Smith
            Transaction transaction1 = new Transaction();
            transaction1.setConfirmationNumber("TXN-" + System.currentTimeMillis() + "-001");
            transaction1.setStatus("completed");
            transaction1.setTransactionAmount(99.99);
            transaction1.setKeycodeUser(janeUser);
            transactionRepository.save(transaction1);

            // Create test transaction 2 for Alice Brown
            Transaction transaction2 = new Transaction();
            transaction2.setConfirmationNumber("TXN-" + System.currentTimeMillis() + "-002");
            transaction2.setStatus("pending");
            transaction2.setTransactionAmount(199.99);
            transaction2.setKeycodeUser(aliceUser);
            transactionRepository.save(transaction2);

            // Create test transaction 3 for Bob Johnson
            Transaction transaction3 = new Transaction();
            transaction3.setConfirmationNumber("TXN-" + System.currentTimeMillis() + "-003");
            transaction3.setStatus("completed");
            transaction3.setTransactionAmount(149.99);
            transaction3.setKeycodeUser(bobUser);
            transactionRepository.save(transaction3);

            // Create test transaction 4 for Alice Brown (another transaction)
            Transaction transaction4 = new Transaction();
            transaction4.setConfirmationNumber("TXN-" + System.currentTimeMillis() + "-004");
            transaction4.setStatus("completed");
            transaction4.setTransactionAmount(299.99);
            transaction4.setKeycodeUser(aliceUser);
            transactionRepository.save(transaction4);

            return ResponseEntity.ok("Test transactions created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating test transactions: " + e.getMessage());
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTestTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return ResponseEntity.ok(transactions);
    }
}
