import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin } from "../utils/roles";
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
  FileText,
} from "lucide-react";

function AdminDashboard() {
  const { user, userRole } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [keycodes, setKeycodes] = useState({});
  const [pin, setPin] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
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
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  const [showKeycodes, setShowKeycodes] = useState({});

  // Check admin access
  useEffect(() => {
    if (userRole) {
      const hasAccess = canSeeAdmin(userRole);
      setHasAdminAccess(hasAccess);
      console.log("Admin access check:", { userRole, hasAccess });
      if (!hasAccess) {
        setError("Access denied. You don't have admin privileges.");
      }
    } else {
      console.log("No user role available yet");
    }
  }, [userRole]);

  const handleApiError = (error, defaultMessage) => {
    console.error(error);

    let errorMessage = defaultMessage;

    if (error.response?.status === 403) {
      errorMessage =
        "Access denied. You don't have admin privileges or your session has expired.";
    } else if (error.response?.status === 401) {
      errorMessage = "Authentication required. Please log in again.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    setError(errorMessage);

    // Auto-clear error after 8 seconds for better UX
    setTimeout(() => setError(null), 8000);
  };

  const clearError = () => {
    setError(null);
  };

  const fetchPendingRequests = useCallback(() => {
    if (!hasAdminAccess) {
      console.log("Skipping fetchPendingRequests - no admin access");
      return;
    }

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
  }, [hasAdminAccess]);

  const fetchInProgressRequests = useCallback(() => {
    if (!hasAdminAccess) {
      console.log("Skipping fetchInProgressRequests - no admin access");
      return;
    }

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
  }, [hasAdminAccess]);

  const fetchSubscriptions = useCallback(() => {
    if (!hasAdminAccess) {
      console.log("Skipping fetchSubscriptions - no admin access");
      return;
    }

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
  }, [hasAdminAccess]);

  const fetchTransactions = useCallback(() => {
    if (!hasAdminAccess) {
      console.log("Skipping fetchTransactions - no admin access");
      return;
    }

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
  }, [filters, hasAdminAccess]);

  const fetchPendingUsers = useCallback(() => {
    api
      .get("/user-approval/pending", {
        params: { adminEmail: user?.email },
      })
      .then((response) => setPendingUsers(response.data || []))
      .catch((error) => {
        console.error("Failed to fetch pending users:", error);
        if (error.response?.status === 403) {
          handleApiError(
            error,
            "Access denied. You may not have admin privileges or your session has expired."
          );
        } else {
          handleApiError(
            error,
            "Error fetching pending user registrations. Please try again."
          );
        }
      });
  }, [user?.email]);

  const fetchValidatedUsers = useCallback(() => {
    api
      .get("/user-approval/validated", {
        params: { adminEmail: user?.email },
      })
      .then((response) => {
        // Handle validated users response if needed
        console.log("Validated users:", response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch validated users:", error);
        if (error.response?.status === 403) {
          handleApiError(
            error,
            "Access denied. You may not have admin privileges or your session has expired."
          );
        } else {
          handleApiError(
            error,
            "Error fetching validated users. Please try again."
          );
        }
      });
  }, [user?.email]);

  const retryFetch = () => {
    setError(null);
    fetchPendingRequests();
    fetchSubscriptions();
    fetchTransactions();
    fetchInProgressRequests();
    fetchPendingUsers();
    fetchValidatedUsers();
  };

  useEffect(() => {
    if (user && hasAdminAccess) {
      const fetchData = async () => {
        try {
          await Promise.all([
            fetchPendingRequests(),
            fetchSubscriptions(),
            fetchTransactions(),
            fetchInProgressRequests(),
            fetchPendingUsers(),
            fetchValidatedUsers(),
          ]);
        } catch (error) {
          console.error("Error fetching admin data:", error);
          // If we get 403 errors, it might mean the user doesn't actually have admin access
          if (error.response?.status === 403) {
            setError(
              "Access denied. Your admin privileges may have been revoked."
            );
            setHasAdminAccess(false);
          }
        }
      };

      fetchData();
    }
  }, [
    user,
    hasAdminAccess,
    filters,
    fetchPendingRequests,
    fetchSubscriptions,
    fetchTransactions,
    fetchInProgressRequests,
    fetchPendingUsers,
    fetchValidatedUsers,
  ]);

  const handleApproveUser = (userId, notes) => {
    api
      .post("/user-approval/approve", {
        adminEmail: user?.email,
        userId: String(userId),
        approvalNotes: notes || "Approved by admin",
      })
      .then(() => {
        alert("User account approved successfully!");
        fetchPendingUsers();
        fetchValidatedUsers();
      })
      .catch((error) => {
        console.error("Error approving user:", error);
        alert("Failed to approve user account");
      });
  };

  const handleRejectUser = (userId, notes) => {
    api
      .post("/user-approval/reject", {
        adminEmail: user?.email,
        userId: String(userId),
        rejectionNotes: notes || "Rejected by admin",
      })
      .then(() => {
        alert("User account rejected successfully!");
        fetchPendingUsers();
        fetchValidatedUsers();
      })
      .catch((error) => {
        console.error("Error rejecting user:", error);
        alert("Failed to reject user account");
      });
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
                <div className="rounded-2xl bg-slate-700/50 p-4 text-emerald-400 mb-4">
                  <Layers className="h-8 w-8 mx-auto" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-white">
                  Please log in to access the admin dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have admin privileges
  if (user && !hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
          <div className="mb-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-3xl flex items-center justify-center shadow-lg">
                  <Layers className="h-10 w-10 text-red-400" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
                    Access Denied
                  </h1>
                  <p className="text-white text-xl font-medium">
                    You don&apos;t have admin privileges to access this
                    dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-8 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
                <Layers className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Admin Access Required
              </h2>
              <p className="text-white text-lg mb-6">
                This dashboard is only accessible to users with admin or super
                admin privileges.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  Your current role:{" "}
                  <span className="text-white font-semibold">
                    {userRole || "Unknown"}
                  </span>
                </p>
                <p>
                  Required roles:{" "}
                  <span className="text-white font-semibold">
                    ADMIN or SUPER_ADMIN
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
      style={{
        background:
          "linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a) !important",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-red-400 font-semibold">Error</h3>
                  <p className="text-white text-sm">{error}</p>
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
                  className="text-gray-600 hover:text-white transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-3xl flex items-center justify-center shadow-lg">
                <Layers className="h-10 w-10 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                  Admin Dashboard
                </h1>
                <p
                  className="text-white text-xl font-medium"
                  style={{ color: "#ffffff !important" }}
                >
                  Manage requests, subscriptions and transactions
                </p>
              </div>
            </div>
            {isLoading && (
              <div className="flex items-center gap-3 text-blue-400 bg-blue-500/10 px-4 py-3 rounded-2xl border border-blue-500/20">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-base font-semibold">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls & Stats */}
        <div className="mb-10 space-y-8">
          {/* Search and Filter Controls */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <Filter className="h-4 w-4 text-blue-400" />
              </div>
              Filters & Search
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-400" />
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  placeholder="Search VIN or Confirmation"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">
                  Status Filter
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-slate-800 text-white">
                    All Statuses
                  </option>
                  <option value="PENDING" className="bg-slate-800 text-white">
                    Pending
                  </option>
                  <option
                    value="INPROGRESS"
                    className="bg-slate-800 text-white"
                  >
                    In Progress
                  </option>
                  <option value="FULFILLED" className="bg-slate-800 text-white">
                    Fulfilled
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">
                  Sort Options
                </label>
                <div className="flex gap-2">
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="flex-1 bg-slate-800/50 border border-slate-600 text-white rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-20 bg-slate-800/50 border border-slate-600 text-white rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-white text-sm font-semibold mb-2">
                  Pending Requests
                </div>
                <div className="text-white text-3xl font-bold">
                  {pendingRequests.length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <div className="text-white text-sm font-semibold mb-2">
                  Pending Users
                </div>
                <div className="text-white text-3xl font-bold">
                  {pendingUsers.length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-white text-sm font-semibold mb-2">
                  In Progress
                </div>
                <div className="text-white text-3xl font-bold">
                  {inProgressRequests.length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="text-white text-sm font-semibold mb-2">
                  Transactions
                </div>
                <div className="text-white text-3xl font-bold">
                  {transactions.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subscriptions */}
            <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-2xl">
                    Subscriptions
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Active user subscriptions
                  </p>
                </div>
              </div>
              {subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-white">No subscriptions available.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 text-white font-semibold">
                          ID
                        </th>
                        <th className="text-left py-3 text-white font-semibold">
                          Tier
                        </th>
                        <th className="text-left py-3 text-white font-semibold">
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
                          <td className="py-3 text-white font-medium">
                            {s.id}
                          </td>
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
            <section className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-2xl">
                    Pending Requests
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Keycode requests awaiting processing
                  </p>
                </div>
              </div>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-white text-lg">
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
                          <div className="flex items-center gap-2 text-sm text-gray-600">
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
                          <span className="text-gray-600 text-sm">VIN:</span>
                          <span className="text-white font-medium text-sm">
                            {request.vin}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm">Price:</span>
                          <span className="text-white font-medium text-sm">
                            ${request.price}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Email:</span>
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
                    <CheckCircle2 className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-white">No transactions available.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 text-white font-semibold">
                          Confirmation
                        </th>
                        <th className="text-left py-3 text-white font-semibold">
                          Status
                        </th>
                        <th className="text-left py-3 text-white font-semibold">
                          Vehicles
                        </th>
                        <th className="text-left py-3 text-white font-semibold">
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
                    <RefreshCw className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-white text-lg">
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
                            <div className="flex items-center gap-2 text-sm text-gray-600">
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
                            <span className="text-gray-600 text-sm">VIN:</span>
                            <span className="text-white font-medium text-sm">
                              {request.vin}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-sm">
                              Price:
                            </span>
                            <span className="text-white font-medium text-sm">
                              ${request.price}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">
                              Email:
                            </span>
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
                            type={
                              showKeycodes[request.id] ? "text" : "password"
                            }
                            value={keycodes[request.id] || ""}
                            onChange={(e) =>
                              handleKeycodeChange(request.id, e.target.value)
                            }
                            placeholder="Enter Keycode"
                            className="flex-1 bg-slate-800/50 border border-slate-600 text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-600"
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
                              <EyeOff className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600" />
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
                          className="w-full bg-slate-800/50 border border-slate-600 text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-600"
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

          {/* Pending User Registrations - Moved outside grid for better width */}
          <section className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">
                  Pending User Registrations
                </h2>
                <p className="text-gray-300 text-sm">Users awaiting approval</p>
              </div>
            </div>
            {pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-white">No pending user registrations.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-slate-800/90 rounded-3xl p-8 mb-6 shadow-xl border border-slate-600 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* User Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-2xl mb-1">
                              {user.fname} {user.lname}
                            </h3>
                            <p className="text-gray-300 text-sm font-medium">
                              Pending Registration Approval
                            </p>
                          </div>
                        </div>

                        {/* User Details Grid */}
                        <div className="space-y-6 mb-8">
                          {/* Email - Full Width */}
                          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-4 h-4 bg-primary rounded-full"></div>
                              <span className="text-white text-sm font-semibold uppercase tracking-wide">
                                Email Address
                              </span>
                            </div>
                            <p className="text-white font-semibold text-lg break-all leading-relaxed">
                              {user.email}
                            </p>
                          </div>

                          {/* Other Details - Single Column Layout for Better Readability */}
                          <div className="space-y-4">
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-4 h-4 bg-success rounded-full"></div>
                                <span className="text-white text-sm font-semibold uppercase tracking-wide">
                                  Phone
                                </span>
                              </div>
                              <p className="text-white font-semibold text-base leading-relaxed">
                                {user.phone || "Not provided"}
                              </p>
                            </div>

                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-4 h-4 bg-warning rounded-full"></div>
                                <span className="text-white text-sm font-semibold uppercase tracking-wide">
                                  State
                                </span>
                              </div>
                              <p className="text-white font-semibold text-base leading-relaxed">
                                {user.state || "Not provided"}
                              </p>
                            </div>

                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-4 h-4 bg-accent rounded-full"></div>
                                <span className="text-white text-sm font-semibold uppercase tracking-wide">
                                  Industry
                                </span>
                              </div>
                              <p className="text-white font-semibold text-base leading-relaxed">
                                {user.industry || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:w-full">
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-gradient-to-r from-success to-success-dark text-white px-6 py-3 rounded-xl font-semibold hover:from-success-light hover:to-success focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                        >
                          <UserCheck className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectUser(user.id)}
                          className="bg-gradient-to-r from-error to-error-dark text-white px-6 py-3 rounded-xl font-semibold hover:from-error-light hover:to-error focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                        >
                          <UserX className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>

                    {/* Document Images Section */}
                    <div className="border-t border-slate-600 pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-dark rounded-xl flex items-center justify-center shadow-lg">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-white font-semibold text-lg">
                          Supporting Documents
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {user.frontId && (
                          <div className="group">
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-600 hover:border-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                              <img
                                src={user.frontId}
                                alt="Front ID"
                                className="w-full h-40 object-cover rounded-xl border border-slate-600 group-hover:border-slate-500 cursor-pointer transition-colors duration-200"
                                onClick={() => openModal(user.frontId)}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "block";
                                }}
                              />
                              <div className="hidden w-full h-40 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center">
                                <p className="text-gray-400 text-sm">
                                  Image failed to load
                                </p>
                              </div>
                              <p className="text-white text-sm text-center mt-3 font-semibold">
                                Front ID
                              </p>
                            </div>
                          </div>
                        )}
                        {user.backId && (
                          <div className="group">
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-600 hover:border-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                              <img
                                src={user.backId}
                                alt="Back ID"
                                className="w-full h-40 object-cover rounded-xl border border-slate-600 group-hover:border-slate-500 cursor-pointer transition-colors duration-200"
                                onClick={() => openModal(user.backId)}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "block";
                                }}
                              />
                              <div className="hidden w-full h-40 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center">
                                <p className="text-gray-400 text-sm">
                                  Image failed to load
                                </p>
                              </div>
                              <p className="text-white text-sm text-center mt-3 font-semibold">
                                Back ID
                              </p>
                            </div>
                          </div>
                        )}
                        {user.insurance && (
                          <div className="group">
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-600 hover:border-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                              <img
                                src={user.insurance}
                                alt="Insurance"
                                className="w-full h-40 object-cover rounded-xl border border-slate-600 group-hover:border-slate-500 cursor-pointer transition-colors duration-200"
                                onClick={() => openModal(user.insurance)}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "block";
                                }}
                              />
                              <div className="hidden w-full h-40 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center">
                                <p className="text-gray-400 text-sm">
                                  Image failed to load
                                </p>
                              </div>
                              <p className="text-white text-sm text-center mt-3 font-semibold">
                                Insurance
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {!user.frontId && !user.backId && !user.insurance && (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-white">
                            No supporting documents uploaded
                          </p>
                        </div>
                      )}
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
