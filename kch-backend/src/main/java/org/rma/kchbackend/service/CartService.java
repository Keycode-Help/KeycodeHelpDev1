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

        Logger log = LoggerFactory.getLogger(CartService.class);
        //To set the cart item price
        double cartItemPrice = 0.00;

        Cart cart = getOrCreateCart(user);
        //Check the cart status. If the cart has been already checked out, change it to ACTIVE
        String cartStatus = cart.getStatus();
        if(cartStatus.equals("CHECKED_OUT")){
            cart.setStatus("ACTIVE");
        }
        //Get the cart total
        double cartTotal = cart.getCartTotal();
        if (cart.getCartItems().stream().anyMatch(item -> item.getVehicle() != null && item.getVehicle().getId().equals(vehicle.getId()))) {
            throw new IllegalArgumentException("Vehicle is already in the cart.");
        }

        //Check whether user has a subscription associated
        Subscription subscription = user.getSubscription();
        if(subscription != null){
            //If user has a BASE subscription discount the cart item price by $5
            if(subscription.getTier().equals(SubscriptionTier.BASE)){
                cartItemPrice = vehicle.getMake().getKeyCodePrice() - 5;
            }else if(subscription.getTier().equals(SubscriptionTier.PREMIUM)){
                //If user has PREMIUM subscription, discount the cart item price by $10
                cartItemPrice = vehicle.getMake().getKeyCodePrice() - 10;
            }
        }else{
            //User does not have subscription - price remains the same
            cartItemPrice = vehicle.getMake().getKeyCodePrice();
        }
        vehicle.setKeycodePrice(cartItemPrice);
        CartItem cartItem = new CartItem(vehicle);
        //Set the cart item price after applying discount if the user has a subscription
        cartItem.setCartItemFinalPrice(cartItemPrice);
        cartItem.setCart(cart);
        cartItemRepository.save(cartItem);
        cart.addCartItem(cartItem);

        //Update Cart Total after adding vehicle
        updateCartTotal(cart);
        log.debug("Updated Cart Total: {}", cart.getCartTotal());

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart addSubscriptionToCart(KeycodeUser user, Subscription subscription) {
        Logger log = LoggerFactory.getLogger(CartService.class);
        //To set the subscription cart item price
        double cartItemPrice = 0.00;

        Cart cart = getOrCreateCart(user);

        // Validate if the user already has an active subscription in the system
        subscriptionService.validateUserSubscription(user);

        // Ensure there is no subscription already in the cart
        if (cart.getCartItems().stream().anyMatch(item -> item.getSubscription() != null)) {
            throw new IllegalArgumentException("User already has a subscription in the cart.");
        }

        //Check the cart status. If the cart has been already checked out, change it to ACTIVE
        String cartStatus = cart.getStatus();
        if(cartStatus.equals("CHECKED_OUT")){
            cart.setStatus("ACTIVE");
        }

        subscription.setKeycodeUser(user); // Setting the user reference in subscription
        subscription.setActivated(false);
        subscription = subscriptionService.saveSubscription(subscription);

        CartItem cartItem = new CartItem(subscription);
        cartItem.setCart(cart);
        //set the subscription cart item price
        if(subscription.getTier().equals(SubscriptionTier.BASE)){
            cartItemPrice = 9.99;
        }else if(subscription.getTier().equals(SubscriptionTier.PREMIUM)){
            cartItemPrice = 49.99;
        }
        cartItem.setCartItemFinalPrice(cartItemPrice);
        cartItemRepository.save(cartItem);
        cart.addCartItem(cartItem);

        //Check whether the cart already has vehicles, if yes update the prices according to Subscription
        List<CartItem> cartItems = cart.getCartItems();
        for(CartItem selectedCartItem : cartItems){
            if(selectedCartItem.getVehicle() != null){
                double selectedCartItemAmount = selectedCartItem.getVehicle().getMake().getKeyCodePrice();
                double cartItemAmountAfterDiscount = 0.0;
                if(subscription.getTier().equals(SubscriptionTier.BASE)){
                    cartItemAmountAfterDiscount = selectedCartItemAmount - 5;
                }else if(subscription.getTier().equals(SubscriptionTier.PREMIUM)){
                    cartItemAmountAfterDiscount = selectedCartItemAmount - 10;
                }
                selectedCartItem.getVehicle().getCartItem().setCartItemFinalPrice(cartItemAmountAfterDiscount);

                Vehicle vehicle = selectedCartItem.getVehicle();
                vehicle.setKeycodePrice(cartItemAmountAfterDiscount);
                vehicleRepository.save(vehicle);
            }
        }

        //Update cart total
        updateCartTotal(cart);
        log.debug("Updated Cart Total: {}", cart.getCartTotal());
        return cartRepository.save(cart);
    }

    @Transactional
    public List<CartItem> getCartItems(KeycodeUser user) {
        Cart cart = getOrCreateCart(user);
        return cart.getCartItems();
    }

    //Added by Nithya - To update Cart Total when a keycode request or subscription is added to cart
    @Transactional
    public void updateCartTotal(Cart cart){
        List<CartItem> cartItems = cart.getCartItems();
        double totalCartAmount = 0.0;

        if(!cartItems.isEmpty()){
            for(CartItem cartItem : cartItems){
                totalCartAmount += cartItem.getCartItemFinalPrice();
            }
        }
        totalCartAmount = Math.round(totalCartAmount * 100.0)/100.0;
        //Set the cart total
        cart.setCartTotal(totalCartAmount);
    }

    @Transactional
    public boolean removeCartItem(Long cartItemId) {
        Logger log = LoggerFactory.getLogger(CartService.class);
        log.debug("Attempting to remove CartItem with ID: {}", cartItemId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("CartItem not found"));
        log.debug("CartItem retrieved: {}", cartItem);
        boolean isSubscriptionRemoved = false;
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
            isSubscriptionRemoved = true;
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
        return  isSubscriptionRemoved;
    }

    @Transactional
    public void updateVehiclePrices(boolean isSubscriptionRemoved, KeycodeUser user){
        Cart cart = getOrCreateCart(user);
        List<CartItem> vehicles = cart.getCartItems();
        //If Subscription is removed update the vehicle prices and then update cart total
        //If only a keycode request is removed, update the cart total
        if(isSubscriptionRemoved){
            if(!vehicles.isEmpty()){
                for(CartItem selectedCartItem : vehicles){
                    if(selectedCartItem.getVehicle() != null){
                        //Set the cart item final price to the standard keycode price associated with make
                        double selectedCartItemAmount = selectedCartItem.getVehicle().getMake().getKeyCodePrice();
                        selectedCartItem.getVehicle().getCartItem().setCartItemFinalPrice(selectedCartItemAmount);
                        cartItemRepository.save(selectedCartItem);

                        //Set the keycode price of the vehicle
                        Vehicle vehicle = selectedCartItem.getVehicle();
                        vehicle.setKeycodePrice(selectedCartItemAmount);
                    }
                }
            }
        }

        //Update the cart total
        updateCartTotal(cart);
        cartRepository.save(cart);

    }
    @Transactional
    public void checkoutCart(Cart cart) {
        cart.setStatus("CHECKED_OUT");

        // Create a new Transaction for the cart
        Transaction transaction = new Transaction();
        transaction.setConfirmationNumber(generateConfirmationNumber());
        transaction.setStatus("PENDING");
        transaction.setKeycodeUser(cart.getKeycodeUser());

        //Added by Nithya - Set the total transaction amount as cart total
        transaction.setTransactionAmount(cart.getCartTotal());
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
                subscription.setActivated(true);
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
        cart.setCartTotal(0.0);
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
