package org.rma.kchbackend.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.rma.kchbackend.service.CartService;
import org.rma.kchbackend.service.KeycodeUserService;
import org.rma.kchbackend.model.KeycodeUser;
import org.rma.kchbackend.model.Cart;
import org.rma.kchbackend.model.CartItem;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "https://keycode-help-dev1.vercel.app", "https://keycode-help-dev1-mrguru2024s-projects.vercel.app", "https://keycode.help", "https://www.keycode.help"}, allowCredentials = "true")
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Autowired
    private CartService cartService;

    @Autowired
    private KeycodeUserService keycodeUserService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> request) {
        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || authentication.getName().equals("anonymousUser")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "User must be authenticated to create payment intent");
                return ResponseEntity.status(401).body(errorResponse);
            }

            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Get user's cart
            Cart cart = cartService.getOrCreateCart(user);
            List<CartItem> cartItems = cart.getCartItems();

            if (cartItems.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Cart is empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Initialize Stripe with secret key
            Stripe.apiKey = stripeSecretKey;

            // Extract amount from request (amount should be in cents)
            Long amount = Long.valueOf(request.get("amount").toString());
            
            // Build order description for Stripe
            StringBuilder orderDescription = new StringBuilder();
            orderDescription.append("KeycodeHelp Order - ");
            
            for (CartItem item : cartItems) {
                if (item.getVehicle() != null) {
                    orderDescription.append(item.getVehicle().getMake().getName())
                            .append(" ")
                            .append(item.getVehicle().getModel())
                            .append(" (VIN: ")
                            .append(item.getVehicle().getVin())
                            .append(") - $")
                            .append(String.format("%.2f", item.getCartItemFinalPrice()))
                            .append(", ");
                } else if (item.getSubscription() != null) {
                    orderDescription.append(item.getSubscription().getTier())
                            .append(" Subscription - $")
                            .append(String.format("%.2f", item.getCartItemFinalPrice()))
                            .append(", ");
                }
            }
            
            // Remove trailing comma and space
            if (orderDescription.charAt(orderDescription.length() - 2) == ',') {
                orderDescription.setLength(orderDescription.length() - 2);
            }

                        // Create payment intent parameters with order details
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency("usd")
                    .setDescription(orderDescription.toString())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                            .build()
                    )
                    .build();

            // Create the payment intent
            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Return the client secret and order details
            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());
            response.put("orderDescription", orderDescription.toString());
            response.put("cartTotal", cart.getCartTotal());
            response.put("itemCount", cartItems.size());
            response.put("orderDetails", buildOrderDetails(cartItems));

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

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(@RequestBody Map<String, Object> request) {
        try {
            // Initialize Stripe with secret key
            Stripe.apiKey = stripeSecretKey;

            // Extract request data
            Long amount = Long.valueOf(request.get("amount").toString());
            List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");
            String successUrl = (String) request.get("success_url");
            String cancelUrl = (String) request.get("cancel_url");

            // Build line items for Stripe checkout
            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
            
            for (Map<String, Object> item : items) {
                String itemName = "";
                if (item.get("make") != null && item.get("model") != null) {
                    itemName = item.get("make") + " " + item.get("model") + " Keycode";
                } else {
                    itemName = "Vehicle Keycode";
                }
                
                SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("usd")
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(itemName)
                                                        .build()
                                        )
                                        .setUnitAmount((Long) item.get("finalPrice") != null ? 
                                                Math.round(((Number) item.get("finalPrice")).doubleValue() * 100) : 
                                                Math.round(((Number) item.get("standardPrice")).doubleValue() * 100))
                                        .build()
                        )
                        .setQuantity(1L)
                        .build();
                
                lineItems.add(lineItem);
            }

            // Create checkout session parameters
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addAllLineItem(lineItems)
                    .setCustomerEmail(getCustomerEmail(request))
                    .build();

            // Create the checkout session
            Session session = Session.create(params);

            // Return the checkout URL
            Map<String, Object> response = new HashMap<>();
            response.put("url", session.getUrl());
            response.put("sessionId", session.getId());
            response.put("amount", amount);
            response.put("itemCount", items.size());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create checkout session: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    private String getCustomerEmail(Map<String, Object> request) {
        // Try to get email from authenticated user first
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && !authentication.getName().equals("anonymousUser")) {
                String userEmail = authentication.getName();
                KeycodeUser user = keycodeUserService.findByEmail(userEmail).orElse(null);
                if (user != null) {
                    return user.getEmail();
                }
            }
        } catch (Exception e) {
            // Ignore authentication errors for guest users
        }
        
        // Return null for guest users (Stripe will handle this)
        return null;
    }

    private Map<String, String> buildCheckoutMetadata(List<Map<String, Object>> items) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("order_type", "keycode_request");
        metadata.put("item_count", String.valueOf(items.size()));
        
        // Add item details to metadata
        for (int i = 0; i < items.size(); i++) {
            Map<String, Object> item = items.get(i);
            if (item.get("make") != null && item.get("model") != null) {
                metadata.put("item_" + i + "_type", "vehicle");
                metadata.put("item_" + i + "_make", (String) item.get("make"));
                metadata.put("item_" + i + "_model", (String) item.get("model"));
                metadata.put("item_" + i + "_vin", (String) item.get("vin"));
            } else {
                metadata.put("item_" + i + "_type", "keycode");
            }
        }
        
        return metadata;
    }

    private List<Map<String, Object>> buildOrderDetails(List<CartItem> cartItems) {
        return cartItems.stream().map(item -> {
            Map<String, Object> itemDetails = new HashMap<>();
            
            if (item.getVehicle() != null) {
                itemDetails.put("type", "vehicle");
                itemDetails.put("make", item.getVehicle().getMake().getName());
                itemDetails.put("model", item.getVehicle().getModel());
                itemDetails.put("year", item.getVehicle().getYear());
                itemDetails.put("vin", item.getVehicle().getVin());
                itemDetails.put("price", item.getCartItemFinalPrice());
                itemDetails.put("description", item.getVehicle().getMake().getName() + " " + item.getVehicle().getModel() + " Keycode");
            } else if (item.getSubscription() != null) {
                itemDetails.put("type", "subscription");
                itemDetails.put("tier", item.getSubscription().getTier().name());
                itemDetails.put("price", item.getCartItemFinalPrice());
                itemDetails.put("description", item.getSubscription().getTier().name() + " Subscription");
            }
            
            return itemDetails;
        }).toList();
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
            response.put("description", paymentIntent.getDescription());
            response.put("metadata", paymentIntent.getMetadata());

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

    @PostMapping("/process-payment-success")
    public ResponseEntity<Map<String, Object>> processPaymentSuccess(@RequestBody Map<String, Object> request) {
        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || authentication.getName().equals("anonymousUser")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "User must be authenticated to process payment");
                return ResponseEntity.status(401).body(errorResponse);
            }

            String userEmail = authentication.getName();
            KeycodeUser user = keycodeUserService.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            String paymentIntentId = (String) request.get("paymentIntentId");
            
            // Process the successful payment by checking out the cart
            Cart cart = cartService.getOrCreateCart(user);
            cartService.checkoutCart(cart);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment processed successfully and order placed");
            response.put("confirmationNumber", "ORD-" + cart.getId() + "-" + System.currentTimeMillis());
            response.put("cartTotal", cart.getCartTotal());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to process payment success: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
