import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin } from "../utils/roles";
import api from "../services/request";
import { getOptimizedImageUrl, revokeBlobUrl } from "../utils/fileUtils";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Users,
  AlertTriangle,
  RefreshCw,
  Eye,
  Download,
  Clock,
  UserCheck,
  Shield,
} from "lucide-react";

export default function DocumentValidation() {
  const { user, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [actionLoading, setActionLoading] = useState(new Set());
  const blobUrlsRef = useRef(new Map());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");

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

  // Fetch users
  const fetchUsers = useCallback(async () => {
    if (!hasAdminAccess) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/users");
      const usersData = response.data || [];

      // Filter users who have documents or are pending validation
      const usersWithDocs = usersData.filter(
        (user) =>
          user.frontId ||
          user.backId ||
          user.insurance ||
          user.isValidatedUser === false
      );

      setUsers(usersWithDocs);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [hasAdminAccess]);

  // Fetch documents for selected user
  const fetchDocuments = useCallback(
    async (userId) => {
      if (!userId) return;

      setLoadingDocs(true);
      setError(null);

      try {
        const response = await api.get(`/compliance/documents/${userId}`);
        const docs = response.data || [];

        // Also include user's uploaded documents (frontId, backId, insurance)
        const user = users.find((u) => u.id === userId);
        console.log("🔍 DocumentValidation: User data for documents:", user);
        if (user) {
          const userDocs = [];

          if (user.frontId) {
            userDocs.push({
              id: `front-${user.id}`,
              docType: "Front ID",
              storageKey: user.frontId,
              uploadedAt:
                user.updatedAt || user.createdAt || new Date().toISOString(),
              verified: user.isValidatedUser === true,
              reviewNotes:
                user.isValidatedUser === false ? "Pending validation" : null,
            });
          }

          if (user.backId) {
            userDocs.push({
              id: `back-${user.id}`,
              docType: "Back ID",
              storageKey: user.backId,
              uploadedAt:
                user.updatedAt || user.createdAt || new Date().toISOString(),
              verified: user.isValidatedUser === true,
              reviewNotes:
                user.isValidatedUser === false ? "Pending validation" : null,
            });
          }

          if (user.insurance) {
            userDocs.push({
              id: `insurance-${user.id}`,
              docType: "Insurance Document",
              storageKey: user.insurance,
              uploadedAt:
                user.updatedAt || user.createdAt || new Date().toISOString(),
              verified: user.isValidatedUser === true,
              reviewNotes:
                user.isValidatedUser === false ? "Pending validation" : null,
            });
          }

          setDocuments([...docs, ...userDocs]);
        } else {
          setDocuments(docs);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        setError("Failed to fetch documents. Please try again.");
      } finally {
        setLoadingDocs(false);
      }
    },
    [users]
  );

  // Load users on component mount
  useEffect(() => {
    if (hasAdminAccess) {
      fetchUsers();
    }
  }, [hasAdminAccess, fetchUsers]);

  // Fetch documents when user is selected
  useEffect(() => {
    if (selectedUserId) {
      fetchDocuments(selectedUserId);
    }
  }, [selectedUserId, fetchDocuments]);

  // Helper function to get optimized image URL
  const getImageUrl = useCallback((imageData) => {
    if (!imageData) return null;

    const optimizedUrl = getOptimizedImageUrl(imageData);

    if (optimizedUrl && optimizedUrl.startsWith("blob:")) {
      blobUrlsRef.current.set(imageData, optimizedUrl);
    }

    return optimizedUrl;
  }, []);

  // Helper function to format upload date
  const formatUploadDate = useCallback((dateString) => {
    if (!dateString) return "Date not available";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not available";
    }
  }, []);

  // Helper function to get relative time
  const getRelativeTime = useCallback((dateString) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;

      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000)
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    } catch (error) {
      console.error("Error calculating relative time:", error);
      return null;
    }
  }, []);

  // Open review modal
  const openReviewModal = (document, action) => {
    setSelectedDocument({ ...document, action });
    setReviewNotes(document.reviewNotes || "");
    setShowReviewModal(true);
  };

  // Close review modal
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedDocument(null);
    setReviewNotes("");
  };

  // Review document
  const reviewDocument = async (docId, verified, notes = "") => {
    setActionLoading((prev) => new Set(prev).add(docId));

    try {
      // For user documents (frontId, backId, insurance), we need to update the user's validation status
      if (
        docId.startsWith("front-") ||
        docId.startsWith("back-") ||
        docId.startsWith("insurance-")
      ) {
        const userId = docId.split("-")[1];
        await api.post(`/admin/users/${userId}/approve`);

        // Update the user's validation status in the users list
        setUsers((prev) =>
          prev.map((u) =>
            u.id === parseInt(userId) ? { ...u, isValidatedUser: verified } : u
          )
        );
      } else {
        // For compliance documents, use the compliance endpoint
        await api.patch(`/compliance/documents/${docId}/review`, {
          verified,
          notes,
        });
      }

      // Update the documents list
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId ? { ...d, verified, reviewNotes: notes } : d
        )
      );

      console.log(`✅ Document ${docId} ${verified ? "approved" : "rejected"}`);
      closeReviewModal();
    } catch (error) {
      console.error(`❌ Failed to review document ${docId}:`, error);
      setError(
        `Failed to ${
          verified ? "approve" : "reject"
        } document. Please try again.`
      );
    } finally {
      setActionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  // Submit review from modal
  const submitReview = () => {
    if (selectedDocument) {
      reviewDocument(selectedDocument.id, selectedDocument.action, reviewNotes);
    }
  };

  // Show access denied if user doesn't have admin privileges
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
              You don't have admin privileges to access document validation.
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
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Document Validation
              </h1>
              <p className="text-white/70">
                Review and validate user uploaded documents
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 text-center shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {users.length}
              </div>
              <div className="text-sm font-medium text-white/70">
                Users with Documents
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-2xl p-6 text-center shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {documents.filter((d) => !d.verified).length}
              </div>
              <div className="text-sm font-medium text-white/70">
                Pending Review
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 text-center shadow-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {documents.filter((d) => d.verified).length}
              </div>
              <div className="text-sm font-medium text-white/70">
                Verified Documents
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white/90">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Users with Documents</h2>
              </div>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-6 h-6 text-white/50 animate-spin mx-auto mb-2" />
                <p className="text-white/70">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-white/30 mx-auto mb-2" />
                <p className="text-white/70">No users with documents found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUserId(u.id)}
                    className={`w-full text-left rounded-xl p-4 border transition-all duration-200 ${
                      selectedUserId === u.id
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-semibold">
                        {u.fname} {u.lname}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          u.isValidatedUser === true
                            ? "bg-green-500/20 text-green-300"
                            : u.isValidatedUser === false
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {u.isValidatedUser === true
                          ? "Verified"
                          : u.isValidatedUser === false
                          ? "Pending"
                          : "Unknown"}
                      </div>
                    </div>
                    <div className="text-white/70 text-sm">{u.email}</div>
                    <div className="text-white/50 text-xs mt-1">
                      {
                        [u.frontId, u.backId, u.insurance].filter(Boolean)
                          .length
                      }{" "}
                      documents
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Documents Section */}
          <section className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-600">
            {!selectedUserId ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 text-lg">
                  Select a user to view their documents
                </p>
                <p className="text-white/50 text-sm">
                  Choose a user from the list to see their uploaded documents
                </p>
              </div>
            ) : loadingDocs ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-white/50 animate-spin mx-auto mb-4" />
                <p className="text-white/70">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 text-lg">No documents found</p>
                <p className="text-white/50 text-sm">
                  This user hasn't uploaded any documents yet
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Documents for{" "}
                    {users.find((u) => u.id === selectedUserId)?.fname}{" "}
                    {users.find((u) => u.id === selectedUserId)?.lname}
                  </h2>
                  <button
                    onClick={() => fetchDocuments(selectedUserId)}
                    disabled={loadingDocs}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${loadingDocs ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((d) => (
                    <div
                      key={d.id}
                      className={`rounded-xl border p-4 transition-all duration-200 ${
                        d.verified
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-orange-500/30 bg-orange-500/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white font-semibold">
                          {d.docType}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            d.verified
                              ? "bg-green-500/20 text-green-300"
                              : "bg-orange-500/20 text-orange-300"
                          }`}
                        >
                          {d.verified ? "Verified" : "Pending"}
                        </div>
                      </div>

                      {/* Document Preview */}
                      {d.storageKey && (
                        <div className="mb-3">
                          <img
                            src={getImageUrl(d.storageKey)}
                            alt={d.docType}
                            className="w-full h-32 object-cover rounded-lg border border-slate-600"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                          <div className="hidden w-full h-32 bg-slate-700/50 rounded-lg border border-slate-600 items-center justify-center">
                            <FileText className="w-8 h-8 text-white/30" />
                          </div>
                        </div>
                      )}

                      <div className="text-white/70 text-sm mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/50">Uploaded:</span>
                          <div className="text-right">
                            <div className="text-white/70">
                              {formatUploadDate(d.uploadedAt)}
                            </div>
                            {getRelativeTime(d.uploadedAt) && (
                              <div className="text-white/50 text-xs">
                                {getRelativeTime(d.uploadedAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {d.reviewNotes && (
                        <div className="text-white/60 text-sm mb-3 p-2 bg-slate-700/50 rounded">
                          Notes: {d.reviewNotes}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => reviewDocument(d.id, true)}
                          disabled={actionLoading.has(d.id) || d.verified}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {actionLoading.has(d.id)
                            ? "Processing..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => reviewDocument(d.id, false)}
                          disabled={actionLoading.has(d.id) || d.verified}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4" />
                          {actionLoading.has(d.id) ? "Processing..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
