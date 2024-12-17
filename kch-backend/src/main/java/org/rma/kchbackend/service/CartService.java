package org.rma.kchbackend.service;

import org.rma.kchbackend.model.*;
import org.rma.kchbackend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public CartService(CartRepository cartRepository, VehicleRepository vehicleRepository,
                       CartItemRepository cartItemRepository, TransactionRepository transactionRepository,
                       SubscriptionService subscriptionService, SubscriptionRepository subscriptionRepository) {
        this.cartRepository = cartRepository;
        this.vehicleRepository = vehicleRepository;
        this.cartItemRepository = cartItemRepository;
        this.transactionRepository = transactionRepository;
        this.subscriptionService = subscriptionService;
        this.subscriptionRepository = subscriptionRepository;
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

    @Transactional
    public Cart addSubscriptionToCart(KeycodeUser user, Subscription subscription) {
        Cart cart = getOrCreateCart(user);

        // Validate if the user already has a subscription in the system
        subscriptionService.validateUserSubscription(user);

        // Ensure there is no subscription already in the cart
        if (cart.getCartItems().stream().anyMatch(item -> item.getSubscription() != null)) {
            throw new IllegalArgumentException("User already has a subscription in the cart.");
        }

        subscription.setKeycodeUser(user); // Setting the user reference in subscription
        subscription = subscriptionService.saveSubscription(subscription);

        CartItem cartItem = new CartItem(subscription);
        cartItem.setCart(cart);
        cartItemRepository.save(cartItem);
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
        Logger log = LoggerFactory.getLogger(CartService.class);
        log.debug("Attempting to remove CartItem with ID: {}", cartItemId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("CartItem not found"));
        log.debug("CartItem retrieved: {}", cartItem);

        // Handle Vehicle Removal
        if (cartItem.getVehicle() != null) {
            Vehicle vehicle = cartItem.getVehicle();
            log.debug("Handling vehicle removal for Vehicle ID: {}", vehicle.getId());

            vehicle.setCartItem(null);
            vehicle.setKeycodeUser(null);
            vehicleRepository.save(vehicle);
            log.debug("Cleared associations for Vehicle ID: {}", vehicle.getId());

            if (vehicle.getCartItem() == null && vehicle.getTransaction() == null) {
                vehicleRepository.delete(vehicle);
                log.debug("Vehicle deleted: {}", vehicle.getId());
            }
        }

        // Handle Subscription Removal
        if (cartItem.getSubscription() != null) {
            Subscription subscription = cartItem.getSubscription();
            log.debug("Handling subscription removal for Subscription ID: {}", subscription.getId());

            // Clear bidirectional associations
            subscription.setCartItem(null);
            cartItem.setSubscription(null);

            // Clear the association with KeycodeUser
            if (subscription.getKeycodeUser() != null) {
                subscription.getKeycodeUser().setSubscription(null);
                subscription.setKeycodeUser(null);
            }

            // Save changes to the CartItem and Subscription
            cartItemRepository.save(cartItem);
            subscriptionRepository.save(subscription);
            log.debug("Cleared associations for Subscription ID: {}", subscription.getId());

            // Delete the Subscription entity
            subscriptionRepository.delete(subscription);
            log.debug("Subscription deleted: {}", subscription.getId());
        }

        // Remove the CartItem itself
        cartItemRepository.delete(cartItem);
        log.debug("CartItem deleted: {}", cartItemId);
    }



    @Transactional
    public void checkoutCart(Cart cart) {
        cart.setStatus("CHECKED_OUT");

        // Create a new Transaction for the cart
        Transaction transaction = new Transaction();
        transaction.setConfirmationNumber(generateConfirmationNumber());
        transaction.setStatus("PENDING");
        transaction.setKeycodeUser(cart.getKeycodeUser());

        boolean hasSubscription = false;

        // Store cart items to be deleted
        List<CartItem> cartItems = cart.getCartItems();

        // Disassociate all cart items from the cart and handle associated entities
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

        // Save the transaction in the repository
        transactionRepository.save(transaction);
    }



    private String generateConfirmationNumber() {
        return "CONF-" + System.currentTimeMillis();
    }
}
