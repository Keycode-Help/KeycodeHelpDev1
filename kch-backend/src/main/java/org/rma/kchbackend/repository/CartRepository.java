package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.Cart;
import org.rma.kchbackend.model.KeycodeUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByKeycodeUser(KeycodeUser keycodeUser);
}