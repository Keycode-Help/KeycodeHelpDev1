# Development Guidelines

## Table of Contents

1. [Code Standards](#code-standards)
2. [Component Development](#component-development)
3. [State Management](#state-management)
4. [API Development](#api-development)
5. [Database Development](#database-development)
6. [Testing Guidelines](#testing-guidelines)
7. [Performance Guidelines](#performance-guidelines)
8. [Security Guidelines](#security-guidelines)
9. [Documentation Standards](#documentation-standards)
10. [Git Workflow](#git-workflow)

---

## Code Standards

### General Principles

- **Readability**: Code should be self-documenting
- **Consistency**: Follow established patterns throughout the project
- **Maintainability**: Write code that's easy to modify and extend
- **Performance**: Consider performance implications of design decisions

### Naming Conventions

#### Frontend (React/JavaScript)

```javascript
// Components: PascalCase
const UserProfile = () => { ... }

// Functions: camelCase
const handleUserLogin = () => { ... }

// Variables: camelCase
const userEmail = 'user@example.com'

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8080'

// CSS Classes: kebab-case
const buttonClass = 'btn-primary'
```

#### Backend (Java)

```java
// Classes: PascalCase
public class UserService { ... }

// Methods: camelCase
public void createUser() { ... }

// Variables: camelCase
private String userEmail;

// Constants: UPPER_SNAKE_CASE
public static final String API_VERSION = "v1";

// Packages: lowercase
package org.rma.kchbackend.service;
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   └── ComponentName/
│       ├── index.jsx
│       ├── ComponentName.test.jsx
│       └── ComponentName.stories.jsx
├── pages/              # Page-level components
├── context/            # React Context providers
├── styles/             # CSS files
├── utils/              # Utility functions
├── data/               # Static data files
└── assets/             # Images, logos, etc.
```

---

## Component Development

### Component Structure

```jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ComponentName.css";

const ComponentName = ({ prop1, prop2, onAction }) => {
  // State declarations
  const [localState, setLocalState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleAction = () => {
    // Handler logic
    onAction();
  };

  // Render
  return <div className="component-name">{/* Component content */}</div>;
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onAction: PropTypes.func.isRequired,
};

// Default props
ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### Component Guidelines

- **Single Responsibility**: Each component should have one clear purpose
- **Props Interface**: Use PropTypes for type checking
- **Default Props**: Provide sensible defaults
- **Error Boundaries**: Wrap components in error boundaries when appropriate
- **Accessibility**: Include ARIA labels and semantic HTML

### Component Reusability

```jsx
// Good: Reusable component with clear props
const Button = ({ variant, size, children, onClick, disabled }) => {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Usage
<Button variant="primary" size="large" onClick={handleClick}>
  Submit
</Button>;
```

---

## State Management

### Local State

```jsx
// Use local state for component-specific data
const [formData, setFormData] = useState({
  email: "",
  password: "",
});

// Update state immutably
const handleInputChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
```

### Context State

```jsx
// Create context for global state
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = async (credentials) => {
    // Login logic
  };

  const logout = () => {
    // Logout logic
  };

  const value = {
    user,
    userRole,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### State Guidelines

- **Minimize Global State**: Only put truly global data in context
- **Local First**: Prefer local state when possible
- **Immutable Updates**: Always update state immutably
- **State Lifting**: Lift state up when multiple components need it

---

## API Development

### Frontend API Calls

```jsx
// Create API service functions
const apiService = {
  // GET request
  async getUsers() {
    try {
      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  // POST request
  async createUser(userData) {
    try {
      const response = await axios.post("/api/users", userData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },
};

// Usage in components
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Render logic
};
```

### Backend API Design

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            List<UserDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.emptyList());
        }
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            UserDTO user = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

### API Guidelines

- **Consistent Response Format**: Use standard response structure
- **Error Handling**: Proper HTTP status codes and error messages
- **Validation**: Validate all input data
- **Documentation**: Document all endpoints with examples
- **Rate Limiting**: Implement rate limiting for public endpoints

---

## Database Development

### Entity Design

```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors, getters, setters
}
```

### Repository Pattern

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    @Query("SELECT u FROM User u WHERE u.createdAt >= :startDate")
    List<User> findUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);

    boolean existsByEmail(String email);
}
```

### Database Guidelines

- **Naming**: Use snake_case for table and column names
- **Indexing**: Index frequently queried fields
- **Relationships**: Define clear foreign key relationships
- **Migrations**: Use database migrations for schema changes
- **Performance**: Monitor query performance and optimize as needed

---

## Testing Guidelines

### Frontend Testing

```jsx
// Component test example
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

describe("Login Component", () => {
  test("renders login form", () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("handles form submission", async () => {
    const mockLogin = jest.fn();
    render(<Login onLogin={mockLogin} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
```

### Backend Testing

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void createUser_ValidData_ReturnsUser() {
        // Arrange
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        // Act
        UserDTO result = userService.createUser(request);

        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertTrue(userRepository.existsByEmail("test@example.com"));
    }

    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        // Arrange
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        // Create existing user
        userService.createUser(request);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.createUser(request);
        });
    }
}
```

### Testing Guidelines

- **Test Coverage**: Aim for at least 80% code coverage
- **Test Types**: Unit tests, integration tests, and end-to-end tests
- **Test Data**: Use factories or builders for test data
- **Mocking**: Mock external dependencies appropriately
- **Assertions**: Use descriptive assertion messages

---

## Performance Guidelines

### Frontend Performance

```jsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
})

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.filter(item => item.active).map(item => ({
    ...item,
    processed: processItem(item)
  }))
}, [data])

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies])

// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'))

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### Backend Performance

```java
// Use pagination for large datasets
@GetMapping
public Page<UserDTO> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size) {

    Pageable pageable = PageRequest.of(page, size);
    return userService.getUsers(pageable);
}

// Use caching for frequently accessed data
@Cacheable("users")
public UserDTO getUserById(Long id) {
    return userRepository.findById(id)
        .map(UserMapper::toDTO)
        .orElseThrow(() -> new UserNotFoundException(id));
}

// Use async processing for long-running operations
@Async
public CompletableFuture<String> processLargeDataset() {
    // Long-running processing
    return CompletableFuture.completedFuture("Processing complete");
}
```

### Performance Guidelines

- **Lazy Loading**: Load components and data on demand
- **Caching**: Cache frequently accessed data
- **Optimization**: Optimize images and assets
- **Monitoring**: Monitor performance metrics
- **Profiling**: Use profiling tools to identify bottlenecks

---

## Security Guidelines

### Frontend Security

```jsx
// Sanitize user input
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, "");
};

// Validate data before submission
const validateForm = (formData) => {
  const errors = {};

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = "Valid email is required";
  }

  if (!formData.password || formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};

// Secure token storage
const storeToken = (token) => {
  localStorage.setItem("auth_token", token);
};

const getToken = () => {
  return localStorage.getItem("auth_token");
};

const removeToken = () => {
  localStorage.removeItem("auth_token");
};
```

### Backend Security

```java
// Input validation
@PostMapping
public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
    // Validation is handled by @Valid annotation
    UserDTO user = userService.createUser(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(user);
}

// Password hashing
@Service
public class PasswordService {

    public String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}

// JWT token validation
@Component
public class JwtTokenProvider {

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

### Security Guidelines

- **Input Validation**: Validate all user input
- **Authentication**: Implement secure authentication
- **Authorization**: Use role-based access control
- **HTTPS**: Always use HTTPS in production
- **Security Headers**: Implement security headers
- **Regular Updates**: Keep dependencies updated

---

## Documentation Standards

### Code Documentation

```jsx
/**
 * User authentication form component
 *
 * @param {Object} props - Component props
 * @param {Function} props.onLogin - Login callback function
 * @param {string} props.error - Error message to display
 * @returns {JSX.Element} Login form component
 */
const Login = ({ onLogin, error }) => {
  // Component implementation
};
```

```java
/**
 * Service for managing user operations
 *
 * @author Developer Name
 * @version 1.0
 */
@Service
public class UserService {

    /**
     * Creates a new user account
     *
     * @param request User creation request
     * @return Created user DTO
     * @throws UserAlreadyExistsException if user with email already exists
     * @throws ValidationException if request data is invalid
     */
    public UserDTO createUser(CreateUserRequest request) {
        // Implementation
    }
}
```

### Documentation Guidelines

- **Code Comments**: Comment complex logic and business rules
- **API Documentation**: Document all API endpoints
- **README Files**: Maintain up-to-date README files
- **Change Logs**: Document significant changes
- **Architecture Decisions**: Document architectural decisions

---

## Git Workflow

### Branch Naming

```
feature/user-authentication
bugfix/login-validation
hotfix/security-patch
release/v1.2.0
```

### Commit Messages

```
feat: add user authentication system
fix: resolve login validation issue
docs: update API documentation
refactor: simplify user service logic
test: add unit tests for user service
style: format code according to style guide
```

### Pull Request Process

1. **Create Feature Branch**: From main/master branch
2. **Develop Feature**: Implement changes with tests
3. **Code Review**: Request review from team members
4. **Address Feedback**: Make requested changes
5. **Merge**: Merge to main/master after approval

### Git Guidelines

- **Small Commits**: Make small, focused commits
- **Clear Messages**: Write clear, descriptive commit messages
- **Branch Strategy**: Use feature branches for development
- **Code Review**: Always review code before merging
- **Clean History**: Maintain clean, linear git history

---

## Code Review Checklist

### Frontend Review

- [ ] Component follows established patterns
- [ ] Props are properly typed with PropTypes
- [ ] State management is appropriate
- [ ] Error handling is implemented
- [ ] Accessibility features are included
- [ ] Performance considerations are addressed
- [ ] Tests are written and passing

### Backend Review

- [ ] API design follows REST principles
- [ ] Input validation is implemented
- [ ] Error handling is comprehensive
- [ ] Database queries are optimized
- [ ] Security measures are in place
- [ ] Tests cover all scenarios
- [ ] Documentation is updated

### General Review

- [ ] Code follows style guidelines
- [ ] Naming conventions are followed
- [ ] No code duplication
- [ ] Error messages are user-friendly
- [ ] Logging is appropriate
- [ ] Performance impact is considered

---

_These guidelines should be followed by all developers working on the project to ensure consistency and quality._
