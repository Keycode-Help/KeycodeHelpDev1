# **Getting Started for Developers**

## **Overview**

This document will guide you through the steps needed to set up your development environment to contribute to the **Keycode Help Application**, which consists of two main components:

- **kch-frontend** (React front end)
- **kch-backend** (Spring Boot back end)

The repository folder structure is:

```
keycodehelpdev1/
  ├── kch-frontend/
  └── kch-backend/
```

The goal is to enable you to get the application running locally, make changes, and eventually create a pull request to contribute your code.

---

## **Pre-requisites**

Before starting, make sure you have the following software installed on your machine:

1. **Git**: Version control system.
2. **Java Development Kit (JDK)**: Version 17+.
3. **Node.js & npm**: To run the React front end.
4. **MySQL**: For database management.
5. **IDE**: IntelliJ IDEA, VS Code, or any preferred code editor.
6. **Docker (Optional)**: For running MySQL or SendGrid in a container.
7. **SendGrid Account**: For email functionality.

---

## **Step-by-Step Setup Guide**

### **1. Fork the Repository**

- First, **fork** the main repository from GitHub into your account. This is crucial as you’ll be making your own changes that you want to eventually push back to the main repository via pull requests.

### **2. Clone the Repository**

- Clone the forked repository to your local machine using Git.
  ```sh
  git clone https://github.com/YOUR-USERNAME/keycodehelpdev1.git
  ```
- Navigate to the directory:
  ```sh
  cd keycodehelpdev1
  ```

### **3. Setting Up kch-backend (Spring Boot)**

1. **Navigate to kch-backend**:
   ```sh
   cd kch-backend
   ```
2. **Create Environment Variables**:
   - Create a `.env` file to store environment variables like SendGrid API keys.
   ```env
   SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
   SENDER_EMAIL=YOUR_SENDGRID_SENDER_EMAIL
   ```
3. **Configure application.properties**:
   - Make sure `application.properties` contains appropriate MySQL settings:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/keycodehelp
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   ```
4. **Run MySQL**:
   - Make sure your MySQL server is running and has a database named `keycodehelp`.
   - You can create it manually via MySQL CLI or use Docker to set up MySQL:
     ```sh
     docker run --name keycode-mysql -e MYSQL_ROOT_PASSWORD=YOUR_PASSWORD -e MYSQL_DATABASE=keycodehelp -p 3306:3306 -d mysql
     ```
5. **Run the Backend**:
   - Use your IDE to open the `kch-backend` directory.
   - Build and run the Spring Boot project:
     ```sh
     ./mvnw spring-boot:run
     ```
6. **Verify API Endpoints**:
   - Once running, the backend will be accessible at `http://localhost:8080`.
   - You can test API endpoints using tools like **Postman** or **curl**.

### **4. Setting Up kch-frontend (React)**

1. **Navigate to kch-frontend**:
   ```sh
   cd ../kch-frontend
   ```
2. **Install Dependencies**:
   - Install the required dependencies using `npm`.
   ```sh
   npm install
   ```
3. **Run the Frontend**:
   - Start the development server:
   ```sh
   npm run dev
   ```
   - The front end will be running at `http://localhost:5173`.

### **5. Managing JWT Tokens**

- **Frontend**: The JWT received during login is stored in **localStorage** or **sessionStorage**. This token is then attached to headers when making authenticated API requests.
- **Backend**: The backend uses **Spring Security** to verify and decode JWTs on each request.

### **6. Branching Strategy**

- **Create a New Branch**:
  - Always create a new branch for each feature or bug fix you are working on. This helps keep your work isolated and easier to manage.
  ```sh
  git checkout -b feature/new-feature
  ```
- **Naming Convention**:
  - Use descriptive names for branches, such as:
    - `feature/user-authentication`
    - `bugfix/cart-empty-error`

### **7. Make Your Changes**

- Make changes to the codebase as needed.
- Ensure that **unit tests** and **integration tests** are written or updated to reflect changes.
- **Formatting and Linting**: Make sure the code follows existing formatting and linting standards.

### **8. Commit Your Changes**

- **Add Changes**:
  ```sh
  git add .
  ```
- **Commit Changes**:
  ```sh
  git commit -m "Add feature for new user authentication method"
  ```

### **9. Push Your Branch to GitHub**

- Push your branch to your forked repository:
  ```sh
  git push origin feature/new-feature
  ```

### **10. Create a Pull Request**

- Go to your repository on GitHub.
- You’ll see a prompt to create a **Pull Request** for the branch you just pushed.
- Click **Compare & pull request**.
- Add a description of what you’ve done and mention any related issue numbers.
- Assign reviewers (if required) and submit the Pull Request.

---

## **Environment and Application Properties**

### **.env Configuration**

The `.env` file holds sensitive credentials such as your **SendGrid API Key**.

**Example**:

```env
SENDGRID_API_KEY=your-sendgrid-api-key
SENDER_EMAIL=no-reply@keycodeapp.com
```

### **Integrating Environment Variables with application.properties**

In `application.properties`, you can load environment variables using the following syntax:

```properties
sendgrid.api.key=${SENDGRID_API_KEY}
sendgrid.sender.email=${SENDER_EMAIL}
```

The **Spring Boot** application will then read from the `.env` file, thanks to **Spring Boot’s support for external configuration**.

---

## **Code Structure**

### **Backend Directory Structure (`kch-backend/`)**:

- `src/main/java/org/rma/kchbackend`:
  - `controller` - Holds the **controllers** like `AuthController`, `CartController`, and `AdminDashboardController`.
  - `model` - Entity classes such as `KeycodeUser`, `Vehicle`, `Transaction`.
  - `repository` - Interfaces that extend **JPA Repositories** for database interaction.
  - `service` - Contains the business logic, such as `CartService`, `VehicleService`, and `EmailService`.
  - `config` - Holds configurations for **JWT** handling, **Spring Security**, etc.

### **Frontend Directory Structure (`kch-frontend/`)**:

- `src/`:
  - `components/` - Holds reusable components like `LoginForm`, `VehicleForm`, `AdminDashboard`.
  - `context/` - Contains the **AuthContext** for managing authentication status and JWTs.
  - `pages/` - Main pages such as `LoginPage`, `CartPage`, `CheckoutPage`.
  - `services/` - Files that handle communication with the backend API using **axios**.

---

## **Best Practices for Contribution**

1. **Keep Pull Requests Small**: Focus on a single feature or bug fix to make the review process simpler.
2. **Write Tests**: Make sure to include or update unit/integration tests for your changes.
3. **Code Reviews**: Always request a review from your peers or maintainers of the repository.
4. **Rebase Regularly**: Keep your feature branch up to date by rebasing with the main branch to avoid conflicts later.
   ```sh
   git fetch origin
   git rebase origin/main
   ```

---

## **Deployment (Optional for Advanced Usage)**

- **Docker**:
  - Use Docker to containerize the application for consistency across environments.
  - A **Dockerfile** is provided to build an image for the backend.
  - Use **docker-compose** to manage both backend and database services together.

**Example `docker-compose.yml`**:

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: YOUR_PASSWORD
      MYSQL_DATABASE: keycodehelp
    ports:
      - "3306:3306"
  backend:
    build: ./kch-backend
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/keycodehelp
    ports:
      - "8080:8080"
    depends_on:
      - mysql
```

---
