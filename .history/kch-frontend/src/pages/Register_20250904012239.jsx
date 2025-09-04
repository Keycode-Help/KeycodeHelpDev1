import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/request";
import StatesDropDown from "../components/StatesDropDown";
import states from "../data/states";
import { Icon } from "../components/IconProvider";
import { processFile, isValidFileType, isValidFileSize, formatFileSize, FILE_LIMITS } from "../utils/fileUtils";

function Register() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    industry: "",
    frontId: null,
    backId: null,
    businessDocument: null,
    coi: null,
  });

  const [selectedState, setSelectedState] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const industryOptions = [
    { value: "", label: "Select your industry" },
    { value: "locksmith", label: "Locksmith" },
    { value: "mechanic", label: "Mechanic/Mobile Mechanic" },
    {
      value: "rental",
      label: "Rental Company Owner/Manager (With authorization)",
    },
    { value: "tow", label: "Tow Truck Company" },
    { value: "repo", label: "Repo Company" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (!file) {
      setErrors((prev) => ({ ...prev, [name]: "File is required." }));
      return;
    }

    try {
      // Process file (validate and compress)
      const processedFile = await processFile(file);
      
      // Clear any previous errors
      setErrors((prev) => ({ ...prev, [name]: null }));
      
      // Update form data with processed file
      setFormData({
        ...formData,
        [name]: processedFile,
      });
    } catch (error) {
      // Set error message
      setErrors((prev) => ({
        ...prev,
        [name]: error.message,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.fname?.trim()) {
      newErrors.fname = "First name is required";
    }
    if (!formData.lname?.trim()) {
      newErrors.lname = "Last name is required";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!selectedState) {
      newErrors.state = "State is required";
    }
    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // File validation
    if (!formData.frontId) {
      newErrors.frontId = "Front ID image is required";
    }
    if (!formData.backId) {
      newErrors.backId = "Back ID image is required";
    }
    if (!formData.businessDocument) {
      newErrors.businessDocument = "Business document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("fname", formData.fname);
    formDataObj.append("lname", formData.lname);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("password", formData.password);
    formDataObj.append("state", selectedState); // Add selected state
    formDataObj.append("industry", formData.industry); // Add industry
    formDataObj.append("frontId", formData.frontId);
    formDataObj.append("backId", formData.backId);
    formDataObj.append("businessDocument", formData.businessDocument);
    formDataObj.append("coi", formData.coi);

    api
      .post("/auth/register", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration failed", error);
        alert(error.response?.data || "Registration failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <img
                src="/assets/images/logos/MainLogoGold.png"
                alt="Keycode Help Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-300">Join our professional network</p>
          </div>

          {/* Business Notice */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Icon
                name="shield"
                size={24}
                className="text-yellow-400 flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">
                  Business Verification Required
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This account is for business professionals only. You must
                  provide business documentation and active Certificate of
                  Insurance (COI) for verification.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.fname
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:ring-blue-500"
                  }`}
                />
                {errors.fname && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {errors.fname}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.lname
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:ring-blue-500"
                  }`}
                />
                {errors.lname && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {errors.lname}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-blue-500"
                }`}
              />
              {errors.phone && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className={`w-full px-4 py-3 pr-12 bg-slate-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-600 focus:ring-blue-500"
                    }`}
                    style={{
                      color: "#ffffff",
                      WebkitTextFillColor: "#ffffff",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <Icon
                      name={showPassword ? "eyeOff" : "eye"}
                      size={20}
                      className="drop-shadow-none filter-none"
                    />
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {errors.password}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className={`w-full px-4 py-3 pr-12 bg-slate-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-600 focus:ring-blue-500"
                    }`}
                    style={{
                      color: "#ffffff",
                      WebkitTextFillColor: "#ffffff",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    <Icon
                      name={showConfirmPassword ? "eyeOff" : "eye"}
                      size={20}
                      className="drop-shadow-none filter-none"
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                State <span className="text-red-400">*</span>
              </label>
              <StatesDropDown
                selectedState={selectedState}
                options={states}
                onChange={(e) => setSelectedState(e.target.value)}
              />
              {errors.state && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.state}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Industry Affiliation <span className="text-red-400">*</span>
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.industry
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:ring-blue-500"
                }`}
              >
                {industryOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-slate-800 text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <span className="text-red-400 text-sm mt-1 block">
                  {errors.industry}
                </span>
              )}
            </div>

            {/* File Uploads */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
                Required Documents
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Front ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    name="frontId"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.frontId && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                      <Icon name="alertCircle" size={16} />
                      {errors.frontId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Back ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    name="backId"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.backId && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                      <Icon name="alertCircle" size={16} />
                      {errors.backId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Business Documentation <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  name="businessDocument"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Acceptable documents: Business License, Business Card with
                  full details, or Secretary of State document
                </p>
                {errors.businessDocument && (
                  <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <Icon name="alertCircle" size={16} />
                    {errors.businessDocument}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Certificate of Insurance (COI){" "}
                  {formData.industry !== "mechanic" && (
                    <span className="text-red-400">*</span>
                  )}
                  {formData.industry === "mechanic" && (
                    <span className="text-yellow-400">
                      (Optional for Mobile Mechanics)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  name="coi"
                  onChange={handleFileChange}
                  accept="image/*"
                  required={formData.industry !== "mechanic"}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-400 mt-2">
                  {formData.industry === "mechanic"
                    ? "Certificate of Insurance is optional for Mobile Mechanics but recommended for business verification"
                    : "Active Certificate of Insurance required for business verification"}
                </p>
                {errors.coi && (
                  <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <Icon name="alertCircle" size={16} />
                    {errors.coi}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icon name="userPlus" size={18} />
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already a member?{" "}
              <a
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
