package org.rma.kchbackend.controller;

import org.rma.kchbackend.model.Cart;
import org.rma.kchbackend.dto.CartItemDto;
import org.rma.kchbackend.model.*;
import org.rma.kchbackend.service.CartService;
import org.rma.kchbackend.service.EmailService;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.TrialService;
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
                .map(cartItem ->
                {

                   double cartItemStandardPrice = 0.0;
                   if(cartItem.getVehicle() !=null){
                       // If cart item is vehicle, standard price depends on membership status
                       Subscription userSubscription = user.getSubscription();
                       if(userSubscription != null && userSubscription.isActivated()){
                           cartItemStandardPrice = cartItem.getVehicle().getMake().getMemberPrice();
                       }else{
                           cartItemStandardPrice = cartItem.getVehicle().getMake().getNonMemberPrice();
                       }
                   }else if(cartItem.getSubscription() != null){
                       //If the cart item is a subscription, standard price will be the subscription tier price
                       String subscriptionTier = cartItem.getSubscription().getTier().name();
                       if(subscriptionTier.equals("BASE")){
                           cartItemStandardPrice = 9.99;
                       }else if(subscriptionTier.equals("PREMIUM")){
                           cartItemStandardPrice = 49.99;
                       }
                   }
                   return new CartItemDto(
                            cartItem.getId(),   //cart item id
                            cartItem.getVehicle() != null ? cartItem.getVehicle().getMake().getName() : null, //make
                            cartItem.getVehicle() != null ? cartItem.getVehicle().getModel() : null,    //model
                            cartItem.getVehicle() != null ? cartItem.getVehicle().getVin() : null, //vin
                            cartItemStandardPrice,  //standard price
                            cartItem.getVehicle() != null || cartItem.getSubscription() != null ? cartItem.getCartItemFinalPrice() : 0.00,  //final price
                            cartItem.getSubscription() != null ? cartItem.getSubscription().getTier().name() : null //subscription tier
                    );
                }
                        )
                .collect(Collectors.toList());
    }

    @GetMapping("/items/public")
    public ResponseEntity<?> getGuestUserCartItems(@RequestParam("guestUserId") Long guestUserId) {
        try {
            KeycodeUser guestUser = keycodeUserService.findById(guestUserId)
                    .orElseThrow(() -> new IllegalArgumentException("Guest user not found"));
            
            // Verify this is actually a guest user
            if (!"GUEST".equals(guestUser.getRole().name())) {
                return ResponseEntity.badRequest().body("Invalid guest user");
            }

            List<CartItemDto> cartItems = cartService.getCartItems(guestUser).stream()
                    .map(cartItem -> {
                        double cartItemStandardPrice = 0.0;
                        if(cartItem.getVehicle() != null){
                            // For guest users, always use non-member pricing
                            cartItemStandardPrice = cartItem.getVehicle().getMake().getNonMemberPrice();
                        }
                        
                        return new CartItemDto(
                                cartItem.getId(),
                                cartItem.getVehicle() != null ? cartItem.getVehicle().getMake().getName() : null,
                                cartItem.getVehicle() != null ? cartItem.getVehicle().getModel() : null,
                                cartItem.getVehicle() != null ? cartItem.getVehicle().getVin() : null,
                                cartItemStandardPrice,
                                cartItem.getVehicle() != null ? cartItem.getCartItemFinalPrice() : 0.00,
                                null // No subscriptions for guest users
                        );
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching guest user cart: " + e.getMessage());
        }
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
            // If trial flag present, enable 3-day trial window and activate for immediate access
            if (subscription.isTrial()) {
                if (subscription.getTrialEndsAt() == null) {
                    subscription.setTrialEndsAt(java.time.OffsetDateTime.now().plusDays(3));
                }
                subscription.setActivated(true);
            }
            cartService.addSubscriptionToCart(user, subscription);
            return ResponseEntity.ok("Subscription added to cart successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/remove/{cartItemId}")
    public String removeCartItem(@PathVariable Long cartItemId) {

        //Changed by Nithya - Getting the user info and passing it to update vehicle prices
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            //Check whether the cart item removed is Subscription or Vehicle
            boolean isSubscriptionRemoved = cartService.removeCartItem(cartItemId);

            //Update the vehicle prices if the cart item removed is a subscription
            //Update the cart total
            cartService.updateVehiclePrices(isSubscriptionRemoved, user);
            return "Item removed from cart.";
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }


    }

    @PostMapping("/checkout")
    public String checkout() throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Cart cart = cartService.getOrCreateCart(user);
        cartService.checkoutCart(cart);

        String adminEmail = System.getenv("SENDER_EMAIL");
        
        String userEmailResult = emailService.sendNotificationEmail(user.getFname(),
                                            user.getEmail(), "Order Confirmation!",
                                        "Thank you for your order. Your confirmation number will be provided by the admin.");
        String adminEmailResult = emailService.sendNotificationEmail(user.getFname(),
                                            adminEmail,"New Transaction to Process",
                                        "Order from user " + user.getEmail() + " is ready for processing.");
    
        if (!userEmailResult.startsWith("Notification email sent successfully")) {
            System.err.println("Failed to send order confirmation email to user: " + user.getEmail());
        }
        if (!adminEmailResult.startsWith("Notification email sent successfully")) {
            System.err.println("Failed to notify admin for the transaction.");
        }

        return "Checkout successful.";
    }
}
