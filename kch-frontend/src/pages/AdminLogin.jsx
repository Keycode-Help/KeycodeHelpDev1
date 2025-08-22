import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper } from "../utils/roles";
import "../styles/adminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, user, isLoading, isInitialized } = useAuth();

  // Debug: Log auth context state
  console.log("AuthContext state:", {
    isLoading,
    isInitialized,
    user,
  });

  // Watch for user changes and navigate accordingly
  useEffect(() => {
    if (user?.role) {
      const currentRole = user.role;
      console.log("User role detected:", currentRole, "User object:", user);

      if (canSeeAdmin(currentRole) && !isSuper(currentRole)) {
        navigate("/admin");
      } else if (isSuper(currentRole)) {
        navigate("/super-admin");
      } else {
        // If not admin, show error and redirect back to admin login
        alert("Access denied. Admin privileges required.");
        navigate("/admin-login");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", formData);
    console.log("Login function:", login);
    console.log("Form data email:", formData.email);
    console.log("Form data password:", formData.password);

    try {
      console.log("Calling login function...");
      const result = await login(formData.email, formData.password);
      console.log("Login result:", result);
      // The navigation will be handled by the useEffect above
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
              autoComplete="username"
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
              autoComplete="current-password"
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
