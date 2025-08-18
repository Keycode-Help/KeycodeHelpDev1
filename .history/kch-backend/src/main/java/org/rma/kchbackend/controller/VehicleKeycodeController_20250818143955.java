package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.service.MakeService;
import org.rma.kchbackend.service.VehicleService;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.rma.kchbackend.compliance.ComplianceRequirement;
import org.rma.kchbackend.compliance.ComplianceService;
import org.rma.kchbackend.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vehicle")
public class VehicleKeycodeController {

    private final VehicleService vehicleService;
    private final KeycodeUserService keycodeUserService;
    private final CartService cartService;
    private final MakeService makeService;
    private final ComplianceService complianceService;

    @Autowired
    public VehicleKeycodeController(VehicleService vehicleService, KeycodeUserService keycodeUserService,
                                    CartService cartService, MakeService makeService, ComplianceService complianceService) {
        this.vehicleService = vehicleService;
        this.keycodeUserService = keycodeUserService;
        this.cartService = cartService;
        this.makeService = makeService;
        this.complianceService = complianceService;
    }

    @PostMapping("/request-keycode")
    public ResponseEntity<?> requestKeycode(
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

            // Compliance gate: require license + photo ID in licensed states
            ComplianceRequirement cr = complianceService.evaluate(user.getId(), user.getState());
            if (cr.required()) {
                return ResponseEntity.unprocessableEntity().body(
                        ErrorResponse.of(
                                "DOCS_REQUIRED",
                                cr.userMessage(),
                                Map.of("missingDocs", cr.requiredDocs(), "jurisdiction", user.getState())
                        )
                );
            }

            // Create and save the vehicle
            Vehicle vehicle = new Vehicle();

            //Added by Nithya - Get the vehicle make
            Make vehicleMake = makeService.getMakeDetails(make);
            vehicle.setMake(vehicleMake);
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


    @GetMapping("/user-requests")
    public ResponseEntity<Map<String, List<Vehicle>>> getUserRequests(Authentication authentication) {
        String email = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Vehicle> pendingRequests = vehicleService.getVehiclesByStatus(user, "PENDING");
        List<Vehicle> fulfilledRequests = vehicleService.getVehiclesByStatus(user, "COMPLETED");
        List<Vehicle> inProgressRequests = vehicleService.getVehiclesByStatus(user, "INPROGRESS");

        Map<String, List<Vehicle>> response = new HashMap<>();
        response.put("pendingRequests", pendingRequests);
        response.put("inProgressRequests", inProgressRequests);
        response.put("fulfilledRequests", fulfilledRequests);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-requests-all")
    public ResponseEntity<List<Vehicle>> getAllStatusUserRequests(Authentication authentication) {
        String email = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        List<Vehicle> allRequests = vehicleService.getVehiclesByUser(user);

        return ResponseEntity.ok(allRequests);
    }

    @PutMapping("/update-request/{vehicleId}")
    public ResponseEntity<String> updateVehicleRequest(
            @PathVariable Long vehicleId,
            @RequestParam(value = "make", required = false) String make,
            @RequestParam(value = "model", required = false) String model,
            @RequestParam(value = "vin", required = false) String vin,
            @RequestParam(value = "frontId", required = false) MultipartFile frontId,
            @RequestParam(value = "backId", required = false) MultipartFile backId,
            @RequestParam(value = "registration", required = false) MultipartFile registration,
            Authentication authentication) {

        // Get the authenticated user's email
        String email = authentication.getName();

        // Check if the vehicle exists and belongs to the authenticated user
        Vehicle vehicle = vehicleService.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (!vehicle.getKeycodeUser().getEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this vehicle.");
        }

        // Update the vehicle details only if the new values are provided
        //Changed by Nithya
        if (make != null && !make.isEmpty()) vehicle.setMake(makeService.getMakeDetails(make));
        if (model != null && !model.isEmpty()) vehicle.setModel(model);
        if (vin != null && !vin.isEmpty()) vehicle.setVin(vin);

        // Handle file updates
        try {
            if (frontId != null && !frontId.isEmpty()) vehicle.setFrontId(frontId.getBytes());
            if (backId != null && !backId.isEmpty()) vehicle.setBackId(backId.getBytes());
            if (registration != null && !registration.isEmpty()) vehicle.setRegistration(registration.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Error processing file uploads", e);
        }

        // Save the updated vehicle
        vehicleService.saveVehicle(vehicle);
        return ResponseEntity.ok("Vehicle request updated successfully");
    }




}
