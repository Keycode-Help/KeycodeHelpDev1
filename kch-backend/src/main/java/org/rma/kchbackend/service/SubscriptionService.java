package org.rma.kchbackend.service;

import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    public void validateUserSubscription(KeycodeUser user) {
        Optional<Subscription> existingSubscription = subscriptionRepository.findByKeycodeUser(user);
        if (existingSubscription.isPresent()) {
            throw new IllegalArgumentException("User already has an active subscription.");
        }
    }
    public Optional<Subscription> getSubscriptionForUser(KeycodeUser user) {
        return subscriptionRepository.findByKeycodeUser(user);
    }

    public Subscription saveSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }


    @Transactional
    public void removeSubscription(Subscription subscription) {
        if (subscription.getKeycodeUser() != null) {
            subscription.getKeycodeUser().setSubscription(null);
            subscription.setKeycodeUser(null);
        }
        if (subscription.getCartItem() != null) {
            subscription.getCartItem().setSubscription(null);
            subscription.setCartItem(null);
        }
        subscriptionRepository.save(subscription);

        subscriptionRepository.delete(subscription);
    }



    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }


}

