import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import {
  User,
  Building2,
  FileText,
  History,
  Settings,
  Shield,
  Fingerprint,
  Smartphone,
  Edit3,
  Camera,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

function UserProfile() {
  const { user, isAuthenticated, isInitialized } = useAuth();

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    profilePhoto: null,
    companyLogo: null,
  });

  // Subscription state
  const [subscription, setSubscription] = useState({
    tier: "NONE",
    status: "INACTIVE",
    startDate: null,
    endDate: null,
    autoRenew: false,
  });

  // Order history state
  const [orderHistory, setOrderHistory] = useState([]);

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    fingerprintEnabled: false,
    lastLogin: null,
    loginHistory: [],
  });

  // Credentials and files state
  const [credentials, setCredentials] = useState({
    businessLicense: null,
    driversLicenseFront: null,
    driversLicenseBack: null,
    insuranceCertificate: null,
    identificationDocuments: [],
    otherFiles: [],
  });

  // Important notices state
  const [importantNotices, setImportantNotices] = useState([]);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingCredentials, setUploadingCredentials] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      fetchUserProfile();
      fetchSubscriptionData();
      fetchOrderHistory();
      fetchSecuritySettings();
      fetchCredentials();
      fetchImportantNotices();
    }
  }, [isInitialized, isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      const data = response.data;

      // Map backend data to frontend state
      setProfileData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        company: data.company || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
        profilePhoto: data.profilePhoto || null,
        companyLogo: data.companyLogo || null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchSubscriptionData = async () => {
    try {
      const response = await api.get("/user/subscription");
      setSubscription(response.data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Gracefully fallback to no subscription on auth/permissions errors
      setSubscription({
        tier: "NONE",
        status: "INACTIVE",
        startDate: null,
        endDate: null,
        autoRenew: false,
      });
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await api.get("/user/orders");
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchSecuritySettings = async () => {
    try {
      const response = await api.get("/user/security");
      setSecuritySettings(response.data);
    } catch (error) {
      console.error("Error fetching security settings:", error);
    }
  };

  const fetchCredentials = async () => {
    try {
      const response = await api.get("/user/credentials");
      setCredentials(response.data);
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
  };

  const fetchImportantNotices = async () => {
    try {
      const response = await api.get("/user/notices");
      setImportantNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== null) {
          formData.append(key, profileData[key]);
        }
      });

      await api.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleFileUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleSecurityChange = async (setting, value) => {
    if (setting === "fingerprint" && value) {
      setShowFingerprintModal(true);
      return;
    }

    if (setting === "twoFactor" && value) {
      setShow2FAModal(true);
      return;
    }

    try {
      await api.put("/user/security", {
        [setting]: value,
      });

      setSecuritySettings((prev) => ({
        ...prev,
        [setting]: value,
      }));

      alert("Security setting updated successfully!");
    } catch (error) {
      console.error("Error updating security setting:", error);
      alert("Failed to update security setting. Please try again.");
    }
  };

  const handleCredentialsSubmit = async () => {
    // Check if any files are selected
    const hasFiles =
      credentials.businessLicense ||
      credentials.driversLicenseFront ||
      credentials.driversLicenseBack ||
      credentials.insuranceCertificate;

    if (!hasFiles) {
      alert("Please select at least one document to upload.");
      return;
    }

    setUploadingCredentials(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();

      // Add files to FormData if they exist
      if (credentials.businessLicense) {
        formData.append("businessLicense", credentials.businessLicense);
      }
      if (credentials.driversLicenseFront) {
        formData.append("driversLicenseFront", credentials.driversLicenseFront);
      }
      if (credentials.driversLicenseBack) {
        formData.append("driversLicenseBack", credentials.driversLicenseBack);
      }
      if (credentials.insuranceCertificate) {
        formData.append(
          "insuranceCertificate",
          credentials.insuranceCertificate
        );
      }

      await api.put("/user/credentials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadSuccess(true);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);

      // Refresh credentials data
      await fetchCredentials();
    } catch (error) {
      console.error("Error uploading credentials:", error);
      alert("Failed to upload credentials. Please try again.");
    } finally {
      setUploadingCredentials(false);
    }
  };

  const maskVIN = (vin) => {
    if (!vin || vin.length < 4) return vin;
    return `****${vin.slice(-4)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getSubscriptionStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "#10b981";
      case "PENDING":
        return "#f59e0b";
      case "EXPIRED":
        return "#ef4444";
      case "CANCELLED":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getSubscriptionTierDisplay = (tier) => {
    switch (tier) {
      case "BASIC":
        return "Basic Plan";
      case "PROFESSIONAL":
        return "Professional Plan";
      case "ENTERPRISE":
        return "Enterprise Plan";
      default:
        return "No Subscription";
    }
  };

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-slate-300 mb-6">
            Please log in to access your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            User Profile
          </h1>
          <p className="text-slate-300 text-lg">
            Manage your account, subscription, and security settings
          </p>
        </div>

        {/* Important Notices Banner */}
        {importantNotices.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle
                className="text-amber-400 mt-1 flex-shrink-0"
                size={24}
              />
              <div className="flex-1">
                <h3 className="text-amber-400 font-semibold text-lg mb-4">
                  Important Notices
                </h3>
                <div className="space-y-4">
                  {importantNotices.map((notice, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {notice.title}
                        </span>
                        <span className="text-amber-300 text-sm">
                          {formatDate(notice.date)}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{notice.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={20} />
              Profile
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "subscription"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveTab("subscription")}
            >
              <Shield size={20} />
              Subscription
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <History size={20} />
              Orders
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "credentials"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveTab("credentials")}
            >
              <FileText size={20} />
              Credentials
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "security"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <Settings size={20} />
              Security
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            {/* Photo Upload Section */}
            <div className="mb-8">
              <div className="border-b border-slate-600 pb-4 mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Profile Photos
                </h2>
                <p className="text-slate-400 mt-2">
                  Upload your profile photo and company logo
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div className="space-y-4">
                  <label htmlFor="profile-photo" className="block">
                    <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer">
                      {profileData.profilePhoto ? (
                        <img
                          src={URL.createObjectURL(profileData.profilePhoto)}
                          alt="Profile"
                          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center mb-4">
                            <User size={40} className="text-slate-400" />
                          </div>
                          <span className="text-slate-300 font-medium">
                            Profile Photo
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "profilePhoto")}
                      disabled={!isEditing}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-slate-400 text-center">
                    Click to upload profile photo
                  </p>
                </div>

                {/* Company Logo */}
                <div className="space-y-4">
                  <label htmlFor="company-logo" className="block">
                    <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer">
                      {profileData.companyLogo ? (
                        <img
                          src={URL.createObjectURL(profileData.companyLogo)}
                          alt="Company Logo"
                          className="w-24 h-24 mx-auto rounded-lg object-cover mb-4"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                            <Building2 size={40} className="text-slate-400" />
                          </div>
                          <span className="text-slate-300 font-medium">
                            Company Logo
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      id="company-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "companyLogo")}
                      disabled={!isEditing}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-slate-400 text-center">
                    Click to upload company logo
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="space-y-8">
              <div className="border-b border-slate-600 pb-4 mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Personal Information
                </h2>
                <p className="text-slate-400 mt-2">
                  Update your personal details and contact information
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      color: "white !important",
                      WebkitTextFillColor: "white !important",
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                      backgroundColor: "rgba(51, 65, 85, 0.5)",
                      border: "1px solid rgb(71, 85, 105)",
                      caretColor: "white",
                    }}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      color: "white !important",
                      WebkitTextFillColor: "white !important",
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                      backgroundColor: "rgba(51, 65, 85, 0.5)",
                      border: "1px solid rgb(71, 85, 105)",
                      caretColor: "white",
                    }}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400">
                    Email cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      color: "white !important",
                      WebkitTextFillColor: "white !important",
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                      backgroundColor: "rgba(51, 65, 85, 0.5)",
                      border: "1px solid rgb(71, 85, 105)",
                      caretColor: "white",
                    }}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Company
                </label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: "white !important",
                    WebkitTextFillColor: "white !important",
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                    backgroundColor: "rgba(51, 65, 85, 0.5)",
                    border: "1px solid rgb(71, 85, 105)",
                    caretColor: "white",
                  }}
                  placeholder="Enter your company name"
                />
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">
                  Address Information
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      color: "white !important",
                      WebkitTextFillColor: "white !important",
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                      backgroundColor: "rgba(51, 65, 85, 0.5)",
                      border: "1px solid rgb(71, 85, 105)",
                      caretColor: "white",
                    }}
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl !text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:!text-slate-300 disabled:bg-slate-800/50"
                      style={{ color: "white !important" }}
                      style={{ color: "white !important" }}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      State
                    </label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl !text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:!text-slate-300 disabled:bg-slate-800/50"
                      style={{ color: "white !important" }}
                      style={{ color: "white !important" }}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={profileData.zipCode}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl !text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:!text-slate-300 disabled:bg-slate-800/50"
                      style={{ color: "white !important" }}
                      style={{ color: "white !important" }}
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                  >
                    <Edit3 size={20} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleProfileUpdate}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg"
                    >
                      <Save size={20} />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors duration-200 shadow-lg"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <div className="space-y-6">
              <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-white">
                    {getSubscriptionTierDisplay(subscription.tier)}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{
                      backgroundColor: getSubscriptionStatusColor(
                        subscription.status
                      ),
                    }}
                  >
                    {subscription.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">
                      Start Date
                    </div>
                    <div className="text-white font-medium">
                      {formatDate(subscription.startDate)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">End Date</div>
                    <div className="text-white font-medium">
                      {formatDate(subscription.endDate)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-400 mb-1">
                      Auto-Renew
                    </div>
                    <div className="text-white font-medium">
                      {subscription.autoRenew ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {subscription.status === "ACTIVE" && (
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Your Benefits:
                    </h4>
                    <ul className="space-y-2">
                      {subscription.tier === "BASIC" && (
                        <>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            15% off keycode purchases
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            Limited vehicle access
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            Basic support
                          </li>
                        </>
                      )}
                      {subscription.tier === "PROFESSIONAL" && (
                        <>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            20% off keycode purchases
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            Extended vehicle coverage
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            Priority support
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            Bulk ordering (up to 20 codes)
                          </li>
                        </>
                      )}
                      {subscription.tier === "ENTERPRISE" && (
                        <>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            25% off keycode purchases
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            Complete vehicle database
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            24/7 premium support
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            Unlimited bulk ordering
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle size={16} className="text-green-400" />
                            Multi-location management
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Order History
              </h3>
              {orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History size={48} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No orders found</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Your order history will appear here once you make a
                    purchase.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((order, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/50 border border-slate-600 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-300 font-medium">
                          {formatDate(order.orderDate)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "COMPLETED"
                              ? "bg-green-600 text-white"
                              : order.status === "PENDING"
                              ? "bg-yellow-600 text-white"
                              : order.status === "CANCELLED"
                              ? "bg-red-600 text-white"
                              : "bg-slate-600 text-white"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">VIN:</span>
                          <span className="text-white font-mono">
                            {maskVIN(order.vin)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Cost:</span>
                          <span className="text-green-400 font-semibold">
                            ${order.cost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Credentials Tab */}
        {activeTab === "credentials" && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Business Credentials & Files
              </h3>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={20}
                    className="text-amber-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-amber-200">
                    <strong>Important:</strong> Driver's license requires both
                    front and back sides for verification.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label htmlFor="business-license" className="block">
                    <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer">
                      <div className="flex flex-col items-center">
                        <FileText size={32} className="text-slate-400 mb-3" />
                        <span className="text-slate-300 font-medium mb-2">
                          Business License
                        </span>
                        {credentials.businessLicense && (
                          <CheckCircle size={20} className="text-green-400" />
                        )}
                      </div>
                    </div>
                  </label>
                  <input
                    id="business-license"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        businessLicense: e.target.files[0],
                      }))
                    }
                    className="hidden"
                  />
                </div>

                <div className="space-y-4">
                  <label htmlFor="drivers-license-front" className="block">
                    <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer">
                      <div className="flex flex-col items-center">
                        <FileText size={32} className="text-slate-400 mb-3" />
                        <span className="text-slate-300 font-medium mb-2">
                          Driver's License - Front
                        </span>
                        {credentials.driversLicenseFront && (
                          <CheckCircle size={20} className="text-green-400" />
                        )}
                      </div>
                    </div>
                  </label>
                  <input
                    id="drivers-license-front"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        driversLicenseFront: e.target.files[0],
                      }))
                    }
                    className="hidden"
                  />
                </div>

                <div className="space-y-4">
                  <label htmlFor="drivers-license-back" className="block">
                    <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer">
                      <div className="flex flex-col items-center">
                        <FileText size={32} className="text-slate-400 mb-3" />
                        <span className="text-slate-300 font-medium mb-2">
                          Driver's License - Back
                        </span>
                        {credentials.driversLicenseBack && (
                          <CheckCircle size={20} className="text-green-400" />
                        )}
                      </div>
                    </div>
                  </label>
                  <input
                    id="drivers-license-back"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        driversLicenseBack: e.target.files[0],
                      }))
                    }
                    className="hidden"
                  />
                </div>

                <div className="space-y-4">
                  <label htmlFor="insurance-certificate" className="block">
                    <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer">
                      <div className="flex flex-col items-center">
                        <FileText size={32} className="text-slate-400 mb-3" />
                        <span className="text-slate-300 font-medium mb-2">
                          Insurance Certificate
                        </span>
                        {credentials.insuranceCertificate && (
                          <CheckCircle size={20} className="text-green-400" />
                        )}
                      </div>
                    </div>
                  </label>
                  <input
                    id="insurance-certificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        insuranceCertificate: e.target.files[0],
                      }))
                    }
                    className="hidden"
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-200 text-sm">
                  Both front and back of your driver's license are required for
                  verification purposes.
                </p>
              </div>

              {/* Success Message */}
              {uploadSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-400" />
                    <span className="text-green-200">
                      Documents uploaded successfully!
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCredentialsSubmit}
                  disabled={uploadingCredentials}
                >
                  {uploadingCredentials ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Upload Documents
                    </>
                  )}
                </button>
              </div>

              {credentials.identificationDocuments &&
                credentials.identificationDocuments.length > 0 && (
                  <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Uploaded Files
                    </h4>
                    <div className="space-y-3">
                      {credentials.identificationDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                        >
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-slate-300 flex-1">
                            {doc.name}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {formatDate(doc.uploadDate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Security Settings
              </h3>

              <div className="space-y-6">
                <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg">
                        <Fingerprint size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Fingerprint Authentication
                        </h4>
                        <p className="text-slate-300 text-sm">
                          Use your fingerprint to access profile changes
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.fingerprintEnabled}
                        onChange={(e) =>
                          handleSecurityChange("fingerprint", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <Smartphone size={24} className="text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-slate-300 text-sm">
                          Add an extra layer of security with 2FA
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(e) =>
                          handleSecurityChange("twoFactor", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Security Information
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-300">Last Login:</span>
                    <span className="text-white font-medium">
                      {formatDate(securitySettings.lastLogin)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-300">Login History:</span>
                    <span className="text-white font-medium">
                      {securitySettings.loginHistory.length} recent logins
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Modals */}
      {showFingerprintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              Enable Fingerprint Authentication
            </h3>
            <p className="text-slate-300 mb-6">
              Please scan your fingerprint to enable this feature
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowFingerprintModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              Enable Two-Factor Authentication
            </h3>
            <p className="text-slate-300 mb-6">
              Scan the QR code with your authenticator app
            </p>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 text-center mb-6">
              <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center">
                <span className="text-slate-800 font-medium">QR Code</span>
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShow2FAModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
