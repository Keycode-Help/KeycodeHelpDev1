import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/userDash.css";

function UserDash() {
  const { token } = useAuth();
  const [requests, setRequests] = useState({
    pendingRequests: [],
    fulfilledRequests: [],
  });
  const [modalImage, setModalImage] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [fileData, setFileData] = useState({});

  // Fetch user requests
  useEffect(() => {
    axios
      .get("http://localhost:8080/vehicle/user-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRequests(response.data))
      .catch((error) =>
        console.error("Error fetching vehicle requests:", error)
      );
  }, [token]);

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
  const handleUpdateRequest = (requestId) => {
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

    // Send the PUT request
    axios
      .put(
        `http://localhost:8080/vehicle/update-request/${requestId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        alert("Request updated successfully!");
        // Refresh requests after update
        axios
          .get("http://localhost:8080/vehicle/user-requests", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setRequests(response.data));
      })
      .catch((error) => {
        console.error("Error updating request:", error);
        alert("Failed to update request.");
      });
  };

  // Render the component
  return (
    <>
      <h1 className="userdash-h1">User Dashboard</h1>
      <div className="user-dash-container">
        {/* Pending Requests Section */}
        <section className="section-one">
          <h2>Pending Requests</h2>
          {requests.pendingRequests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            requests.pendingRequests.map((request) => (
              <div key={request.id} className="request-card">
                <h3>
                  {request.make} {request.model}
                </h3>
                <p>VIN: {request.vin}</p>
                <div className="request-images">
                  <img
                    src={`data:image/jpeg;base64,${request.frontId}`}
                    alt="Front ID"
                    onClick={() =>
                      handleImageClick(
                        `data:image/jpeg;base64,${request.frontId}`
                      )
                    }
                    className="vehicle-image"
                  />
                  <img
                    src={`data:image/jpeg;base64,${request.backId}`}
                    alt="Back ID"
                    onClick={() =>
                      handleImageClick(
                        `data:image/jpeg;base64,${request.backId}`
                      )
                    }
                    className="vehicle-image"
                  />
                  <img
                    src={`data:image/jpeg;base64,${request.registration}`}
                    alt="Registration"
                    onClick={() =>
                      handleImageClick(
                        `data:image/jpeg;base64,${request.registration}`
                      )
                    }
                    className="vehicle-image"
                  />
                </div>
                <form>
                  <label>Make:</label>
                  <input
                    type="text"
                    name="make"
                    value={updateData[request.id]?.make || request.make}
                    onChange={(e) => handleInputChange(e, request.id)}
                  />
                  <label>Model:</label>
                  <input
                    type="text"
                    name="model"
                    value={updateData[request.id]?.model || request.model}
                    onChange={(e) => handleInputChange(e, request.id)}
                  />
                  <label>VIN:</label>
                  <input
                    type="text"
                    name="vin"
                    value={updateData[request.id]?.vin || request.vin}
                    onChange={(e) => handleInputChange(e, request.id)}
                  />

                  {/* File inputs */}
                  <label>Front ID:</label>
                  <input
                    type="file"
                    name="frontId"
                    onChange={(e) => handleFileChange(e, request.id)}
                    accept="image/*"
                  />
                  <label>Back ID:</label>
                  <input
                    type="file"
                    name="backId"
                    onChange={(e) => handleFileChange(e, request.id)}
                    accept="image/*"
                  />
                  <label>Registration:</label>
                  <input
                    type="file"
                    name="registration"
                    onChange={(e) => handleFileChange(e, request.id)}
                    accept="image/*"
                  />

                  <button
                    className="user-button"
                    type="button"
                    onClick={() => handleUpdateRequest(request.id)}
                  >
                    Update Request
                  </button>
                </form>
              </div>
            ))
          )}
        </section>

        {/* Fulfilled Requests Section */}
        <section className="section-two">
          <h2>Fulfilled Requests</h2>
          {requests.fulfilledRequests.length === 0 ? (
            <p>No fulfilled requests.</p>
          ) : (
            requests.fulfilledRequests.map((request) => (
              <div key={request.id} className="request-card">
                <h3>
                  {request.make} {request.model}
                </h3>
                <p>VIN: {request.vin}</p>
                <p>Status: Completed</p>
              </div>
            ))
          )}
        </section>

        {/* Modal for Image Preview */}
        {modalImage && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <img
                src={modalImage}
                alt="Enlarged View"
                className="modal-image"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserDash;
