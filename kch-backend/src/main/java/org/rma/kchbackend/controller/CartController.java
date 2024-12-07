package org.rma.kchbackend.controller;

import jakarta.validation.Valid;
import org.rma.kchbackend.dto.CartItemDto;
import org.rma.kchbackend.model.*;
import org.rma.kchbackend.service.CartService;
import org.rma.kchbackend.service.EmailService;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final KeycodeUserService keycodeUserService;
    private final EmailService emailService;

    @Autowired
    public CartController(CartService cartService, KeycodeUserService keycodeUserService, EmailService emailService,
                          SubscriptionService subscriptionService) {
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

        /*List<CartItemDto> cartItems1 =  cartService.getCartItems(user).stream()
                .map(cartItem -> new CartItemDto(
                        cartItem.getId(),
                        cartItem.getVehicle().getMake(),
                        cartItem.getVehicle().getModel(),
                        cartItem.getVehicle().getVin()))
                .collect(Collectors.toList());*/
        //Added by Nithya - To handle both Vehicles and Subscriptions
        List<CartItem> tempCartItems = cartService.getCartItems(user);
        List<CartItemDto> cartItems = new ArrayList<>();
        for(CartItem cartItem : tempCartItems) {

            //If cart item is vehicle
            if(cartItem.getVehicle() != null){
                CartItemDto cartItemDto = new CartItemDto(
                        cartItem.getId(),
                        cartItem.getVehicle().getMake(),
                        cartItem.getVehicle().getModel(),
                        cartItem.getVehicle().getVin()
                );
                cartItems.add(cartItemDto);
            }
            //If cart item is subscription
            if(cartItem.getSubscription() != null){
                CartItemDto cartItemDto = new CartItemDto(
                        cartItem.getId(),
                        cartItem.getSubscription().getTier()
                );
                cartItems.add(cartItemDto);
            }
        }
        return cartItems;
    }

    @PostMapping("/add")
    public String addToCart(@RequestBody Vehicle vehicle) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        cartService.addVehicleToCart(user, vehicle);
        return "Vehicle added to cart successfully.";
    }

   /* @DeleteMapping("/remove/{vehicleId}")
    public String removeVehicle(@PathVariable Long vehicleId) {
        cartService.removeVehicleFromCart(vehicleId);
        return "Vehicle removed from cart.";
    }*/



    @PostMapping("/checkout")
    public String checkout() throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Cart cart = cartService.getOrCreateCart(user);
        cartService.checkoutCart(cart);

        // Notify user and admin about checkout
        String adminEmail = System.getenv("SENDER_EMAIL");

        String userEmailResult = emailService.sendEmail(user.getEmail(), "Order Confirmation",
                "Thank you for your order. Your confirmation number will be provided by the admin.");
        String adminEmailResult = emailService.sendEmail(adminEmail, "New Transaction to Process",
                "Order from user " + user.getEmail() + " is ready for processing.");

        if (!userEmailResult.startsWith("Email sent successfully")) {
            System.err.println("Failed to send order confirmation email to user: " + user.getEmail());
        }
        if (!adminEmailResult.startsWith("Email sent successfully")) {
            System.err.println("Failed to notify admin for the transaction.");
        }

        return "Checkout successful.";
    }

    //KH-10 - Update Cart Controller
    //Add Subscription to Cart
    @PostMapping("/addSubscription")
    public String addSubscriptionToCart(@RequestBody Subscription subscription){
        String message = null;
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            subscription.setKeycodeUser(user);
            //Subscription savedSubscription = subscriptionService.saveSubscription(subscription);
            cartService.addSubscriptionToCart(user, subscription);
            message = "Subscription added to cart successfully";
        }catch(IllegalArgumentException e){
            message = e.getMessage();

        }
        return message;
    }

    //KH-10 - Update Cart Controller
    //To Remove Cart Item
    @DeleteMapping("/remove/{cartItemId}")
    public String removeCartItem(@PathVariable Long cartItemId){
        String returnMessage = "";
        int cartItemType = cartService.removeCartItem(cartItemId);
        if(cartItemType == 1){
            returnMessage = "Vehicle removed from Cart";
        }else if(cartItemType == 2){
            returnMessage = "Subscription removed from Cart";
        }
        return returnMessage;
    }

}