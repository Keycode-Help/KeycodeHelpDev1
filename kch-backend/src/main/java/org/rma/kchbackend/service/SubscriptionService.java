package org.rma.kchbackend.service;

import org.rma.kchbackend.model.Cart;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Subscription;
import org.rma.kchbackend.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * KH-5 - Implement Subscription Service class
 */
@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    //To get the subscription details of the particular user
    public Optional<Subscription> getSubscriptionForUser(KeycodeUser user)
    {
        Optional<Subscription> subscriptionOptional = subscriptionRepository.findByKeycodeUser(user);
        return subscriptionOptional;
    }

    //To save subscription
    public Subscription saveSubscription(Subscription subscription)
    {
        return subscriptionRepository.save(subscription);
    }

    //To remove subscription
    public void removeSubscription(Subscription subscription){
        subscriptionRepository.delete(subscription);
    }

    //To validate User Subscription - To make sure that user does not already have a subscription
    public void validateUserSubscription(KeycodeUser user){
        if(getSubscriptionForUser(user).isPresent()){
            throw new IllegalArgumentException("User already has a subscription");
        }
    }

    //To get all Subscriptions
    public List<Subscription> getAllSubscriptions(){
        return subscriptionRepository.findAll();
    }
}
