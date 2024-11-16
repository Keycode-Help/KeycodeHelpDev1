# 🔑 Keycode Help: Tech Stack Documentation

Welcome to the **Keycode Help** project! This document provides an overview of the technologies and tools used to build the MVP and clear instructions to ensure smooth collaboration. The stack is designed to keep the project lightweight, scalable, and focused on delivering core features efficiently.

---

## Backend: RESTful APIs with Node.js and MySQL

### 1. **Node.js with Express.js**  
**Why**: Express.js provides a lightweight framework to build RESTful APIs for user authentication, VIN-to-keycode lookups, and dashboard data retrieval.  

#### Setup Instructions:
1. Initialize the backend:
    ```bash
    mkdir backend
    cd backend
    npm init -y
    npm install express mysql2 bcrypt jsonwebtoken dotenv
    npm install --save-dev nodemon
    ```

2. Organize the backend structure:
    ```
    backend/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── vinController.js
    └── routes/
        ├── auth.js
        ├── vin.js
    ```

3. Set up the main server (`app.js`):
    ```javascript
    const express = require('express');
    const app = express();
    const dotenv = require('dotenv');
    const bodyParser = require('body-parser');
    dotenv.config();

    app.use(bodyParser.json());

    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/vin', require('./routes/vin'));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    ```

---

### 2. **MySQL Database**  
**Why**: MySQL offers reliable, structured storage for user accounts, VIN lookups, and keycode mappings.

#### Setup Instructions:
1. Install MySQL locally or use a cloud-hosted service.
2. Create the following tables:
    ```sql
    CREATE TABLE Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('locksmith', 'admin') DEFAULT 'locksmith',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE VINLookups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        vin VARCHAR(17) NOT NULL,
        keycode VARCHAR(50),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    );
    ```

3. Configure the database connection (`config/db.js`):
    ```javascript
    const mysql = require('mysql2');
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.message);
        } else {
            console.log('Connected to MySQL');
        }
    });

    module.exports = connection;
    ```

---

## Frontend: Simple and Lightweight with HTML, Tailwind CSS, and Vanilla JavaScript  

### 1. **HTML and Vanilla JavaScript**  
**Why**: Lightweight and efficient, these tools allow rapid development of core functionality without unnecessary complexity.

#### Setup Instructions:
1. Organize the frontend structure:
    ```
    frontend/
    ├── index.html        # Landing page
    ├── login.html        # Login page
    ├── dashboard.html    # User dashboard
    ├── css/
    │   └── styles.css    # Tailwind CSS
    ├── js/
    │   ├── auth.js       # Handles authentication logic
    │   └── vin.js        # VIN lookup functionality
    ```

2. Example of a VIN lookup form (`dashboard.html`):
    ```html
    <form id="vin-form">
        <label for="vin">Enter VIN:</label>
        <input type="text" id="vin" maxlength="17" required />
        <button type="submit">Lookup Keycode</button>
    </form>
    <div id="result"></div>
    <script src="./js/vin.js"></script>
    ```

3. VIN lookup logic (`js/vin.js`):
    ```javascript
    const vinForm = document.getElementById('vin-form');
    const resultDiv = document.getElementById('result');

    vinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const vin = document.getElementById('vin').value;

        const response = await fetch('/api/vin/lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vin }),
        });

        const data = await response.json();
        resultDiv.textContent = data.keycode || 'Keycode not found.';
    });
    ```

---

### 2. **Tailwind CSS**  
**Why**: Tailwind CSS provides utility-first styling to quickly build modern, responsive UIs.

#### Setup Instructions:
1. Install Tailwind CSS:
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init
    ```

2. Configure `tailwind.config.js`:
    ```javascript
    module.exports = {
        content: ['./**/*.html'],
        theme: {
            extend: {},
        },
        plugins: [],
    };
    ```

3. Add Tailwind to `css/styles.css`:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

4. Use Tailwind utility classes to style forms, buttons, and layout elements.

---

## Deployment

### Backend: Railway or Render  
**Why**: Both platforms provide scalable, low-cost hosting for Node.js applications.

#### Setup Instructions:
1. Connect the `backend` folder to Railway or Render.
2. Add environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`).
3. Deploy the backend directly from your repository.

---

### Frontend: Vercel or Netlify  
**Why**: These platforms are ideal for static frontend hosting, offering quick deployments and CI/CD integration.

#### Setup Instructions:
1. Connect the `frontend` folder to Vercel or Netlify.
2. Deploy the static files (`index.html`, `login.html`, `dashboard.html`) to the platform.
3. Configure any necessary redirects for API requests.

---

## Summary of Tech Stack

| **Layer**       | **Technology**               | **Why**                                                                 |
|------------------|------------------------------|-------------------------------------------------------------------------|
| **Backend**      | Node.js, Express.js          | Lightweight, fast, and scalable for RESTful APIs.                      |
| **Database**     | MySQL                        | Structured data storage for users, VIN lookups, and keycodes.           |
| **Frontend**     | HTML, Tailwind CSS, JS       | Simple and efficient for MVP development.                              |
| **Authentication** | JWT, bcrypt.js             | Secure token-based authentication and password hashing.                |
| **Payments**     | Stripe                       | Simplifies payment and subscription management.                        |
| **Hosting**      | Vercel (frontend), Railway (backend) | Scalable and cost-effective hosting solutions.                         |

---

This documentation ensures that all collaborators have the context and tools needed to contribute effectively. Let’s keep the codebase organized and aligned with these standards. If you encounter issues or have suggestions, feel free to raise them during standups or via GitHub Issues.
