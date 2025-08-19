import React, { useState } from "react";
import FormField from "./FormField";

export default function ProfileForm({ user, onSubmit }) {
  const [formData, setFormData] = useState({
    fname: user?.fname || "",
    lname: user?.lname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    state: user?.state || "",
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

    if (!formData.fname) newErrors.fname = "First name is required";
    if (!formData.lname) newErrors.lname = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.state) newErrors.state = "State is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="fname"
          value={formData.fname}
          onChange={(e) => handleChange("fname", e.target.value)}
          error={errors.fname}
          required
        />

        <FormField
          label="Last Name"
          name="lname"
          value={formData.lname}
          onChange={(e) => handleChange("lname", e.target.value)}
          error={errors.lname}
          required
        />
      </div>

      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        required
      />

      <FormField
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        error={errors.phone}
        required
      />

      <FormField
        label="State"
        name="state"
        value={formData.state}
        onChange={(e) => handleChange("state", e.target.value)}
        error={errors.state}
        required
      />

      <button type="submit" className="w-full btn btn-lg btn-primary">
        Update Profile
      </button>
    </form>
  );
}
