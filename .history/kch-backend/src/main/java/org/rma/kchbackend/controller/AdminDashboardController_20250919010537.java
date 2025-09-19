package org.rma.kchbackend.controller;

import org.rma.kchbackend.dto.ProcessRequestDto;
import org.rma.kchbackend.dto.SubscriptionDto;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.model.Transaction;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.service.*;
import org.rma.kchbackend.repository.VehicleRepository;
import org.rma.kchbackend.repository.AdminActionLogRepository;
import org.rma.kchbackend.model.AdminActionLog;
import org.rma.kchbackend.model.Role;
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
    private final VehicleRepository vehicleRepository;
    private final AdminActionLogRepository adminActionLogRepository;

    @Autowired
    public AdminDashboardController(
            VehicleService vehicleService,
            TransactionService transactionService,
            SubscriptionService subscriptionService,
            KeycodeUserService keycodeUserService,
            EmailService emailService,
            AdminActionLogService adminActionLogService,
            VehicleRepository vehicleRepository,
            AdminActionLogRepository adminActionLogRepository) {
        this.vehicleService = vehicleService;
        this.transactionService = transactionService;
        this.subscriptionService = subscriptionService;
        this.keycodeUserService = keycodeUserService;
        this.emailService = emailService;
        this.adminActionLogService = adminActionLogService;
        this.vehicleRepository = vehicleRepository;
        this.adminActionLogRepository = adminActionLogRepository;
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
    public ResponseEntity<?> getUserHistory(@RequestParam String email, 
                                          @RequestParam(required = false) String nastfMode,
                                          @RequestParam(required = false) String adminLogsMode,
                                          @RequestParam(required = false) String adminEmailFilter,
                                          @RequestParam(required = false) String actionFilter,
                                          @RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "50") int size,
                                          Authentication auth) {
        
        // Admin activity logs mode
        if ("true".equals(adminLogsMode)) {
            System.out.println("🚀 ==> ADMIN ACTIVITY LOGS MODE ACTIVATED <==");
            
            try {
                String requestingAdminEmail = auth != null ? auth.getName() : "unknown";
                
                // Verify requesting user is a super admin
                Optional<KeycodeUser> requestingAdminOpt = keycodeUserService.findByEmail(requestingAdminEmail);
                if (requestingAdminOpt.isEmpty()) {
                    return ResponseEntity.status(403).body("Admin user not found");
                }
                
                KeycodeUser requestingAdmin = requestingAdminOpt.get();
                if (requestingAdmin.getRole() != Role.SUPER_ADMIN) {
                    adminActionLogService.log(requestingAdminEmail, "VIEW_ADMIN_LOGS_DENIED", null, 
                        "Non-super admin attempted to view admin activity logs");
                    return ResponseEntity.status(403).body("Only super admins can view admin activity logs");
                }
                
                // Log the access
                adminActionLogService.log(requestingAdminEmail, "VIEW_ADMIN_LOGS", null, 
                    "Super admin accessed admin activity logs");
                
                // Get all admin action logs
                List<AdminActionLog> allLogs = adminActionLogRepository.findAll();
                
                // Apply filters
                if (adminEmailFilter != null && !adminEmailFilter.trim().isEmpty()) {
                    allLogs = allLogs.stream()
                        .filter(log -> log.getAdminEmail().toLowerCase().contains(adminEmailFilter.toLowerCase()))
                        .collect(Collectors.toList());
                }
                
                if (actionFilter != null && !actionFilter.trim().isEmpty()) {
                    allLogs = allLogs.stream()
                        .filter(log -> log.getAction().toLowerCase().contains(actionFilter.toLowerCase()))
                        .collect(Collectors.toList());
                }
                
                // Sort by most recent first
                allLogs.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
                
                // Apply pagination
                int start = page * size;
                int end = Math.min(start + size, allLogs.size());
                List<AdminActionLog> paginatedLogs = allLogs.subList(start, end);
                
                // Return simple log data without enhancement to avoid timeouts
                List<Map<String, Object>> simpleLogs = paginatedLogs.stream().map(log -> {
                    Map<String, Object> logData = new HashMap<>();
                    logData.put("id", log.getId());
                    logData.put("adminEmail", log.getAdminEmail());
                    logData.put("action", log.getAction());
                    logData.put("targetUserId", log.getTargetUserId());
                    logData.put("details", log.getDetails());
                    logData.put("createdAt", log.getCreatedAt());
                    
                    // Add target user information if available
                    if (log.getTargetUserId() != null) {
                        Optional<KeycodeUser> targetUserOpt = keycodeUserService.findById(log.getTargetUserId());
                        if (targetUserOpt.isPresent()) {
                            KeycodeUser targetUser = targetUserOpt.get();
                            logData.put("targetUserEmail", targetUser.getEmail());
                            logData.put("targetUserName", targetUser.getFname() + " " + targetUser.getLname());
                            logData.put("targetUserRole", targetUser.getRole());
                        }
                    }
                    
                    // Add admin user information
                    Optional<KeycodeUser> adminUserOpt = keycodeUserService.findByEmail(log.getAdminEmail());
                    if (adminUserOpt.isPresent()) {
                        KeycodeUser adminUser = adminUserOpt.get();
                        logData.put("adminName", adminUser.getFname() + " " + adminUser.getLname());
                        logData.put("adminRole", adminUser.getRole());
                    }
                    
                    return logData;
                }).collect(Collectors.toList());
                
                Map<String, Object> response = new HashMap<>();
                response.put("logs", enhancedLogs);
                response.put("totalCount", allLogs.size());
                response.put("page", page);
                response.put("size", size);
                response.put("hasMore", end < allLogs.size());
                
                System.out.println("✅ Returning " + enhancedLogs.size() + " admin activity logs");
                return ResponseEntity.ok(response);
                
            } catch (Exception e) {
                String requestingAdminEmail = auth != null ? auth.getName() : "unknown";
                adminActionLogService.log(requestingAdminEmail, "VIEW_ADMIN_LOGS_ERROR", null, 
                    "Error viewing admin logs: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error fetching admin activity logs: " + e.getMessage());
            }
        }
        
        // NASTF compliance mode
        if ("true".equals(nastfMode)) {
            System.out.println("🚀 ==> NASTF COMPLIANCE MODE ACTIVATED <==");
            System.out.println("✅ Authentication working through user-history endpoint");
            
            try {
                List<Map<String, Object>> complianceData = new ArrayList<>();
                List<Transaction> allTransactions = transactionService.getAllTransactions();
                
                System.out.println("📊 Found " + allTransactions.size() + " total transactions");
                
                for (Transaction transaction : allTransactions) {
                    if (transaction.getVehicles() != null) {
                        for (Vehicle vehicle : transaction.getVehicles()) {
                            Map<String, Object> data = new HashMap<>();
                            data.put("transactionId", transaction.getId());
                            data.put("confirmationNumber", transaction.getConfirmationNumber());
                            data.put("vehicleId", vehicle.getId());
                            data.put("vin", vehicle.getVin());
                            data.put("make", vehicle.getMake() != null ? vehicle.getMake().getName() : "Unknown");
                            data.put("model", vehicle.getModel());
                            data.put("year", vehicle.getYear());
                            data.put("status", vehicle.getStatus());
                            data.put("keycode", vehicle.getKeycode());
                            
                            // Use current time for testing since createdAt might not be available
                            data.put("createdAt", java.time.LocalDateTime.now());
                            data.put("daysSinceOrder", 1); // Mock for testing
                            data.put("daysRemaining", 3);
                            data.put("isUrgent", false);
                            data.put("isOverdue", false);
                            
                            // User information
                            KeycodeUser user = transaction.getKeycodeUser();
                            if (user != null) {
                                data.put("userEmail", user.getEmail());
                                data.put("userName", user.getFname() + " " + user.getLname());
                                data.put("userState", user.getState());
                                data.put("userCompany", user.getCompany());
                            }
                            
                            // Document availability
                            data.put("hasFrontId", vehicle.getFrontId() != null);
                            data.put("hasBackId", vehicle.getBackId() != null);
                            data.put("hasRegistration", vehicle.getRegistration() != null);
                            
                            complianceData.add(data);
                        }
                    }
                }
                
                System.out.println("✅ Returning " + complianceData.size() + " compliance records");
                return ResponseEntity.ok(complianceData);
                
            } catch (Exception e) {
                System.out.println("❌ Error in NASTF compliance mode: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(500).body("NASTF Error: " + e.getMessage());
            }
        }
        
        // Regular user history mode
        Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        KeycodeUser user = userOptional.get();
        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/nastf-compliance")
    public ResponseEntity<?> getNastfComplianceData(@RequestParam(required = false) String status, Authentication auth) {
        System.out.println("🚀 ==> NASTF COMPLIANCE ENDPOINT HIT <==");
        System.out.println("🔍 NASTF Compliance Endpoint Called:");
        System.out.println("  - Principal: " + (auth != null ? auth.getName() : "null"));
        System.out.println("  - Authorities: " + (auth != null ? auth.getAuthorities() : "null"));
        System.out.println("  - Is Authenticated: " + (auth != null ? auth.isAuthenticated() : "false"));
        System.out.println("  - Authentication Type: " + (auth != null ? auth.getClass().getSimpleName() : "null"));
        System.out.println("  - Status Parameter: " + status);
        System.out.println("🚀 ==> CONTINUING WITH ENDPOINT LOGIC <==");
        
        // Return actual NASTF compliance data
        try {
            List<Map<String, Object>> complianceData = new ArrayList<>();
            List<Transaction> allTransactions = transactionService.getAllTransactions();
            
            System.out.println("📊 Found " + allTransactions.size() + " total transactions");
            
            for (Transaction transaction : allTransactions) {
                if (transaction.getVehicles() != null) {
                    for (Vehicle vehicle : transaction.getVehicles()) {
                        Map<String, Object> data = new HashMap<>();
                        data.put("transactionId", transaction.getId());
                        data.put("confirmationNumber", transaction.getConfirmationNumber());
                        data.put("vehicleId", vehicle.getId());
                        data.put("vin", vehicle.getVin());
                        data.put("make", vehicle.getMake() != null ? vehicle.getMake().getName() : "Unknown");
                        data.put("model", vehicle.getModel());
                        data.put("year", vehicle.getYear());
                        data.put("status", vehicle.getStatus());
                        data.put("keycode", vehicle.getKeycode());
                        
                        // Calculate days for NASTF compliance (using mock data for now since createdAt might be null)
                        if (vehicle.getCreatedAt() != null) {
                            long daysSinceOrder = java.time.Duration.between(
                                vehicle.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant(),
                                java.time.Instant.now()
                            ).toDays();
                            data.put("daysSinceOrder", daysSinceOrder);
                            data.put("daysRemaining", Math.max(0, 4 - daysSinceOrder));
                            data.put("isUrgent", daysSinceOrder >= 3);
                            data.put("isOverdue", daysSinceOrder >= 4);
                        } else {
                            // Mock data for testing when createdAt is null
                            data.put("daysSinceOrder", 1);
                            data.put("daysRemaining", 3);
                            data.put("isUrgent", false);
                            data.put("isOverdue", false);
                        }
                        data.put("createdAt", vehicle.getCreatedAt() != null ? vehicle.getCreatedAt() : java.time.LocalDateTime.now().minusDays(1));
                        
                        // User information
                        KeycodeUser user = transaction.getKeycodeUser();
                        if (user != null) {
                            data.put("userEmail", user.getEmail());
                            data.put("userName", user.getFname() + " " + user.getLname());
                            data.put("userState", user.getState());
                            data.put("userCompany", user.getCompany());
                        }
                        
                        // Document availability
                        data.put("hasFrontId", vehicle.getFrontId() != null);
                        data.put("hasBackId", vehicle.getBackId() != null);
                        data.put("hasRegistration", vehicle.getRegistration() != null);
                        
                        complianceData.add(data);
                    }
                }
            }
            
            // Filter by status if requested
            if ("urgent".equals(status)) {
                complianceData = complianceData.stream()
                    .filter(data -> Boolean.TRUE.equals(data.get("isUrgent")))
                    .collect(Collectors.toList());
            }
            
            // Sort by urgency (most urgent first)
            complianceData.sort((a, b) -> {
                Boolean aUrgent = (Boolean) a.get("isUrgent");
                Boolean bUrgent = (Boolean) b.get("isUrgent");
                if (aUrgent != null && bUrgent != null) {
                    return bUrgent.compareTo(aUrgent);
                }
                return 0;
            });
            
            System.out.println("✅ Returning " + complianceData.size() + " compliance records");
            return ResponseEntity.ok(complianceData);
            
        } catch (Exception e) {
            System.out.println("❌ Error in NASTF compliance: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("NASTF Error: " + e.getMessage());
        }
    }

    @GetMapping("/nastf-compliance/{vehicleId}/documents")
    public ResponseEntity<?> downloadNastfDocuments(@PathVariable Long vehicleId) {
        try {
            Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);
            if (vehicleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Vehicle not found");
            }
            
            Vehicle vehicle = vehicleOpt.get();
            Map<String, Object> documents = new HashMap<>();
            
            // Encode documents as base64 for download
            if (vehicle.getFrontId() != null) {
                documents.put("frontId", Base64.getEncoder().encodeToString(vehicle.getFrontId()));
            }
            if (vehicle.getBackId() != null) {
                documents.put("backId", Base64.getEncoder().encodeToString(vehicle.getBackId()));
            }
            if (vehicle.getRegistration() != null) {
                documents.put("registration", Base64.getEncoder().encodeToString(vehicle.getRegistration()));
            }
            
            // Include vehicle and user information for D1 form
            Map<String, Object> vehicleInfo = new HashMap<>();
            vehicleInfo.put("vin", vehicle.getVin());
            vehicleInfo.put("make", vehicle.getMake() != null ? vehicle.getMake().getName() : "Unknown");
            vehicleInfo.put("model", vehicle.getModel());
            vehicleInfo.put("year", vehicle.getYear());
            vehicleInfo.put("keycode", vehicle.getKeycode());
            vehicleInfo.put("status", vehicle.getStatus());
            vehicleInfo.put("createdAt", vehicle.getCreatedAt());
            
            Transaction transaction = vehicle.getTransaction();
            if (transaction != null) {
                vehicleInfo.put("confirmationNumber", transaction.getConfirmationNumber());
                
                KeycodeUser user = transaction.getKeycodeUser();
                if (user != null) {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("email", user.getEmail());
                    userInfo.put("name", user.getFname() + " " + user.getLname());
                    userInfo.put("company", user.getCompany());
                    userInfo.put("state", user.getState());
                    userInfo.put("phone", user.getPhone());
                    vehicleInfo.put("user", userInfo);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("documents", documents);
            response.put("vehicleInfo", vehicleInfo);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error downloading documents: " + e.getMessage());
        }
    }

    @GetMapping("/nastf-compliance-test")
    public ResponseEntity<?> getNastfComplianceTest() {
        System.out.println("🚀 ==> NASTF COMPLIANCE TEST ENDPOINT HIT <==");
        return ResponseEntity.ok("NASTF Test endpoint working!");
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
            userData.put("lastLoginAt", user.getLastLoginAt());
            
            // Add trial information from KeycodeUser entity (set by activateTrial)
            userData.put("trialEndsAt", user.getTrialEndsAt());
            
            // Calculate trial start date (3 days before end date)
            if (user.getTrialEndsAt() != null) {
                java.util.Calendar cal = java.util.Calendar.getInstance();
                cal.setTime(user.getTrialEndsAt());
                cal.add(java.util.Calendar.DAY_OF_MONTH, -3);
                userData.put("trialStartedAt", cal.getTime());
            } else {
                userData.put("trialStartedAt", null);
            }
            
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
            java.util.Date trialStart = cal.getTime();
            cal.add(java.util.Calendar.DAY_OF_MONTH, 3);
            java.util.Date trialEnd = cal.getTime();
            
            user.setTrialEndsAt(trialEnd);
            user.setActive(true);
            user.setAdminApproved(true);
            
            keycodeUserService.saveUser(user);
            
            String adminEmail = auth != null ? auth.getName() : "unknown";
            adminActionLogService.log(adminEmail, "ACTIVATE_TRIAL", id, "3-day trial activated");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Trial activated successfully");
            response.put("trialEndsAt", user.getTrialEndsAt());
            response.put("trialStartedAt", trialStart);
            
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

    @DeleteMapping("/users/{id}/delete")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @RequestParam(required = false) String reason, Authentication auth) {
        try {
            String adminEmail = auth != null ? auth.getName() : "unknown";
            
            // Verify admin has permission to delete users
            Optional<KeycodeUser> adminUserOpt = keycodeUserService.findByEmail(adminEmail);
            if (adminUserOpt.isEmpty()) {
                return ResponseEntity.status(403).body("Admin user not found");
            }
            
            KeycodeUser adminUser = adminUserOpt.get();
            boolean canDelete = adminUser.getRole() == Role.ADMIN || adminUser.getRole() == Role.SUPER_ADMIN;
            
            if (!canDelete) {
                adminActionLogService.log(adminEmail, "DELETE_USER_DENIED", id, "Insufficient permissions to delete user");
                return ResponseEntity.status(403).body("Insufficient permissions to delete user");
            }
            
            // Find the user to delete
            Optional<KeycodeUser> optionalUser = keycodeUserService.findById(id);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found.");
            }
            
            KeycodeUser userToDelete = optionalUser.get();
            
            // Prevent deletion of other admins/super admins unless you're a super admin
            if ((userToDelete.getRole() == Role.ADMIN || userToDelete.getRole() == Role.SUPER_ADMIN) 
                && adminUser.getRole() != Role.SUPER_ADMIN) {
                adminActionLogService.log(adminEmail, "DELETE_ADMIN_DENIED", id, 
                    "Admin attempted to delete another admin/super admin");
                return ResponseEntity.status(403).body("Only super admins can delete other admin accounts");
            }
            
            // Prevent self-deletion
            if (userToDelete.getId().equals(adminUser.getId())) {
                adminActionLogService.log(adminEmail, "DELETE_SELF_DENIED", id, "Attempted self-deletion");
                return ResponseEntity.status(400).body("Cannot delete your own account");
            }
            
            // Log the deletion attempt with detailed information
            String deletionDetails = String.format(
                "User deleted: %s %s (%s) - Role: %s - Reason: %s", 
                userToDelete.getFname(), 
                userToDelete.getLname(), 
                userToDelete.getEmail(),
                userToDelete.getRole(),
                reason != null ? reason : "No reason provided"
            );
            
            // Soft delete: mark as inactive instead of hard delete to preserve data integrity
            userToDelete.setActive(false);
            userToDelete.setAdminApprovalNotes("DELETED by " + adminEmail + " - " + (reason != null ? reason : "No reason"));
            keycodeUserService.saveUser(userToDelete);
            
            // Log the successful deletion
            adminActionLogService.log(adminEmail, "DELETE_USER", id, deletionDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User account deleted successfully");
            response.put("deletedUser", userToDelete.getEmail());
            response.put("deletedBy", adminEmail);
            response.put("reason", reason);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            String adminEmail = auth != null ? auth.getName() : "unknown";
            adminActionLogService.log(adminEmail, "DELETE_USER_ERROR", id, "Error deleting user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting user: " + e.getMessage());
        }
    }

    @PostMapping("/generate-test-logs")
    public ResponseEntity<String> generateTestLogs(Authentication auth) {
        try {
            String adminEmail = auth != null ? auth.getName() : "unknown";
            
            // Verify requesting user is a super admin
            Optional<KeycodeUser> adminOpt = keycodeUserService.findByEmail(adminEmail);
            if (adminOpt.isEmpty()) {
                return ResponseEntity.status(403).body("Admin user not found");
            }
            
            KeycodeUser admin = adminOpt.get();
            if (admin.getRole() != Role.SUPER_ADMIN) {
                return ResponseEntity.status(403).body("Only super admins can generate test logs");
            }
            
            // Generate test activity logs for the super admin
            adminActionLogService.log(adminEmail, "LOGIN", null, "Super admin logged into dashboard");
            adminActionLogService.log(adminEmail, "VIEW_USERS", null, "Accessed user management page");
            adminActionLogService.log(adminEmail, "SEARCH_USER", null, "Searched for user: test@example.com");
            adminActionLogService.log(adminEmail, "VIEW_USER_PROFILE", 123L, "Viewed user profile details");
            adminActionLogService.log(adminEmail, "UPDATE_USER_NOTES", 123L, "Updated user notes: Test note added");
            adminActionLogService.log(adminEmail, "ACTIVATE_TRIAL", 456L, "Activated 3-day trial for user");
            adminActionLogService.log(adminEmail, "REVOKE_USER", 789L, "Revoked user access due to policy violation");
            adminActionLogService.log(adminEmail, "VIEW_NASTF_COMPLIANCE", null, "Accessed NASTF compliance dashboard");
            adminActionLogService.log(adminEmail, "DOWNLOAD_DOCUMENTS", 101L, "Downloaded D1 form documents for vehicle");
            adminActionLogService.log(adminEmail, "VIEW_ADMIN_LOGS", null, "Accessed admin activity logs");
            adminActionLogService.log(adminEmail, "EXPORT_REPORT", null, "Exported user activity report");
            adminActionLogService.log(adminEmail, "SYSTEM_MAINTENANCE", null, "Performed system maintenance tasks");
            
            return ResponseEntity.ok("✅ Generated 12 test activity logs for super admin: " + adminEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Error generating test logs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error generating test logs: " + e.getMessage());
        }
    }

    @GetMapping("/admin-activity-logs")
    public ResponseEntity<?> getAdminActivityLogs(@RequestParam(required = false) String adminEmail, 
                                                  @RequestParam(required = false) String action,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "50") int size,
                                                  Authentication auth) {
        try {
            String requestingAdminEmail = auth != null ? auth.getName() : "unknown";
            
            // Verify requesting user is a super admin
            Optional<KeycodeUser> requestingAdminOpt = keycodeUserService.findByEmail(requestingAdminEmail);
            if (requestingAdminOpt.isEmpty()) {
                return ResponseEntity.status(403).body("Admin user not found");
            }
            
            KeycodeUser requestingAdmin = requestingAdminOpt.get();
            if (requestingAdmin.getRole() != Role.SUPER_ADMIN) {
                adminActionLogService.log(requestingAdminEmail, "VIEW_ADMIN_LOGS_DENIED", null, 
                    "Non-super admin attempted to view admin activity logs");
                return ResponseEntity.status(403).body("Only super admins can view admin activity logs");
            }
            
            // Log the access to admin logs
            adminActionLogService.log(requestingAdminEmail, "VIEW_ADMIN_LOGS", null, 
                "Super admin accessed admin activity logs - filters: adminEmail=" + adminEmail + ", action=" + action);
            
            // Get all admin action logs
            List<AdminActionLog> allLogs = adminActionLogRepository.findAll();
            
            // Apply filters
            if (adminEmail != null && !adminEmail.trim().isEmpty()) {
                allLogs = allLogs.stream()
                    .filter(log -> log.getAdminEmail().toLowerCase().contains(adminEmail.toLowerCase()))
                    .collect(Collectors.toList());
            }
            
            if (action != null && !action.trim().isEmpty()) {
                allLogs = allLogs.stream()
                    .filter(log -> log.getAction().toLowerCase().contains(action.toLowerCase()))
                    .collect(Collectors.toList());
            }
            
            // Sort by most recent first
            allLogs.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
            
            // Apply pagination
            int start = page * size;
            int end = Math.min(start + size, allLogs.size());
            List<AdminActionLog> paginatedLogs = allLogs.subList(start, end);
            
            // Enhance logs with additional context
            List<Map<String, Object>> enhancedLogs = paginatedLogs.stream().map(log -> {
                Map<String, Object> logData = new HashMap<>();
                logData.put("id", log.getId());
                logData.put("adminEmail", log.getAdminEmail());
                logData.put("action", log.getAction());
                logData.put("targetUserId", log.getTargetUserId());
                logData.put("details", log.getDetails());
                logData.put("createdAt", log.getCreatedAt());
                
                // Add target user information if available
                if (log.getTargetUserId() != null) {
                    Optional<KeycodeUser> targetUserOpt = keycodeUserService.findById(log.getTargetUserId());
                    if (targetUserOpt.isPresent()) {
                        KeycodeUser targetUser = targetUserOpt.get();
                        logData.put("targetUserEmail", targetUser.getEmail());
                        logData.put("targetUserName", targetUser.getFname() + " " + targetUser.getLname());
                        logData.put("targetUserRole", targetUser.getRole());
                    }
                }
                
                // Add admin user information
                Optional<KeycodeUser> adminUserOpt = keycodeUserService.findByEmail(log.getAdminEmail());
                if (adminUserOpt.isPresent()) {
                    KeycodeUser adminUser = adminUserOpt.get();
                    logData.put("adminName", adminUser.getFname() + " " + adminUser.getLname());
                    logData.put("adminRole", adminUser.getRole());
                }
                
                return logData;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("logs", enhancedLogs);
            response.put("totalCount", allLogs.size());
            response.put("page", page);
            response.put("size", size);
            response.put("hasMore", end < allLogs.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            String requestingAdminEmail = auth != null ? auth.getName() : "unknown";
            adminActionLogService.log(requestingAdminEmail, "VIEW_ADMIN_LOGS_ERROR", null, 
                "Error viewing admin logs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching admin activity logs: " + e.getMessage());
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
