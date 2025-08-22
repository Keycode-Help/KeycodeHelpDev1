package org.rma.kchbackend.controller;

import org.rma.kchbackend.dto.ProcessRequestDto;
import org.rma.kchbackend.dto.SubscriptionDto;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.service.*;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDashboardController {

    private final VehicleService vehicleService;
    private final TransactionService transactionService;
    private final SubscriptionService subscriptionService;
    private final KeycodeUserService keycodeUserService;
    private final EmailService emailService;
    private final AdminActionLogService adminActionLogService;

    @Autowired
    public AdminDashboardController(
            VehicleService vehicleService,
            TransactionService transactionService,
            SubscriptionService subscriptionService,
            KeycodeUserService keycodeUserService,
            EmailService emailService,
            AdminActionLogService adminActionLogService) {
        this.vehicleService = vehicleService;
        this.transactionService = transactionService;
        this.subscriptionService = subscriptionService;
        this.keycodeUserService = keycodeUserService;
        this.emailService = emailService;
        this.adminActionLogService = adminActionLogService;
    }



    @GetMapping("/pending-requests")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests() {
        List<Vehicle> vehicles = vehicleService.getPendingVehicles();
        System.out.println("Fetched " + vehicles.size() + " pending vehicles");

        List<Map<String, Object>> vehicleDetails = vehicles.stream().map(vehicle -> {
            Map<String, Object> vehicleData = new HashMap<>();
            vehicleData.put("id", vehicle.getId());
            Make make = vehicle.getMake();
            vehicleData.put("make", make != null ? make.getName() : null);

            vehicleData.put("model", vehicle.getModel());
            vehicleData.put("vin", vehicle.getVin());
            vehicleData.put("status", vehicle.getStatus());
            vehicleData.put("keycode", vehicle.getKeycode());
        vehicleData.put("frontId", vehicle.getFrontId() != null ? convertImageToBase64(vehicle.getFrontId()) : null);
        vehicleData.put("backId", vehicle.getBackId() != null ? convertImageToBase64(vehicle.getBackId()) : null);
        vehicleData.put("registration", vehicle.getRegistration() != null ? convertImageToBase64(vehicle.getRegistration()) : null);
        vehicleData.put("price", vehicle.getKeycodePrice());
            if (vehicle.getKeycodeUser() != null) {
                vehicleData.put("keycodeUserEmail", vehicle.getKeycodeUser().getEmail());
                vehicleData.put("isValidatedUser", vehicle.getKeycodeUser().isValidatedUser());
            } else {
                vehicleData.put("keycodeUserEmail", null);
                vehicleData.put("isValidatedUser", false);
            }
            return vehicleData;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(vehicleDetails);
    }



    @GetMapping("/in-progress-requests")
    public ResponseEntity<List<Map<String, Object>>> getInProgressRequests() {
        List<Vehicle> vehicles = vehicleService.getInProgressVehicles();
        List<Map<String, Object>> vehicleDetails = vehicles.stream().map(vehicle -> {
            Map<String, Object> vehicleData = new HashMap<>();
            vehicleData.put("id", vehicle.getId());
            Make make = vehicle.getMake();
            vehicleData.put("make", make != null ? make.getManufacturerName() : null);

            vehicleData.put("model", vehicle.getModel());
            vehicleData.put("vin", vehicle.getVin());
            vehicleData.put("status", vehicle.getStatus());
            vehicleData.put("keycode", vehicle.getKeycode());
            vehicleData.put("frontId", (vehicle.getFrontId() != null && vehicle.getFrontId().length > 0) ? convertImageToBase64(vehicle.getFrontId()) : null);
            vehicleData.put("backId", (vehicle.getBackId() != null && vehicle.getBackId().length > 0) ? convertImageToBase64(vehicle.getBackId()) : null);
            vehicleData.put("registration", (vehicle.getRegistration() != null && vehicle.getRegistration().length > 0) ? convertImageToBase64(vehicle.getRegistration()) : null);
            vehicleData.put("registration", vehicle.getRegistration() != null ? convertImageToBase64(vehicle.getRegistration()) : null);
            vehicleData.put("price", vehicle.getKeycodePrice());
            // Include keycode user email and validation status
            if (vehicle.getKeycodeUser() != null) {
                vehicleData.put("keycodeUserEmail", vehicle.getKeycodeUser().getEmail());
                vehicleData.put("isValidatedUser", vehicle.getKeycodeUser().isValidatedUser());
            } else {
                vehicleData.put("keycodeUserEmail", null);
                vehicleData.put("isValidatedUser", false);
            }
            return vehicleData;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(vehicleDetails);
    }



    // Utility method to convert byte[] to Base64 string
    private String convertImageToBase64(byte[] image) {
        try {
            return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(image);
        } catch (Exception e) {
            System.err.println("Failed to encode image to base64: " + e.getMessage());
            return null; // or a placeholder string
        }
    }


    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {

        List<Transaction> transactions = transactionService.getAllTransactions();

        // Filter by status
        if (status != null && !status.isEmpty()) {
            transactions = transactions.stream()
                    .filter(t -> t.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        // Search by confirmation number or vehicle VIN
        if (search != null && !search.isEmpty()) {
            transactions = transactions.stream()
                    .filter(t -> t.getConfirmationNumber().contains(search) ||
                            t.getVehicles().stream().anyMatch(v -> v.getVin().contains(search)))
                    .collect(Collectors.toList());
        }

        // Sort transactions
        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<Transaction> comparator;
            switch (sortBy.toLowerCase()) {
                case "confirmationnumber":
                    comparator = Comparator.comparing(Transaction::getConfirmationNumber);
                    break;
                case "status":
                    comparator = Comparator.comparing(Transaction::getStatus);
                    break;
                default:
                    comparator = Comparator.comparing(Transaction::getId);
            }
            if ("desc".equalsIgnoreCase(sortOrder)) {
                comparator = comparator.reversed();
            }
            transactions = transactions.stream().sorted(comparator).collect(Collectors.toList());
        }

        return transactions;
    }

    @GetMapping("/subscriptions")
    public List<SubscriptionDto> getAllSubscriptions() {
        //Changed by Nithya - Retrieving subscriptions which are checked out by the user
        return subscriptionService.getActivatedSubscriptions().stream()
                .map(subscription -> new SubscriptionDto(
                        subscription.getId(),
                        subscription.getTier().name(),
                        subscription.getKeycodeUser() != null ? subscription.getKeycodeUser().getEmail() : null
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/process-request")
    public String processRequest(@RequestBody ProcessRequestDto request) throws IOException {
        return vehicleService.processVehicleRequest(request.getVehicleId(), request.getKeycode(), request.getPincode());
    }

    @GetMapping("/user-history")
    public ResponseEntity<?> getUserHistory(@RequestParam String email) {
        Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        KeycodeUser user = userOptional.get();
        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<KeycodeUser> users = keycodeUserService.getAllUsers();
        List<Map<String, Object>> userDetails = users.stream().map(user -> {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("fname", user.getFname());
            userData.put("lname", user.getLname());
            userData.put("phone", user.getPhone());
            userData.put("state", user.getState());
            userData.put("isValidatedUser", user.isValidatedUser());
            userData.put("frontId", keycodeUserService.convertImageToBase64(user.getFrontId()));
            userData.put("backId", keycodeUserService.convertImageToBase64(user.getBackId()));
            userData.put("insurance", keycodeUserService.convertImageToBase64(user.getInsurance()));
            userData.put("isActive", user.isActive());
            if (user.getSubscription() != null) {
                userData.put("trial", user.getSubscription().isTrial());
                userData.put("trialEndsAt", user.getSubscription().getTrialEndsAt());
            }
            return userData;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userDetails);
    }

    @PatchMapping("/users/{id}/revoke")
    public ResponseEntity<?> revokeUser(@PathVariable Long id, Authentication auth) {
        Optional<KeycodeUser> optionalUser = keycodeUserService.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        KeycodeUser user = optionalUser.get();
        user.setActive(false);
        keycodeUserService.saveUser(user);
        String adminEmail = auth != null ? auth.getName() : "unknown";
        adminActionLogService.log(adminEmail, "REVOKE_USER", id, "Revoked user access");
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/users/{id}/notes")
    public ResponseEntity<?> updateAdminNotes(@PathVariable Long id, @RequestParam("notes") String notes, Authentication auth) {
        Optional<KeycodeUser> optionalUser = keycodeUserService.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        KeycodeUser user = optionalUser.get();
        user.setAdminApprovalNotes(notes);
        keycodeUserService.saveUser(user);
        String adminEmail = auth != null ? auth.getName() : "unknown";
        adminActionLogService.log(adminEmail, "UPDATE_NOTES", id, notes);
        return ResponseEntity.ok().build();
    }




    @PostMapping("/notify-user/{id}")
    public ResponseEntity<String> notifyUser(@PathVariable Long id, @RequestParam("message") String message) {
        try {
            Optional<KeycodeUser> optionalUser = keycodeUserService.findById(id);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found.");
            }
            KeycodeUser user = optionalUser.get();
            System.out.println("To Email:"+user.getEmail());
            emailService.sendNotificationEmail(user.getFname(),user.getEmail(), "UPDATE REQUIRED!", message);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send notification email.");
        }
        return ResponseEntity.ok("Notification email sent successfully.");
    }



    @PatchMapping("/validate-user/{id}")
    public ResponseEntity<String> validateUser(@PathVariable Long id) {
        Optional<KeycodeUser> optionalUser = keycodeUserService.findById(id);
        if (optionalUser.isPresent()) {
            KeycodeUser user = optionalUser.get();
            user.setValidatedUser(true);
            keycodeUserService.saveUser(user);
            return ResponseEntity.ok("User validated successfully.");
        } else {
            return ResponseEntity.badRequest().body("User not found.");
        }
    }



    @PostMapping("/update-request-status/{vehicleId}")
    public String updatePendingRequestStatus(@PathVariable Long vehicleId) throws IOException {

        return vehicleService.updatePendingRequestStatus(vehicleId);
    }
}
