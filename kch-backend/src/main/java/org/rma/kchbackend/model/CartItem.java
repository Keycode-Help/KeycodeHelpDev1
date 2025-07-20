package org.rma.kchbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonBackReference
    private Cart cart;

    @OneToOne
    @JoinColumn(name = "vehicle_id")
    @JsonManagedReference
    private Vehicle vehicle;

    @OneToOne
    @JoinColumn(name = "subscription_id")
    @JsonManagedReference
    private Subscription subscription;

    //Added by Nithya - final amount after discount if subscription is there or it will be the standardPrice
    private double cartItemFinalPrice;

    public CartItem(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public CartItem(Subscription subscription) {
        this.subscription = subscription;
    }

}
