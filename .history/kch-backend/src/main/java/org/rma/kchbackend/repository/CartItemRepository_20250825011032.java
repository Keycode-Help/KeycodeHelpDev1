package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByVehicleId(Long vehicleId);
    
    @Query("SELECT ci FROM CartItem ci " +
           "LEFT JOIN FETCH ci.vehicle v " +
           "LEFT JOIN FETCH v.make " +
           "LEFT JOIN FETCH ci.subscription " +
           "WHERE ci.cart.id = :cartId")
    List<CartItem> findByCartWithVehicleAndSubscription(@Param("cartId") Long cartId);
}