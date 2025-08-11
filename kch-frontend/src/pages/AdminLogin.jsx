import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/adminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, userRole } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);

      // Check if the logged-in user is actually an admin
      if (userRole === "ADMIN") {
        navigate("/admin");
      } else if (userRole === "SUPER_ADMIN") {
        navigate("/super-admin");
      } else {
        // If not admin, show error and redirect back to admin login
        alert("Access denied. Admin privileges required.");
        navigate("/admin-login");
      }
    } catch (error) {
      console.error("Admin login failed", error);
      alert("Admin login failed. " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="container-admin-login">
      <div className="form-section-admin-login">
        <div className="admin-login-header">
          <h1>Admin Access</h1>
          <p>Administrative login portal</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@keycodehelp.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </div>
          
          <button type="submit" className="admin-login-btn">
            Access Admin Panel
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>
            <a href="/login">← Back to User Login</a>
          </p>
          <p>
            <a href="/admin-register">🔐 Create Admin Account</a>
          </p>
          <p className="admin-notice">
            This portal is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
