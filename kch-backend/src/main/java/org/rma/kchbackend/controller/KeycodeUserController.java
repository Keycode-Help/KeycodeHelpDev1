package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.service.KeycodeUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/keycode-user")
@CrossOrigin(origins = "http://localhost:5173")
public class KeycodeUserController {

    private final KeycodeUserService keycodeUserService;

    @Autowired
    public KeycodeUserController(KeycodeUserService keycodeUserService) {
        this.keycodeUserService = keycodeUserService;
    }

    @GetMapping("/profile")
    public ResponseEntity<KeycodeUser> getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateUserProfile(
            Authentication authentication,
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("phone") String phone,
            @RequestParam(value = "frontId", required = false) MultipartFile frontId,
            @RequestParam(value = "backId", required = false) MultipartFile backId,
            @RequestParam(value = "insurance", required = false) MultipartFile insurance) {

        String email = authentication.getName();
        keycodeUserService.updateUserProfile(email, fname, lname, phone, frontId, backId, insurance);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
