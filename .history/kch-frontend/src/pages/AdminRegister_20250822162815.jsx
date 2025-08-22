import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/adminRegister.css";

function AdminRegister() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "", // Special admin registration code
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
  });

  const [codeRequested, setCodeRequested] = useState(false);
  const [codeRequestLoading, setCodeRequestLoading] = useState(false);
  const [codeRequestMessage, setCodeRequestMessage] = useState("");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const requestRegistrationCode = async () => {
    // Validate required fields for code request
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setErrors({
        email: !formData.email ? "Email is required" : "",
        firstName: !formData.firstName ? "First name is required" : "",
        lastName: !formData.lastName ? "Last name is required" : "",
      });
      return;
    }

    setCodeRequestLoading(true);
    setCodeRequestMessage("");

    try {
      const response = await fetch("/admin-registration-code/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCodeRequested(true);
        setCodeRequestMessage(
          "✅ Registration code sent successfully! Check your email."
        );
        // Clear the admin code field so user can enter the new code
        setFormData((prev) => ({ ...prev, adminCode: "" }));
      } else {
        setCodeRequestMessage(
          "❌ " + (result.error || "Failed to send registration code")
        );
      }
    } catch (error) {
      console.error("Error requesting registration code:", error);
      setCodeRequestMessage(
        "❌ Error requesting registration code. Please try again."
      );
    } finally {
      setCodeRequestLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Admin code validation
    if (!formData.adminCode) {
      newErrors.adminCode = "Admin registration code is required";
    } else if (formData.adminCode.length < 6) {
      newErrors.adminCode =
        "Please enter the registration code sent to your email";
    }

    // Required fields
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.company) newErrors.company = "Company name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for multipart form submission
      const formDataToSend = new FormData();
      formDataToSend.append("fname", formData.firstName);
      formDataToSend.append("lname", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("company", formData.company);
      formDataToSend.append("adminCode", formData.adminCode);

      // Send to backend admin registration endpoint
      const response = await fetch("/auth/admin-register", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.text();
        alert(
          "Admin account created successfully! Pending super admin approval. You will be notified once approved."
        );
        navigate("/admin-login");
      } else {
        const errorText = await response.text();
        alert("Admin registration failed: " + errorText);
      }
    } catch (error) {
      console.error("Admin registration failed", error);
      alert("Admin registration failed: " + error.message);
    }
  };

  return (
    <div className="container-admin-register">
      <div className="form-section-admin-register">
        <div className="admin-register-header">
          <h1>Admin Registration</h1>
          <p>Create new administrative account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Admin Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@company.com"
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="company">Company/Organization *</label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              className={errors.company ? "error" : ""}
            />
            {errors.company && (
              <span className="error-message">{errors.company}</span>
            )}
          </div>

          {/* Registration Code Request Section */}
          <div className="form-group">
            <label htmlFor="adminCode">Admin Registration Code *</label>
            <div className="code-request-section">
              <input
                id="adminCode"
                type="text"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                placeholder="Enter registration code from email"
                className={errors.adminCode ? "error" : ""}
                disabled={!codeRequested}
              />
              <button
                type="button"
                onClick={requestRegistrationCode}
                disabled={codeRequestLoading || codeRequested}
                className="request-code-btn"
              >
                {codeRequestLoading
                  ? "Sending..."
                  : codeRequested
                  ? "Code Sent"
                  : "Request Code"}
              </button>
            </div>
            {errors.adminCode && (
              <span className="error-message">{errors.adminCode}</span>
            )}
            {codeRequestMessage && (
              <div
                className={`code-message ${
                  codeRequestMessage.includes("✅") ? "success" : "error"
                }`}
              >
                {codeRequestMessage}
              </div>
            )}
            <small className="help-text">
              Click "Request Code" to receive a registration code via email. The
              code will expire in 24 hours.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button type="submit" className="admin-register-btn">
            Create Admin Account
          </button>
        </form>

        <div className="admin-register-footer">
          <p>
            <a href="/admin-login">← Back to Admin Login</a>
          </p>
          <p className="admin-notice">
            Admin accounts have full system access. Only authorized personnel
            should register.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
