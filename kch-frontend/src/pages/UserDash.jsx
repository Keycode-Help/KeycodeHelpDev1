import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import "../styles/userDash.css";
import { ModalContent } from "../components/ModalContent";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Car, 
  DollarSign, 
  FileImage, 
  Edit3, 
  Save,
  X,
  TrendingUp,
  Calendar,
  User
} from "lucide-react";

function UserDash() {
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState({
    pendingRequests: [],
    inProgressRequests: [],
    fulfilledRequests: [],
  });
  const [modalImage, setModalImage] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [fileData, setFileData] = useState({});
  const [editingRequest, setEditingRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user requests
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Fetching vehicle requests...");
      api.get("/vehicle/user-requests")
        .then((response) => {
          console.log("Vehicle requests fetched successfully:", response.data);
          setRequests(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vehicle requests:", error);
          console.error("Error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
          });
          setLoading(false);
        });
    } else {
      console.log("User not authenticated, skipping vehicle requests fetch");
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Handle input change for text fields
  const handleInputChange = (e, requestId) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [requestId]: {
        ...prevData[requestId],
        [name]: value,
      },
    }));
  };

  // Handle file input change
  const handleFileChange = (e, requestId) => {
    const { name, files } = e.target;
    setFileData((prevFiles) => ({
      ...prevFiles,
      [requestId]: {
        ...prevFiles[requestId],
        [name]: files[0],
      },
    }));
  };

  // Handle image click to open modal
  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
  };

  // Close modal
  const closeModal = () => {
    setModalImage(null);
  };

  // Handle request update
  const handleUpdateRequest = async (requestId) => {
    const requestData = updateData[requestId] || {};
    const requestFiles = fileData[requestId] || {};

    // Create FormData object to handle file uploads
    const formData = new FormData();

    // Append updated fields to the FormData object
    if (requestData.make) formData.append("make", requestData.make);
    if (requestData.model) formData.append("model", requestData.model);
    if (requestData.vin) formData.append("vin", requestData.vin);

    // Append files if they are selected
    if (requestFiles.frontId) formData.append("frontId", requestFiles.frontId);
    if (requestFiles.backId) formData.append("backId", requestFiles.backId);
    if (requestFiles.registration)
      formData.append("registration", requestFiles.registration);

    try {
      await api.put(`/vehicle/update-request/${requestId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      alert("Request updated successfully!");
      setEditingRequest(null);
      
      // Refresh requests after update
      const response = await api.get("/vehicle/user-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update request.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'inProgress':
        return <TrendingUp className="status-icon in-progress" />;
      case 'fulfilled':
        return <CheckCircle className="status-icon fulfilled" />;
      default:
        return <AlertCircle className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'inProgress':
        return '#3b82f6';
      case 'fulfilled':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'inProgress':
        return 'In Progress';
      case 'fulfilled':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const RequestCard = ({ request, status, showEdit = false }) => (
    <div className="request-card">
      <div className="card-header">
        <div className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>
          {getStatusIcon(status)}
          <span>{getStatusText(status)}</span>
        </div>
        <div className="vehicle-info">
          <div className="vehicle-make">
            <Car size={16} />
            <span>{request.make?.manufacturerName || 'N/A'}</span>
          </div>
          <div className="vehicle-model">
            <span>{request.model || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="info-grid">
          <div className="info-item">
            <label>VIN</label>
            <span className="vin-text">{request.vin || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Price</label>
            <span className="price-text">
              <DollarSign size={16} />
              {request.keycodePrice || '0.00'}
            </span>
          </div>
        </div>

        <div className="vehicle-images">
          <h4>Vehicle Documents</h4>
          <div className="image-grid">
            {request.frontId && (
              <div className="image-item">
                <img
                  src={`data:image/jpeg;base64,${request.frontId}`}
                  alt="Front ID"
                  onClick={() => handleImageClick(`data:image/jpeg;base64,${request.frontId}`)}
                  className="vehicle-image"
                />
                <span>Front ID</span>
              </div>
            )}
            {request.backId && (
              <div className="image-item">
                <img
                  src={`data:image/jpeg;base64,${request.backId}`}
                  alt="Back ID"
                  onClick={() => handleImageClick(`data:image/jpeg;base64,${request.backId}`)}
                  className="vehicle-image"
                />
                <span>Back ID</span>
              </div>
            )}
            {request.registration && (
              <div className="image-item">
                <img
                  src={`data:image/jpeg;base64,${request.registration}`}
                  alt="Registration"
                  onClick={() => handleImageClick(`data:image/jpeg;base64,${request.registration}`)}
                  className="vehicle-image"
                />
                <span>Registration</span>
              </div>
            )}
          </div>
        </div>

        {showEdit && editingRequest === request.id && (
          <div className="edit-form">
            <h4>Update Request</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  name="model"
                  value={updateData[request.id]?.model || request.model || ''}
                  onChange={(e) => handleInputChange(e, request.id)}
                  placeholder="Enter model"
                />
              </div>
              <div className="form-group">
                <label>VIN</label>
                <input
                  type="text"
                  name="vin"
                  value={updateData[request.id]?.vin || request.vin || ''}
                  onChange={(e) => handleInputChange(e, request.id)}
                  placeholder="Enter VIN"
                />
              </div>
            </div>

            <div className="file-uploads">
              <h5>Update Documents</h5>
              <div className="file-grid">
                <div className="file-group">
                  <label>Front ID</label>
                  <input
                    type="file"
                    name="frontId"
                    onChange={(e) => handleFileChange(e, request.id)}
                    accept="image/*"
                  />
                </div>
                <div className="file-group">
                  <label>Back ID</label>
                  <input
                    type="file"
                    name="backId"
                    onChange={(e) => handleFileChange(e, request.id)}
                    accept="image/*"
                  />
                </div>
                <div className="file-group">
                  <label>Registration</label>
                  <input
                    type="file"
                    name="registration"
                    onChange={(e) => handleFileChange(e, request.id)}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleUpdateRequest(request.id)}
              >
                <Save size={16} />
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingRequest(null)}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {showEdit && editingRequest !== request.id && (
          <button
            className="btn btn-outline"
            onClick={() => setEditingRequest(request.id)}
          >
            <Edit3 size={16} />
            Edit Request
          </button>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="dashboard-loading">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access your dashboard.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const totalRequests = requests.pendingRequests.length + 
                       requests.inProgressRequests.length + 
                       requests.fulfilledRequests.length;

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, {user?.fname || 'User'}!</h1>
            <p>Manage your vehicle keycode requests and track their progress</p>
          </div>
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon pending">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{requests.pendingRequests.length}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon in-progress">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{requests.inProgressRequests.length}</span>
                <span className="stat-label">In Progress</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon fulfilled">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{requests.fulfilledRequests.length}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Pending Requests Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <Clock size={24} />
              Pending Requests
            </h2>
            <span className="request-count">{requests.pendingRequests.length} requests</span>
          </div>
          <div className="requests-grid">
            {requests.pendingRequests.length === 0 ? (
              <div className="empty-state">
                <Clock size={48} />
                <h3>No pending requests</h3>
                <p>All caught up! Your pending requests will appear here.</p>
              </div>
            ) : (
              requests.pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} status="pending" showEdit={true} />
              ))
            )}
          </div>
        </section>

        {/* In Progress Requests Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <TrendingUp size={24} />
              In Progress
            </h2>
            <span className="request-count">{requests.inProgressRequests.length} requests</span>
          </div>
          <div className="requests-grid">
            {requests.inProgressRequests.length === 0 ? (
              <div className="empty-state">
                <TrendingUp size={48} />
                <h3>No in-progress requests</h3>
                <p>Your requests will appear here once processing begins.</p>
              </div>
            ) : (
              requests.inProgressRequests.map((request) => (
                <RequestCard key={request.id} request={request} status="inProgress" />
              ))
            )}
          </div>
        </section>

        {/* Fulfilled Requests Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <CheckCircle size={24} />
              Completed Requests
            </h2>
            <span className="request-count">{requests.fulfilledRequests.length} requests</span>
          </div>
          <div className="requests-grid">
            {requests.fulfilledRequests.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} />
                <h3>No completed requests</h3>
                <p>Your completed requests will appear here.</p>
              </div>
            ) : (
              requests.fulfilledRequests.map((request) => (
                <RequestCard key={request.id} request={request} status="fulfilled" />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Modal for Image Preview */}
      {modalImage && (
        <ModalContent 
          modalImage={modalImage} 
          closeModal={closeModal} 
        />
      )}
    </div>
  );
}

export default UserDash;
