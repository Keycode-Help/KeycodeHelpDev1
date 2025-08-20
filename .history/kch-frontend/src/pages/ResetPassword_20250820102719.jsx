import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/IconProvider";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [token] = useState(searchParams.get("token"));

  useEffect(() => {
    if (!token) {
      setMessage("❌ Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsResetting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            newPassword: formData.newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage("❌ " + (result.error || "Failed to update password"));
      }
    } catch (error) {
      setMessage("❌ Error updating password. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-gray-400">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={() => navigate("/login")}
              className="w-full btn btn-lg btn-primary"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Reset Your Password</h2>
          <p className="mt-2 text-gray-400">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {message && (
            <div
              className={`text-sm p-3 rounded-lg ${
                message.includes("✅")
                  ? "text-green-400 bg-green-900/20 border border-green-700"
                  : "text-red-400 bg-red-900/20 border border-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isResetting}
            className="w-full btn btn-lg btn-primary"
          >
            {isResetting ? "Updating..." : "Update Password"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
