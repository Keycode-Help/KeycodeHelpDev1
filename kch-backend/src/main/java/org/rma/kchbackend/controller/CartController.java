package org.rma.kchbackend.controller;

import com.sendgrid.Response;
import org.rma.kchbackend.dto.CartItemDto;
import org.rma.kchbackend.model.Cart;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.model.Vehicle;
import org.rma.kchbackend.service.CartService;
import org.rma.kchbackend.service.EmailService;
import org.rma.kchbackend.service.KeycodeUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final KeycodeUserService keycodeUserService;
    private final EmailService emailService;

    @Autowired
    public CartController(CartService cartService, KeycodeUserService keycodeUserService, EmailService emailService) {
        this.cartService = cartService;
        this.keycodeUserService = keycodeUserService;
        this.emailService = emailService;
    }

    @GetMapping("/items")
    public List<CartItemDto> getUserCartItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return cartService.getCartItems(user).stream()
                .map(cartItem -> new CartItemDto(
                        cartItem.getId(),
                        cartItem.getVehicle() != null ? cartItem.getVehicle().getMake() : null,
                        cartItem.getVehicle() != null ? cartItem.getVehicle().getModel() : null,
                        cartItem.getVehicle() != null ? cartItem.getVehicle().getVin() : null,
                        cartItem.getSubscription() != null ? cartItem.getSubscription().getTier().name() : null
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/addVehicle")
    public String addVehicleToCart(@RequestBody Vehicle vehicle) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        cartService.addVehicleToCart(user, vehicle);
        return "Vehicle added to cart successfully.";
    }




    @PostMapping("/addSubscription")
    public ResponseEntity<String> addSubscriptionToCart(@RequestBody Subscription subscription) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            // Attach subscription to user before adding to cart
            subscription.setKeycodeUser(user);
            cartService.addSubscriptionToCart(user, subscription);
            return ResponseEntity.ok("Subscription added to cart successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/remove/{cartItemId}")
    public String removeCartItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return "Item removed from cart.";
    }

    @PostMapping("/checkout")
    public String checkout() throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Cart cart = cartService.getOrCreateCart(user);
        cartService.checkoutCart(cart);

//        // Notify user and admin about checkout
//        String adminEmail = System.getenv("SENDER_EMAIL");
//
//        String userEmailResult = emailService.sendEmail(user.getEmail(), "Order Confirmation",
//                "Thank you for your order. Your confirmation number will be provided by the admin.");
//        String adminEmailResult = emailService.sendEmail(adminEmail, "New Transaction to Process",
//                "Order from user " + user.getEmail() + " is ready for processing.");
//
//        if (!userEmailResult.startsWith("Email sent successfully")) {
//            System.err.println("Failed to send order confirmation email to user: " + user.getEmail());
//        }
//        if (!adminEmailResult.startsWith("Email sent successfully")) {
//            System.err.println("Failed to notify admin for the transaction.");
//        }

           String adminEmail = System.getenv("SENDER_EMAIL");
//
           Response userEmailResponse = emailService.sendNotificationEmail(user.getFname(),
                                            user.getEmail(), "Order Confirmation!",
                                        "Thank you for your order. Your confirmation number will be provided by the admin.");
            Response adminEmailResponse = emailService.sendNotificationEmail(user.getFname(),
                                            adminEmail,"New Transaction to Process",
                                        "Order from user " + user.getEmail() + " is ready for processing.");
    //
            if (userEmailResponse.getStatusCode() != 202) {
                System.err.println("Failed to send order confirmation email to user: " + user.getEmail());
            }
            if (adminEmailResponse.getStatusCode() != 202) {
                System.err.println("Failed to notify admin for the transaction.");
            }

        return "Checkout successful.";
    }
}
