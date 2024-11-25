# **Detailed Application Architecture**

## **Overview**

The application is designed with several core components and entities including `KeycodeUser`, `Vehicle`, `Cart`, `CartItem`, and `Transaction`. It uses **Spring Boot** for the backend, integrated with **MySQL** for data storage, and communicates via **RESTful APIs**. The front end is built with **React**, managing UI interactions and communicating with the backend through API calls. Security is implemented using **Spring Security**, **JWTs** (JSON Web Tokens), and **BCrypt** for password encryption.

## **Entities and Relationships**

### **1. KeycodeUser Model**

The `KeycodeUser` model represents all users in the application, including both **Admin Users** and **Base Users**. The user model supports role-based authorization and integrates with Spring Security.

- **Attributes**:
  - `id`, `email`, `password`, `fname`, `lname`, `phone`, and `role` (either `ROLE_BASEUSER` or `ROLE_ADMIN`).
- **Relationships**:
  - **One-to-Many with Vehicle**: A user can request key codes for multiple vehicles.

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public class KeycodeUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @NotBlank
    private String fname;

    @NotBlank
    private String lname;

    @NotBlank
    private String password;

    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "keycodeUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Vehicle> vehicles;

    // UserDetails implementation for Spring Security
    @Override
    @JsonIgnore
    public String getUsername() { return email; }
    @Override
    @JsonIgnore
    public String getPassword() { return password; }
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
    // Other methods are implemented as necessary
}
```

### **2. Vehicle Model**

The `Vehicle` model stores details about each vehicle requested by the users, such as `make`, `model`, and `VIN`. It has various relationships that track its interactions throughout the workflow.

- **Attributes**:
  - `make`, `model`, `vin`, and `status` (`PENDING`, `COMPLETED`, `CHECKED_OUT`).
- **Relationships**:
  - **Many-to-One with KeycodeUser**: Each vehicle is linked to the user who requests it.
  - **Many-to-One with Transaction**: Once a transaction is created after checkout, each vehicle is associated with that transaction.
  - **One-to-One with CartItem**: Each vehicle added to a cart is represented as a cart item.

```java
@Entity
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String make;

    @NotBlank
    private String model;

    @Column(unique = true, nullable = false)
    @NotBlank
    private String vin;

    @ManyToOne
    @JoinColumn(name = "keycode_user_id")
    @JsonIgnore
    private KeycodeUser keycodeUser;

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    @JsonBackReference
    private Transaction transaction;

    private String status = "PENDING";
}
```

### **3. Cart & CartItem Models**

- **Cart**: Represents the shopping cart a user has, containing one or more vehicles they wish to request a keycode for.
- **CartItem**: Each individual vehicle in the cart is represented as a `CartItem`.

```java
@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems;

    @ManyToOne
    @JoinColumn(name = "keycode_user_id", nullable = false)
    private KeycodeUser keycodeUser;

    private String status;
}
```

### **4. Transaction Model**

The `Transaction` model represents an order after a cart has been checked out, providing the `confirmationNumber`, `status`, and any associated keycodes.

- **Attributes**:
  - `confirmationNumber`, `status` (`PENDING`, `FULFILLED`), and `keycode`.
- **Relationships**:
  - **One-to-Many with Vehicle**: A transaction can be associated with multiple vehicles.

```java
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String confirmationNumber;

    @NotBlank
    private String status;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Vehicle> vehicles = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "keycode_user_id", nullable = false)
    @JsonIgnore
    private KeycodeUser keycodeUser;

    private String keycode;
}
```

## **Application Workflow Including Frontend**

### **1. User Registration & Login (Frontend and Backend)**

- Users can register and log in using the **React** front end, which interacts with the backend endpoints.
- **Password Encryption**: User passwords are encrypted using **BCryptPasswordEncoder** for enhanced security.
- **JWT Authentication**:
  - Upon successful login, a **JWT** is generated in the backend and returned to the user.
  - The frontend saves this token in **localStorage** or **sessionStorage**.
  - For each subsequent request, this token is included in the request header to authenticate the user.

**AuthController**:

```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}
```

### **2. Vehicle Request and Cart Management**

- **Vehicle Request**:
  - The user can enter vehicle details such as `make`, `model`, and `VIN`.
  - Once submitted, the vehicle is added to the user's cart.
- **Add to Cart (Frontend Interaction)**:
  - A React component manages the form for adding vehicles to the cart.
  - Once added, it makes an API call (`/vehicle/request-keycode`) to the backend with the **JWT** token for authentication.

```jsx
const requestVehicleKeycode = (vehicle) => {
  axios
    .post("http://localhost:8080/vehicle/request-keycode", vehicle, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      alert("Vehicle keycode request has been added to your cart.");
    })
    .catch((error) => {
      console.error("Error adding vehicle:", error);
    });
};
```

### **3. Checkout and Order Creation**

- **Checkout Process**:

  - Users can check out their cart, and a new `Transaction` is created.
  - All `CartItem` entities are transferred to the new `Transaction`, and the cart is cleared.
  - An email is sent to the user confirming the order.

- **Backend Code for Checkout**:

```java
@PostMapping("/checkout")
public String checkout() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String userEmail = authentication.getName();
    KeycodeUser user = keycodeUserService.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

    Cart cart = cartService.getOrCreateCart(user);
    cartService.checkoutCart(cart);
    emailService.sendEmail(user.getEmail(), "Order Confirmation", "Thank you for your order.");
    return "Checkout successful.";
}
```

### **4. Admin Fulfillment and Processing**

- **Admin Dashboard**:

  - Admins can view pending requests and process them through the React front end, which displays a list of vehicles that need keycodes.
  - The backend provides endpoints (`/admin/pending-requests`) to fetch vehicles that need to be fulfilled.

- **Processing Requests**:
  - Admins enter the keycode, and the backend updates the `Vehicle` and `Transaction` statuses.
  - The updated information is sent to the user via email through **SendGrid**.

## **Controllers and Services**

### **1. AdminDashboardController**

- Handles all requests from the admin.
- Allows for viewing pending keycode requests, viewing all transactions, and processing orders by updating keycodes and notifying users.

### **2. VehicleKeycodeController**

- Handles user interactions related to adding vehicles to the system.
- Provides endpoints for adding vehicles and managing user-specific data.

### **3. CartController**

- Manages user cart operations, including adding items, removing items, and checking out.
- Communicates with the `CartService`, `VehicleService`, and `EmailService`.

### **4. AuthController**

- Provides authentication and authorization logic.
- Generates **JWTs** for authenticated users and verifies credentials.

## **Security Measures**

### **1. Spring Security & JWTs**

- **Spring Security** is used to handle all security aspects, including user authentication and authorization.
- Upon successful login, a **JWT** is generated, signed, and sent to the client.
- The **JWT** is added to the **Authorization Header** (`Bearer <token>`) of all subsequent requests to ensure secure communication.

### **2. BCrypt for Password Encryption**

- Passwords are encrypted using **BCryptPasswordEncoder** before being stored in the database, which ensures that passwords are securely hashed.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### **3. Role-Based Access Control**

- Admin users (`ROLE_ADMIN`) have elevated privileges and can access the admin dashboard.
- **@PreAuthorize** annotations are used in the backend to restrict access based on roles.

```java
@RestController
@RequestMapping("/admin")
public class AdminDashboardController {
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending-requests")
    public List<Vehicle> getPendingRequests() {
        return vehicleService.getPendingVehicles();
    }
}
```

## **Email Integration Using SendGrid**

### **EmailService**

- The **EmailService** utilizes the **SendGrid API** to send transactional emails to both users and admins, such as order confirmations and keycode fulfillment.

```java
@Autowired
private SendGrid sendGridClient;

public String sendEmail(String to, String subject, String body) {
    Email from = new Email("no-reply@keycodeapp.com");
    Email recipient = new Email(to);
    Content content = new Content("text/plain", body);
    Mail mail = new Mail(from, subject, recipient, content);

    Request request = new Request();
    try {
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        Response response = sendGridClient.api(request);
        return response.getBody();
    } catch (IOException ex) {
        throw new RuntimeException("Error sending email", ex);
    }
}
```

## **Error Handling and Logging**

### **Exception Handling**

- **Duplicate Entry Handling**:
  - When users try to add the same vehicle multiple times, an exception is thrown.

```java
if (cart.getCartItems().stream().anyMatch(item -> item.getVehicle().getId().equals(vehicle.getId()))) {
    throw new IllegalArgumentException("Vehicle is already in the cart.");
}
```

### **Logging**

- The application logs all key actions (using **SLF4J** with **Logback**), such as:
  - Successful transactions, vehicle additions, status changes, and email notifications.
  - This helps in monitoring the application and debugging issues effectively.

---
