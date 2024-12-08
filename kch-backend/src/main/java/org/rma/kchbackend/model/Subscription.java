package org.rma.kchbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * KH-3 - Implement Subscription Model
 */
@Data
@NoArgsConstructor
@Entity
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull(message="Subscription tier cannot be null")
    private SubscriptionTier tier;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "keycode_user_id", unique=true)
    @JsonIgnore
    private KeycodeUser keycodeUser;

    @OneToOne(mappedBy = "subscription", cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonIgnore
    private CartItem cartItem;
}