package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.Make;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.service.MakeService;
import org.rma.kchbackend.service.VehicleService;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.CartService;
import org.rma.kchbackend.service.KeycodeNotificationService;
import org.rma.kchbackend.compliance.ComplianceRequirement;
import org.rma.kchbackend.compliance.ComplianceService;
import org.rma.kchbackend.dto.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.rma.kchbackend.model.Cart;
import org.rma.kchbackend.model.Role;
import org.rma.kchbackend.model.CartItem;
import org.rma.kchbackend.repository.CartItemRepository;
import org.rma.kchbackend.repository.CartRepository;

@RestController
@RequestMapping("/vehicle")
public class VehicleKeycodeController {

    private final VehicleService vehicleService;
    private final KeycodeUserService keycodeUserService;
    private final CartService cartService;
    private final MakeService makeService;
    private final ComplianceService complianceService;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;

    @Autowired
    public VehicleKeycodeController(VehicleService vehicleService, KeycodeUserService keycodeUserService,
                                    CartService cartService, MakeService makeService, ComplianceService complianceService,
                                    CartItemRepository cartItemRepository, CartRepository cartRepository) {
        this.vehicleService = vehicleService;
        this.keycodeUserService = keycodeUserService;
        this.cartService = cartService;
        this.makeService = makeService;
        this.complianceService = complianceService;
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
    }

    @GetMapping("/test-public")
    public ResponseEntity<String> testPublic() {
        return ResponseEntity.ok("Public endpoint is working!");
    }

