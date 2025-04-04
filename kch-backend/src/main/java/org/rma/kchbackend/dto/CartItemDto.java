package org.rma.kchbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.rma.kchbackend.model.Make;

@Data
@AllArgsConstructor
public class CartItemDto {
    private Long id;
    private String make;
    private String model;
    private String vin;

    //Added by Nithya - Standard Price of Keycode or Subscription
    private double standardPrice;

    //Final price after applying discount if there is a subscription or same as standard price
    private double finalPrice;
    private String subscriptionTier;
}