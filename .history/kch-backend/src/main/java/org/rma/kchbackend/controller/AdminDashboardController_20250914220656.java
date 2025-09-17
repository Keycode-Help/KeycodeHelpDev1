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
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "https://keycode.help", "https://www.keycode.help"})
@RestController
@RequestMapping("/admin")
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
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests(Authentication authentication) {
        // Check if user is authenticated and has admin role
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null);
        }
        
        String userRole = getCurrentUserRole(authentication);
        System.out.println("🔍 AdminDashboard - User role: " + userRole);
        if (userRole == null || (!userRole.equalsIgnoreCase("admin") && !userRole.equalsIgnoreCase("super_admin"))) {
            System.out.println("❌ Access denied for user role: " + userRole);
            return ResponseEntity.status(403).body(null);
        }
        System.out.println("✅ Access granted for user role: " + userRole);
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
    
    /**
     * Helper method to get the current user's role from authentication
     */
    private String getCurrentUserRole(Authentication authentication) {
        try {
            if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
                org.springframework.security.core.userdetails.UserDetails userDetails = 
                    (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
                
                System.out.println("🔍 getCurrentUserRole - All authorities: " + userDetails.getAuthorities());
                
                String role = userDetails.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .filter(authority -> authority.startsWith("ROLE_"))
                    .map(authority -> authority.substring(5)) // Remove "ROLE_" prefix
                    .findFirst()
                    .orElse(null);
                    
                System.out.println("🔍 getCurrentUserRole - Extracted role: " + role);
                return role;
            }
            return null;
        } catch (Exception e) {
            System.out.println("❌ Error in getCurrentUserRole: " + e.getMessage());
            return null;
        }
    }



    @GetMapping("/in-progress-requests")
    public ResponseEntity<List<Map<String, Object>>> getInProgressRequests(Authentication authentication) {
        // Check if user is authenticated and has admin role
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null);
        }
        
        String userRole = getCurrentUserRole(authentication);
        if (userRole == null || (!userRole.equalsIgnoreCase("admin") && !userRole.equalsIgnoreCase("super_admin"))) {
            return ResponseEntity.status(403).body(null);
        }
        List<Vehicle> vehicles = vehicleService.getInProgressVehicles();
        List<Map<String, Object>> vehicleDetails = vehicles.stream().map(vehicle -> {
            Map<String, Object> vehicleData = new HashMap<>();
            vehicleData.put("id", vehicle.getId());
            Make make = vehicle.getMake();
            vehicleData.put("make", make != null ? make.getName() : null);

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



    // Utility method to convert byte[] to Base64 string with compression
    private String convertImageToBase64(byte[] image) {
        try {
            if (image == null) {
                System.out.println("🔍 Image is null, returning null");
                return null;
            }
            if (image.length == 0) {
                System.out.println("🔍 Image is empty, returning null");
                return null;
            }
            
            // Detect image format from magic bytes
            String mimeType = detectImageMimeType(image);
            System.out.println("🔍 Detected image MIME type: " + mimeType);
            
            // Compress large images to reduce base64 size
            byte[] compressedImage = compressImageIfNeeded(image, mimeType);
            System.out.println("🔍 Original size: " + image.length + " bytes, Compressed size: " + compressedImage.length + " bytes");
            
            String base64 = "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(compressedImage);
            System.out.println("🔍 Image converted to base64, length: " + base64.length());
            return base64;
        } catch (Exception e) {
            System.err.println("❌ Failed to encode image to base64: " + e.getMessage());
            return null; // or a placeholder string
        }
    }
    
    // Compress image if it's too large
    private byte[] compressImageIfNeeded(byte[] image, String mimeType) {
        // If image is smaller than 500KB, return as-is
        if (image.length <= 500 * 1024) {
            return image;
        }
        
        try {
            // For very large images (>1MB), truncate to prevent frontend issues
            // This is a temporary solution - in production you'd want proper image resizing
            if (image.length > 1024 * 1024) {
                System.out.println("⚠️ Very large image detected (" + image.length + " bytes), truncating to prevent frontend issues");
                // Truncate to 1MB to prevent frontend crashes
                byte[] truncated = new byte[1024 * 1024];
                System.arraycopy(image, 0, truncated, 0, truncated.length);
                return truncated;
            }
            
            System.out.println("⚠️ Large image detected (" + image.length + " bytes), but compression not implemented yet");
            return image;
        } catch (Exception e) {
            System.err.println("❌ Failed to compress image: " + e.getMessage());
            return image; // Return original if compression fails
        }
    }
    
    // Detect image MIME type from magic bytes
    private String detectImageMimeType(byte[] image) {
        if (image.length < 4) {
            return "image/jpeg"; // default fallback
        }
        
        // Check magic bytes
        if (image[0] == (byte) 0xFF && image[1] == (byte) 0xD8 && image[2] == (byte) 0xFF) {
            return "image/jpeg";
        } else if (image[0] == (byte) 0x89 && image[1] == 0x50 && image[2] == 0x4E && image[3] == 0x47) {
            return "image/png";
        } else if (image[0] == 0x47 && image[1] == 0x49 && image[2] == 0x46) {
            return "image/gif";
        } else if (image[0] == 0x42 && image[1] == 0x4D) {
            return "image/bmp";
        } else if (image[0] == 0x52 && image[1] == 0x49 && image[2] == 0x46 && image[3] == 0x46) {
            return "image/webp";
        }
        
        // Default to JPEG if we can't detect
        return "image/jpeg";
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
            
            // Add trial information from KeycodeUser entity (set by activateTrial)
            userData.put("trialEndsAt", user.getTrialEndsAt());
            userData.put("trialStartedAt", user.getTrialStartedAt());
            
            // Add subscription trial information if available
            if (user.getSubscription() != null) {
                userData.put("trial", user.getSubscription().isTrial());
                userData.put("subscriptionTrialEndsAt", user.getSubscription().getTrialEndsAt());
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

    @PostMapping("/users/{id}/activate-trial")
    public ResponseEntity<?> activateTrial(@PathVariable Long id, @RequestBody Map<String, Object> request, Authentication auth) {
        try {
            Optional<KeycodeUser> optionalUser = keycodeUserService.findById(id);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found.");
            }
            
            KeycodeUser user = optionalUser.get();
            
            // Check if user already has an active trial
            System.out.println("🔍 DEBUG activateTrial for user " + id + ":");
            System.out.println("  - user.getTrialEndsAt(): " + user.getTrialEndsAt());
            System.out.println("  - Current time: " + new java.util.Date());
            System.out.println("  - trialEndsAt != null: " + (user.getTrialEndsAt() != null));
            if (user.getTrialEndsAt() != null) {
                System.out.println("  - trialEndsAt.after(now): " + user.getTrialEndsAt().after(new java.util.Date()));
            }
            
            if (user.getTrialEndsAt() != null && user.getTrialEndsAt().after(new java.util.Date())) {
                System.out.println("❌ User already has an active trial - blocking activation");
                return ResponseEntity.badRequest().body("User already has an active trial.");
            }
            
            // Activate trial for 3 days
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.add(java.util.Calendar.DAY_OF_MONTH, 3);
            user.setTrialEndsAt(cal.getTime());
            user.setActive(true);
            user.setAdminApproved(true);
            
            keycodeUserService.saveUser(user);
            
            String adminEmail = auth != null ? auth.getName() : "unknown";
            adminActionLogService.log(adminEmail, "ACTIVATE_TRIAL", id, "3-day trial activated");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Trial activated successfully");
            response.put("trialEndsAt", user.getTrialEndsAt());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error activating trial: " + e.getMessage());
        }
    }

    @PostMapping("/users/{id}/reset-trial")
    public ResponseEntity<?> resetTrial(@PathVariable Long id, Authentication auth) {
        try {
            Optional<KeycodeUser> optionalUser = keycodeUserService.findById(id);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found.");
            }
            
            KeycodeUser user = optionalUser.get();
            
            // Reset trial status
            user.setTrialEndsAt(null);
            keycodeUserService.saveUser(user);
            
            String adminEmail = auth != null ? auth.getName() : "unknown";
            adminActionLogService.log(adminEmail, "RESET_TRIAL", id, "Trial status reset");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Trial status reset successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error resetting trial: " + e.getMessage());
        }
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

    // Debug endpoint to test image conversion
    @GetMapping("/debug/images")
    public ResponseEntity<Map<String, Object>> debugImages() {
        Map<String, Object> debugInfo = new HashMap<>();
        
        try {
            // Get a sample user with images
            List<KeycodeUser> users = keycodeUserService.getAllUsers();
            if (!users.isEmpty()) {
                KeycodeUser user = users.get(0);
                debugInfo.put("userEmail", user.getEmail());
                debugInfo.put("hasFrontId", user.getFrontId() != null && user.getFrontId().length > 0);
                debugInfo.put("hasBackId", user.getBackId() != null && user.getBackId().length > 0);
                debugInfo.put("hasInsurance", user.getInsurance() != null && user.getInsurance().length > 0);
                
                if (user.getFrontId() != null && user.getFrontId().length > 0) {
                    debugInfo.put("frontIdLength", user.getFrontId().length);
                    debugInfo.put("frontIdBase64", convertImageToBase64(user.getFrontId()));
                }
            }
            
            // Get a sample vehicle with images - commented out until findAll method is available
            // List<Vehicle> vehicles = vehicleService.findAll();
            // if (!vehicles.isEmpty()) {
            //     Vehicle vehicle = vehicles.get(0);
            //     debugInfo.put("vehicleId", vehicle.getId());
            //     debugInfo.put("hasVehicleFrontId", vehicle.getFrontId() != null && vehicle.getFrontId().length > 0);
            //     debugInfo.put("hasVehicleBackId", vehicle.getBackId() != null && vehicle.getBackId().length > 0);
            //     debugInfo.put("hasVehicleRegistration", vehicle.getRegistration() != null && vehicle.getRegistration().length > 0);
            //     
            //     if (vehicle.getFrontId() != null && vehicle.getFrontId().length > 0) {
            //         debugInfo.put("vehicleFrontIdLength", vehicle.getFrontId().length);
            //         debugInfo.put("vehicleFrontIdBase64", convertImageToBase64(vehicle.getFrontId()));
            //     }
            // }
            
            return ResponseEntity.ok(debugInfo);
        } catch (Exception e) {
            debugInfo.put("error", e.getMessage());
            return ResponseEntity.status(500).body(debugInfo);
        }
    }
}
