package org.rma.kchbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.rma.kchbackend.model.SubscriptionTier;

@Data
@RequiredArgsConstructor
public class CartItemDto {
    private Long cartItemId;

    private String make;
    private String model;
    private String vin;

    //For Subscription
    private SubscriptionTier tier;

    public CartItemDto(Long cartItemId, String make, String model, String vin){
        this.cartItemId = cartItemId;
        this.make = make;
        this.model = model;
        this.vin = vin;
    }

    public CartItemDto(Long cartItemId, SubscriptionTier subscriptionTier){
        this.cartItemId = cartItemId;
        this.tier = subscriptionTier;
    }
}