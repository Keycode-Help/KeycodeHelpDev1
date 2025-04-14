package org.rma.kchbackend.repository;


import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByKeycodeUser(KeycodeUser user);
    List<Subscription> findByIsActivated(boolean isActivated);
}
