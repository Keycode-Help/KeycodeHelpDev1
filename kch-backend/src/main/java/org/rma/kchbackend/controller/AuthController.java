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

            // Create and save the user
            KeycodeUser user = new KeycodeUser();
            user.setFname(fname);
            user.setLname(lname);
            user.setEmail(email);
            user.setPhone(phone);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(Role.BASEUSER);
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