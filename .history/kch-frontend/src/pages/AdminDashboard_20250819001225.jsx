import React, { useState, useEffect } from "react";
import api from "../services/request";
import { ModalContent } from "../components/ModalContent";
import { Search, Filter, Layers, Clock, CheckCircle2 } from "lucide-react";
import "../styles/adminDashboard.css"; // Import the CSS file

function AdminDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [keycodes, setKeycodes] = useState({});
  const [pin, setPin] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    sortBy: "",
    sortOrder: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [inProgressRequests, setInProgressRequests] = useState([]);

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
    api
      .get("/admin/pending-requests")
      .then((response) => setPendingRequests(response.data))
      .catch((error) =>
        handleApiError(error, "Error fetching pending requests.")
      )
      .finally(() => setIsLoading(false));
  };

  const fetchInProgressRequests = () => {
    setIsLoading(true);
    api
      .get("/admin/in-progress-requests")
      .then((response) => setInProgressRequests(response.data))
      .catch((error) =>
        handleApiError(error, "Error fetching In Progress requests.")
      )
      .finally(() => setIsLoading(false));
  };

  const fetchSubscriptions = () => {
    api
      .get("/admin/subscriptions")
      .then((response) => setSubscriptions(response.data))
      .catch((error) => handleApiError(error, "Error fetching subscriptions."));
  };

  const fetchTransactions = () => {
    const { status, search, sortBy, sortOrder } = filters;
    const query = new URLSearchParams({ status, search, sortBy, sortOrder });

    api
      .get(`/admin/transactions?${query}`)
      .then((response) => setTransactions(response.data))
      .catch((error) => handleApiError(error, "Error fetching transactions."));
  };

  const handleProcessRequest = (vehicleId) => {
    if (!keycodes[vehicleId]) {
      alert("Please enter a keycode before submitting.");
      return;
    }

    api
      .post("/admin/process-request", {
        vehicleId,
        keycode: keycodes[vehicleId],
        pincode: pin[vehicleId],
      })
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

  const handlePinChange = (vehicleId, value) => {
    setPin((prev) => ({ ...prev, [vehicleId]: value }));
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
    api
      .post(`/admin/update-request-status/${vehicleId}`)
      .then(() => {
        alert("Status updated to In Progress");
        fetchPendingRequests();
        fetchInProgressRequests();
        fetchTransactions();
      })
      .catch((error) => handleApiError(error, "Error Update Request Status."));
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      {isLoading && <p className="loading-text">Loading...</p>}

      {/* Modern header */}
      <div className="mx-auto max-w-7xl w-full px-4 md:px-6">
        <div className="mb-6 rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#0d0f1a] to-[#121524] p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-400">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Admin Console</h2>
                <p className="text-gray-300">Operate requests, subscriptions and transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-black/30 p-4 flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search VIN or Confirmation"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-black/30 p-4 flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full bg-transparent border border-neutral-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="INPROGRESS">In Progress</option>
              <option value="FULFILLED">Fulfilled</option>
            </select>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-black/30 p-4 flex items-center gap-3">
            <span className="text-gray-400">Sort</span>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full bg-transparent border border-neutral-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">None</option>
              <option value="confirmationnumber">Confirmation</option>
              <option value="status">Status</option>
            </select>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="w-full bg-transparent border border-neutral-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-neutral-800 bg-black/30 p-3 text-center">
              <div className="text-gray-400 text-xs">Pending</div>
              <div className="text-white text-lg font-semibold flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />{pendingRequests.length}
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/30 p-3 text-center">
              <div className="text-gray-400 text-xs">In Progress</div>
              <div className="text-white text-lg font-semibold">{inProgressRequests.length}</div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/30 p-3 text-center">
              <div className="text-gray-400 text-xs">Transactions</div>
              <div className="text-white text-lg font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />{transactions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
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
                    <td>{subscription.userEmail || "User Inactive"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="dashboard-card pending-requests">
          <h2>Pending Requests</h2>
          {pendingRequests.length === 0 ? (
            <p className="no-requests">No pending requests at the moment.</p>
          ) : (
            <div className="pending-grid">
              {pendingRequests.map((request) => (
                <div className="pending-card" key={request.id}>
                  <div className="pending-card-header">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3>
                        {request.make || "Unknown Make"} {request.model}
                      </h3>
                      <button
                        className="start-button"
                        onClick={() => updateRequestStatus(request.id)}
                      >
                        Start
                      </button>
                    </div>
                    <p>
                      VIN: <strong>{request.vin}</strong>
                    </p>
                    <p>
                      Price: <strong>${request.price}</strong>
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

        <section className="dashboard-card in-progress-requests">
          <h2>In Progress Requests</h2>
          {inProgressRequests.length === 0 ? (
            <p className="no-requests">
              No In Progress Requests at the moment.
            </p>
          ) : (
            <div className="in-progress-grid">
              {inProgressRequests.map((request) => (
                <div className="in-progress-card" key={request.id}>
                  <div className="pending-card-header">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3>
                        {request.make || "Unknown Make"} {request.model}
                      </h3>
                    </div>
                    <p>
                      VIN: <strong>{request.vin}</strong>
                    </p>
                    <p>
                      Price: <strong>${request.price}</strong>
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
                    <input
                      type="text"
                      value={pin[request.id] || ""}
                      onChange={(e) =>
                        handlePinChange(request.id, e.target.value)
                      }
                      placeholder="Enter Pin"
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
                          {vehicle.make?.manufacturerName || "Unknown Make"}{" "}
                          {vehicle.model} (VIN: {vehicle.vin})
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
        <ModalContent modalImage={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
}

export default AdminDashboard;
