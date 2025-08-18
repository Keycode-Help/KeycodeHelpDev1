import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import "../styles/userProfile.css";
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
  Clock
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
    companyLogo: null
  });

  // Subscription state
  const [subscription, setSubscription] = useState({
    tier: "NONE",
    status: "INACTIVE",
    startDate: null,
    endDate: null,
    autoRenew: false
  });

  // Order history state
  const [orderHistory, setOrderHistory] = useState([]);
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    fingerprintEnabled: false,
    lastLogin: null,
    loginHistory: []
  });

  // Credentials and files state
  const [credentials, setCredentials] = useState({
    businessLicense: null,
    driversLicenseFront: null,
    driversLicenseBack: null,
    insuranceCertificate: null,
    identificationDocuments: [],
    otherFiles: []
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
        companyLogo: data.companyLogo || null
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
        autoRenew: false
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
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null) {
          formData.append(key, profileData[key]);
        }
      });

      await api.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
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
      setProfileData(prev => ({
        ...prev,
        [field]: file
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
        [setting]: value
      });
      
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: value
      }));
      
      alert("Security setting updated successfully!");
    } catch (error) {
      console.error("Error updating security setting:", error);
      alert("Failed to update security setting. Please try again.");
    }
  };

  const handleCredentialsSubmit = async () => {
    // Check if any files are selected
    const hasFiles = credentials.businessLicense || 
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
        formData.append("insuranceCertificate", credentials.insuranceCertificate);
      }

      await api.put("/user/credentials", formData, {
        headers: { "Content-Type": "multipart/form-data" }
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
      case "ACTIVE": return "#10b981";
      case "PENDING": return "#f59e0b";
      case "EXPIRED": return "#ef4444";
      case "CANCELLED": return "#6b7280";
      default: return "#6b7280";
    }
  };

  const getSubscriptionTierDisplay = (tier) => {
    switch (tier) {
      case "BASIC": return "Basic Plan";
      case "PROFESSIONAL": return "Professional Plan";
      case "ENTERPRISE": return "Enterprise Plan";
      default: return "No Subscription";
    }
  };

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Initializing...</p>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="profile-loading">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access your profile.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="login-btn"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account, subscription, and security settings</p>
      </div>

      {/* Important Notices Banner */}
      {importantNotices.length > 0 && (
        <div className="notices-banner">
          <AlertTriangle className="notice-icon" />
          <div className="notices-content">
            <h3>Important Notices</h3>
            {importantNotices.map((notice, index) => (
              <div key={index} className="notice-item">
                <span className="notice-title">{notice.title}</span>
                <span className="notice-date">{formatDate(notice.date)}</span>
                <p className="notice-message">{notice.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="profile-content">
        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={20} />
            Profile
          </button>
          <button 
            className={`tab ${activeTab === "subscription" ? "active" : ""}`}
            onClick={() => setActiveTab("subscription")}
          >
            <Shield size={20} />
            Subscription
          </button>
          <button 
            className={`tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <History size={20} />
            Orders
          </button>
          <button 
            className={`tab ${activeTab === "credentials" ? "active" : ""}`}
            onClick={() => setActiveTab("credentials")}
          >
            <FileText size={20} />
            Credentials
          </button>
          <button 
            className={`tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Settings size={20} />
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="tab-content">
            <div className="profile-section">
              <div className="profile-photos">
                <div className="photo-upload">
                  <label htmlFor="profile-photo">
                    {profileData.profilePhoto ? (
                      <img 
                        src={URL.createObjectURL(profileData.profilePhoto)} 
                        alt="Profile" 
                        className="profile-photo"
                      />
                    ) : (
                      <div className="photo-placeholder">
                        <User size={40} />
                        <span>Profile Photo</span>
                      </div>
                    )}
                    <input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "profilePhoto")}
                      disabled={!isEditing}
                    />
                  </label>
                </div>

                <div className="photo-upload">
                  <label htmlFor="company-logo">
                    {profileData.companyLogo ? (
                      <img 
                        src={URL.createObjectURL(profileData.companyLogo)} 
                        alt="Company Logo" 
                        className="company-logo"
                      />
                    ) : (
                      <div className="photo-placeholder">
                        <Building2 size={40} />
                        <span>Company Logo</span>
                      </div>
                    )}
                    <input
                      id="company-logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "companyLogo")}
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="disabled"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({...prev, company: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({...prev, address: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({...prev, city: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => setProfileData(prev => ({...prev, state: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData(prev => ({...prev, zipCode: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="profile-actions">
                  {!isEditing ? (
                    <button 
                      className="edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 size={20} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={handleProfileUpdate}
                      >
                        <Save size={20} />
                        Save Changes
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => setIsEditing(false)}
                      >
                        <X size={20} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="tab-content">
            <div className="subscription-section">
              <div className="subscription-card">
                <div className="subscription-header">
                  <h3>{getSubscriptionTierDisplay(subscription.tier)}</h3>
                  <span 
                    className="subscription-status"
                    style={{ backgroundColor: getSubscriptionStatusColor(subscription.status) }}
                  >
                    {subscription.status}
                  </span>
                </div>
                
                <div className="subscription-details">
                  <div className="detail-row">
                    <span>Start Date:</span>
                    <span>{formatDate(subscription.startDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span>End Date:</span>
                    <span>{formatDate(subscription.endDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Auto-Renew:</span>
                    <span>{subscription.autoRenew ? "Yes" : "No"}</span>
                  </div>
                </div>

                {subscription.status === "ACTIVE" && (
                  <div className="subscription-benefits">
                    <h4>Your Benefits:</h4>
                    <ul>
                      {subscription.tier === "BASIC" && (
                        <>
                          <li>15% off keycode purchases</li>
                          <li>Limited vehicle access</li>
                          <li>Basic support</li>
                        </>
                      )}
                      {subscription.tier === "PROFESSIONAL" && (
                        <>
                          <li>20% off keycode purchases</li>
                          <li>Extended vehicle coverage</li>
                          <li>Priority support</li>
                          <li>Bulk ordering (up to 20 codes)</li>
                        </>
                      )}
                      {subscription.tier === "ENTERPRISE" && (
                        <>
                          <li>25% off keycode purchases</li>
                          <li>Complete vehicle database</li>
                          <li>24/7 premium support</li>
                          <li>Unlimited bulk ordering</li>
                          <li>Multi-location management</li>
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
          <div className="tab-content">
            <div className="orders-section">
              <h3>Order History</h3>
              {orderHistory.length === 0 ? (
                <div className="no-orders">
                  <History size={48} />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orderHistory.map((order, index) => (
                    <div key={index} className="order-item">
                      <div className="order-header">
                        <span className="order-date">{formatDate(order.orderDate)}</span>
                        <span className="order-status">{order.status}</span>
                      </div>
                      <div className="order-details">
                        <div className="order-vin">
                          <span>VIN:</span>
                          <span className="vin-masked">{maskVIN(order.vin)}</span>
                        </div>
                        <div className="order-cost">
                          <span>Cost:</span>
                          <span className="cost-amount">${order.cost.toFixed(2)}</span>
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
           <div className="tab-content">
             <div className="credentials-section">
               <h3>Business Credentials & Files</h3>
               
                               <div className="credentials-notice">
                  <AlertTriangle size={20} />
                  <p><strong>Important:</strong> Driver's license requires both front and back sides for verification.</p>
                </div>
                
                <div className="credentials-grid">
                  <div className="credential-item">
                    <label htmlFor="business-license">
                      <FileText size={24} />
                      <span>Business License</span>
                      {credentials.businessLicense && (
                        <CheckCircle size={16} className="uploaded" />
                      )}
                    </label>
                    <input
                      id="business-license"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCredentials(prev => ({...prev, businessLicense: e.target.files[0]}))}
                    />
                  </div>

                  <div className="credential-item license-item">
                    <label htmlFor="drivers-license-front">
                      <FileText size={24} />
                      <span>Driver's License - Front</span>
                      {credentials.driversLicenseFront && (
                        <CheckCircle size={16} className="uploaded" />
                      )}
                    </label>
                    <input
                      id="drivers-license-front"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCredentials(prev => ({...prev, driversLicenseFront: e.target.files[0]}))}
                    />
                  </div>

                  <div className="credential-item license-item">
                    <label htmlFor="drivers-license-back">
                      <FileText size={24} />
                      <span>Driver's License - Back</span>
                      {credentials.driversLicenseBack && (
                        <CheckCircle size={16} className="uploaded" />
                      )}
                    </label>
                    <input
                      id="drivers-license-back"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCredentials(prev => ({...prev, driversLicenseBack: e.target.files[0]}))}
                    />
                  </div>

                 <div className="credential-item">
                   <label htmlFor="insurance-certificate">
                     <FileText size={24} />
                     <span>Insurance Certificate</span>
                     {credentials.insuranceCertificate && (
                       <CheckCircle size={16} className="uploaded" />
                     )}
                   </label>
                   <input
                     id="insurance-certificate"
                     type="file"
                     accept=".pdf,.jpg,.jpeg,.png"
                     onChange={(e) => setCredentials(prev => ({...prev, insuranceCertificate: e.target.files[0]}))}
                   />
                 </div>
               </div>
               
                               <div className="license-help-text">
                  <p>Both front and back of your driver's license are required for verification purposes.</p>
                </div>

                {/* Success Message */}
                {uploadSuccess && (
                  <div className="upload-success-message">
                    <CheckCircle size={20} />
                    <span>Documents uploaded successfully!</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="credentials-submit-section">
                  <button 
                    className="submit-credentials-btn"
                    onClick={handleCredentialsSubmit}
                    disabled={uploadingCredentials}
                  >
                    {uploadingCredentials ? (
                      <>
                        <div className="upload-spinner"></div>
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

               <div className="uploaded-files">
                 <h4>Uploaded Files</h4>
                 {credentials.identificationDocuments.map((doc, index) => (
                   <div key={index} className="file-item">
                     <FileText size={16} />
                     <span>{doc.name}</span>
                     <span className="file-date">{formatDate(doc.uploadDate)}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="tab-content">
            <div className="security-section">
              <h3>Security Settings</h3>
              
              <div className="security-options">
                <div className="security-option">
                  <div className="option-info">
                    <Fingerprint size={24} />
                    <div>
                      <h4>Fingerprint Authentication</h4>
                      <p>Use your fingerprint to access profile changes</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={securitySettings.fingerprintEnabled}
                      onChange={(e) => handleSecurityChange("fingerprint", e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="security-option">
                  <div className="option-info">
                    <Smartphone size={24} />
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security with 2FA</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorEnabled}
                      onChange={(e) => handleSecurityChange("twoFactor", e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="security-info">
                <div className="info-item">
                  <span>Last Login:</span>
                  <span>{formatDate(securitySettings.lastLogin)}</span>
                </div>
                <div className="info-item">
                  <span>Login History:</span>
                  <span>{securitySettings.loginHistory.length} recent logins</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Modals */}
      {showFingerprintModal && (
        <div className="modal-overlay">
          <div className="security-modal">
            <h3>Enable Fingerprint Authentication</h3>
            <p>Please scan your fingerprint to enable this feature</p>
            <div className="modal-actions">
              <button onClick={() => setShowFingerprintModal(false)}>Cancel</button>
              <button className="primary">Enable</button>
            </div>
          </div>
        </div>
      )}

      {show2FAModal && (
        <div className="modal-overlay">
          <div className="security-modal">
            <h3>Enable Two-Factor Authentication</h3>
            <p>Scan the QR code with your authenticator app</p>
            <div className="qr-code-placeholder">
              <div className="qr-code">QR Code</div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShow2FAModal(false)}>Cancel</button>
              <button className="primary">Enable</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
