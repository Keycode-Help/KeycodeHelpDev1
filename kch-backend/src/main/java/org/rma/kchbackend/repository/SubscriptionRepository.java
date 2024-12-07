package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * KH-4 - Implement Subscription Repo
 */
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByKeycodeUser(KeycodeUser user);
}
