package org.rma.kchbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@Entity
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Commented by Nithya - Adding Many to One relationship between Vehicle and Make
    //@NotBlank(message = "Make cannot be empty")
    //private String make;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="make_id")
    private Make make;

    @NotBlank(message = "Model cannot be empty")
    private String model;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "VIN cannot be empty")
    private String vin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keycode_user_id")
    @JsonIgnore
    private KeycodeUser keycodeUser;

    @OneToOne(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private CartItem cartItem;

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    @JsonBackReference
    private Transaction transaction;


    private String status = "PENDING";

    private String keycode;

    //Added by Nithya - key code price
    private double keycodePrice;
    @Column(columnDefinition = "BYTEA")
    private byte[] frontId;

    @Column(columnDefinition = "BYTEA")
    private byte[] backId;

    @Column(columnDefinition = "BYTEA")
    private byte[] registration;
}