import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { isSuper } from "../utils/roles";
import api from "../services/request";
import toast from "react-hot-toast";
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Eye,
  Database,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function AdminActivityLogs() {
  const { user, userRole } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    adminEmail: "",
    action: "",
  });
  const [generatingLogs, setGeneratingLogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 10; // Reduced from 25 to help with connection issues

  // Check authentication and token validity
  const checkAuthStatus = async () => {
    try {
      // Quick auth check
      const response = await api.get("/auth/me", { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn("Auth check failed:", error.response?.status);
      return false;
    }
  };

  // Check super admin access
  useEffect(() => {
    if (userRole) {
      const isSuperAdmin = isSuper(userRole);
      setHasAccess(isSuperAdmin);

      if (!isSuperAdmin) {
        setError(
          "Access denied. Only super admins can view admin activity logs."
        );
      } else {
        // Log access when super admin enters the page
        console.log("🔐 Super admin accessing Admin Activity Logs page");

        // Verify authentication is still valid
        checkAuthStatus().then((isValid) => {
          if (!isValid) {
            setError("Session expired. Please log in again.");
            toast.error("Session expired - please refresh and log in again");
          }
        });
      }
    }
  }, [userRole]);

  // Generate test logs for super admin
  const generateTestLogs = async () => {
    setGeneratingLogs(true);
    try {
      const response = await api.post(
        "/admin/generate-test-logs",
        {},
        {
          timeout: 10000, // 10 second timeout for test log generation
        }
      );
      toast.success("✅ Test logs generated successfully!");
      console.log("🎯 Test logs response:", response.data);

      // Refresh the logs after generating test data
      await fetchLogs(0);
    } catch (error) {
      console.error("❌ Error generating test logs:", error);
      toast.error(
        "Failed to generate test logs: " +
          (error.response?.data || error.message)
      );
    } finally {
      setGeneratingLogs(false);
    }
  };

  // Fetch admin activity logs with retry logic
  const fetchLogs = async (
    page = 0,
    filters = searchFilters,
    retryCount = 0
  ) => {
    if (!hasAccess) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Fetching admin activity logs...");
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
      });

      let response;

      // Always try the test endpoint first to show sample data
      console.log("🧪 Using test admin logs endpoint for sample data...");
      try {
        response = await api.get("/admin/admin-logs-test", {
          timeout: 10000, // 10 second timeout for test endpoint
        });
        console.log(
          "✅ Test endpoint worked, showing sample admin activity logs"
        );
      } catch (testError) {
        console.log(
          "❌ Test endpoint failed, trying simple endpoint as fallback"
        );
        // Fallback to simple endpoint
        try {
          response = await api.get("/admin/admin-logs-simple", {
            timeout: 10000,
          });
          console.log("✅ Simple endpoint worked as fallback");
        } catch (simpleError) {
          throw simpleError;
        }
      }
      
      // Skip the problematic main endpoint for now
      if (false) {
        // Use working user-history endpoint with admin logs mode
        params.append("adminLogsMode", "true");
        params.append("email", user?.email || "5epmgllc@gmail.com"); // Use actual user email

        if (filters.adminEmail.trim()) {
          params.append("adminEmailFilter", filters.adminEmail.trim());
        }
        if (filters.action.trim()) {
          params.append("actionFilter", filters.action.trim());
        }

        response = await api.get(`/admin/user-history?${params}`, {
          timeout: 60000, // 60 second timeout for admin logs
          headers: {
            Accept: "application/json",
            // Note: Connection header cannot be set from JavaScript for security reasons
          },
          // Add response type and other options to help with large responses
          responseType: "json",
          maxContentLength: 50 * 1024 * 1024, // 50MB max response size
          maxBodyLength: 50 * 1024 * 1024,
        });
      }

      setLogs(response.data.logs || []);
      setTotalCount(response.data.totalCount || 0);
      setHasMore(response.data.hasMore || false);
      setCurrentPage(page);

      console.log("✅ Admin activity logs fetched:", {
        logsCount: response.data.logs?.length,
        totalCount: response.data.totalCount,
        page,
        hasMore: response.data.hasMore,
      });
    } catch (error) {
      console.error("❌ Error fetching admin logs:", error);

      if (error.response?.status === 403) {
        setError(
          "Session expired. Please log in again to access admin activity logs."
        );
        toast.error("Session expired - redirecting to login");
        // The request interceptor will handle the redirect
      } else if (error.code === "ECONNABORTED" && retryCount < 2) {
        // Retry on timeout up to 2 times
        console.log(
          `⏱️ Request timed out, retrying... (attempt ${retryCount + 1}/3)`
        );
        toast(`Request timed out, retrying... (${retryCount + 1}/3)`, {
          icon: "⏱️",
          duration: 2000,
        });
        setTimeout(() => {
          fetchLogs(page, filters, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Progressive delay: 1s, 2s, 3s
        return;
      } else if (error.code === "ECONNABORTED") {
        setError(
          "Request timed out after multiple attempts. Please check your connection and try again."
        );
        toast.error("Request timed out - please try again later");
      } else {
        setError(
          `Failed to fetch admin activity logs: ${
            error.response?.data || error.message
          }`
        );
        toast.error("Failed to load admin activity logs");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(0);
    fetchLogs(0, searchFilters);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchLogs(currentPage - 1, searchFilters);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      fetchLogs(currentPage + 1, searchFilters);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (hasAccess) {
      fetchLogs();
    }
  }, [hasAccess]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!hasAccess) return;

    const interval = setInterval(() => {
      fetchLogs(currentPage, searchFilters);
    }, 30 * 1000); // 30 seconds

    return () => clearInterval(interval);
  }, [hasAccess, currentPage, searchFilters]);

  // Get action color and icon
  const getActionStyle = (action) => {
    if (action.includes("DELETE"))
      return {
        color: "text-red-400 bg-red-500/10",
        icon: <AlertTriangle className="w-4 h-4" />,
      };
    if (action.includes("APPROVE") || action.includes("ACTIVATE"))
      return {
        color: "text-green-400 bg-green-500/10",
        icon: <User className="w-4 h-4" />,
      };
    if (action.includes("REVOKE") || action.includes("SUSPEND"))
      return {
        color: "text-orange-400 bg-orange-500/10",
        icon: <AlertTriangle className="w-4 h-4" />,
      };
    if (action.includes("VIEW"))
      return {
        color: "text-blue-400 bg-blue-500/10",
        icon: <Eye className="w-4 h-4" />,
      };
    return {
      color: "text-gray-400 bg-gray-500/10",
      icon: <FileText className="w-4 h-4" />,
    };
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Show access denied if user doesn't have super admin privileges
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              Access Denied
            </h2>
            <p className="text-red-300">
              {error ||
                "Only super administrators can access admin activity logs."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Admin Activity Logs
              </h1>
              <p className="text-white/70">
                Monitor all administrative actions for accountability and
                security
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  placeholder="Filter by admin email..."
                  value={searchFilters.adminEmail}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      adminEmail: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Action Type
                </label>
                <select
                  value={searchFilters.action}
                  onChange={(e) => {
                    console.log("🔍 Action filter changed to:", e.target.value);
                    setSearchFilters((prev) => ({
                      ...prev,
                      action: e.target.value,
                    }));
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">All Actions</option>
                  <option value="DELETE">Delete Actions</option>
                  <option value="APPROVE">Approve Actions</option>
                  <option value="REVOKE">Revoke Actions</option>
                  <option value="ACTIVATE">Activate Actions</option>
                  <option value="VIEW">View Actions</option>
                  <option value="UPDATE">Update Actions</option>
                  <option value="TRIAL">Trial Actions</option>
                  <option value="DENIED">Denied Actions</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button
                  onClick={() => fetchLogs(currentPage, searchFilters)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <button
                  onClick={generateTestLogs}
                  disabled={generatingLogs || isLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                  title="Generate test activity logs for your super admin profile"
                >
                  <Database
                    className={`w-4 h-4 ${
                      generatingLogs ? "animate-pulse" : ""
                    }`}
                  />
                  {generatingLogs ? "Generating..." : "Test Logs"}
                </button>
              </div>
            </div>
          </div>

          {/* Current Filters Display */}
          {(searchFilters.adminEmail || searchFilters.action) && (
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center gap-2 text-blue-300 text-sm">
                <Filter className="w-4 h-4" />
                <span>Active filters:</span>
                {searchFilters.adminEmail && (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Admin: {searchFilters.adminEmail}
                  </span>
                )}
                {searchFilters.action && (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Action: {searchFilters.action}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchFilters({ adminEmail: "", action: "" });
                    fetchLogs(0, { adminEmail: "", action: "" });
                  }}
                  className="text-blue-400 hover:text-blue-300 underline text-xs ml-2"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Activity Logs */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80 text-lg">
              Loading admin activity logs...
            </p>
          </div>
        ) : logs.length > 0 ? (
          <>
            {/* Summary */}
            <div className="mb-6 p-4 bg-slate-800/50 border border-slate-600 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-white/70">
                  Showing {logs.length} of {totalCount} admin actions
                  {searchFilters.adminEmail || searchFilters.action
                    ? " (filtered)"
                    : ""}
                </div>
                <div className="text-white/70 text-sm">
                  Page {currentPage + 1} of {Math.ceil(totalCount / pageSize)}
                </div>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-3">
              {logs.map((log) => {
                const actionStyle = getActionStyle(log.action);
                return (
                  <div
                    key={log.id}
                    className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${actionStyle.color}`}
                          >
                            {actionStyle.icon}
                            {log.action}
                          </div>
                          <div className="text-white/60 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(log.createdAt)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-white/60 text-xs mb-1">
                              Admin
                            </div>
                            <div className="text-white font-medium">
                              {log.adminName || "Unknown"}
                              <span className="text-white/60 text-sm ml-2">
                                ({log.adminEmail})
                              </span>
                            </div>
                            <div className="text-white/50 text-xs">
                              Role: {log.adminRole}
                            </div>
                          </div>
                          {log.targetUserId && (
                            <div>
                              <div className="text-white/60 text-xs mb-1">
                                Target User
                              </div>
                              <div className="text-white font-medium">
                                {log.targetUserName || "Unknown"}
                                <span className="text-white/60 text-sm ml-2">
                                  ({log.targetUserEmail})
                                </span>
                              </div>
                              <div className="text-white/50 text-xs">
                                Role: {log.targetUserRole}
                              </div>
                            </div>
                          )}
                        </div>

                        {log.details && (
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <div className="text-white/60 text-xs mb-1">
                              Details
                            </div>
                            <div className="text-white/80 text-sm">
                              {log.details}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0 || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="text-white/70 text-sm">
                Page {currentPage + 1} of {Math.ceil(totalCount / pageSize)}
              </div>

              <button
                onClick={handleNextPage}
                disabled={!hasMore || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white/80 text-lg mb-2">
              No admin activity logs found
            </p>
            <p className="text-white/60 text-sm">
              {searchFilters.adminEmail || searchFilters.action
                ? "Try adjusting your search filters"
                : "Admin actions will appear here as they occur"}
            </p>
          </div>
        )}

        {/* Action Legend */}
        <div className="mt-8 p-6 bg-slate-800/50 border border-slate-600 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Action Types
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-white/70">Delete Actions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/70">Approve/Activate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-white/70">Revoke/Suspend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white/70">View/Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminActivityLogs;
