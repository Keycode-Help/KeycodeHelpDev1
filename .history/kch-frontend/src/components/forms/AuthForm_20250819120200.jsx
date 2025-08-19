import React, { useState } from "react";
import FormField from "./FormField";
import { Icon } from "../IconProvider";

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
        type="password"
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
      />
    );

    if (mode === "register" || mode === "admin-register") {
      fields.push(
        <FormField
          key="confirmPassword"
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFields()}

      <button type="submit" className="w-full btn btn-lg btn-primary">
        {getSubmitButtonText()}
      </button>
    </form>
  );
}
