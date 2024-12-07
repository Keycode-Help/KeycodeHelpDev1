package org.rma.kchbackend.service;

import org.rma.kchbackend.model.*;
import org.rma.kchbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final VehicleRepository vehicleRepository;
    private final CartItemRepository cartItemRepository;
    private final TransactionRepository transactionRepository;
    private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public CartService(CartRepository cartRepository, VehicleRepository vehicleRepository, CartItemRepository cartItemRepository, TransactionRepository transactionRepository,
                       SubscriptionRepository subscriptionRepository, SubscriptionService subscriptionService) {
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

        if (cart.getCartItems().stream().anyMatch(item -> item.getVehicle().getId().equals(vehicle.getId()))) {
            throw new IllegalArgumentException("Vehicle is already in the cart.");
        }

        CartItem cartItem = new CartItem(vehicle);
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
    public void removeVehicleFromCart(Long vehicleId) {

        CartItem cartItem = cartItemRepository.findByVehicleId(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found in any cart"));

        Vehicle vehicle = cartItem.getVehicle();

        if (vehicle != null) {
            Optional<Transaction> existingTransaction = transactionRepository.findByVehiclesId(vehicle.getId());
            existingTransaction.ifPresent(transaction -> {
                transactionRepository.delete(transaction);
                vehicle.setTransaction(null);
            });
        }

        cartItemRepository.delete(cartItem);


        if (vehicle != null) {
            vehicle.setCartItem(null);
            vehicle.setKeycodeUser(null);


            if (vehicle.getCartItem() == null && vehicle.getTransaction() == null) {
                vehicleRepository.delete(vehicle);
            }
        }
    }



    @Transactional
    public void checkoutCart(Cart cart) {

        cart.setStatus("CHECKED_OUT");

        Transaction transaction = new Transaction();
        transaction.setConfirmationNumber(generateConfirmationNumber());
        transaction.setStatus("PENDING");
        transaction.setKeycodeUser(cart.getKeycodeUser());

        //KH-9 - Update CartService
        //Modifying checkout to handle subscriptions
        for(CartItem cartItem : cart.getCartItems()) {
            //Check whether the cart item is a vehicle
            if(cartItem.getVehicle() != null){
                Vehicle vehicle = cartItem.getVehicle();

                vehicle.setCartItem(null);

                vehicle.setTransaction(transaction);
                vehicleRepository.save(vehicle);

                transaction.getVehicles().add(vehicle);
            }

            //Check if the cart item is a Subscription
            if(cartItem.getSubscription() != null){
                Subscription subscription = cartItem.getSubscription();
                subscription.setCartItem(null);
                subscriptionRepository.save(subscription);
            }
        }

        transactionRepository.save(transaction);

        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private String generateConfirmationNumber() {
        return "CONF-" + System.currentTimeMillis();
    }

    //KH-9 - Update CartService
    //New Method - addSubscriptionToCart() - To add subscription to cart
    @Transactional
    public Cart addSubscriptionToCart(KeycodeUser user, Subscription subscription) {

        //Get the cart associated with user
        Cart cart = getOrCreateCart(user);

        //Make sure the subscription is not already present in the cart
        if(cart.getCartItems().stream().anyMatch(item -> item.getSubscription()!=null)){
            throw new IllegalArgumentException("User already has a subscription in the cart");
        }else{
            //Validate whether user already has a subscription in the system
            subscriptionService.validateUserSubscription(user);
        }

        //Create Subscription cart item
        CartItem cartItem = new CartItem(subscription);
        cartItem.setCart(cart);
        cartItemRepository.save(cartItem);

        //Add the cart item to the cart
        cart.addCartItem(cartItem);
        return cartRepository.save(cart);
    }

    //KH-9 - Udpate Cart Service
    //New Method - removeCartItem() - To remove cart item - both vehicle and subscription
    public int removeCartItem(Long cartItemId) {
        //Check whether the cart item is valid
        CartItem cartItem = cartItemRepository.findById(cartItemId).
                                orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        int cartItemType = 0;   //1 for Vehicle, 2 for Subscription

        //Check whether it is a vehicle
        if(cartItem.getVehicle() != null){
            Vehicle vehicle = cartItem.getVehicle();
            //Remove the vehicle from cartItemRepository
            cartItemRepository.delete(cartItem);
            vehicle.setCartItem(null);
            vehicle.setKeycodeUser(null);

            //Remove vehicle in vehicle repository
            vehicleRepository.delete(vehicle);

            cartItemType = 1;
        }

        //Check whether it is a subscription
        if(cartItem.getSubscription() != null){
            Subscription subscription = cartItem.getSubscription();

            subscription.setKeycodeUser(null);
            //Remove the subscription from cartItemRepository
            cartItemRepository.delete(cartItem);
            System.out.println("Cart Item deleted");

            subscription.setCartItem(null);
            //remove the subscription in subscription repo
            subscriptionRepository.delete(subscription);
            System.out.println("Subscription deleted");
            cartItemType = 2;
        }
        return cartItemType;
    }
}
