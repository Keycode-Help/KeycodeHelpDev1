import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ModalContent } from "../components/ModalContent";
import "../styles/adminDashboard.css"; // Import the CSS file

function AdminDashboard() {
  const { token } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [keycodes, setKeycodes] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    sortBy: "",
    sortOrder: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [inProgressRequests, setInProgressRequests] = useState([])

  const handleApiError = (error, defaultMessage) => {
    console.error(error);
    alert(error.response?.data?.message || defaultMessage);
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchSubscriptions();
    fetchTransactions();
    fetchInProgressRequests();
  }, [filters]);

  const fetchPendingRequests = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:8080/admin/pending-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPendingRequests(response.data))
      .catch((error) =>
        handleApiError(error, "Error fetching pending requests.")
      )
      .finally(() => setIsLoading(false));
  };

  const fetchInProgressRequests = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:8080/admin/in-progress-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setInProgressRequests(response.data))
      .catch((error) =>
        handleApiError(error, "Error fetching In Progress requests.")
      )
      .finally(() => setIsLoading(false));
  };

  const fetchSubscriptions = () => {
    axios
      .get("http://localhost:8080/admin/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setSubscriptions(response.data))
      .catch((error) => handleApiError(error, "Error fetching subscriptions."));
  };

  const fetchTransactions = () => {
    const { status, search, sortBy, sortOrder } = filters;
    const query = new URLSearchParams({ status, search, sortBy, sortOrder });

    axios
      .get(`http://localhost:8080/admin/transactions?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTransactions(response.data))
      .catch((error) => handleApiError(error, "Error fetching transactions."));
  };

  const handleProcessRequest = (vehicleId) => {
    if (!keycodes[vehicleId]) {
      alert("Please enter a keycode before submitting.");
      return;
    }

    axios
      .post(
        "http://localhost:8080/admin/process-request",
        { vehicleId, keycode: keycodes[vehicleId] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setPendingRequests(
          pendingRequests.filter((request) => request.id !== vehicleId)
        );
        fetchInProgressRequests();
        fetchTransactions();
      })
      .catch((error) =>
        handleApiError(error, "Error processing keycode request.")
      );
  };

  const handleKeycodeChange = (vehicleId, value) => {
    setKeycodes((prev) => ({ ...prev, [vehicleId]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const updateRequestStatus = (vehicleId) => {
    //alert("Start button clicked");
    axios
      .post(
        "http://localhost:8080/admin/update-request-status/"+vehicleId,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Status updated to In Progress")
         fetchPendingRequests();
         fetchInProgressRequests();
         fetchTransactions();
         
      })
      .catch((error) =>
        handleApiError(error, "Error Update Request Status.")
      );
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      {isLoading && <p className="loading-text">Loading...</p>}

      <div className="filter-section">
        <h2>Filter Transactions</h2>
        <div className="filters">
          <input
            type="text"
            name="search"
            placeholder="Search (e.g., VIN or Confirmation)"
            value={filters.search}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-dropdown"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="INPROGRESS">In Progress</option>
            <option value="FULFILLED">Fulfilled</option>
          </select>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="filter-dropdown"
          >
            <option value="">Sort By</option>
            <option value="confirmationnumber">Confirmation Number</option>
            <option value="status">Status</option>
          </select>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            className="filter-dropdown"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Subscriptions Section */}
        <section className="dashboard-card">
          <h2>Subscriptions</h2>
          {subscriptions.length === 0 ? (
            <p>No subscriptions available.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Subscription ID</th>
                  <th>Tier</th>
                  <th>User Email</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td>{subscription.id}</td>
                    <td>{subscription.tier}</td>
                    <td>{subscription.userEmail || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Pending Requests Section */}
        <section className="dashboard-card pending-requests">
          <h2>Pending Requests</h2>
          {pendingRequests.length === 0 ? (
            <p className="no-requests">No pending requests at the moment.</p>
          ) : (
            <div className="pending-grid">
              {pendingRequests.map((request) => (
                <div className="pending-card" key={request.id}>
                  <div className="pending-card-header">
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <h3>
                      {request.make} {request.model}
                    </h3>
                    <button className="start-button"
                            onClick={() => updateRequestStatus(request.id)}>
                      Start
                    </button>
                    </div>
                    <p>
                      VIN: <strong>{request.vin}</strong>
                    </p>
                    <p>
                      Email:{" "}
                      <strong>{request.keycodeUserEmail || "N/A"}</strong>{" "}
                      <span
                        className={
                          request.isValidatedUser
                            ? "validated-status"
                            : "unvalidated-status"
                        }
                      >
                        {request.isValidatedUser ? "Validated" : "Unvalidated"}
                      </span>
                    </p>
                  </div>
                  <div className="pending-card-images">
                    <img
                      src={request.frontId}
                      alt="Front ID"
                      className="vehicle-image"
                      onClick={() => openModal(request.frontId)}
                    />
                    <img
                      src={request.backId}
                      alt="Back ID"
                      className="vehicle-image"
                      onClick={() => openModal(request.backId)}
                    />
                    <img
                      src={request.registration}
                      alt="Registration"
                      className="vehicle-image"
                      onClick={() => openModal(request.registration)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* In Progress Requests Section */}
        <section className="dashboard-card in-progress-requests">
          <h2>In Progress Requests</h2>
          {inProgressRequests.length === 0 ? (
            <p className="no-requests">No In Progress Requests at the moment.</p>
          ) : (
            <div className="in-progress-grid">
              {inProgressRequests.map((request) => (
                <div className="in-progress-card" key={request.id}>
                  <div className="pending-card-header">
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <h3 style={{paddingLeft:'5em'}}>
                      {request.make} {request.model}
                    </h3>

                    </div>
                    <p>
                      VIN: <strong>{request.vin}</strong>
                    </p>
                    <p>
                      Email:{" "}
                      <strong>{request.keycodeUserEmail || "N/A"}</strong>{" "}
                      <span
                        className={
                          request.isValidatedUser
                            ? "validated-status"
                            : "unvalidated-status"
                        }
                      >
                        {request.isValidatedUser ? "Validated" : "Unvalidated"}
                      </span>
                    </p>
                  </div>
                  <div className="pending-card-images">
                    <img
                      src={request.frontId}
                      alt="Front ID"
                      className="vehicle-image"
                      onClick={() => openModal(request.frontId)}
                    />
                    <img
                      src={request.backId}
                      alt="Back ID"
                      className="vehicle-image"
                      onClick={() => openModal(request.backId)}
                    />
                    <img
                      src={request.registration}
                      alt="Registration"
                      className="vehicle-image"
                      onClick={() => openModal(request.registration)}
                    />
                  </div>
                  <div className="pending-card-input">
                    <input
                      type="text"
                      value={keycodes[request.id] || ""}
                      onChange={(e) =>
                        handleKeycodeChange(request.id, e.target.value)
                      }
                      placeholder="Enter Keycode"
                      className="keycode-input"
                    />
                    <button
                      onClick={() => handleProcessRequest(request.id)}
                      className="process-button"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Transactions Section */}
        <section className="dashboard-card">
          <h2>Transactions</h2>
          {transactions.length === 0 ? (
            <p>No transactions available.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Confirmation Number</th>
                  <th>Status</th>
                  <th>Vehicles</th>
                  <th>Keycodes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.confirmationNumber}</td>
                    <td>{transaction.status}</td>
                    <td>
                      {transaction.vehicles.map((vehicle) => (
                        <div key={vehicle.id}>
                          {vehicle.make} {vehicle.model} (VIN: {vehicle.vin})
                        </div>
                      ))}
                    </td>
                    <td>
                      {transaction.vehicles.map((vehicle) => (
                        <div key={vehicle.id}>
                          {vehicle.keycode ? vehicle.keycode : "Not Provided"}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {modalImage && (
        <ModalContent 
          modalImage={modalImage} 
          closeModal={closeModal} 
        />
      )}
    </div>
  );
}

export default AdminDashboard;
