package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.service.VehicleService;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
    public String requestKeycode(@RequestBody Vehicle vehicle) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("User not found"));


        vehicle.setKeycodeUser(user);
        Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);


        cartService.addVehicleToCart(user, savedVehicle);

        return "Vehicle keycode request has been added to your cart.";
    }


    @GetMapping("/pending-vehicles")
    public List<Vehicle> getPendingVehicles() {
        return vehicleService.getPendingVehicles();
    }
}