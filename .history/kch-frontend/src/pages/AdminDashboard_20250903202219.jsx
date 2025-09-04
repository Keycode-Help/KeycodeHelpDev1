import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import { ModalContent } from "../components/ModalContent";
import {
  Search,
  Filter,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

function AdminDashboard() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [keycodes, setKeycodes] = useState({});
  const [pin, setPin] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [validatedUsers, setValidatedUsers] = useState([]);
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
  const [error, setError] = useState(null);

  const [showKeycodes, setShowKeycodes] = useState({});

  const handleApiError = (error, defaultMessage) => {
    console.error(error);
    const errorMessage = error.response?.data?.message || defaultMessage;
    setError(errorMessage);

    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  const clearError = () => {
    setError(null);
  };

  const retryFetch = () => {
    setError(null);
    fetchPendingRequests();
    fetchSubscriptions();
    fetchTransactions();
    fetchInProgressRequests();
  };

  useEffect(() => {
    if (user) {
      fetchPendingRequests();
      fetchSubscriptions();
      fetchTransactions();
      fetchInProgressRequests();
    }
  }, [
    user,
    filters,
    fetchPendingRequests,
    fetchSubscriptions,
    fetchTransactions,
    fetchInProgressRequests,
  ]);

  const fetchPendingRequests = useCallback(() => {
    setIsLoading(true);
    setError(null);
    api
      .get("/admin/pending-requests")
      .then((response) => {
        setPendingRequests(response.data || []);
        // initialize timers for pending requests if not present
        setRequestTimers((prev) => {
          const next = { ...prev };
          (response.data || []).forEach((r) => {
            if (!next[r.id]) {
              next[r.id] = { startedAt: Date.now(), status: "PENDING" };
            }
          });
          return next;
        });
      })
      .catch((error) => {
        console.error("Failed to fetch pending requests:", error);
        if (error.response?.status === 403) {
          handleApiError(
            error,
            "Access denied. You may not have admin privileges or your session has expired."
          );
        } else {
          handleApiError(
            error,
            "Error fetching pending requests. Please try again."
          );
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const fetchInProgressRequests = useCallback(() => {
    setIsLoading(true);
    api
      .get("/admin/in-progress-requests")
      .then((response) => {
        setInProgressRequests(response.data || []);
        setRequestTimers((prev) => {
          const next = { ...prev };
          (response.data || []).forEach((r) => {
            if (!next[r.id]) {
              next[r.id] = { startedAt: Date.now(), status: "INPROGRESS" };
            } else {
              next[r.id].status = "INPROGRESS";
            }
          });
          return next;
        });
      })
      .catch((error) => {
        console.error("Failed to fetch in-progress requests:", error);
        if (error.response?.status === 403) {
          handleApiError(
            error,
            "Access denied. You may not have admin privileges or your session has expired."
          );
        } else {
          handleApiError(
            error,
            "Error fetching In Progress requests. Please try again."
          );
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const fetchSubscriptions = useCallback(() => {
    api
      .get("/admin/subscriptions")
      .then((response) => setSubscriptions(response.data || []))
      .catch((error) => {
        console.error("Failed to fetch subscriptions:", error);
        if (error.response?.status === 403) {
          handleApiError(
            error,
            "Access denied. You may not have admin privileges or your session has expired."
          );
        } else {
          handleApiError(
            error,
            "Error fetching subscriptions. Please try again."
          );
        }
      });
  }, []);

  const fetchTransactions = useCallback(() => {
    const { status, search, sortBy, sortOrder } = filters;
    const query = new URLSearchParams({ status, search, sortBy, sortOrder });

    api
      .get(`/admin/transactions?${query}`)
      .then((response) => setTransactions(response.data || []))
      .catch((error) => {
        console.error("Failed to fetch transactions:", error);
        if (error.response?.status === 403) {
          handleApiError(
            error,
            "Access denied. You may not have admin privileges or your session has expired."
          );
        } else {
          handleApiError(
            error,
            "Error fetching transactions. Please try again."
          );
        }
      });
  }, [filters]);

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

  const toggleKeycodeVisibility = (requestId) => {
    setShowKeycodes((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
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

  // Show loading state if user is not authenticated
  if (!user) {
    return (
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
          <div className="mb-6 rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#0d0f1a] to-[#121524] p-6 shadow-2xl">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 mb-4">
                  <Layers className="h-8 w-8 mx-auto" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-300">
                  Please log in to access the admin dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-red-400 font-semibold">Error</h3>
                  <p className="text-gray-300 text-sm">{error}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={retryFetch}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                <button
                  onClick={clearError}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                <Layers className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-300 text-lg">
                  Manage requests, subscriptions and transactions
                </p>
              </div>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <Search className="h-5 w-5 text-blue-400" />
            <input
              type="text"
              name="search"
              placeholder="Search VIN or Confirmation"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <Filter className="h-5 w-5 text-blue-400" />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              style={{ colorScheme: "dark" }}
            >
              <option value="" className="bg-slate-800 text-white">
                All Statuses
              </option>
              <option value="PENDING" className="bg-slate-800 text-white">
                Pending
              </option>
              <option value="INPROGRESS" className="bg-slate-800 text-white">
                In Progress
              </option>
              <option value="FULFILLED" className="bg-slate-800 text-white">
                Fulfilled
              </option>
            </select>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <span className="text-blue-400 font-medium">Sort</span>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              style={{ colorScheme: "dark" }}
            >
              <option value="" className="bg-slate-800 text-white">
                None
              </option>
              <option
                value="confirmationnumber"
                className="bg-slate-800 text-white"
              >
                Confirmation
              </option>
              <option value="status" className="bg-slate-800 text-white">
                Status
              </option>
            </select>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              style={{ colorScheme: "dark" }}
            >
              <option value="asc" className="bg-slate-800 text-white">
                Asc
              </option>
              <option value="desc" className="bg-slate-800 text-white">
                Desc
              </option>
            </select>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-gray-400 text-xs font-medium mb-1">
                Pending
              </div>
              <div className="text-white text-xl font-bold flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                {pendingRequests.length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-gray-400 text-xs font-medium mb-1">
                In Progress
              </div>
              <div className="text-white text-xl font-bold flex items-center justify-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-400" />
                {inProgressRequests.length}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 text-center shadow-lg">
              <div className="text-gray-400 text-xs font-medium mb-1">
                Transactions
              </div>
              <div className="text-white text-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                {transactions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscriptions */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-white font-bold text-xl">Subscriptions</h2>
            </div>
            {subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">No subscriptions available.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 text-gray-400 font-semibold">
                        ID
                      </th>
                      <th className="text-left py-3 text-gray-400 font-semibold">
                        Tier
                      </th>
                      <th className="text-left py-3 text-gray-400 font-semibold">
                        User
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors duration-200"
                      >
                        <td className="py-3 text-white font-medium">{s.id}</td>
                        <td className="py-3">
                          <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                            {s.tier}
                          </span>
                        </td>
                        <td className="py-3 text-gray-300">
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
          <section className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-white font-bold text-xl">Pending Requests</h2>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">
                  No pending requests at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pendingRequests.map((request) => (
                  <div
                    className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-5 hover:border-slate-500 transition-all duration-300 shadow-lg"
                    key={request.id}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">
                          {request.make || "Unknown Make"} {request.model}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>
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
                        </div>
                      </div>
                      <button
                        className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg"
                        onClick={() => updateRequestStatus(request.id)}
                      >
                        Start
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">VIN:</span>
                        <span className="text-white font-medium text-sm">
                          {request.vin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Price:</span>
                        <span className="text-white font-medium text-sm">
                          ${request.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Email:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">
                            {request.keycodeUserEmail || "N/A"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.isValidatedUser
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {request.isValidatedUser
                              ? "Validated"
                              : "Unvalidated"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <img
                        src={request.frontId}
                        alt="Front ID"
                        className="w-20 h-20 object-cover rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors duration-200"
                        onClick={() => openModal(request.frontId)}
                      />
                      <img
                        src={request.backId}
                        alt="Back ID"
                        className="w-20 h-20 object-cover rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors duration-200"
                        onClick={() => openModal(request.backId)}
                      />
                      <img
                        src={request.registration}
                        alt="Registration"
                        className="w-20 h-20 object-cover rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors duration-200"
                        onClick={() => openModal(request.registration)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Transactions */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-white font-bold text-xl">Transactions</h2>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">No transactions available.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 text-gray-400 font-semibold">
                        Confirmation
                      </th>
                      <th className="text-left py-3 text-gray-400 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 text-gray-400 font-semibold">
                        Vehicles
                      </th>
                      <th className="text-left py-3 text-gray-400 font-semibold">
                        Keycodes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors duration-200 align-top"
                      >
                        <td className="py-3 text-white font-medium">
                          {t.confirmationNumber}
                        </td>
                        <td className="py-3">
                          <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-300">
                          {t.vehicles.map((v) => (
                            <div key={v.id} className="mb-1">
                              {v.make?.manufacturerName || "Unknown Make"}{" "}
                              {v.model} (VIN: {v.vin})
                            </div>
                          ))}
                        </td>
                        <td className="py-3 text-gray-300">
                          {t.vehicles.map((v) => (
                            <div key={v.id} className="mb-1">
                              {v.keycode ? (
                                <span className="font-mono text-sm bg-slate-700/50 px-2 py-1 rounded border border-slate-600">
                                  {v.keycode}
                                </span>
                              ) : (
                                <span className="text-gray-500 italic">
                                  Not Provided
                                </span>
                              )}
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
          <section className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-white font-bold text-xl">
                In Progress Requests
              </h2>
            </div>
            {inProgressRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">
                  No In Progress Requests at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {inProgressRequests.map((request) => (
                  <div
                    className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-5 hover:border-slate-500 transition-all duration-300 shadow-lg"
                    key={request.id}
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">
                            {request.make || "Unknown Make"} {request.model}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <RefreshCw className="w-4 h-4" />
                            <span>
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
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">VIN:</span>
                          <span className="text-white font-medium text-sm">
                            {request.vin}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Price:</span>
                          <span className="text-white font-medium text-sm">
                            ${request.price}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Email:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium text-sm">
                              {request.keycodeUserEmail || "N/A"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.isValidatedUser
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-red-500/20 text-red-300 border border-red-500/30"
                              }`}
                            >
                              {request.isValidatedUser
                                ? "Validated"
                                : "Unvalidated"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <img
                          src={request.frontId}
                          alt="Front ID"
                          className="w-20 h-20 object-cover rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors duration-200"
                          onClick={() => openModal(request.frontId)}
                        />
                        <img
                          src={request.backId}
                          alt="Back ID"
                          className="w-20 h-20 object-cover rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors duration-200"
                          onClick={() => openModal(request.backId)}
                        />
                        <img
                          src={request.registration}
                          alt="Registration"
                          className="w-20 h-20 object-cover rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition-colors duration-200"
                          onClick={() => openModal(request.registration)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type={showKeycodes[request.id] ? "text" : "password"}
                          value={keycodes[request.id] || ""}
                          onChange={(e) =>
                            handleKeycodeChange(request.id, e.target.value)
                          }
                          placeholder="Enter Keycode"
                          className="flex-1 bg-slate-800/50 border border-slate-600 text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                        <button
                          onClick={() => toggleKeycodeVisibility(request.id)}
                          className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
                          title={
                            showKeycodes[request.id]
                              ? "Hide keycode"
                              : "Show keycode"
                          }
                        >
                          {showKeycodes[request.id] ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pin[request.id] || ""}
                        onChange={(e) =>
                          handlePinChange(request.id, e.target.value)
                        }
                        placeholder="Enter Pin"
                        className="w-full bg-slate-800/50 border border-slate-600 text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                      <button
                        onClick={() => handleProcessRequest(request.id)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg"
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
