import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin } from "../utils/roles";
import api from "../services/request";
import { getOptimizedImageUrl, revokeBlobUrl } from "../utils/fileUtils";
import toast from "react-hot-toast";
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
  AlertCircle,
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
  const [filterType, setFilterType] = useState("all"); // all, active, trial, pro, pending, inactive
  const [sortBy, setSortBy] = useState("name"); // name, email, status, trialEndsAt, createdAt
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const blobUrlsRef = useRef(new Map());

  // Update current time every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check admin access
  useEffect(() => {
    console.log("🔍 UserManagement: userRole =", userRole);
    if (userRole) {
      const hasAccess = canSeeAdmin(userRole);
      console.log("🔍 UserManagement: hasAccess =", hasAccess);
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
      console.log("🔍 UserManagement: Fetching users from /admin/users");
      const response = await api.get("/admin/users");
      console.log("🔍 UserManagement: Response received:", response);
      const users = response.data || [];

      // Add computed fields for easier filtering and display
      const usersWithStatus = users.map((user) => ({
        ...user,
        status: getUserStatus(user),
        trialDaysRemaining: getTrialDaysRemaining(user),
        trialHoursRemaining: getTrialHoursRemaining(user),
        trialMinutesRemaining: getTrialMinutesRemaining(user),
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
    // Check if user is approved (isValidatedUser = true)
    if (!user.isValidatedUser) {
      return "pending"; // New users not yet approved
    }

    // Check if user has active trial
    if (user.trialActive && isTrialActive(user)) {
      return "trial";
    }

    // Check if user has pro subscription
    if (user.subscription?.activated) {
      return "pro";
    }

    // Check if user is inactive (not logged in for 90+ days)
    if (user.lastLoginAt) {
      const lastLogin = new Date(user.lastLoginAt);
      const daysSinceLogin = Math.floor(
        (currentTime - lastLogin) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLogin > 90) {
        return "inactive";
      }
    } else if (!user.isActive) {
      // Fallback to isActive field if lastLoginAt is not available
      return "inactive";
    }

    // If user is approved and active, they are considered active
    return "active";
  };

  const isTrialActive = (user) => {
    return (
      user.trialActive &&
      user.trialEndsAt &&
      new Date(user.trialEndsAt) > currentTime
    );
  };

  const isProUser = (user) => {
    return user.subscription?.activated === true;
  };

  const getTrialDaysRemaining = (user) => {
    if (!user.trialEndsAt) return 0;
    const trialEnd = new Date(user.trialEndsAt);
    const diffTime = trialEnd - currentTime;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getTrialHoursRemaining = (user) => {
    if (!user.trialEndsAt) return 0;
    const trialEnd = new Date(user.trialEndsAt);
    const diffTime = trialEnd - currentTime;
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return Math.max(0, diffHours);
  };

  const getTrialMinutesRemaining = (user) => {
    if (!user.trialEndsAt) return 0;
    const trialEnd = new Date(user.trialEndsAt);
    const diffTime = trialEnd - currentTime;
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    return Math.max(0, diffMinutes);
  };

  // Format time remaining for display
  const formatTrialTimeRemaining = (user) => {
    const days = getTrialDaysRemaining(user);
    const hours = getTrialHoursRemaining(user);
    const minutes = getTrialMinutesRemaining(user);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "Expired";
    }
  };

  // Get trial urgency level
  const getTrialUrgency = (user) => {
    const days = getTrialDaysRemaining(user);
    const hours = getTrialHoursRemaining(user);

    if (days === 0 && hours <= 1) return "critical"; // Less than 1 hour
    if (days === 0 && hours <= 6) return "urgent"; // Less than 6 hours
    if (days <= 1) return "warning"; // Less than 1 day
    return "normal";
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
  }, [allUsers, filterType, searchTerm, sortBy, sortOrder, currentTime]);

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
  const handleDeleteUser = async (userId, reason = "") => {
    setActionLoading((prev) => new Set(prev).add(userId));

    try {
      const response = await api.delete(
        `/admin/users/${userId}/delete?reason=${encodeURIComponent(reason)}`
      );

      if (response.status === 200) {
        // Refresh users list
        await fetchAllUsers();
        console.log(`✅ User ${userId} deleted successfully`);
        toast.success(
          `User deleted successfully: ${response.data.deletedUser}`
        );

        // Close delete confirmation modal
        setShowDeleteConfirm(false);
        setUserToDelete(null);
        setDeleteReason("");
      }
    } catch (error) {
      console.error(`❌ Failed to delete user ${userId}:`, error);
      const errorMessage = error.response?.data || error.message;
      setError(`Failed to delete user: ${errorMessage}`);
      toast.error(`Failed to delete user: ${errorMessage}`);
    } finally {
      setActionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
    setDeleteReason("");
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
    setDeleteReason("");
  };

  const viewDocument = (documentData, documentType, userName) => {
    if (!documentData) {
      toast.error("Document not available");
      return;
    }

    setSelectedDocument({
      data: documentData,
      type: documentType,
      userName: userName,
      url: getImageUrl(documentData)
    });
    setShowDocumentViewer(true);
  };

  const closeDocumentViewer = () => {
    setShowDocumentViewer(false);
    setSelectedDocument(null);
  };

  // Enhanced Status badge component with countdown
  const StatusBadge = ({ status, trialDaysRemaining, isTrialActive, user }) => {
    const urgency = getTrialUrgency(user);
    const timeRemaining = formatTrialTimeRemaining(user);

    const badges = {
      active: {
        icon: <CheckCircle2 className="w-3 h-3" />,
        text: "Active",
        className: "bg-green-500/20 text-green-300 border-green-500/30",
      },
      trial: {
        icon: <Timer className="w-3 h-3" />,
        text: `Trial (${timeRemaining})`,
        className:
          urgency === "critical"
            ? "bg-red-500/20 text-red-300 border-red-500/30 animate-pulse"
            : urgency === "urgent"
            ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
            : urgency === "warning"
            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
            : "bg-blue-500/20 text-blue-300 border-blue-500/30",
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
      <div className="flex flex-col items-end gap-1">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.className}`}
        >
          {badge.icon}
          {badge.text}
        </span>
        {status === "trial" && urgency === "critical" && (
          <span className="text-xs text-red-400 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Expires Soon!
          </span>
        )}
      </div>
    );
  };

  // User card component
  const UserCard = ({ user }) => {
    const isLoading = actionLoading.has(user.id);
    const urgency = getTrialUrgency(user);

    return (
      <div
        className={`bg-slate-800/50 rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl ${
          user.status === "trial" && urgency === "critical"
            ? "border-red-500/50 hover:border-red-400/50"
            : user.status === "trial" && urgency === "urgent"
            ? "border-orange-500/50 hover:border-orange-400/50"
            : "border-slate-600 hover:border-slate-500"
        }`}
      >
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
            user={user}
          />
        </div>

        {/* Trial Countdown Display */}
        {user.status === "trial" && (
          <div
            className={`mb-4 p-3 rounded-lg border ${
              urgency === "critical"
                ? "bg-red-500/10 border-red-500/30"
                : urgency === "urgent"
                ? "bg-orange-500/10 border-orange-500/30"
                : urgency === "warning"
                ? "bg-yellow-500/10 border-yellow-500/30"
                : "bg-blue-500/10 border-blue-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer
                  className={`w-4 h-4 ${
                    urgency === "critical"
                      ? "text-red-400"
                      : urgency === "urgent"
                      ? "text-orange-400"
                      : urgency === "warning"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    urgency === "critical"
                      ? "text-red-300"
                      : urgency === "urgent"
                      ? "text-orange-300"
                      : urgency === "warning"
                      ? "text-yellow-300"
                      : "text-blue-300"
                  }`}
                >
                  Trial Time Remaining
                </span>
              </div>
              <div
                className={`text-lg font-bold ${
                  urgency === "critical"
                    ? "text-red-400"
                    : urgency === "urgent"
                    ? "text-orange-400"
                    : urgency === "warning"
                    ? "text-yellow-400"
                    : "text-blue-400"
                }`}
              >
                {formatTrialTimeRemaining(user)}
              </div>
            </div>

            {urgency === "critical" && (
              <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Trial expires very soon! Consider upgrading to Pro.
              </div>
            )}
          </div>
        )}

        {/* Trial Start and End Dates - Always show if available */}
        {user.trialEndsAt && (
          <div className="mb-4 p-3 rounded-lg border border-slate-600/50 bg-slate-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                Trial Period
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60 text-xs font-medium">
                  Started:
                </span>
                <div className="text-white font-medium">
                  {user.trialStartedAt
                    ? new Date(user.trialStartedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : "Unknown"}
                </div>
              </div>
              <div>
                <span className="text-white/60 text-xs font-medium">
                  Expires:
                </span>
                <div className="text-white font-medium">
                  {new Date(user.trialEndsAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

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

          {/* Delete User Button - Only for admins/super admins */}
          {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
            <button
              onClick={() => confirmDeleteUser(user)}
              disabled={isLoading || actionLoading.has(user.id)}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
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
      title: "Active Users",
      value: allUsers.filter((u) => u.status === "active").length,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color:
        "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
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
    {
      title: "Inactive",
      value: allUsers.filter((u) => u.status === "inactive").length,
      icon: <UserX className="w-6 h-6" />,
      color:
        "from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400",
    },
  ];

  // Trial statistics
  const trialStats = allUsers.filter((u) => u.status === "trial");
  const criticalTrials = trialStats.filter(
    (u) => getTrialUrgency(u) === "critical"
  ).length;
  const urgentTrials = trialStats.filter(
    (u) => getTrialUrgency(u) === "urgent"
  ).length;
  const warningTrials = trialStats.filter(
    (u) => getTrialUrgency(u) === "warning"
  ).length;

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

          {/* Trial Alert Cards */}
          {(criticalTrials > 0 || urgentTrials > 0 || warningTrials > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {criticalTrials > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {criticalTrials}
                  </div>
                  <div className="text-sm font-medium text-red-300">
                    Critical Trials (&lt;1h)
                  </div>
                </div>
              )}
              {urgentTrials > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {urgentTrials}
                  </div>
                  <div className="text-sm font-medium text-orange-300">
                    Urgent Trials (&lt;6h)
                  </div>
                </div>
              )}
              {warningTrials > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-center">
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {warningTrials}
                  </div>
                  <div className="text-sm font-medium text-yellow-300">
                    Warning Trials (&lt;1d)
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-600">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Filter & Search Users
              </h2>
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

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Search Field */}
              <div className="space-y-2">
                <label
                  htmlFor="search-users"
                  className="block text-sm font-medium text-white/90"
                >
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <input
                    id="search-users"
                    type="text"
                    placeholder="Search by name, email, phone, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Type */}
              <div className="space-y-2">
                <label
                  htmlFor="filter-type"
                  className="block text-sm font-medium text-white/90"
                >
                  User Status
                </label>
                <select
                  id="filter-type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users</option>
                  <option value="trial">Trial Users</option>
                  <option value="pro">Pro Users</option>
                  <option value="pending">Pending Approval</option>
                  <option value="inactive">Inactive Users</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label
                  htmlFor="sort-options"
                  className="block text-sm font-medium text-white/90"
                >
                  Sort By
                </label>
                <select
                  id="sort-options"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="email-asc">Email (A-Z)</option>
                  <option value="email-desc">Email (Z-A)</option>
                  <option value="status-asc">Status</option>
                  <option value="trialEndsAt-desc">Trial Ending Soon</option>
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filterType !== "all") && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-600">
                <span className="text-sm text-white/70">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterType !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    Status:{" "}
                    {filterType === "active"
                      ? "Active Users"
                      : filterType === "trial"
                      ? "Trial Users"
                      : filterType === "pro"
                      ? "Pro Users"
                      : filterType === "pending"
                      ? "Pending Approval"
                      : filterType === "inactive"
                      ? "Inactive Users"
                      : filterType}
                    <button
                      onClick={() => setFilterType("all")}
                      className="ml-1 hover:text-green-200"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                  className="text-sm text-white/50 hover:text-white/70 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
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
                    user={selectedUser}
                  />
                </div>

                {/* Trial Countdown in Modal */}
                {selectedUser.status === "trial" && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Trial Information
                    </h3>
                    <div
                      className={`p-4 rounded-lg border ${
                        getTrialUrgency(selectedUser) === "critical"
                          ? "bg-red-500/10 border-red-500/30"
                          : getTrialUrgency(selectedUser) === "urgent"
                          ? "bg-orange-500/10 border-orange-500/30"
                          : getTrialUrgency(selectedUser) === "warning"
                          ? "bg-yellow-500/10 border-yellow-500/30"
                          : "bg-blue-500/10 border-blue-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Timer
                            className={`w-5 h-5 ${
                              getTrialUrgency(selectedUser) === "critical"
                                ? "text-red-400"
                                : getTrialUrgency(selectedUser) === "urgent"
                                ? "text-orange-400"
                                : getTrialUrgency(selectedUser) === "warning"
                                ? "text-yellow-400"
                                : "text-blue-400"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              getTrialUrgency(selectedUser) === "critical"
                                ? "text-red-300"
                                : getTrialUrgency(selectedUser) === "urgent"
                                ? "text-orange-300"
                                : getTrialUrgency(selectedUser) === "warning"
                                ? "text-yellow-300"
                                : "text-blue-300"
                            }`}
                          >
                            Time Remaining
                          </span>
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            getTrialUrgency(selectedUser) === "critical"
                              ? "text-red-400"
                              : getTrialUrgency(selectedUser) === "urgent"
                              ? "text-orange-400"
                              : getTrialUrgency(selectedUser) === "warning"
                              ? "text-yellow-400"
                              : "text-blue-400"
                          }`}
                        >
                          {formatTrialTimeRemaining(selectedUser)}
                        </div>
                      </div>
                      {selectedUser.trialEndsAt && (
                        <div className="mt-2 text-sm text-white/70">
                          Expires:{" "}
                          {new Date(selectedUser.trialEndsAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                            className="w-full h-32 object-cover rounded-lg border border-slate-600 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => viewDocument(selectedUser.frontId, "Front ID", selectedUser.displayName)}
                          />
                          <p className="text-white/70 text-sm mt-2 text-center">
                            Front ID
                            <span className="block text-xs text-blue-400">Click to view full size</span>
                          </p>
                        </div>
                      )}
                      {selectedUser.backId && (
                        <div>
                          <img
                            src={getImageUrl(selectedUser.backId)}
                            alt="Back ID"
                            className="w-full h-32 object-cover rounded-lg border border-slate-600 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => viewDocument(selectedUser.backId, "Back ID", selectedUser.displayName)}
                          />
                          <p className="text-white/70 text-sm mt-2 text-center">
                            Back ID
                            <span className="block text-xs text-blue-400">Click to view full size</span>
                          </p>
                        </div>
                      )}
                      {selectedUser.insurance && (
                        <div>
                          <img
                            src={getImageUrl(selectedUser.insurance)}
                            alt="Insurance"
                            className="w-full h-32 object-cover rounded-lg border border-slate-600 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => viewDocument(selectedUser.insurance, "Insurance Document", selectedUser.displayName)}
                          />
                          <p className="text-white/70 text-sm mt-2 text-center">
                            Insurance
                            <span className="block text-xs text-blue-400">Click to view full size</span>
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && userToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Delete User Account
                </h2>
                <p className="text-white/70">
                  Are you sure you want to delete the account for:
                </p>
                <p className="text-white font-semibold mt-2">
                  {userToDelete.displayName} ({userToDelete.email})
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Reason for deletion (optional):
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Enter reason for deletion..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-semibold mb-1">Warning</h4>
                    <p className="text-red-300 text-sm">
                      This action will permanently deactivate the user account.
                      The user will lose access to all services and their data
                      will be preserved for compliance purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleDeleteUser(userToDelete.id, deleteReason)
                  }
                  disabled={actionLoading.has(userToDelete.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading.has(userToDelete.id) ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Viewer Modal */}
        {showDocumentViewer && selectedDocument && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedDocument.type}</h2>
                  <p className="text-white/70 text-sm">User: {selectedDocument.userName}</p>
                </div>
                <button
                  onClick={closeDocumentViewer}
                  className="p-2 text-white/70 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex justify-center">
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.type}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg border border-slate-600"
                />
              </div>
              
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedDocument.url;
                    link.download = `${selectedDocument.userName.replace(/\s+/g, '_')}_${selectedDocument.type.replace(/\s+/g, '_')}.jpg`;
                    link.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={closeDocumentViewer}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
