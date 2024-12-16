package org.rma.kchbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Subscription tier cannot be null")
    private SubscriptionTier tier;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "keycode_user_id", unique = true)
    @JsonIgnore
    private KeycodeUser keycodeUser;

    @OneToOne(mappedBy = "subscription", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private CartItem cartItem;

    public Subscription(SubscriptionTier tier) {
        this.tier = tier;
    }
}
