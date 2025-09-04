package org.rma.kchbackend.controller;

import jakarta.validation.constraints.NotBlank;
import org.rma.kchbackend.dto.RegisterRequest;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.AdminRegistrationCodeService;
import org.rma.kchbackend.service.CustomUserDetailsService;
import org.rma.kchbackend.service.PasswordResetService;
import org.rma.kchbackend.service.EmailService;
import org.rma.kchbackend.util.JwtUtil;
import org.rma.kchbackend.repository.KeycodeUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CookieValue;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

// CORS is handled globally by CorsConfig.java
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final KeycodeUserService keycodeUserService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AdminRegistrationCodeService adminRegistrationCodeService;
    private final CustomUserDetailsService userDetailsService;
    private final PasswordResetService passwordResetService;
    private final KeycodeUserRepository keycodeUserRepository;
    private final EmailService emailService;

    @Autowired
    public AuthController(KeycodeUserService keycodeUserService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager, AdminRegistrationCodeService adminRegistrationCodeService, CustomUserDetailsService userDetailsService, PasswordResetService passwordResetService, KeycodeUserRepository keycodeUserRepository, EmailService emailService) {
        this.keycodeUserService = keycodeUserService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.adminRegistrationCodeService = adminRegistrationCodeService;
        this.userDetailsService = userDetailsService;
        this.passwordResetService = passwordResetService;
        this.keycodeUserRepository = keycodeUserRepository;
        this.emailService = emailService;
    }



    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("password") String password,
            @RequestParam("state") String state,
            @RequestParam("frontId") MultipartFile frontId,
            @RequestParam("backId") MultipartFile backId,
            @RequestParam("insurance") MultipartFile insurance) {
        try {
            // Validate files
            if (frontId.isEmpty() || backId.isEmpty() || insurance.isEmpty()) {
                return ResponseEntity.badRequest().body("All document files are required.");
            }

            // Validate file size (e.g., 5MB limit)
            long maxFileSize = 5 * 1024 * 1024;
            if (frontId.getSize() > maxFileSize || backId.getSize() > maxFileSize || insurance.getSize() > maxFileSize) {
                return ResponseEntity.badRequest().body("File size must not exceed 5MB.");
            }

            // Validate file types
            if (!frontId.getContentType().startsWith("image/") ||
                    !backId.getContentType().startsWith("image/") ||
                    !insurance.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed.");
            }

            //Check whether the user already exists
            Optional<KeycodeUser> userExists = keycodeUserService.findByEmail(email);
            //If the user already exists and is active, display error message user already exists
            if(userExists.isPresent()){
                if(userExists.get().isActive()){
                    return ResponseEntity.status(500).body("User already exists");
                }else{
                    //User exists and currently inactive - change isActive to true, isValidated to false and set the values to the user
                    KeycodeUser user = userExists.get();
                    user.setActive(true);
                    user.setValidatedUser(false);
                    user.setFname(fname);
                    user.setLname(lname);
                    user.setEmail(email);
                    user.setPhone(phone);
                    user.setPassword(passwordEncoder.encode(password));
                    user.setRole(Role.BASEUSER);
                    user.setState(state);
                    user.setFrontId(frontId.getBytes());
                    user.setBackId(backId.getBytes());
                    user.setInsurance(insurance.getBytes());
                    keycodeUserService.saveUser(user);
                }
            }else{
                // Create and save the user
                KeycodeUser user = new KeycodeUser();
                user.setFname(fname);
                user.setLname(lname);
                user.setEmail(email);
                user.setPhone(phone);
                user.setPassword(passwordEncoder.encode(password));
                user.setRole(Role.BASEUSER);
                user.setState(state);
                user.setFrontId(frontId.getBytes());
                user.setBackId(backId.getBytes());
                user.setInsurance(insurance.getBytes());

                keycodeUserService.saveUser(user);
            }
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    /**
     * Admin registration endpoint - requires admin code and creates unapproved admin account
     */
    @PostMapping("/admin-register")
    public ResponseEntity<String> adminRegister(
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("password") String password,
            @RequestParam("company") String company,
            @RequestParam("adminCode") String adminCode) {
        try {
            // Input validation
            if (fname == null || fname.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("First name is required");
            }
            if (lname == null || lname.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Last name is required");
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (phone == null || phone.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Phone number is required");
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            if (company == null || company.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Company name is required");
            }
            if (adminCode == null || adminCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Admin registration code is required");
            }

            // Normalize email (trim and lowercase)
            email = email.trim().toLowerCase();
            
            // Validate admin registration code using the service
            if (!adminRegistrationCodeService.validateAdminRegistrationCode(email, adminCode.trim())) {
                return ResponseEntity.badRequest().body("Invalid or expired admin registration code. Please request a new code.");
            }

            // Check if user already exists
            Optional<KeycodeUser> userExists = keycodeUserService.findByEmail(email);
            if (userExists.isPresent()) {
                if (userExists.get().isActive()) {
                    return ResponseEntity.status(409).body("User already exists and is active");
                } else {
                    return ResponseEntity.status(409).body("User already exists but is inactive. Please contact support.");
                }
            }

            // Create new admin user (unapproved by default)
            KeycodeUser adminUser = new KeycodeUser();
            adminUser.setFname(fname.trim());
            adminUser.setLname(lname.trim());
            adminUser.setEmail(email);
            adminUser.setPhone(phone.trim());
            adminUser.setPassword(passwordEncoder.encode(password));
            adminUser.setRole(Role.ADMIN);
            adminUser.setCompany(company.trim());
            adminUser.setAdminCode(adminCode.trim());
            adminUser.setAdminApproved(false); // Requires super admin approval
            adminUser.setActive(false); // Inactive until approved
            adminUser.setState("N/A"); // Admin users don't need state
            adminUser.setValidatedUser(false);

            keycodeUserService.saveUser(adminUser);
            
            // Notify super admins about the new admin registration that needs approval
            try {
                notifySuperAdminsOfNewAdminRegistration(adminUser);
            } catch (Exception e) {
                // Log the error but don't fail the registration
                System.err.println("⚠️ Failed to send notification to super admins for new admin registration: " + e.getMessage());
            }
            
            return ResponseEntity.ok("Admin account created successfully! Pending super admin approval.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam("email") String email, 
                                   @RequestParam("password") String password) {
        // 🔍 DEBUG LOGGING - Check if method is called
        System.out.println("=== LOGIN ENDPOINT CALLED ===");
        System.out.println("🔍 Login Request Debug:");
        System.out.println("  Email: " + email);
        System.out.println("  Password: " + (password != null ? "***SET***" : "NULL"));
        
        System.out.println("✅ Validation passed, proceeding with authentication...");

        // Normalize email input (trim + lowercase) to avoid case/space mismatches
        try {
            if (email != null) {
                email = email.trim().toLowerCase();
            }
            if (password != null) {
                password = password.trim();
            }
        } catch (Exception ignored) {}

        System.out.println("🔍 Attempting authentication for: " + email);
        System.out.println("🔍 Raw password received: " + (password != null ? "***SET***" : "NULL"));
        System.out.println("🔍 Password length: " + (password != null ? password.length() : "NULL"));

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            System.out.println("✅ Authentication successful!");
        } catch (Exception e) {
            System.out.println("❌ Authentication failed: " + e.getMessage());
            System.out.println("❌ Exception type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        System.out.println("🔍 Looking up user in database...");
        Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
        if (userOptional.isEmpty()) {
            System.out.println("❌ User not found in database");
            return ResponseEntity.status(401).body("Invalid email or password.");
        }
        
        KeycodeUser user = userOptional.get();
        System.out.println("✅ User found: " + user.getEmail() + " (Role: " + user.getRole() + ")");
        
        // Check if account is active
        if (!user.isActive()) {
            System.out.println("❌ Account is inactive");
            return ResponseEntity.status(401).body("Account is inactive.");
        }
        
        // Check if admin account is approved
        if (user.getRole() == Role.ADMIN && !user.isAdminApproved()) {
            System.out.println("❌ Admin account not approved");
            return ResponseEntity.status(401).body("Admin account pending approval. Please contact super administrator.");
        }

        System.out.println("🔍 Generating JWT tokens...");
        // Convert KeycodeUser to UserDetails for JWT generation
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessJwt = jwtUtil.generateToken(userDetails);
        String refreshJwt = jwtUtil.generateRefreshToken(userDetails);

        // Set cookies
        ResponseCookie access = ResponseCookie.from("access_token", accessJwt)
            .httpOnly(true).secure(false).path("/")  // secure(false) for development, can be true in production
            .sameSite("Lax").maxAge(Duration.ofHours(10)).build();  // sameSite("Lax") for better compatibility

        // Use path=/ so browser sends cookie across navigations before refresh call
        ResponseCookie refresh = ResponseCookie.from("refresh_token", refreshJwt)
            .httpOnly(true).secure(false).path("/")  // secure(false) for development, can be true in production
            .sameSite("Lax").maxAge(Duration.ofDays(7)).build();  // sameSite("Lax") for better compatibility

        // Include user information and JWT token in the response
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("user", user);
        response.put("accessToken", accessJwt);
        response.put("refreshToken", refreshJwt);

        System.out.println("✅ Login successful! Returning response with cookies");
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, access.toString())
            .header(HttpHeaders.SET_COOKIE, refresh.toString())
            .body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(value = "refresh_token", required = false) String refreshToken) {
        try {
            if (refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.status(401).body("Refresh token not found");
            }

            // Validate refresh token and get user
            if (!jwtUtil.validateToken(refreshToken)) {
                return ResponseEntity.status(401).body("Invalid refresh token");
            }

            String userEmail = jwtUtil.getUsernameFromToken(refreshToken);
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found");
            }

            KeycodeUser user = userOptional.get();
            
            // Generate new access token
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String newAccessToken = jwtUtil.generateToken(userDetails);
            
            // Set new access token cookie
            ResponseCookie access = ResponseCookie.from("access_token", newAccessToken)
                .httpOnly(true).secure(false).path("/")  // secure(false) for development, can be true in production
                .sameSite("Lax").maxAge(Duration.ofHours(10)).build();  // sameSite("Lax") for better compatibility

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, access.toString())
                .body(Map.of("status", "ok", "message", "Token refreshed"));
                
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token refresh failed");
        }
    }

    /**
     * Dev utility to set a user's password using server-side BCrypt.
     * NOT exposed in production.
     */
    @PostMapping("/dev-set-password")
    public ResponseEntity<?> devSetPassword(@RequestParam("email") String email,
                                            @RequestParam("password") String password) {
        try {
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            KeycodeUser user = userOptional.get();
            user.setPassword(passwordEncoder.encode(password));
            user.setActive(true);
            if (user.getRole() != null && user.getRole().name().contains("ADMIN")) {
                user.setAdminApproved(true);
            }
            keycodeUserService.saveUser(user);
            return ResponseEntity.ok(Map.of("status", "ok"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to set password");
        }
    }

    /**
     * Dev utility to upsert a SUPER_ADMIN user.
     */
    @PostMapping("/dev-upsert-admin")
    public ResponseEntity<?> devUpsertAdmin(@RequestParam("email") String email,
                                            @RequestParam("password") String password,
                                            @RequestParam(value = "fname", required = false, defaultValue = "Admin") String fname,
                                            @RequestParam(value = "lname", required = false, defaultValue = "User") String lname) {
        try {
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
            KeycodeUser user = userOptional.orElseGet(KeycodeUser::new);
            user.setEmail(email);
            user.setFname(fname);
            user.setLname(lname);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(Role.SUPER_ADMIN);
            user.setCompany("Dev");
            user.setAdminApproved(true);
            user.setActive(true);
            user.setState("N/A");
            user.setValidatedUser(true);
            keycodeUserService.saveUser(user);
            return ResponseEntity.ok(Map.of("status", "ok"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upsert admin");
        }
    }

    /**
     * Production utility to ensure super admin account exists.
     * This endpoint can be called once during production setup.
     */
    @PostMapping("/setup-super-admin")
    public ResponseEntity<?> setupSuperAdmin(@RequestParam("email") String email,
                                           @RequestParam("password") String password,
                                           @RequestParam(value = "fname", required = false, defaultValue = "Super") String fname,
                                           @RequestParam(value = "lname", required = false, defaultValue = "Admin") String lname,
                                           @RequestParam(value = "setupKey", required = true) String setupKey) {
        
        // Simple test to see if environment variable is loaded
        System.out.println("=== SETUP ENDPOINT CALLED ===");
        System.out.println("Environment variable SUPER_ADMIN_SETUP_KEY: " + System.getenv("SUPER_ADMIN_SETUP_KEY"));
        System.out.println("Setup key received: " + setupKey);
        
        try {
            // Debug logging to see what's being received
            System.out.println("🔧 Setup Super Admin - Debug Info:");
            System.out.println("  Email: " + email);
            System.out.println("  Fname: " + fname);
            System.out.println("  Lname: " + lname);
            System.out.println("  Setup Key Received: '" + setupKey + "'");
            System.out.println("  Setup Key Length: " + (setupKey != null ? setupKey.length() : "null"));
            
            // Verify setup key for security (should match environment variable)
            String expectedSetupKey = System.getenv("SUPER_ADMIN_SETUP_KEY");
            System.out.println("  Expected Setup Key: '" + expectedSetupKey + "'");
            System.out.println("  Expected Setup Key Length: " + (expectedSetupKey != null ? expectedSetupKey.length() : "null"));
            System.out.println("  Keys Match: " + (expectedSetupKey != null && expectedSetupKey.equals(setupKey)));
            
            if (expectedSetupKey == null || !expectedSetupKey.equals(setupKey)) {
                System.out.println("❌ Setup key validation failed!");
                return ResponseEntity.status(403).body("Invalid setup key");
            }

            System.out.println("✅ Setup key validation successful!");

            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
            KeycodeUser user = userOptional.orElseGet(KeycodeUser::new);
            user.setEmail(email);
            user.setFname(fname);
            user.setLname(lname);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(Role.SUPER_ADMIN);
            user.setCompany("KeyCode Help");
            user.setAdminApproved(true);
            user.setActive(true);
            user.setState("N/A");
            user.setValidatedUser(true);
            user.setAdminCode("SUPER_ADMIN_2024");
            
            keycodeUserService.saveUser(user);
            
            System.out.println("✅ Super admin account created/updated successfully!");
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Super admin account created/updated successfully",
                "email", email,
                "role", "SUPER_ADMIN"
            ));
        } catch (Exception e) {
            System.out.println("❌ Error in setup super admin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to setup super admin: " + e.getMessage());
        }
    }

    /**
     * Dev utility to upsert a user with a specific role
     */
    @PostMapping("/dev-upsert-user")
    public ResponseEntity<?> devUpsertUser(@RequestParam("email") String email,
                                           @RequestParam("password") String password,
                                           @RequestParam("role") String role,
                                           @RequestParam(value = "fname", required = false, defaultValue = "User") String fname,
                                           @RequestParam(value = "lname", required = false, defaultValue = "Account") String lname,
                                           @RequestParam(value = "state", required = false, defaultValue = "NY") String state) {
        try {
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
            KeycodeUser user = userOptional.orElseGet(KeycodeUser::new);
            user.setEmail(email);
            user.setFname(fname);
            user.setLname(lname);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(Role.valueOf(role));
            user.setCompany("Dev");
            user.setAdminApproved(Role.valueOf(role).name().contains("ADMIN"));
            user.setActive(true);
            user.setState(state);
            user.setValidatedUser(true);
            keycodeUserService.saveUser(user);
            return ResponseEntity.ok(Map.of("status", "ok"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upsert user");
        }
    }

    /**
     * Debug endpoint to test BCrypt password verification
     */
    @PostMapping("/debug-bcrypt")
    public ResponseEntity<?> debugBcrypt(@RequestParam("password") String password,
                                       @RequestParam("hash") String hash) {
        try {
            System.out.println("🔧 Debug BCrypt Test:");
            System.out.println("  Password: " + password);
            System.out.println("  Hash: " + hash);
            
            boolean matches = passwordEncoder.matches(password, hash);
            System.out.println("  BCrypt.matches() result: " + matches);
            
            // Also test encoding the same password
            String newHash = passwordEncoder.encode(password);
            System.out.println("  New hash generated: " + newHash);
            
            boolean newMatches = passwordEncoder.matches(password, newHash);
            System.out.println("  New hash verification: " + newMatches);
            
            Map<String, Object> response = new HashMap<>();
            response.put("originalHash", hash);
            response.put("newHash", newHash);
            response.put("originalMatches", matches);
            response.put("newHashMatches", newMatches);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error in debug BCrypt: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }


    @PutMapping("/updateProfile")
    public ResponseEntity<String> updateUserProfile(@RequestParam("fname") String fname,
                                                    @RequestParam("lname") String lname,
                                                    @RequestParam("phone") String phone,
                                                    @RequestParam("state") String state,
                                                    @RequestParam(value = "frontId", required = false) MultipartFile frontId,
                                                    @RequestParam(value = "backId", required = false) MultipartFile backId,
                                                    @RequestParam(value = "insurance", required = false) MultipartFile insurance){
        System.out.println("in update profile");

        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));


            //Set the fields to new values
            user.setFname(fname);
            user.setLname(lname);
            user.setPhone(phone);
            user.setState(state);
            if(frontId != null){
                user.setFrontId(frontId.getBytes());
            }
            if(backId != null){
                user.setBackId(backId.getBytes());
            }
            if(insurance != null){
                user.setInsurance(insurance.getBytes());
            }

            //If any one ID has been changed, admin has to validate user again
            if (frontId!=null || backId!=null || insurance!=null){
                user.setValidatedUser(false);
            }

            keycodeUserService.saveUser(user);

            return ResponseEntity.status(200).body("User Details Updated Successfully");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    /**
     * Simple test endpoint to debug authentication
     */
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        try {
            System.out.println("🔍 /auth/test endpoint called");
            
            // Get the current authenticated user from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔍 Authentication object: " + (authentication != null ? authentication.getClass().getSimpleName() : "NULL"));
            
            if (authentication != null) {
                System.out.println("🔍 Authentication name: " + authentication.getName());
                System.out.println("🔍 Authentication is authenticated: " + authentication.isAuthenticated());
                System.out.println("🔍 Authentication authorities: " + authentication.getAuthorities());
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Test endpoint working",
                "authentication", authentication != null ? authentication.getName() : "null",
                "isAuthenticated", authentication != null ? authentication.isAuthenticated() : false
            ));
        } catch (Exception e) {
            System.out.println("❌ Error in /auth/test: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    /**
     * Debug endpoint to show JWT secret information
     */
    @GetMapping("/debug-jwt")
    public ResponseEntity<?> debugJwt() {
        try {
            System.out.println("🔍 /auth/debug-jwt endpoint called");
            
            String jwtSecret = System.getenv("JWT_SECRET");
            boolean hasJwtSecret = jwtSecret != null && !jwtSecret.isEmpty();
            int secretLength = jwtSecret != null ? jwtSecret.length() : 0;
            
            System.out.println("🔍 JWT Secret Info:");
            System.out.println("  - Has JWT_SECRET env var: " + hasJwtSecret);
            System.out.println("  - Secret length: " + secretLength);
            System.out.println("  - Secret starts with: " + (jwtSecret != null ? jwtSecret.substring(0, Math.min(10, jwtSecret.length())) + "..." : "null"));
            
            return ResponseEntity.ok(Map.of(
                "message", "JWT debug info",
                "hasJwtSecret", hasJwtSecret,
                "secretLength", secretLength,
                "secretPreview", jwtSecret != null ? jwtSecret.substring(0, Math.min(10, jwtSecret.length())) + "..." : "null"
            ));
        } catch (Exception e) {
            System.out.println("❌ Error in /auth/debug-jwt: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/health/db")
    public ResponseEntity<Map<String, Object>> checkDatabaseHealth() {
        try {
            System.out.println("🔍 /auth/health/db endpoint called");
            
            // Test database connection
            long startTime = System.currentTimeMillis();
            long userCount = keycodeUserRepository.count(); // Simple query to test connection
            long endTime = System.currentTimeMillis();
            
            Map<String, Object> healthInfo = new HashMap<>();
            healthInfo.put("status", "healthy");
            healthInfo.put("responseTime", endTime - startTime);
            healthInfo.put("userCount", userCount);
            healthInfo.put("timestamp", System.currentTimeMillis());
            
            System.out.println("✅ Database health check successful - Response time: " + (endTime - startTime) + "ms");
            return ResponseEntity.ok(healthInfo);
        } catch (Exception e) {
            System.out.println("❌ Database health check failed: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> healthInfo = new HashMap<>();
            healthInfo.put("status", "unhealthy");
            healthInfo.put("error", e.getMessage());
            healthInfo.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.status(503).body(healthInfo);
        }
    }

    /**
     * Test endpoint that requires authentication - to debug JWT issues
     */
    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuthEndpoint() {
        try {
            System.out.println("🔍 /auth/test-auth endpoint called");
            
            // Get the current authenticated user from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔍 Authentication object: " + (authentication != null ? authentication.getClass().getSimpleName() : "NULL"));
            
            if (authentication == null || !authentication.isAuthenticated()) {
                System.out.println("❌ No authentication found in /auth/test-auth");
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String email = authentication.getName();
            System.out.println("🔍 Authentication name: " + email);
            
            return ResponseEntity.ok(Map.of(
                "message", "Auth test endpoint working",
                "user", email,
                "isAuthenticated", true
            ));
        } catch (Exception e) {
            System.out.println("❌ Error in /auth/test-auth: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    /**
     * Get current user information from JWT token
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            System.out.println("🔍 /auth/me endpoint called");
            
            // Get the current authenticated user from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔍 Authentication object: " + (authentication != null ? authentication.getClass().getSimpleName() : "NULL"));
            
            if (authentication == null || !authentication.isAuthenticated()) {
                System.out.println("❌ No authentication found");
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            String email = authentication.getName();
            System.out.println("🔍 Authentication name: " + email);
            
            if (email == null || email.equals("anonymousUser")) {
                System.out.println("❌ Invalid authentication name");
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }

            // Get user details from database
            System.out.println("🔍 Looking up user in database: " + email);
            Optional<KeycodeUser> userOpt = keycodeUserService.findByEmail(email);
            if (userOpt.isEmpty()) {
                System.out.println("❌ User not found in database: " + email);
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            KeycodeUser user = userOpt.get();
            System.out.println("✅ User found: " + user.getEmail() + " (Role: " + user.getRole() + ")");
            
            // Return user data (excluding sensitive information)
            Map<String, Object> userData = new HashMap<>();
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("fname", user.getFname());
            userInfo.put("lname", user.getLname());
            userInfo.put("email", user.getEmail());
            userInfo.put("phone", user.getPhone()); // This can be null
            userInfo.put("role", user.getRole());
            userInfo.put("isActive", user.isActive());
            userInfo.put("isAdminApproved", user.isAdminApproved());
            userInfo.put("isValidatedUser", user.isValidatedUser());
            userData.put("user", userInfo);

            System.out.println("✅ /auth/me successful for user: " + email);
            // Fixed NullPointerException by using HashMap instead of Map.of()
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            System.out.println("❌ Error in /auth/me: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error", "message", e.getMessage()));
        }
    }

    @GetMapping("/getUserProfile/{keycodeUserId}")
    public ResponseEntity<?> getUserProfile(@PathVariable("keycodeUserId") Long keycodeUserId) {
        try {
            // Get the authenticated users
            System.out.println("User Id: "+keycodeUserId);
            KeycodeUser user = keycodeUserService.findById(keycodeUserId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("email", user.getEmail());
            userData.put("fname", user.getFname());
            userData.put("lname", user.getLname());
            userData.put("phone", user.getPhone());
            userData.put("state", user.getState());
            userData.put("frontIdImage", keycodeUserService.convertImageToBase64(user.getFrontId()));
            userData.put("backIdImage", keycodeUserService.convertImageToBase64(user.getBackId()));
            userData.put("insuranceImage", keycodeUserService.convertImageToBase64(user.getInsurance()));

            return ResponseEntity.status(200).body(userData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }



    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            System.out.println("🔧 Password reset request received for email: " + request.get("email"));
            
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                System.out.println("❌ Email is missing from request");
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            email = email.trim().toLowerCase();
            System.out.println("🔍 Looking up user with email: " + email);
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
            
            if (userOptional.isEmpty()) {
                System.out.println("❌ User not found for email: " + email);
                // Don't reveal if user exists or not for security
                return ResponseEntity.ok().body(Map.of("message", "If an account with this email exists, a password reset link has been sent."));
            }

            KeycodeUser user = userOptional.get();
            if (!user.isActive()) {
                System.out.println("❌ User is inactive for email: " + email);
                return ResponseEntity.ok().body(Map.of("message", "If an account with this email exists, a password reset link has been sent."));
            }

            System.out.println("✅ User found and active, sending password reset email");
            
            // Send password reset email
            String resetUrl = System.getenv().getOrDefault("FRONTEND_URL", "https://www.keycode.help") + "/reset-password";
            System.out.println("🔗 Reset URL: " + resetUrl);
            boolean emailSent = passwordResetService.sendPasswordResetEmail(email, resetUrl);
            
            if (emailSent) {
                System.out.println("✅ Password reset email sent successfully for: " + email);
                return ResponseEntity.ok().body(Map.of("message", "Password reset email sent successfully"));
            } else {
                System.out.println("❌ Failed to send password reset email for: " + email);
                return ResponseEntity.status(500).body(Map.of("error", "Failed to send password reset email"));
            }
            
        } catch (Exception e) {
            System.err.println("❌ Exception in password reset: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An error occurred while processing your request"));
        }
    }

    @PostMapping("/reset-password/confirm")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Reset token is required"));
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password is required"));
            }
            
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
            }

            // Validate token
            if (!passwordResetService.validateResetToken(token)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset token"));
            }

            // Get email from token
            String email = passwordResetService.getEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid reset token"));
            }

            // Update user password
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            KeycodeUser user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            keycodeUserService.saveUser(user);

            // Delete the used token
            passwordResetService.deleteResetToken(token);

            return ResponseEntity.ok().body(Map.of("message", "Password updated successfully"));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An error occurred while processing your request"));
        }
    }

    static class LoginRequest {
        @NotBlank(message = "Email is mandatory")
        private String email;

        @NotBlank(message = "Password is mandatory")
        private String password;

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
