package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:51731", "http://localhost:51732", "http://localhost:51733", "http://localhost:51734"})
@RestController
@RequestMapping("/user")
public class UserProfileController {

    private final KeycodeUserService keycodeUserService;
    private final SubscriptionService subscriptionService;

    @Autowired
    public UserProfileController(KeycodeUserService keycodeUserService, SubscriptionService subscriptionService) {
        this.keycodeUserService = keycodeUserService;
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            KeycodeUser user = userOptional.get();
            
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("firstName", user.getFname());
            profileData.put("lastName", user.getLname());
            profileData.put("email", user.getEmail());
            profileData.put("phone", user.getPhone());
            profileData.put("company", user.getCompany());
            profileData.put("address", ""); // Not in current model
            profileData.put("city", ""); // Not in current model
            profileData.put("state", user.getState());
            profileData.put("zipCode", ""); // Not in current model
            profileData.put("profilePhoto", null); // Not in current model
            profileData.put("companyLogo", null); // Not in current model
            
            return ResponseEntity.ok(profileData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestParam(value = "firstName", required = false) String firstName,
                                            @RequestParam(value = "lastName", required = false) String lastName,
                                            @RequestParam(value = "phone", required = false) String phone,
                                            @RequestParam(value = "company", required = false) String company,
                                            @RequestParam(value = "address", required = false) String address,
                                            @RequestParam(value = "city", required = false) String city,
                                            @RequestParam(value = "state", required = false) String state,
                                            @RequestParam(value = "zipCode", required = false) String zipCode,
                                            @RequestParam(value = "profilePhoto", required = false) MultipartFile profilePhoto,
                                            @RequestParam(value = "companyLogo", required = false) MultipartFile companyLogo) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            KeycodeUser user = userOptional.get();
            
            // Update fields if provided
            if (firstName != null) user.setFname(firstName);
            if (lastName != null) user.setLname(lastName);
            if (phone != null) user.setPhone(phone);
            if (company != null) user.setCompany(company);
            if (state != null) user.setState(state);
            
            // Note: address, city, zipCode, profilePhoto, companyLogo are not in current model
            // These would need to be added to the KeycodeUser model or stored separately
            
            keycodeUserService.saveUser(user);
            
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/subscription")
    public ResponseEntity<?> getUserSubscription() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            KeycodeUser user = userOptional.get();

            // Look up subscription for the authenticated user
            Optional<Subscription> subscriptionOpt = subscriptionService.getSubscriptionForUser(user);

            Map<String, Object> response = new HashMap<>();
            if (subscriptionOpt.isPresent()) {
                Subscription s = subscriptionOpt.get();
                response.put("tier", s.getTier() != null ? s.getTier().name() : "NONE");
                response.put("status", s.isActivated() ? "ACTIVE" : "PENDING");
                // Fields not modeled yet
                response.put("startDate", null);
                response.put("endDate", null);
                response.put("autoRenew", false);
            } else {
                response.put("tier", "NONE");
                response.put("status", "INACTIVE");
                response.put("startDate", null);
                response.put("endDate", null);
                response.put("autoRenew", false);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getUserOrders() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }
            KeycodeUser user = userOptional.get();
            // Return mock status map for tracker; replace with real service later
            Map<String, Object> resp = new HashMap<>();
            Map<String, Boolean> status = new HashMap<>();
            status.put("ACCOUNT", user.isValidatedUser());
            status.put("DOCS", true);
            status.put("PROCESSING", false);
            status.put("COMPLETED", false);
            resp.put("status", status);
            resp.put("orders", new Object[0]);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/security")
    public ResponseEntity<?> getUserSecuritySettings() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            // Mock security settings - in a real app, this would come from a security service
            Map<String, Object> securitySettings = new HashMap<>();
            securitySettings.put("twoFactorEnabled", false);
            securitySettings.put("fingerprintEnabled", false);
            securitySettings.put("lastLogin", null);
            securitySettings.put("loginHistory", new Object[0]);
            
            return ResponseEntity.ok(securitySettings);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/security")
    public ResponseEntity<?> updateUserSecuritySettings(@RequestBody Map<String, Object> securityUpdates) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            // In a real app, this would update security settings in a security service
            // For now, just return success
            
            return ResponseEntity.ok("Security settings updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/credentials")
    public ResponseEntity<?> getUserCredentials() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            KeycodeUser user = userOptional.get();
            
                                    // Return existing credentials from the user model
                        Map<String, Object> credentials = new HashMap<>();
                        credentials.put("businessLicense", null); // Not in current model
                        credentials.put("driversLicenseFront", null); // Not in current model
                        credentials.put("driversLicenseBack", null); // Not in current model
                        credentials.put("insuranceCertificate", user.getInsurance() != null ? "uploaded" : null);
                        credentials.put("identificationDocuments", new Object[0]); // Not in current model
                        credentials.put("otherFiles", new Object[0]); // Not in current model
            
                                return ResponseEntity.ok(credentials);
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
                }
            }

            @PutMapping("/credentials")
            public ResponseEntity<?> updateUserCredentials(
                    @RequestParam(value = "businessLicense", required = false) MultipartFile businessLicense,
                    @RequestParam(value = "driversLicenseFront", required = false) MultipartFile driversLicenseFront,
                    @RequestParam(value = "driversLicenseBack", required = false) MultipartFile driversLicenseBack,
                    @RequestParam(value = "insuranceCertificate", required = false) MultipartFile insuranceCertificate) {
                try {
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    String userEmail = authentication.getName();

                    Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
                    if (userOptional.isEmpty()) {
                        return ResponseEntity.status(401).body("User not found");
                    }

                    KeycodeUser user = userOptional.get();

                    // Handle file uploads (mock implementation for now)
                    // In a real implementation, you would save these files to storage
                    // and update the user's credential references

                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Credentials updated successfully");
                    response.put("uploadedFiles", new HashMap<String, String>() {{
                        if (businessLicense != null) put("businessLicense", businessLicense.getOriginalFilename());
                        if (driversLicenseFront != null) put("driversLicenseFront", driversLicenseFront.getOriginalFilename());
                        if (driversLicenseBack != null) put("driversLicenseBack", driversLicenseBack.getOriginalFilename());
                        if (insuranceCertificate != null) put("insuranceCertificate", insuranceCertificate.getOriginalFilename());
                    }});

                    return ResponseEntity.ok(response);
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
                }
            }

    @GetMapping("/notices")
    public ResponseEntity<?> getUserNotices() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            // Mock notices - in a real app, this would come from a notification service
            // For now, return empty array
            return ResponseEntity.ok(new Object[0]);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }
}
