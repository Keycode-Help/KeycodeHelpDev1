### **SendGrid API Integration**

#### SendGrid Overview

SendGrid is used in our application for sending transactional emails. These include order confirmations to users and notifications to admins when a user checks out their cart.

##### Steps to Create a SendGrid Account

1. **Sign Up**: Visit [SendGrid](https://sendgrid.com/) and sign up for a new account.
2. **API Key Creation**:
   - Navigate to Settings > API Keys.
   - Click on "Create API Key" and generate a new API key.
   - Set permissions as needed and store the key securely (do not expose it in your code).
3. **Verify Domain**:
   - Follow SendGrid’s steps to verify your email domain for better email deliverability.

#### SendGrid Integration in Application

##### Configuration

- The API key generated is stored in an environment variable.
- We use `JavaMailSender` to communicate with SendGrid via HTTP requests.

##### Service Integration

- **EmailService**:
  - The `EmailService` class is responsible for sending emails.
  - It uses the SendGrid API to send an email when a user checks out or an admin fulfills an order.

Example in Service:

```java
@Autowired
private EmailService emailService;

// Send confirmation to user and admin
String userEmailResult = emailService.sendEmail(user.getEmail(), "Order Confirmation",
        "Thank you for your order. Your confirmation number is: " + confirmationNumber);
String adminEmailResult = emailService.sendEmail(adminEmail, "New Transaction to Process",
        "Order from user " + user.getEmail() + " is ready for processing.");
```

##### Controller Integration

- In controllers like `CartController` and `AdminDashboardController`, after certain actions like checkout or fulfillment, the `EmailService` is called to notify the relevant parties.

Example:

```java
@PostMapping("/checkout")
public String checkout() throws IOException {
    // Notify user and admin about checkout
    String adminEmail = System.getenv("SENDER_EMAIL");
    String confirmationNumber = cart.getCartItems().isEmpty() ? "N/A" : cart.getCartItems().get(0).getVehicle().getTransaction().getConfirmationNumber();

    String userEmailResult = emailService.sendEmail(user.getEmail(), "Order Confirmation",
            "Thank you for your order. Your confirmation number is: " + confirmationNumber);
    String adminEmailResult = emailService.sendEmail(adminEmail, "New Transaction to Process",
            "Order from user " + user.getEmail() + " is ready for processing.");
}
```

---
