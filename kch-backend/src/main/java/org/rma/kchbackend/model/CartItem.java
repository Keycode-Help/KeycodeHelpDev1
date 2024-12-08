package org.rma.kchbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    //Added by Nithya - Including Subscription
    //KH-13 - Update CartItem model
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "subscription_id")
    @JsonManagedReference
    private Subscription subscription;

    public CartItem(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    //Added by Nithya - Create a Subscription Cart Item
    public CartItem(Subscription subscription){
        this.subscription = subscription;
    }
}
