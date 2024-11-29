package org.rma.kchbackend.service;

import org.rma.kchbackend.model.*;
import org.rma.kchbackend.repository.CartItemRepository;
import org.rma.kchbackend.repository.CartRepository;
import org.rma.kchbackend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.rma.kchbackend.repository.TransactionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final VehicleRepository vehicleRepository;
    private final CartItemRepository cartItemRepository;
    private final TransactionRepository transactionRepository;

    @Autowired
    public CartService(CartRepository cartRepository, VehicleRepository vehicleRepository, CartItemRepository cartItemRepository, TransactionRepository transactionRepository) {
        this.cartRepository = cartRepository;
        this.vehicleRepository = vehicleRepository;
        this.cartItemRepository = cartItemRepository;
        this.transactionRepository = transactionRepository;
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

        for (CartItem cartItem : cart.getCartItems()) {
            Vehicle vehicle = cartItem.getVehicle();
            if (vehicle != null) {
               
                vehicle.setCartItem(null);
                vehicleRepository.save(vehicle);

                Transaction transaction = transactionRepository.findById(vehicle.getTransaction().getId())
                        .orElseGet(() -> {
                            Transaction newTransaction = new Transaction();
                            newTransaction.setConfirmationNumber(generateConfirmationNumber());
                            newTransaction.setStatus("PENDING");
                            newTransaction.setKeycodeUser(cart.getKeycodeUser());
                            transactionRepository.save(newTransaction);
                            return newTransaction;
                        });

                vehicle.setTransaction(transaction);
                transaction.getVehicles().add(vehicle);
                transactionRepository.save(transaction);
            }
        }

        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
    private String generateConfirmationNumber() {
        return "CONF-" + System.currentTimeMillis();
    }
}
