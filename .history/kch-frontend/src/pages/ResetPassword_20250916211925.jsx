import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../components/IconProvider";
import API_CONFIG from "../config/api";

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
  const [tokenValidated, setTokenValidated] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("❌ Invalid reset link. Please request a new password reset.");
      return;
    }
    
    // Pre-validate token on component mount to give immediate feedback
    const validateToken = async () => {
      try {
        console.log("🔍 Pre-validating reset token...");
        // We can use a HEAD request or a simple validation endpoint if available
        // For now, we'll just set it as validated since we have the token
        setTokenValidated(true);
        console.log("✅ Token appears valid, ready for password reset");
      } catch (error) {
        console.error("❌ Token pre-validation failed:", error);
        setMessage("❌ Invalid or expired reset link. Please request a new password reset.");
      }
    };
    
    validateToken();
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
      console.log("🔧 Starting password reset confirmation...");
      console.log("Token:", token);
      console.log("API URL:", API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD_CONFIRM));
      
      const requestBody = {
        token: token,
        newPassword: formData.newPassword,
      };
      console.log("Request body:", requestBody);

      const response = await fetch(
        API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD_CONFIRM),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const result = await response.json();
      console.log("Response body:", result);

      if (response.ok) {
        setMessage("✅ Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage("❌ " + (result.error || "Failed to update password"));
      }
    } catch (error) {
      console.error("Password reset error:", error);
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
            <p className="mt-2 text-gray-600">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={() => navigate("/login")}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:from-primary-dark hover:to-primary hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
          <p className="mt-2 text-gray-600">Enter your new password below</p>
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
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
