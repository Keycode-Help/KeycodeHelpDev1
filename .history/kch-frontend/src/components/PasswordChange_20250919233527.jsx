import React, { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertTriangle, X } from "lucide-react";
import api from "../services/request";
import toast from "react-hot-toast";

function PasswordChange({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  // Enhanced password strength validation with stronger regex patterns
  const validatePasswordStrength = (password) => {
    // Comprehensive password validation patterns
    const checks = {
      // Minimum 12 characters (increased from 8)
      length: password.length >= 12,
      // At least one uppercase letter
      uppercase: /[A-Z]/.test(password),
      // At least one lowercase letter
      lowercase: /[a-z]/.test(password),
      // At least one digit
      number: /\d/.test(password),
      // At least one special character (expanded set)
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
      // No common patterns or sequences
      noSequential: !/(.)\1{2,}/.test(password) && !/(123|abc|qwe|asd|zxc)/i.test(password),
      // No common dictionary words (basic check)
      noCommonWords: !/^(password|123456|admin|user|login|welcome|qwerty|letmein)$/i.test(password),
      // At least 3 different character types
      characterVariety: (function() {
        let types = 0;
        if (/[A-Z]/.test(password)) types++;
        if (/[a-z]/.test(password)) types++;
        if (/\d/.test(password)) types++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) types++;
        return types >= 3;
      })(),
    };

    const score = Object.values(checks).filter(Boolean).length;
    let feedback = "";
    let color = "";

    if (score <= 3) {
      feedback = "Very Weak - Password must be at least 12 characters with uppercase, lowercase, numbers, and special characters";
      color = "red";
    } else if (score === 4) {
      feedback = "Weak - Add more character variety and avoid common patterns";
      color = "orange";
    } else if (score === 5) {
      feedback = "Fair - Good start, but avoid sequential characters";
      color = "yellow";
    } else if (score === 6) {
      feedback = "Good - Strong password with good variety";
      color = "lightgreen";
    } else if (score === 7) {
      feedback = "Strong - Excellent password security";
      color = "green";
    } else {
      feedback = "Very Strong - Outstanding password security";
      color = "darkgreen";
    }

    return { score, feedback, checks, color };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate password strength for new password
    if (name === "newPassword") {
      const strength = validatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 12) {
      newErrors.newPassword = "Password must be at least 12 characters";
    } else if (passwordStrength.score < 5) {
      newErrors.newPassword =
        "Password is too weak. Please use a stronger password with uppercase, lowercase, numbers, special characters, and avoid common patterns.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully!");

        // Reset form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength({
          score: 0,
          feedback: "",
          checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false,
          },
        });

        if (onSuccess) {
          onSuccess();
        }
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Password change error:", error);

      const errorMessage =
        error.response?.data?.error || "Failed to change password";
      toast.error(errorMessage);

      // Set specific field errors based on response
      if (error.response?.data?.error) {
        const errorText = error.response.data.error.toLowerCase();
        if (errorText.includes("current password")) {
          setErrors({ currentPassword: errorMessage });
        } else if (errorText.includes("new password")) {
          setErrors({ newPassword: errorMessage });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return "text-red-400";
    if (passwordStrength.score <= 2) return "text-orange-400";
    if (passwordStrength.score <= 3) return "text-yellow-400";
    if (passwordStrength.score <= 4) return "text-blue-400";
    return "text-green-400";
  };

  const getPasswordStrengthBg = () => {
    if (passwordStrength.score <= 1) return "bg-red-500";
    if (passwordStrength.score <= 2) return "bg-orange-500";
    if (passwordStrength.score <= 3) return "bg-yellow-500";
    if (passwordStrength.score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Lock size={24} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Change Password
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
            >
              <X size={20} className="text-white" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Current Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 ${
                  errors.currentPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your current password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
              >
                {showPasswords.current ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle size={16} />
                {errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              New Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle size={16} />
                {errors.newPassword}
              </div>
            )}

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Password Strength:</span>
                  <span
                    className={`text-sm font-medium ${getPasswordStrengthColor()}`}
                  >
                    {passwordStrength.feedback}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBg()}`}
                    style={{ width: `${(passwordStrength.score / 8) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(passwordStrength.checks).map(
                    ([check, passed]) => (
                      <div
                        key={check}
                        className={`flex items-center gap-2 ${
                          passed ? "text-green-400" : "text-slate-400"
                        }`}
                      >
                        <CheckCircle
                          size={12}
                          className={passed ? "opacity-100" : "opacity-50"}
                        />
                        <span className="capitalize">
                          {check === "length" && "12+ characters"}
                          {check === "uppercase" && "Uppercase"}
                          {check === "lowercase" && "Lowercase"}
                          {check === "number" && "Number"}
                          {check === "special" && "Special char"}
                          {check === "noSequential" && "No sequences"}
                          {check === "noCommonWords" && "No common words"}
                          {check === "characterVariety" && "3+ types"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Confirm New Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm your new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
              >
                {showPasswords.confirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle size={16} />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                className="text-blue-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <h4 className="text-blue-400 font-semibold text-sm mb-2">
                  Security Notice
                </h4>
                <ul className="text-blue-200 text-xs space-y-1">
                  <li>• Minimum 12 characters with uppercase, lowercase, numbers, and special characters</li>
                  <li>• Avoid common words, sequences, and repeated characters</li>
                  <li>• Use a unique password not used on other accounts</li>
                  <li>
                    • You'll receive an email confirmation after changing your
                    password
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Change Password
                </>
              )}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordChange;
