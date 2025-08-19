package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.service.KeycodeUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/super-admin")
public class SuperAdminController {

    private final KeycodeUserService keycodeUserService;
    private final PasswordEncoder passwordEncoder;

    public SuperAdminController(KeycodeUserService keycodeUserService, PasswordEncoder passwordEncoder) {
        this.keycodeUserService = keycodeUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createSuperAdmin(@RequestParam("email") String email,
                                              @RequestParam("password") String password,
                                              @RequestParam(value = "fname", defaultValue = "Super") String fname,
                                              @RequestParam(value = "lname", defaultValue = "Admin") String lname,
                                              @RequestParam(value = "phone", required = false) String phone) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String requester = auth != null ? auth.getName() : null;
        if (requester == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<KeycodeUser> requesterOpt = keycodeUserService.findByEmail(requester);
        if (requesterOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        KeycodeUser requesterUser = requesterOpt.get();
        // Only approved SUPER_ADMIN can create another SUPER_ADMIN
        if (requesterUser.getRole() != Role.SUPER_ADMIN || !requesterUser.isAdminApproved()) {
            return ResponseEntity.status(403).body("Only approved super admins can add new super admins.");
        }

        Optional<KeycodeUser> existing = keycodeUserService.findByEmail(email);
        if (existing.isPresent() && existing.get().isActive()) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        KeycodeUser user = existing.orElseGet(KeycodeUser::new);
        user.setEmail(email);
        user.setFname(fname);
        user.setLname(lname);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.SUPER_ADMIN);
        user.setCompany("KCH");
        user.setAdminApproved(true);
        user.setActive(true);
        user.setState("N/A");
        user.setValidatedUser(true);
        keycodeUserService.saveUser(user);

        return ResponseEntity.ok().build();
    }
}


