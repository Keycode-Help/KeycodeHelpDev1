package org.rma.kchbackend.service;

import org.rma.kchbackend.model.*;
import org.rma.kchbackend.repository.CartItemRepository;
import org.rma.kchbackend.repository.CartRepository;
import org.rma.kchbackend.repository.VehicleRepository;
import org.rma.kchbackend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final VehicleRepository vehicleRepository;
    private final CartItemRepository cartItemRepository;
    private final TransactionRepository transactionRepository;
    private final SubscriptionService subscriptionService;

    @Autowired
    public CartService(CartRepository cartRepository, VehicleRepository vehicleRepository,
                       CartItemRepository cartItemRepository, TransactionRepository transactionRepository,
                       SubscriptionService subscriptionService) {
        this.cartRepository = cartRepository;
        this.vehicleRepository = vehicleRepository;
        this.cartItemRepository = cartItemRepository;
        this.transactionRepository = transactionRepository;
        this.subscriptionService = subscriptionService;
    }

    public Cart getOrCreateCart(KeycodeUser user) {
        return cartRepository.findByKeycodeUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setKeycodeUser(user);
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public Cart addVehicleToCart(KeycodeUser user, Vehicle vehicle) {
        Cart cart = getOrCreateCart(user);

        if (cart.getCartItems().stream().anyMatch(item -> item.getVehicle() != null && item.getVehicle().getId().equals(vehicle.getId()))) {
            throw new IllegalArgumentException("Vehicle is already in the cart.");
        }

        CartItem cartItem = new CartItem(vehicle);
        cartItem.setCart(cart);
        cartItemRepository.save(cartItem);
        cart.addCartItem(cartItem);

        return cartRepository.save(cart);
    }


        //KH-9 - Update CartService
//New Method - addSubscriptionToCart() - To add subscription to cart
    @Transactional
    public Cart addSubscriptionToCart(KeycodeUser user, Subscription subscription) {

        //Get the cart associated with user
        Cart cart = getOrCreateCart(user);

        // Switch order of operactions to check if user's account already has a subscription
        // Validate if the user already has a subscription in the system
        subscriptionService.validateUserSubscription(user);

        //Make sure the subscription is not already present in the cart
        if(cart.getCartItems().stream().anyMatch(item -> item.getSubscription()!=null)){
            throw new IllegalArgumentException("User already has a subscription in the cart");
        }

        subscription.setKeycodeUser(user); // Setting the user reference in subscription
        subscription = subscriptionService.saveSubscription(subscription);

        //Create Subscription cart item
        CartItem cartItem = new CartItem(subscription);
        cartItem.setCart(cart);
        cartItemRepository.save(cartItem);

        //Add the cart item to the cart
        cart.addCartItem(cartItem);
        return cartRepository.save(cart);
    }

    @Transactional
    public List<CartItem> getCartItems(KeycodeUser user) {
        Cart cart = getOrCreateCart(user);
        return cart.getCartItems();
    }

    @Transactional
    public void removeCartItem(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("CartItem not found"));

        if (cartItem.getVehicle() != null) {
            Vehicle vehicle = cartItem.getVehicle();
            vehicle.setCartItem(null);
            vehicleRepository.save(vehicle);
        } else if (cartItem.getSubscription() != null) {
            Subscription subscription = cartItem.getSubscription();
            subscription.setKeycodeUser(null);
            subscriptionService.removeSubscription(subscription);
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void checkoutCart(Cart cart) {
        cart.setStatus("CHECKED_OUT");

        Transaction transaction = new Transaction();
        transaction.setConfirmationNumber(generateConfirmationNumber());
        transaction.setStatus("PENDING");
        transaction.setKeycodeUser(cart.getKeycodeUser());

        boolean hasSubscription = false;

        List<CartItem> cartItems = cart.getCartItems();

        for (CartItem cartItem : cartItems) {
            if (cartItem.getVehicle() != null) {
                // Handle Vehicle
                Vehicle vehicle = cartItem.getVehicle();
                vehicle.setCartItem(null);
                vehicle.setTransaction(transaction);
                transaction.getVehicles().add(vehicle);
            } else if (cartItem.getSubscription() != null) {
                // Handle Subscription
                if (hasSubscription) {
                    throw new IllegalArgumentException("Cannot check out more than one subscription.");
                }
                hasSubscription = true;

                // Keep the subscription associated with the user
                Subscription subscription = cartItem.getSubscription();
                subscription.setKeycodeUser(cart.getKeycodeUser());
                subscriptionService.saveSubscription(subscription);

                // Remove subscription from cart item to allow cart item deletion
                subscription.setCartItem(null);
                cartItem.setSubscription(null);
            }

            // Remove the cart item association
            cartItem.setCart(null);
        }

        // Clear the cart items from the cart object
        cart.getCartItems().clear();
        cartRepository.save(cart);

        // Explicitly delete each cart item after disassociating
        for (CartItem cartItem : cartItems) {
            cartItemRepository.delete(cartItem);
        }

        transactionRepository.save(transaction);
    }



    private String generateConfirmationNumber() {
        return "CONF-" + System.currentTimeMillis();
    }




//
//    @Transactional
//    public void checkoutCart(Cart cart) {
//
//        cart.setStatus("CHECKED_OUT");
//
//        Transaction transaction = new Transaction();
//        transaction.setConfirmationNumber(generateConfirmationNumber());
//        transaction.setStatus("PENDING");
//        transaction.setKeycodeUser(cart.getKeycodeUser());
//
//        //KH-9 - Update CartService
//        //Modifying checkout to handle subscriptions
//        for(CartItem cartItem : cart.getCartItems()) {
//            //Check whether the cart item is a vehicle
//            if(cartItem.getVehicle() != null){
//                Vehicle vehicle = cartItem.getVehicle();
//
//                vehicle.setCartItem(null);
//
//                vehicle.setTransaction(transaction);
//                vehicleRepository.save(vehicle);
//
//                transaction.getVehicles().add(vehicle);
//            }
//
//            //Check if the cart item is a Subscription
//            if(cartItem.getSubscription() != null){
//                Subscription subscription = cartItem.getSubscription();
//                subscription.setCartItem(null);
//                subscriptionRepository.save(subscription);
//            }
//        }
//
//        transactionRepository.save(transaction);
//
//        cart.getCartItems().clear();
//        cartRepository.save(cart);
//    }

//    //KH-9 - Udpate Cart Service
////New Method - removeCartItem() - To remove cart item - both vehicle and subscription
//    public int removeCartItem(Long cartItemId) {
//        //Check whether the cart item is valid
//        CartItem cartItem = cartItemRepository.findById(cartItemId).
//                orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
//
//        int cartItemType = 0;   //1 for Vehicle, 2 for Subscription
//
//        //Check whether it is a vehicle
//        if(cartItem.getVehicle() != null){
//            Vehicle vehicle = cartItem.getVehicle();
//            //Remove the vehicle from cartItemRepository
//            cartItemRepository.delete(cartItem);
//            vehicle.setCartItem(null);
//            vehicle.setKeycodeUser(null);
//
//            //Remove vehicle in vehicle repository
//            vehicleRepository.delete(vehicle);
//
//            cartItemType = 1;
//        }
//
//        //Check whether it is a subscription
//        if(cartItem.getSubscription() != null){
//            Subscription subscription = cartItem.getSubscription();
//
//            subscription.setKeycodeUser(null);
//            //Remove the subscription from cartItemRepository
//            cartItemRepository.delete(cartItem);
//            System.out.println("Cart Item deleted");
//
//            subscription.setCartItem(null);
//            //remove the subscription in subscription repo
//            subscriptionRepository.delete(subscription);
//            System.out.println("Subscription deleted");
//            cartItemType = 2;
//        }
//        return cartItemType;
//    }
}
