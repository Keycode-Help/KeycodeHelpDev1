package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.service.VehicleService;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/vehicle")
public class VehicleKeycodeController {

    private final VehicleService vehicleService;
    private final KeycodeUserService keycodeUserService;
    private final CartService cartService;

    @Autowired
    public VehicleKeycodeController(VehicleService vehicleService, KeycodeUserService keycodeUserService, CartService cartService) {
        this.vehicleService = vehicleService;
        this.keycodeUserService = keycodeUserService;
        this.cartService = cartService;
    }

    @PostMapping("/request-keycode")
    public ResponseEntity<String> requestKeycode(
            @RequestParam("make") String make,
            @RequestParam("model") String model,
            @RequestParam("vin") String vin,
            @RequestParam("frontId") MultipartFile frontId,
            @RequestParam("backId") MultipartFile backId,
            @RequestParam("registration") MultipartFile registration) {
        try {
            // Validate files
            if (frontId.isEmpty() || backId.isEmpty() || registration.isEmpty()) {
                return ResponseEntity.badRequest().body("All document files are required.");
            }

            // Validate file size (e.g., 5MB limit)
            long maxFileSize = 5 * 1024 * 1024;
            if (frontId.getSize() > maxFileSize || backId.getSize() > maxFileSize || registration.getSize() > maxFileSize) {
                return ResponseEntity.badRequest().body("File size must not exceed 5MB.");
            }

            // Validate file types
            if (!frontId.getContentType().startsWith("image/") ||
                    !backId.getContentType().startsWith("image/") ||
                    !registration.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed.");
            }

            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Create and save the vehicle
            Vehicle vehicle = new Vehicle();
            vehicle.setMake(make);
            vehicle.setModel(model);
            vehicle.setVin(vin);
            vehicle.setFrontId(frontId.getBytes());
            vehicle.setBackId(backId.getBytes());
            vehicle.setRegistration(registration.getBytes());
            vehicle.setKeycodeUser(user);

            Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);
            cartService.addVehicleToCart(user, savedVehicle);

            return ResponseEntity.ok("Vehicle keycode request has been added to your cart.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }


    @GetMapping("/pending-vehicles")
    public List<Vehicle> getPendingVehicles() {
        return vehicleService.getPendingVehicles();
    }
}
