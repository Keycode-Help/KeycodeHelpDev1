import React, { useState } from "react";
import FormField from "./FormField";
import { Icon } from "../IconProvider";
import API_CONFIG from "../../config/api";

export default function AuthForm({ mode, onSubmit, initial = {} }) {
  // mode: 'login' | 'register' | 'admin-login' | 'admin-register'
  const [formData, setFormData] = useState({
    fname: initial.fname || "",
    lname: initial.lname || "",
    email: initial.email || "",
    phone: initial.phone || "",
    password: initial.password || "",
    confirmPassword: initial.confirmPassword || "",
    state: initial.state || "",
    company: initial.company || "",
    adminCode: initial.adminCode || "",
    ...initial,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetMessage("Please enter your email address");
      return;
    }

    setIsSendingEmail(true);
    setResetMessage("");

    try {
      if (import.meta.env.DEV) {
        console.log(
          "Sending password reset request for email:",
          resetEmail.trim().toLowerCase()
        );
      }

      const requestBody = { email: resetEmail.trim().toLowerCase() };
      if (import.meta.env.DEV) {
        console.log("Request body:", requestBody);
      }

      const response = await fetch(
        API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (import.meta.env.DEV) {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
      }

      const result = await response.json();
      if (import.meta.env.DEV) {
        console.log("Response body:", result);
      }

      if (response.ok) {
        setResetMessage("✅ Password reset email sent! Check your inbox.");
        setResetEmail("");
      } else {
        setResetMessage("❌ " + (result.error || "Failed to send reset email"));
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setResetMessage("❌ Error sending reset email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "login" || mode === "admin-login") {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
    }

    if (mode === "register" || mode === "admin-register") {
      if (!formData.fname) newErrors.fname = "First name is required";
      if (!formData.lname) newErrors.lname = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (mode === "register") {
      if (!formData.state) newErrors.state = "State is required";
    }

    if (mode === "admin-register") {
      if (!formData.company) newErrors.company = "Company is required";
      if (!formData.adminCode) newErrors.adminCode = "Admin code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = { ...formData };
      if (mode === "login" || mode === "admin-login") {
        payload.email = (payload.email || "").trim().toLowerCase();
        payload.password = (payload.password || "").trim();
      }
      onSubmit(payload);
    }
  };

  const renderFields = () => {
    const fields = [];

    if (mode === "register" || mode === "admin-register") {
      fields.push(
        <FormField
          key="fname"
          label="First Name"
          name="fname"
          value={formData.fname}
          onChange={(e) => handleChange("fname", e.target.value)}
          error={errors.fname}
          required
        />
      );

      fields.push(
        <FormField
          key="lname"
          label="Last Name"
          name="lname"
          value={formData.lname}
          onChange={(e) => handleChange("lname", e.target.value)}
          error={errors.lname}
          required
        />
      );
    }

    fields.push(
      <FormField
        key="email"
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        placeholder="Enter your email"
        required
        autoComplete={
          mode === "login" || mode === "admin-login" ? "username" : "email"
        }
      />
    );

    if (mode === "register" || mode === "admin-register") {
      fields.push(
        <FormField
          key="phone"
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          placeholder="Enter your phone number"
          required
          autoComplete="tel"
        />
      );
    }

    if (mode === "register") {
      fields.push(
        <FormField
          key="state"
          label="State"
          name="state"
          value={formData.state}
          onChange={(e) => handleChange("state", e.target.value)}
          error={errors.state}
          placeholder="Enter your state"
          required
          autoComplete="address-level1"
        />
      );
    }

    if (mode === "admin-register") {
      fields.push(
        <FormField
          key="company"
          label="Company"
          name="company"
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          error={errors.company}
          placeholder="Enter your company name"
          required
          autoComplete="organization"
        />
      );

      fields.push(
        <FormField
          key="adminCode"
          label="Admin Code"
          name="adminCode"
          value={formData.adminCode}
          onChange={(e) => handleChange("adminCode", e.target.value)}
          error={errors.adminCode}
          placeholder="Enter admin registration code"
          required
          autoComplete="one-time-code"
        />
      );
    }

    fields.push(
      <FormField
        key="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
        placeholder="Enter your password"
        required
        autoComplete={
          mode === "login" || mode === "admin-login"
            ? "current-password"
            : "new-password"
        }
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 border border-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon
              name={showPassword ? "eyeOff" : "eye"}
              size={18}
              className="drop-shadow-none filter-none"
            />
            <span className="text-sm font-medium">
              {showPassword ? "Hide Password" : "Show Password"}
            </span>
          </button>
        }
      />
    );

    if (mode === "register" || mode === "admin-register") {
      fields.push(
        <FormField
          key="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 border border-gray-600"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              <Icon
                name={showConfirmPassword ? "eyeOff" : "eye"}
                size={18}
                className="drop-shadow-none filter-none"
              />
              <span className="text-sm font-medium">
                {showConfirmPassword ? "Hide Password" : "Show Password"}
              </span>
            </button>
          }
        />
      );
    }

    return fields;
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case "login":
        return "Login";
      case "register":
        return "Sign Up";
      case "admin-login":
        return "Access Admin Panel";
      case "admin-register":
        return "Create Admin Account";
      default:
        return "Submit";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderFields()}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Icon name="logIn" size={18} />
          {getSubmitButtonText()}
        </button>
      </div>

      {/* Password Reset Section for Login Modes */}
      {(mode === "login" || mode === "admin-login") && (
        <div className="pt-6 border-t border-slate-700">
          <button
            type="button"
            onClick={() => setIsResettingPassword(!isResettingPassword)}
            className="text-sm text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
          >
            Forgot Password?
          </button>

          {isResettingPassword && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isSendingEmail}
                  className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-semibold py-2 px-4 rounded-xl hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon name="mail" size={16} />
                      Send Reset Email
                    </>
                  )}
                </button>
                {resetMessage && (
                  <div
                    className={`text-sm flex items-center gap-2 ${
                      resetMessage.includes("✅")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    <Icon
                      name={
                        resetMessage.includes("✅")
                          ? "checkCircle"
                          : "alertCircle"
                      }
                      size={16}
                    />
                    {resetMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
