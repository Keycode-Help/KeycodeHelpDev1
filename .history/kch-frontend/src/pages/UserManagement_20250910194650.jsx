import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin } from "../utils/roles";
import api from "../services/request";
import { getOptimizedImageUrl, revokeBlobUrl } from "../utils/fileUtils";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  Crown,
  Timer,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building2,
  Eye,
  EyeOff,
  MoreVertical,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Star,
  Shield,
  FileText,
  Trash2,
  Edit,
  Ban,
  Unlock,
} from "lucide-react";

function UserManagement() {
  const { user, userRole } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, trial, pro, pending, inactive
  const [sortBy, setSortBy] = useState("name"); // name, email, status, trialEndsAt, createdAt
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState(new Set());
  const blobUrlsRef = useRef(new Map());

  // Check admin access
  useEffect(() => {
    if (userRole) {
      const hasAccess = canSeeAdmin(userRole);
      setHasAdminAccess(hasAccess);
      if (!hasAccess) {
        setError("Access denied. You don't have admin privileges.");
      }
    }
  }, [userRole]);

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    const currentBlobUrls = blobUrlsRef.current;
    return () => {
      currentBlobUrls.forEach((url) => revokeBlobUrl(url));
    };
  }, []);

  // Fetch all users
  const fetchAllUsers = useCallback(async () => {
    if (!hasAdminAccess) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/users/all");
      const users = response.data || [];

      // Add computed fields for easier filtering and display
      const usersWithStatus = users.map((user) => ({
        ...user,
        status: getUserStatus(user),
        trialDaysRemaining: getTrialDaysRemaining(user),
        isTrialActive: isTrialActive(user),
        isProUser: isProUser(user),
        displayName:
          `${user.fname || ""} ${user.lname || ""}`.trim() || "Unknown User",
      }));

      setAllUsers(usersWithStatus);
      setFilteredUsers(usersWithStatus);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [hasAdminAccess]);

  // Helper functions for user status
  const getUserStatus = (user) => {
    if (user.trialActive && isTrialActive(user)) return "trial";
    if (user.subscription?.activated) return "pro";
    if (user.isValidatedUser === false) return "pending";
    return "inactive";
  };

  const isTrialActive = (user) => {
    return (
      user.trialActive &&
      user.trialEndsAt &&
      new Date(user.trialEndsAt) > new Date()
    );
  };

  const isProUser = (user) => {
    return user.subscription?.activated === true;
  };

  const getTrialDaysRemaining = (user) => {
    if (!user.trialEndsAt) return 0;
    const now = new Date();
    const trialEnd = new Date(user.trialEndsAt);
    const diffTime = trialEnd - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Filter and search users
  useEffect(() => {
    let filtered = [...allUsers];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((user) => user.status === filterType);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.displayName.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term) ||
          user.company?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.displayName;
          bValue = b.displayName;
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "trialEndsAt":
          aValue = a.trialEndsAt ? new Date(a.trialEndsAt) : new Date(0);
          bValue = b.trialEndsAt ? new Date(b.trialEndsAt) : new Date(0);
          break;
        case "createdAt":
          aValue = a.createdAt ? new Date(a.createdAt) : new Date(0);
          bValue = b.createdAt ? new Date(b.createdAt) : new Date(0);
          break;
        default:
          aValue = a.displayName;
          bValue = b.displayName;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [allUsers, filterType, searchTerm, sortBy, sortOrder]);

  // Load users on component mount
  useEffect(() => {
    if (hasAdminAccess) {
      fetchAllUsers();
    }
  }, [hasAdminAccess, fetchAllUsers]);

  // Helper function to get optimized image URL
  const getImageUrl = useCallback((imageData) => {
    if (!imageData) return null;

    const optimizedUrl = getOptimizedImageUrl(imageData);

    if (optimizedUrl && optimizedUrl.startsWith("blob:")) {
      blobUrlsRef.current.set(imageData, optimizedUrl);
    }

    return optimizedUrl;
  }, []);

  // User actions
  const handleUserAction = async (userId, action, data = {}) => {
    setActionLoading((prev) => new Set(prev).add(userId));

    try {
      const response = await api.post(`/admin/users/${userId}/${action}`, data);

      if (response.status === 200) {
        // Refresh users list
        await fetchAllUsers();
        console.log(`✅ ${action} successful for user ${userId}`);
      }
    } catch (error) {
      console.error(`❌ Failed to ${action} user ${userId}:`, error);
      setError(`Failed to ${action} user. Please try again.`);
    } finally {
      setActionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleApproveUser = (userId) => handleUserAction(userId, "approve");
  const handleRejectUser = (userId) => handleUserAction(userId, "reject");
  const handleActivateTrial = (userId) =>
    handleUserAction(userId, "activate-trial", { trialDays: 3 });
  const handleSuspendUser = (userId) => handleUserAction(userId, "suspend");
  const handleUnsuspendUser = (userId) => handleUserAction(userId, "unsuspend");
  const handleDeleteUser = (userId) => handleUserAction(userId, "delete");

  // Status badge component
  const StatusBadge = ({ status, trialDaysRemaining, isTrialActive }) => {
    const badges = {
      trial: {
        icon: <Timer className="w-3 h-3" />,
        text: `Trial (${trialDaysRemaining}d left)`,
        className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      },
      pro: {
        icon: <Crown className="w-3 h-3" />,
        text: "Pro User",
        className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      },
      pending: {
        icon: <Clock className="w-3 h-3" />,
        text: "Pending",
        className: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      },
      inactive: {
        icon: <UserX className="w-3 h-3" />,
        text: "Inactive",
        className: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      },
    };

    const badge = badges[status] || badges.inactive;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.className}`}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  // User card component
  const UserCard = ({ user }) => {
    const isLoading = actionLoading.has(user.id);

    return (
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {user.displayName}
              </h3>
              <p className="text-white/70 text-sm">{user.email}</p>
            </div>
          </div>
          <StatusBadge
            status={user.status}
            trialDaysRemaining={user.trialDaysRemaining}
            isTrialActive={user.isTrialActive}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {user.phone && (
            <div className="flex items-center gap-2 text-white/70">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{user.phone}</span>
            </div>
          )}
          {user.company && (
            <div className="flex items-center gap-2 text-white/70">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{user.company}</span>
            </div>
          )}
          {user.state && (
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{user.state}</span>
            </div>
          )}
          {user.createdAt && (
            <div className="flex items-center gap-2 text-white/70">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedUser(user);
              setShowUserDetails(true);
            }}
            className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          {user.status === "pending" && (
            <>
              <button
                onClick={() => handleApproveUser(user.id)}
                disabled={isLoading}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => handleActivateTrial(user.id)}
                disabled={isLoading}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <Timer className="w-4 h-4" />
                Start Trial
              </button>
            </>
          )}

          {user.status === "trial" && (
            <button
              onClick={() => handleApproveUser(user.id)}
              disabled={isLoading}
              className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </button>
          )}

          <button
            onClick={() => handleSuspendUser(user.id)}
            disabled={isLoading}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <Ban className="w-4 h-4" />
            Suspend
          </button>
        </div>
      </div>
    );
  };

  // Statistics cards
  const stats = [
    {
      title: "Total Users",
      value: allUsers.length,
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
    },
    {
      title: "Trial Users",
      value: allUsers.filter((u) => u.status === "trial").length,
      icon: <Timer className="w-6 h-6" />,
      color:
        "from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-400",
    },
    {
      title: "Pro Users",
      value: allUsers.filter((u) => u.status === "pro").length,
      icon: <Crown className="w-6 h-6" />,
      color:
        "from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400",
    },
    {
      title: "Pending",
      value: allUsers.filter((u) => u.status === "pending").length,
      icon: <Clock className="w-6 h-6" />,
      color: "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400",
    },
  ];

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-2xl p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Access Denied
            </h1>
            <p className="text-white/70">
              You don't have admin privileges to access this page.
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-white/70">
                Manage all users, trials, and subscriptions
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} border rounded-2xl p-6 text-center shadow-lg`}
              >
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white/70">
                  {stat.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-600">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="trial">Trial Users</option>
                <option value="pro">Pro Users</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="email-asc">Email A-Z</option>
                <option value="email-desc">Email Z-A</option>
                <option value="status-asc">Status</option>
                <option value="trialEndsAt-desc">Trial Ending Soon</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={fetchAllUsers}
                disabled={loading}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-white/50 animate-spin mx-auto mb-4" />
            <p className="text-white/70">Loading users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-300">{error}</p>
            <button
              onClick={fetchAllUsers}
              className="mt-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70 text-lg">No users found</p>
            <p className="text-white/50 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-white/50 hover:text-white transition-colors duration-200"
                >
                  <UserX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm">Name</label>
                      <p className="text-white font-medium">
                        {selectedUser.displayName}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">Email</label>
                      <p className="text-white font-medium">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">Phone</label>
                      <p className="text-white font-medium">
                        {selectedUser.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">Company</label>
                      <p className="text-white font-medium">
                        {selectedUser.company || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Status
                  </h3>
                  <StatusBadge
                    status={selectedUser.status}
                    trialDaysRemaining={selectedUser.trialDaysRemaining}
                    isTrialActive={selectedUser.isTrialActive}
                  />
                </div>

                {/* Documents */}
                {(selectedUser.frontId ||
                  selectedUser.backId ||
                  selectedUser.insurance) && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Supporting Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedUser.frontId && (
                        <div>
                          <img
                            src={getImageUrl(selectedUser.frontId)}
                            alt="Front ID"
                            className="w-full h-32 object-cover rounded-lg border border-slate-600"
                          />
                          <p className="text-white/70 text-sm mt-2 text-center">
                            Front ID
                          </p>
                        </div>
                      )}
                      {selectedUser.backId && (
                        <div>
                          <img
                            src={getImageUrl(selectedUser.backId)}
                            alt="Back ID"
                            className="w-full h-32 object-cover rounded-lg border border-slate-600"
                          />
                          <p className="text-white/70 text-sm mt-2 text-center">
                            Back ID
                          </p>
                        </div>
                      )}
                      {selectedUser.insurance && (
                        <div>
                          <img
                            src={getImageUrl(selectedUser.insurance)}
                            alt="Insurance"
                            className="w-full h-32 object-cover rounded-lg border border-slate-600"
                          />
                          <p className="text-white/70 text-sm mt-2 text-center">
                            Insurance
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
