package org.rma.kchbackend.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> request) {
        try {
            // Initialize Stripe with secret key
            Stripe.apiKey = stripeSecretKey;

            // Extract amount from request (amount should be in cents)
            Long amount = Long.valueOf(request.get("amount").toString());
            
            // Create payment intent parameters
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency("usd")
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            // Create the payment intent
            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Return the client secret
            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create payment intent: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<Map<String, Object>> confirmPayment(@RequestBody Map<String, Object> request) {
        try {
            // Initialize Stripe with secret key
            Stripe.apiKey = stripeSecretKey;

            String paymentIntentId = (String) request.get("paymentIntentId");
            
            // Retrieve the payment intent
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            Map<String, Object> response = new HashMap<>();
            response.put("status", paymentIntent.getStatus());
            response.put("amount", paymentIntent.getAmount());
            response.put("currency", paymentIntent.getCurrency());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to confirm payment: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
