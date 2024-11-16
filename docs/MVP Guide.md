# 🔑 Keycode Help: MVP Documentation

## 📖 Overview
Keycode Help is a SaaS platform designed to simplify keycode retrieval and management for locksmiths and automotive professionals. The **Minimum Viable Product (MVP)** focuses on delivering core functionality to validate the concept, gather feedback, and provide a foundation for future development.

---

## 🎯 MVP Goals
1. Enable user registration, login, and authentication.
2. Allow users to input VINs and retrieve corresponding keycodes.
3. Provide a basic dashboard for user history and activities.
4. Deliver a responsive landing page highlighting the platform's features.
5. Ensure the backend and database are fully functional and secure.

---

## ✨ Key Deliverables

### 1. **User Authentication**
- **Backend**:
  - `/api/register`:
    - Allows users to register with an email and password.
    - Passwords are securely hashed using `bcrypt`.
  - `/api/login`:
    - Authenticates users and issues a JWT token for secure session management.

- **Frontend**:
  - **Login Page** (`login.html`):
    - Simple form for user login.
    - Sends credentials to the backend for validation.
  - **(Optional) Registration Page**:
    - For new users to create accounts if required.

---

### 2. **Landing Page**
- **Frontend**:
  - A responsive, static landing page (`index.html`) built with HTML and Tailwind CSS.
  - Highlights:
    - Key features of the platform (VIN lookup, keycode management).
    - Call-to-action buttons for "Log In" or "Sign Up".

---

### 3. **VIN Lookup Functionality**
- **Backend**:
  - `/api/vin-to-keycode`:
    - Accepts VIN input, validates the format, and queries the database for the corresponding keycode.
    - Logs each lookup request in the database for tracking.
  - **Database**:
    - Stores VIN-to-keycode mappings.
    - Logs user queries for analytics.

- **Frontend**:
  - **Lookup Form** (`dashboard.html`):
    - Simple form to input VINs.
    - Displays the corresponding keycode or an error message on submission.

---

### 4. **User Dashboard**
- **Backend**:
  - `/api/dashboard`:
    - Retrieves user-specific data such as VIN lookup history.
    - For admins, provides an overview of user activity.
  - **Database**:
    - User table with roles (`user`, `admin`).
    - VIN lookup log table for user-specific queries.

- **Frontend**:
  - **Dashboard Page** (`dashboard.html`):
    - Displays:
      - Recent VIN lookups for users.
      - User management controls for admins (optional for MVP).

---

### 5. **Hosting and Deployment**
- **Frontend**: Hosted on **Vercel** or **Netlify** for fast, free hosting of static assets.
- **Backend**: Hosted on **Railway**, **Render**, or **Heroku** with `.env` for sensitive configurations.

---

## 🛠 Tech Stack
### **Frontend**
- HTML, Vanilla JavaScript, Tailwind CSS.

### **Backend**
- Node.js with Express.js.
- MySQL for relational data storage.
- JWT for authentication.
- bcrypt.js for password hashing.

### **Deployment**
- **Frontend**: Vercel or Netlify.
- **Backend**: Railway or Render.

---

## 📂 Database Schema
| **Table**       | **Columns**                                                                                   |
|------------------|-----------------------------------------------------------------------------------------------|
| **Users**        | `id`, `email`, `password`, `role`, `created_at`, `updated_at`                                 |
| **VIN-Keycodes** | `id`, `vin`, `keycode`, `created_at`                                                          |
| **Lookup Logs**  | `id`, `user_id`, `vin`, `timestamp`                                                           |

---

## 📋 Timeline
| **Milestone**                  | **Tasks**                                                                                 | **Deadline**      |
|--------------------------------|-------------------------------------------------------------------------------------------|-------------------|
| **Milestone 1**: Authentication| Implement `/api/register` and `/api/login`, build login page.                             | Week 1            |
| **Milestone 2**: VIN Lookup    | Create `/api/vin-to-keycode`, setup database, and build lookup form.                      | Week 2            |
| **Milestone 3**: Dashboard     | Build basic dashboard, integrate `/api/dashboard` for user and admin functionality.       | Week 3            |
| **Milestone 4**: Deployment    | Host frontend on Vercel/Netlify and backend on Railway/Render.                            | Week 4            |

---

## 🚧 Known Limitations
1. Limited admin functionality (user management deferred for later iterations).
2. Basic UI design (focus on core functionality, with enhancements planned post-MVP).
3. Real-time updates and advanced analytics not included in MVP.

---

## 🤝 Contribution Workflow
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mrguru2024/keycodeHelpDev1.git
