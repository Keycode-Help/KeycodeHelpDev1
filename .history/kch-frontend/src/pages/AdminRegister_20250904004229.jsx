import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "../components/IconProvider";

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
  const [codeValidationMessage, setCodeValidationMessage] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Clear validation message when admin code changes
    if (name === "adminCode") {
      setCodeValidationMessage("");
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
        setCodeValidationMessage("");
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

  const validateAdminCode = async () => {
    if (!formData.adminCode || !formData.email) {
      setCodeValidationMessage(
        "❌ Please enter both email and registration code"
      );
      return;
    }

    setIsValidatingCode(true);
    setCodeValidationMessage("");

    try {
      const response = await fetch("/admin-registration-code/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.adminCode,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.valid) {
          setCodeValidationMessage("✅ Registration code is valid!");
        } else {
          setCodeValidationMessage(
            "❌ " + (result.message || "Invalid registration code")
          );
        }
      } else {
        setCodeValidationMessage(
          "❌ Error validating code: " + (result.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error validating admin code:", error);
      setCodeValidationMessage("❌ Error validating code. Please try again.");
    } finally {
      setIsValidatingCode(false);
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

    // Additional validation: check if code is valid before submitting
    if (!codeRequested) {
      setErrors({ adminCode: "Please request a registration code first" });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-2 uppercase tracking-wide">
            Admin Registration
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            Register as an admin user. You'll need a registration code from a
            super admin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-blue-900 focus:shadow-lg focus:-translate-y-0.5 ${
                  errors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm font-medium mt-1 block">{errors.firstName}</span>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-blue-900 focus:shadow-lg focus:-translate-y-0.5 ${
                  errors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm font-medium mt-1 block">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-blue-900 focus:shadow-lg focus:-translate-y-0.5 ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm font-medium mt-1 block">{errors.email}</span>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-blue-900 mb-2 uppercase tracking-wide">
              Company/Organization *
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-blue-900 focus:shadow-lg focus:-translate-y-0.5 ${
                errors.company ? "border-red-500 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.company && (
              <span className="text-red-500 text-sm font-medium mt-1 block">{errors.company}</span>
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
              {codeRequested && (
                <button
                  type="button"
                  onClick={validateAdminCode}
                  disabled={isValidatingCode || !formData.adminCode}
                  className="validate-code-btn"
                >
                  {isValidatingCode ? "Validating..." : "Validate Code"}
                </button>
              )}
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
            {codeValidationMessage && (
              <div
                className={`code-message ${
                  codeValidationMessage.includes("✅") ? "success" : "error"
                }`}
              >
                {codeValidationMessage}
              </div>
            )}
            <small className="help-text">
              Click "Request Code" to receive a registration code via email. The
              code will expire in 24 hours. Use "Validate Code" to verify your
              code before submitting.
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
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className={errors.password ? "error" : ""}
                  style={{
                    paddingRight: "45px",
                    color: "#333",
                    WebkitTextFillColor: "#333",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#666",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon
                    name={showPassword ? "eyeOff" : "eye"}
                    size={18}
                    className="drop-shadow-none filter-none"
                  />
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? "error" : ""}
                  style={{
                    paddingRight: "45px",
                    color: "#333",
                    WebkitTextFillColor: "#333",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#666",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <Icon
                    name={showConfirmPassword ? "eyeOff" : "eye"}
                    size={18}
                    className="drop-shadow-none filter-none"
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button type="submit" className="admin-register-btn">
            Create Admin Account
          </button>
        </form>

        <div className="login-link">
          <p>
            Already have an account? <a href="/admin-login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
