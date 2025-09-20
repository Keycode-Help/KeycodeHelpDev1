import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTrialStatus } from "../hooks/useTrialStatus";
import { useConnectionStatus } from "../hooks/useConnectionStatus";
import api from "../services/request";
import { get, post, put, isCachedResponse, isOfflineResponse } from "../services/offlineRequest";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import PasswordChange from "../components/PasswordChange";
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
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
} from "lucide-react";

function UserProfile() {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const { trialStatus } = useTrialStatus();
  const { isOnline } = useConnectionStatus();

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
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingCredentials, setUploadingCredentials] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [twoFactorSecret, setTwoFactorSecret] = useState("");

  useEffect(() => {
    console.log("🔍 UserProfile useEffect - Auth state:", {
      isInitialized,
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
    });

    if (isInitialized && isAuthenticated && user) {
      console.log("✅ All auth conditions met, fetching user data...");
      fetchUserProfile();
      fetchSubscriptionData();
      fetchOrderHistory();
      fetchSecuritySettings();
      fetchCredentials();
      fetchImportantNotices();
    } else if (isInitialized && !isAuthenticated) {
      console.log("❌ User not authenticated, redirecting to login...");
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, [isInitialized, isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      console.log("🔄 Fetching user profile...");
      const response = await get("/user/profile");
      const data = response.data;
      
      console.log("📊 Raw profile data received:", data);

      // Check if response is from cache or offline
      if (isCachedResponse(response)) {
        console.log("📦 Profile data served from cache");
        toast.success("Profile data loaded from cache", { duration: 2000 });
      } else if (isOfflineResponse(response)) {
        console.log("📴 Profile data served offline");
        toast.info("Profile data loaded offline", { duration: 3000 });
      }

      // Map backend data to frontend state with fallbacks
      const profileData = {
        firstName: data.firstName || data.fname || "",
        lastName: data.lastName || data.lname || "",
        email: data.email || "",
        phone: data.phone || "",
        company: data.company || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
        profilePhoto: data.profilePhoto || null,
        companyLogo: data.companyLogo || null,
      };
      
      setProfileData(profileData);
      console.log("✅ User profile mapped and set:", profileData);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);

      // Handle authentication errors specifically
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log(
          "🚨 Authentication error in fetchUserProfile, redirecting to login..."
        );
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
      } else {
        toast.error("Failed to load profile data. Please try again later.");
        // Set default profile data on error
        setProfileData({
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
      }
    }
  };

  const fetchSubscriptionData = async () => {
    try {
      console.log("🔄 Fetching subscription data...");
      const response = await get("/user/subscription");
      const data = response.data;
      
      console.log("📊 Raw subscription data received:", data);

      // Check if response is from cache or offline
      if (isCachedResponse(response)) {
        console.log("📦 Subscription data served from cache");
      } else if (isOfflineResponse(response)) {
        console.log("📴 Subscription data served offline");
      }
      
      // Map backend data to frontend state with fallbacks
      const subscriptionData = {
        tier: data.tier || "NONE",
        status: data.status || "INACTIVE",
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        autoRenew: data.autoRenew || false,
      };
      
      setSubscription(subscriptionData);
      console.log("✅ Subscription data mapped and set:", subscriptionData);
    } catch (error) {
      console.error("❌ Error fetching subscription:", error);
      // Gracefully fallback to no subscription on auth/permissions errors
      const defaultSubscription = {
        tier: "NONE",
        status: "INACTIVE",
        startDate: null,
        endDate: null,
        autoRenew: false,
      };
      setSubscription(defaultSubscription);
      console.log("⚠️ Using default subscription data:", defaultSubscription);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      console.log("🔄 Fetching order history...");
      const response = await get("/user/orders");
      const data = response.data;
      
      console.log("📊 Raw order history data received:", data);

      // Check if response is from cache or offline
      if (isCachedResponse(response)) {
        console.log("📦 Order history served from cache");
      } else if (isOfflineResponse(response)) {
        console.log("📴 Order history served offline");
      }
      
      // Ensure we always set an array
      const orders = Array.isArray(data) ? data : [];
      
      // Map order data to ensure consistent structure
      const mappedOrders = orders.map((order) => ({
        id: order.id || order.orderId || null,
        orderDate: order.orderDate || order.createdAt || order.date || null,
        status: order.status || "UNKNOWN",
        vin: order.vin || "",
        cost: order.cost || order.price || order.amount || 0,
        ...order, // Include any additional fields
      }));
      
      setOrderHistory(mappedOrders);
      console.log("✅ Order history mapped and set:", mappedOrders);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);

      // Handle authentication errors specifically
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log(
          "🚨 Authentication error in fetchOrderHistory, redirecting to login..."
        );
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
      } else {
        toast.error("Failed to load order history. Please try again later.");
        // Set empty array on error
        setOrderHistory([]);
        console.log("⚠️ Using empty order history array due to error");
      }
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
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      console.log(
        `📁 File selected for ${field}:`,
        file.name,
        file.size,
        file.type
      );

      setProfileData((prev) => ({
        ...prev,
        [field]: file,
      }));

      toast.success(
        `${
          field === "profilePhoto" ? "Profile photo" : "Company logo"
        } selected successfully!`
      );
    }
  };

  const triggerFileInput = (inputId) => {
    if (!isEditing) {
      toast.error("Please enable editing mode first");
      return;
    }
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSecurityChange = async (setting, value) => {
    if (setting === "fingerprint" && value) {
      setShowFingerprintModal(true);
      return;
    }

    if (setting === "twoFactor" && value) {
      handle2FASetup();
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

  const generateQRCode = async () => {
    try {
      // Generate a secret for 2FA (in real implementation, this would come from backend)
      const secret = Math.random().toString(36).substring(2, 18);
      setTwoFactorSecret(secret);

      // Create TOTP URL for authenticator apps
      const appName = "Keycode Help";
      const accountName = user?.email || "user@example.com";
      const totpUrl = `otpauth://totp/${appName}:${accountName}?secret=${secret}&issuer=${appName}`;

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(totpUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handle2FASetup = () => {
    setShow2FAModal(true);
    generateQRCode();
  };

  const handleFingerprintSetup = async () => {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        alert(
          "Fingerprint authentication is not supported on this device/browser."
        );
        setShowFingerprintModal(false);
        return;
      }

      // Create credential options
      const credentialCreationOptions = {
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "Keycode Help",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(user?.email || "user"),
            name: user?.email || "user@example.com",
            displayName: `${user?.firstName || "User"} ${
              user?.lastName || ""
            }`.trim(),
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
          attestation: "direct",
        },
      };

      // Create credential
      const credential = await navigator.credentials.create(
        credentialCreationOptions
      );

      if (credential) {
        // In a real implementation, you'd send this to your backend
        console.log("Fingerprint credential created:", credential);

        // Update security settings
        await api.put("/user/security", {
          fingerprintEnabled: true,
        });

        setSecuritySettings((prev) => ({
          ...prev,
          fingerprintEnabled: true,
        }));

        setShowFingerprintModal(false);
        alert("Fingerprint authentication enabled successfully!");
      }
    } catch (error) {
      console.error("Fingerprint setup failed:", error);
      alert("Failed to set up fingerprint authentication. Please try again.");
    }
  };

  const handle2FAEnable = async () => {
    try {
      // In a real implementation, you'd verify the TOTP code first
      await api.put("/user/security", {
        twoFactorEnabled: true,
        twoFactorSecret: twoFactorSecret,
      });

      setSecuritySettings((prev) => ({
        ...prev,
        twoFactorEnabled: true,
      }));

      setShow2FAModal(false);
      alert("Two-Factor Authentication enabled successfully!");
    } catch (error) {
      console.error("2FA setup failed:", error);
      alert("Failed to enable Two-Factor Authentication. Please try again.");
    }
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
          <p className="text-white text-lg">Initializing...</p>
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
          <p className="text-white mb-6">
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
          <p className="text-white text-lg">Loading your profile...</p>
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
          <p className="text-white text-lg">
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
                      <p className="text-white text-sm">{notice.message}</p>
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
                  : "text-white hover:text-white hover:bg-slate-700/50"
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
                  : "text-white hover:text-white hover:bg-slate-700/50"
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
                  : "text-white hover:text-white hover:bg-slate-700/50"
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
                  : "text-white hover:text-white hover:bg-slate-700/50"
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
                  : "text-white hover:text-white hover:bg-slate-700/50"
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
                <p className="text-white mt-2">
                  Upload your profile photo and company logo
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div className="space-y-4">
                  <label
                    htmlFor="profile-photo"
                    className={`block ${
                      !isEditing
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-8 text-center transition-colors duration-200 ${
                        isEditing
                          ? "hover:border-blue-500 cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                      onClick={() =>
                        isEditing && triggerFileInput("profile-photo")
                      }
                    >
                      {profileData.profilePhoto ? (
                        <img
                          src={URL.createObjectURL(profileData.profilePhoto)}
                          alt="Profile"
                          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center mb-4">
                            <User size={40} className="text-white" />
                          </div>
                          <span className="text-white font-medium">
                            Profile Photo
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "profilePhoto")}
                    disabled={!isEditing}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-sm text-white">
                      {isEditing
                        ? "Click to upload profile photo"
                        : "Enable editing to upload photo"}
                    </p>
                    {profileData.profilePhoto && (
                      <p className="text-xs text-green-400 mt-1">
                        ✓ Photo selected: {profileData.profilePhoto.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Logo */}
                <div className="space-y-4">
                  <label
                    htmlFor="company-logo"
                    className={`block ${
                      !isEditing
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-8 text-center transition-colors duration-200 ${
                        isEditing
                          ? "hover:border-blue-500 cursor-pointer"
                          : "cursor-not-allowed"
                      }`}
                      onClick={() =>
                        isEditing && triggerFileInput("company-logo")
                      }
                    >
                      {profileData.companyLogo ? (
                        <img
                          src={URL.createObjectURL(profileData.companyLogo)}
                          alt="Company Logo"
                          className="w-24 h-24 mx-auto rounded-lg object-cover mb-4"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                            <Building2 size={40} className="text-white" />
                          </div>
                          <span className="text-white font-medium">
                            Company Logo
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    id="company-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "companyLogo")}
                    disabled={!isEditing}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-sm text-white">
                      {isEditing
                        ? "Click to upload company logo"
                        : "Enable editing to upload logo"}
                    </p>
                    {profileData.companyLogo && (
                      <p className="text-xs text-green-400 mt-1">
                        ✓ Logo selected: {profileData.companyLogo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="space-y-8">
              <div className="border-b border-slate-600 pb-4 mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Personal Information
                </h2>
                <p className="text-white mt-2">
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-white">Email cannot be changed</p>
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                    <div className="text-sm text-white mb-1">Start Date</div>
                    <div className="text-white font-medium">
                      {formatDate(subscription.startDate)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-white mb-1">End Date</div>
                    <div className="text-white font-medium">
                      {formatDate(subscription.endDate)}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-white mb-1">Auto-Renew</div>
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
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            15% off keycode purchases
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            Limited vehicle access
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            Basic support
                          </li>
                        </>
                      )}
                      {subscription.tier === "PROFESSIONAL" && (
                        <>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            20% off keycode purchases
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            Extended vehicle coverage
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            Priority support
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            Bulk ordering (up to 20 codes)
                          </li>
                        </>
                      )}
                      {subscription.tier === "ENTERPRISE" && (
                        <>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            25% off keycode purchases
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            Complete vehicle database
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            24/7 premium support
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            Unlimited bulk ordering
                          </li>
                          <li className="flex items-center gap-2 text-white">
                            <CheckCircle size={16} className="text-green-400" />
                            Multi-location management
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Trial Information Section */}
              {trialStatus?.hasTrial && trialStatus?.isActive && (
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      Active Trial
                    </h3>
                    <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                      {trialStatus.remainingDays} days left
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-blue-300 mb-1">
                        Trial Expires
                      </div>
                      <div className="text-white font-medium">
                        {trialStatus.trialEndsAt
                          ? new Date(
                              trialStatus.trialEndsAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Unknown"}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-blue-300 mb-1">
                        Premium Access
                      </div>
                      <div className="text-white font-medium">
                        {trialStatus.hasPremiumAccess ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Trial Benefits:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-white">
                        <CheckCircle size={16} className="text-green-400" />
                        Priority processing (30m - 1h)
                      </li>
                      <li className="flex items-center gap-2 text-white">
                        <CheckCircle size={16} className="text-green-400" />
                        Premium keycode database access
                      </li>
                      <li className="flex items-center gap-2 text-white">
                        <CheckCircle size={16} className="text-green-400" />
                        Phone & live chat support
                      </li>
                      <li className="flex items-center gap-2 text-white">
                        <CheckCircle size={16} className="text-green-400" />
                        Expanded vehicle coverage
                      </li>
                    </ul>
                  </div>
                </div>
              )}
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
              {!Array.isArray(orderHistory) || orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History size={48} className="text-white mx-auto mb-4" />
                  <p className="text-white text-lg">No orders found</p>
                  <p className="text-white text-sm mt-2">
                    Your order history will appear here once you make a
                    purchase.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(orderHistory) &&
                    orderHistory.map((order, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/50 border border-slate-600 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white font-medium">
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
                            <span className="text-white">VIN:</span>
                            <span className="text-white font-mono">
                              {maskVIN(order.vin)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white">Cost:</span>
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
                    <strong>Important:</strong> Driver&apos;s license requires
                    both front and back sides for verification.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label htmlFor="business-license" className="block">
                    <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer">
                      <div className="flex flex-col items-center">
                        <FileText size={32} className="text-white mb-3" />
                        <span className="text-white font-medium mb-2">
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
                        <FileText size={32} className="text-white mb-3" />
                        <span className="text-white font-medium mb-2">
                          Driver&apos;s License - Front
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
                        <FileText size={32} className="text-white mb-3" />
                        <span className="text-white font-medium mb-2">
                          Driver&apos;s License - Back
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
                        <FileText size={32} className="text-white mb-3" />
                        <span className="text-white font-medium mb-2">
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
                  Both front and back of your driver&apos;s license are required
                  Add for verification purposes.
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
                          <FileText size={16} className="text-white" />
                          <span className="text-white flex-1">{doc.name}</span>
                          <span className="text-white text-sm">
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
                {/* Password Change Section */}
                <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-600/20 rounded-lg">
                        <Lock size={24} className="text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Password Management
                        </h4>
                        <p className="text-white text-sm">
                          Change your account password for better security
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordChangeModal(true)}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

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
                        <p className="text-white text-sm">
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
                        <p className="text-white text-sm">
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
                    <span className="text-white">Last Login:</span>
                    <span className="text-white font-medium">
                      {formatDate(securitySettings.lastLogin)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-white">Login History:</span>
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
            <p className="text-white mb-6">
              Please scan your fingerprint to enable this feature
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowFingerprintModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFingerprintSetup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
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
            <p className="text-white mb-6">
              Scan the QR code with your authenticator app
            </p>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 text-center mb-6">
              <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center p-4">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="2FA QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                    <span className="text-slate-600 text-sm">
                      Generating QR Code...
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShow2FAModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handle2FAEnable}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordChangeModal && (
        <PasswordChange
          onClose={() => setShowPasswordChangeModal(false)}
          onSuccess={() => {
            setShowPasswordChangeModal(false);
            toast.success("Password changed successfully!");
          }}
        />
      )}
    </div>
  );
}

export default UserProfile;
