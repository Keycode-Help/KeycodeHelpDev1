import React, { useState, useEffect } from "react";
import api from "../services/request";
import { ModalContent } from "../components/ModalContent";
import { Search, Filter, Layers, Clock, CheckCircle2 } from "lucide-react";

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
  const [requestTimers, setRequestTimers] = useState({});

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
      .then((response) => {
        setPendingRequests(response.data);
        // initialize timers for pending requests if not present
        setRequestTimers((prev) => {
          const next = { ...prev };
          response.data.forEach((r) => {
            if (!next[r.id]) {
              next[r.id] = { startedAt: Date.now(), status: "PENDING" };
            }
          });
          return next;
        });
      })
      .catch((error) =>
        handleApiError(error, "Error fetching pending requests.")
      )
      .finally(() => setIsLoading(false));
  };

  const fetchInProgressRequests = () => {
    setIsLoading(true);
    api
      .get("/admin/in-progress-requests")
      .then((response) => {
        setInProgressRequests(response.data);
        setRequestTimers((prev) => {
          const next = { ...prev };
          response.data.forEach((r) => {
            if (!next[r.id]) {
              next[r.id] = { startedAt: Date.now(), status: "INPROGRESS" };
            } else {
              next[r.id].status = "INPROGRESS";
            }
          });
          return next;
        });
      })
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
        setRequestTimers((prev) => ({
          ...prev,
          [vehicleId]: { startedAt: Date.now(), status: "INPROGRESS" },
        }));
      })
      .catch((error) => handleApiError(error, "Error Update Request Status."));
  };

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#0d0f1a] to-[#121524] p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-400">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-gray-300">
                  Operate requests, subscriptions and transactions
                </p>
              </div>
            </div>
            {isLoading && (
              <span className="text-sm text-gray-400">Loading...</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-black/30 p-4 flex items-center gap-3 backdrop-blur supports-[backdrop-filter]:bg-black/40">
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
          <div className="rounded-2xl border border-neutral-800 bg-black/30 p-4 flex items-center gap-3 backdrop-blur supports-[backdrop-filter]:bg-black/40">
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
          <div className="rounded-2xl border border-neutral-800 bg-black/30 p-4 flex items-center gap-3 backdrop-blur supports-[backdrop-filter]:bg-black/40">
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
            <div className="rounded-2xl border border-neutral-800 bg-black/30 p-3 text-center backdrop-blur supports-[backdrop-filter]:bg-black/40">
              <div className="text-gray-400 text-xs">Pending</div>
              <div className="text-white text-lg font-semibold flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                {pendingRequests.length}
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/30 p-3 text-center backdrop-blur supports-[backdrop-filter]:bg-black/40">
              <div className="text-gray-400 text-xs">In Progress</div>
              <div className="text-white text-lg font-semibold">
                {inProgressRequests.length}
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/30 p-3 text-center backdrop-blur supports-[backdrop-filter]:bg-black/40">
              <div className="text-gray-400 text-xs">Transactions</div>
              <div className="text-white text-lg font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {transactions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscriptions */}
          <section className="rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40">
            <h2 className="text-white font-semibold text-lg mb-3">
              Subscriptions
            </h2>
            {subscriptions.length === 0 ? (
              <p className="text-gray-400">No subscriptions available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="text-left py-2">ID</th>
                      <th className="text-left py-2">Tier</th>
                      <th className="text-left py-2">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((s) => (
                      <tr key={s.id} className="border-t border-neutral-800">
                        <td className="py-2">{s.id}</td>
                        <td className="py-2">{s.tier}</td>
                        <td className="py-2">
                          {s.userEmail || "User Inactive"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Pending Requests */}
          <section className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40">
            <h2 className="text-white font-semibold text-lg mb-3">
              Pending Requests
            </h2>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-400">
                No pending requests at the moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pendingRequests.map((request) => (
                  <div
                    className="rounded-2xl border border-neutral-800 bg-black/40 p-4 hover:border-neutral-700 transition-colors"
                    key={request.id}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-white font-semibold">
                        {request.make || "Unknown Make"} {request.model}
                      </h3>
                      <span className="text-xs text-gray-400 ml-2">
                        Waiting:{" "}
                        {Math.floor(
                          (Date.now() -
                            (requestTimers[request.id]?.startedAt ||
                              Date.now())) /
                            1000 /
                            60
                        )}
                        m
                      </span>
                      <button
                        className="rounded-xl bg-yellow-500/90 hover:bg-yellow-500 text-black font-semibold px-3 py-1.5"
                        onClick={() => updateRequestStatus(request.id)}
                      >
                        Start
                      </button>
                    </div>
                    <p className="text-gray-300">
                      VIN:{" "}
                      <span className="text-white font-medium">
                        {request.vin}
                      </span>
                    </p>
                    <p className="text-gray-300">
                      Price:{" "}
                      <span className="text-white font-medium">
                        ${request.price}
                      </span>
                    </p>
                    <p className="text-gray-300">
                      Email:{" "}
                      <span className="text-white font-medium">
                        {request.keycodeUserEmail || "N/A"}
                      </span>{" "}
                      <span
                        className={
                          request.isValidatedUser
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {request.isValidatedUser ? "Validated" : "Unvalidated"}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <img
                        src={request.frontId}
                        alt="Front ID"
                        className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                        onClick={() => openModal(request.frontId)}
                      />
                      <img
                        src={request.backId}
                        alt="Back ID"
                        className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                        onClick={() => openModal(request.backId)}
                      />
                      <img
                        src={request.registration}
                        alt="Registration"
                        className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                        onClick={() => openModal(request.registration)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Transactions */}
          <section className="rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40">
            <h2 className="text-white font-semibold text-lg mb-3">
              Transactions
            </h2>
            {transactions.length === 0 ? (
              <p className="text-gray-400">No transactions available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="text-left py-2">Confirmation</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Vehicles</th>
                      <th className="text-left py-2">Keycodes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="border-t border-neutral-800 align-top"
                      >
                        <td className="py-2">{t.confirmationNumber}</td>
                        <td className="py-2">{t.status}</td>
                        <td className="py-2">
                          {t.vehicles.map((v) => (
                            <div key={v.id}>
                              {v.make?.manufacturerName || "Unknown Make"}{" "}
                              {v.model} (VIN: {v.vin})
                            </div>
                          ))}
                        </td>
                        <td className="py-2">
                          {t.vehicles.map((v) => (
                            <div key={v.id}>
                              {v.keycode ? v.keycode : "Not Provided"}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* In Progress */}
          <section className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40">
            <h2 className="text-white font-semibold text-lg mb-3">
              In Progress Requests
            </h2>
            {inProgressRequests.length === 0 ? (
              <p className="text-gray-400">
                No In Progress Requests at the moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {inProgressRequests.map((request) => (
                  <div
                    className="rounded-2xl border border-neutral-800 bg-black/40 p-4 hover:border-neutral-700 transition-colors"
                    key={request.id}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-white font-semibold">
                        {request.make || "Unknown Make"} {request.model}
                      </h3>
                      <span className="text-xs text-gray-400">
                        In progress:{" "}
                        {Math.floor(
                          (Date.now() -
                            (requestTimers[request.id]?.startedAt ||
                              Date.now())) /
                            1000 /
                            60
                        )}
                        m
                      </span>
                    </div>
                    <p className="text-gray-300">
                      VIN:{" "}
                      <span className="text-white font-medium">
                        {request.vin}
                      </span>
                    </p>
                    <p className="text-gray-300">
                      Price:{" "}
                      <span className="text-white font-medium">
                        ${request.price}
                      </span>
                    </p>
                    <p className="text-gray-300">
                      Email:{" "}
                      <span className="text-white font-medium">
                        {request.keycodeUserEmail || "N/A"}
                      </span>{" "}
                      <span
                        className={
                          request.isValidatedUser
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {request.isValidatedUser ? "Validated" : "Unvalidated"}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <img
                        src={request.frontId}
                        alt="Front ID"
                        className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                        onClick={() => openModal(request.frontId)}
                      />
                      <img
                        src={request.backId}
                        alt="Back ID"
                        className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                        onClick={() => openModal(request.backId)}
                      />
                      <img
                        src={request.registration}
                        alt="Registration"
                        className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                        onClick={() => openModal(request.registration)}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        value={keycodes[request.id] || ""}
                        onChange={(e) =>
                          handleKeycodeChange(request.id, e.target.value)
                        }
                        placeholder="Enter Keycode"
                        className="flex-1 rounded-xl bg-black/30 border border-neutral-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <input
                        type="text"
                        value={pin[request.id] || ""}
                        onChange={(e) =>
                          handlePinChange(request.id, e.target.value)
                        }
                        placeholder="Enter Pin"
                        className="flex-1 rounded-xl bg-black/30 border border-neutral-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <button
                        onClick={() => handleProcessRequest(request.id)}
                        className="rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-black font-semibold px-3 py-2"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {modalImage && (
          <ModalContent modalImage={modalImage} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