    @PostMapping("/test-form")
    public ResponseEntity<Map<String, Object>> testForm(
            @RequestParam("make") String make,
            @RequestParam("model") String model) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("make", make);
        response.put("model", model);
        response.put("message", "Form data received successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/request-keycode-public")
    public ResponseEntity<?> requestKeycodePublic(
            @RequestParam("make") String make,
            @RequestParam("model") String model,
            @RequestParam("year") String year,
            @RequestParam("vin") String vin,
            @RequestParam(value = "frontId", required = false) MultipartFile frontId,
            @RequestParam(value = "backId", required = false) MultipartFile backId,
            @RequestParam(value = "registration", required = false) MultipartFile registration) {
        try {
            // For testing purposes, make files optional
            if (frontId != null && !frontId.isEmpty()) {
                // Validate file size (e.g., 5MB limit)
                long maxFileSize = 5 * 1024 * 1024;
                if (frontId.getSize() > maxFileSize) {
                    return ResponseEntity.badRequest().body("Front ID file size must not exceed 5MB.");
                }
                // Validate file type
                if (!frontId.getContentType().startsWith("image/")) {
                    return ResponseEntity.badRequest().body("Front ID must be an image file.");
                }
            }
            
            if (backId != null && !backId.isEmpty()) {
                long maxFileSize = 5 * 1024 * 1024;
                if (backId.getSize() > maxFileSize) {
                    return ResponseEntity.badRequest().body("Back ID file size must not exceed 5MB.");
                }
                if (!backId.getContentType().startsWith("image/")) {
                    return ResponseEntity.badRequest().body("Back ID must be an image file.");
                }
            }
            
            if (registration != null && !registration.isEmpty()) {
                long maxFileSize = 5 * 1024 * 1024;
                if (registration.getSize() > maxFileSize) {
                    return ResponseEntity.badRequest().body("Registration file size must not exceed 5MB.");
                }
                if (!registration.getContentType().startsWith("image/")) {
                    return ResponseEntity.badRequest().body("Registration must be an image file.");
                }
            }

            // Create a guest user for production safety
            KeycodeUser guestUser = new KeycodeUser();
            guestUser.setEmail("guest-" + System.currentTimeMillis() + "@keycode.help");
            guestUser.setFname("Guest");
            guestUser.setLname("User");
            guestUser.setPassword("GUEST_" + System.currentTimeMillis()); // Temporary password
            guestUser.setRole(Role.GUEST);
            guestUser.setActive(false);
            guestUser.setState("GUEST"); // Set a default state
            guestUser.setPhone("N/A"); // Set a default phone
            
            // Save the guest user
            KeycodeUser savedGuestUser = keycodeUserService.saveUser(guestUser);

            // Create and save the vehicle
            Vehicle vehicle = new Vehicle();

            // Get or create the vehicle make
            Make vehicleMake = makeService.getMakeDetails(make);
            if (vehicleMake == null) {
                // Create the make if it doesn't exist
                vehicleMake = new Make();
                vehicleMake.setName(make);
                vehicleMake.setNonMemberPrice(99.99); // Default non-member price
                vehicleMake.setMemberPrice(79.99);    // Default member price
                vehicleMake = makeService.saveMake(vehicleMake);
            }
            
            vehicle.setMake(vehicleMake);
            vehicle.setModel(model);
            vehicle.setYear(Integer.parseInt(year));
            
            // Set the keycode price (non-member price for public endpoint)
            double keycodePrice = vehicleMake.getNonMemberPrice();
            vehicle.setKeycodePrice(keycodePrice);
            vehicle.setVin(vin);
            
            // Set file data if provided
            if (frontId != null && !frontId.isEmpty()) {
                vehicle.setFrontId(frontId.getBytes());
            }
            if (backId != null && !backId.isEmpty()) {
                vehicle.setBackId(backId.getBytes());
            }
            if (registration != null && !registration.isEmpty()) {
                vehicle.setRegistration(registration.getBytes());
            }
            
            vehicle.setKeycodeUser(savedGuestUser); // Associate with guest user
            
            Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);

            // Create a cart for the guest user
            Cart guestCart = new Cart();
            guestCart.setKeycodeUser(savedGuestUser);
            guestCart.setStatus("ACTIVE");
            guestCart.setCartTotal(keycodePrice);
            
            // Save the cart
            Cart savedCart = cartService.getOrCreateCart(savedGuestUser);

            // Create a CartItem to link the vehicle to the cart
            CartItem cartItem = new CartItem();
            cartItem.setVehicle(savedVehicle);
            cartItem.setCart(savedCart);
            cartItem.setCartItemFinalPrice(keycodePrice);
            
            // Save the cart item
            cartItemRepository.save(cartItem);
            
            // Add the cart item to the cart
            savedCart.addCartItem(cartItem);
            cartService.updateCartTotal(savedCart);
            cartRepository.save(savedCart);
            
            // Return the vehicle data with cart information
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehicle keycode request submitted successfully");
            response.put("vehicleId", savedVehicle.getId());
            response.put("cartId", savedCart.getId());
            response.put("guestUserId", savedGuestUser.getId());
            response.put("make", savedVehicle.getMake().getName());
            response.put("model", savedVehicle.getModel());
            response.put("year", savedVehicle.getYear());
            response.put("vin", savedVehicle.getVin());
            response.put("price", keycodePrice);
            response.put("note", "This is a guest request. Complete checkout or log in to save permanently.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to process keycode request: " + e.getMessage());
        }
    }

    @PostMapping("/request-keycode")
    public ResponseEntity<?> requestKeycode(
            @RequestParam("make") String make,
            @RequestParam("model") String model,
            @RequestParam("year") String year,
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

            // Get the authenticated user (optional - for members)
            KeycodeUser user = null;
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && !authentication.getName().equals("anonymousUser")) {
                    // User is authenticated
                    String userEmail = authentication.getName();
                    user = keycodeUserService.findByEmail(userEmail)
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
                }
            } catch (Exception e) {
                // If there's any security context issue, treat as unauthenticated user
                user = null;
            }
            // If user is not authenticated, they can still request keycodes (non-member pricing)

            // Create and save the vehicle
            Vehicle vehicle = new Vehicle();

            // Get or create the vehicle make
            Make vehicleMake = makeService.getMakeDetails(make);
            if (vehicleMake == null) {
                // Create the make if it doesn't exist
                vehicleMake = new Make();
                vehicleMake.setName(make);
                vehicleMake = makeService.saveMake(vehicleMake);
            }
            
            vehicle.setMake(vehicleMake);
            vehicle.setModel(model);
            vehicle.setYear(Integer.parseInt(year));
            
            // Determine the correct price based on membership status
            double keycodePrice;
            if (user != null) {
                // Check if user has an active subscription
                Subscription subscription = user.getSubscription();
                if (subscription != null && subscription.isActivated()) {
                    keycodePrice = vehicleMake.getMemberPrice();
                } else {
                    keycodePrice = vehicleMake.getNonMemberPrice();
                }
            } else {
                // Non-authenticated user - use non-member pricing
                keycodePrice = vehicleMake.getNonMemberPrice();
            }
            
            vehicle.setKeycodePrice(keycodePrice);
            vehicle.setVin(vin);
            vehicle.setFrontId(frontId.getBytes());
            vehicle.setBackId(backId.getBytes());
            vehicle.setRegistration(registration.getBytes());
            
            if (user != null) {
                // Authenticated user - add to cart
                vehicle.setKeycodeUser(user);
                Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);
                cartService.addVehicleToCart(user, savedVehicle);
                return ResponseEntity.ok("Vehicle keycode request has been added to your cart.");
            } else {
                // Non-authenticated user - create anonymous request
                vehicle.setKeycodeUser(null); // No user association
                Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);
                // For non-members, we might want to create a session-based cart or redirect to payment
                return ResponseEntity.ok("Vehicle keycode request created. Please proceed to checkout.");
            }
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
