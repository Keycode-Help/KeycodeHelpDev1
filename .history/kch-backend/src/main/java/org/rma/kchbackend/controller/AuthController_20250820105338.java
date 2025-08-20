package org.rma.kchbackend.controller;

import jakarta.validation.constraints.NotBlank;
import org.rma.kchbackend.dto.RegisterRequest;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.AdminRegistrationCodeService;
import org.rma.kchbackend.service.CustomUserDetailsService;
import org.rma.kchbackend.service.PasswordResetService;
import org.rma.kchbackend.util.JwtUtil;
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

@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:51731", 
    "http://localhost:51732", 
    "http://localhost:51733", 
    "http://localhost:51734",
    "https://*.vercel.app",
    "https://*.keycode.help",
    "https://keycode.help",
    "https://www.keycode.help"
})
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

    @Autowired
    public AuthController(KeycodeUserService keycodeUserService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager, AdminRegistrationCodeService adminRegistrationCodeService, CustomUserDetailsService userDetailsService, PasswordResetService passwordResetService) {
        this.keycodeUserService = keycodeUserService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.adminRegistrationCodeService = adminRegistrationCodeService;
        this.userDetailsService = userDetailsService;
        this.passwordResetService = passwordResetService;
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
            // Validate admin registration code using the service
            if (!adminRegistrationCodeService.validateAdminRegistrationCode(email, adminCode)) {
                return ResponseEntity.badRequest().body("Invalid or expired admin registration code. Please request a new code.");
            }

            // Check if user already exists
            Optional<KeycodeUser> userExists = keycodeUserService.findByEmail(email);
            if (userExists.isPresent() && userExists.get().isActive()) {
                return ResponseEntity.status(500).body("User already exists");
            }

            // Create new admin user (unapproved by default)
            KeycodeUser adminUser = new KeycodeUser();
            adminUser.setFname(fname);
            adminUser.setLname(lname);
            adminUser.setEmail(email);
            adminUser.setPhone(phone);
            adminUser.setPassword(passwordEncoder.encode(password));
            adminUser.setRole(Role.ADMIN);
            adminUser.setCompany(company);
            adminUser.setAdminCode(adminCode);
            adminUser.setAdminApproved(false); // Requires super admin approval
            adminUser.setActive(false); // Inactive until approved
            adminUser.setState("N/A"); // Admin users don't need state
            adminUser.setValidatedUser(false);

            keycodeUserService.saveUser(adminUser);
            
            return ResponseEntity.ok("Admin account created successfully! Pending super admin approval.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errors = new StringBuilder();
            bindingResult.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("; "));
            return ResponseEntity.badRequest().body("Validation errors: " + errors.toString());
        }

        // Normalize email input (trim + lowercase) to avoid case/space mismatches
        try {
            if (loginRequest.getEmail() != null) {
                loginRequest.setEmail(loginRequest.getEmail().trim().toLowerCase());
            }
            if (loginRequest.getPassword() != null) {
                loginRequest.setPassword(loginRequest.getPassword().trim());
            }
        } catch (Exception ignored) {}

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }
        
        KeycodeUser user = userOptional.get();
        
        // Check if account is active
        if (!user.isActive()) {
            return ResponseEntity.status(401).body("Account is inactive.");
        }
        
        // Check if admin account is approved
        if (user.getRole() == Role.ADMIN && !user.isAdminApproved()) {
            return ResponseEntity.status(401).body("Admin account pending approval. Please contact super administrator.");
        }
        // Convert KeycodeUser to UserDetails for JWT generation
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessJwt = jwtUtil.generateToken(userDetails);
        String refreshJwt = jwtUtil.generateRefreshToken(userDetails);

        // Set cookies
        ResponseCookie access = ResponseCookie.from("access_token", accessJwt)
            .httpOnly(true).secure(false).path("/")
            .sameSite("Lax").maxAge(Duration.ofHours(10)).build();

        // Use path=/ so browser sends cookie across navigations before refresh call
        ResponseCookie refresh = ResponseCookie.from("refresh_token", refreshJwt)
            .httpOnly(true).secure(false).path("/")
            .sameSite("Lax").maxAge(Duration.ofDays(7)).build();

        // Include user information in the response, but not the token
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("user", user);

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
                .httpOnly(true).secure(false).path("/")
                .sameSite("Lax").maxAge(Duration.ofHours(10)).build();

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

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            // Get the authenticated user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body("User not found. Please log in again.");
            }
            
            KeycodeUser user = userOptional.get();
            
            // Check if account is active
            if (!user.isActive()) {
                return ResponseEntity.status(401).body("Account is inactive.");
            }
            
            // Check if admin account is approved
            if (user.getRole() == Role.ADMIN && !user.isAdminApproved()) {
                return ResponseEntity.status(401).body("Admin account pending approval.");
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
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
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            email = email.trim().toLowerCase();
            Optional<KeycodeUser> userOptional = keycodeUserService.findByEmail(email);
            
            if (userOptional.isEmpty()) {
                // Don't reveal if user exists or not for security
                return ResponseEntity.ok().body(Map.of("message", "If an account with this email exists, a password reset link has been sent."));
            }

            KeycodeUser user = userOptional.get();
            if (!user.isActive()) {
                return ResponseEntity.ok().body(Map.of("message", "If an account with this email exists, a password reset link has been sent."));
            }

            // Send password reset email
            String resetUrl = System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:5173") + "/reset-password";
            boolean emailSent = passwordResetService.sendPasswordResetEmail(email, resetUrl);
            
            if (emailSent) {
                return ResponseEntity.ok().body(Map.of("message", "Password reset email sent successfully"));
            } else {
                return ResponseEntity.status(500).body(Map.of("error", "Failed to send password reset email"));
            }
            
        } catch (Exception e) {
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
