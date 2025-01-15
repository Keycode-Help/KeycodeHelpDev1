package org.rma.kchbackend.controller;

import jakarta.validation.constraints.NotBlank;
import org.rma.kchbackend.dto.RegisterRequest;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.service.KeycodeUserService;
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

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final KeycodeUserService keycodeUserService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(KeycodeUserService keycodeUserService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.keycodeUserService = keycodeUserService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

//    @PostMapping("/register")
//    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult) throws IOException {
//        if (bindingResult.hasErrors()) {
//            StringBuilder errors = new StringBuilder();
//            bindingResult.getAllErrors().forEach(error -> errors.append(error.getDefaultMessage()).append("; "));
//            return ResponseEntity.badRequest().body("Validation errors: " + errors.toString());
//        }
//
//        if (keycodeUserService.findByEmail(registerRequest.getEmail()).isPresent()) {
//            return ResponseEntity.badRequest().body("Email already in use.");
//        }
//
//        KeycodeUser user = new KeycodeUser();
//        user.setFname(registerRequest.getFname());
//        user.setLname(registerRequest.getLname());
//        user.setEmail(registerRequest.getEmail());
//        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
//        user.setPhone(registerRequest.getPhone());
//        user.setRole(Role.BASEUSER);
//
//        keycodeUserService.saveUser(user);
//
//
//        return ResponseEntity.ok("User registered successfully!");
//    }

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

            //Check whether the user email already exists
            Optional<KeycodeUser> userExists = keycodeUserService.findByEmail(email);
            if(userExists.isPresent()){
                return ResponseEntity.status(500).body("User already exists");
            }
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

            return ResponseEntity.ok("User registered successfully!");
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
        String jwt = jwtUtil.generateToken(user);

        // Include user information in the response, including role.
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);

        return ResponseEntity.ok(response);
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

            keycodeUserService.saveUser(user);

            return ResponseEntity.status(200).body("User Details Updated Successfully");
        }catch(Exception e){
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