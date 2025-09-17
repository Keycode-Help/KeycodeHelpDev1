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
  Shield
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
      const usersWithDocs = usersData.filter(user => 
        user.frontId || user.backId || user.insurance || user.isValidatedUser === false
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
  const fetchDocuments = useCallback(async (userId) => {
    if (!userId) return;
    
    setLoadingDocs(true);
    setError(null);

    try {
      const response = await api.get(`/compliance/documents/${userId}`);
      const docs = response.data || [];
      
      // Also include user's uploaded documents (frontId, backId, insurance)
      const user = users.find(u => u.id === userId);
      if (user) {
        const userDocs = [];
        
        if (user.frontId) {
          userDocs.push({
            id: `front-${user.id}`,
            docType: "Front ID",
            storageKey: user.frontId,
            uploadedAt: user.createdAt,
            verified: user.isValidatedUser === true,
            reviewNotes: user.isValidatedUser === false ? "Pending validation" : null
          });
        }
        
        if (user.backId) {
          userDocs.push({
            id: `back-${user.id}`,
            docType: "Back ID", 
            storageKey: user.backId,
            uploadedAt: user.createdAt,
            verified: user.isValidatedUser === true,
            reviewNotes: user.isValidatedUser === false ? "Pending validation" : null
          });
        }
        
        if (user.insurance) {
          userDocs.push({
            id: `insurance-${user.id}`,
            docType: "Insurance Document",
            storageKey: user.insurance,
            uploadedAt: user.createdAt,
            verified: user.isValidatedUser === true,
            reviewNotes: user.isValidatedUser === false ? "Pending validation" : null
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
  }, [users]);

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

  // Review document
  const reviewDocument = async (docId, verified, notes = "") => {
    setActionLoading((prev) => new Set(prev).add(docId));

    try {
      // For user documents (frontId, backId, insurance), we need to update the user's validation status
      if (docId.startsWith('front-') || docId.startsWith('back-') || docId.startsWith('insurance-')) {
        const userId = docId.split('-')[1];
        await api.post(`/admin/users/${userId}/approve`);
        
        // Update the user's validation status in the users list
        setUsers(prev => prev.map(u => 
          u.id === parseInt(userId) 
            ? { ...u, isValidatedUser: verified }
            : u
        ));
      } else {
        // For compliance documents, use the compliance endpoint
        await api.patch(`/compliance/documents/${docId}/review`, { verified, notes });
      }

      // Update the documents list
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, verified, reviewNotes: notes } : d))
      );

      console.log(`✅ Document ${docId} ${verified ? 'approved' : 'rejected'}`);
    } catch (error) {
      console.error(`❌ Failed to review document ${docId}:`, error);
      setError(`Failed to ${verified ? 'approve' : 'reject'} document. Please try again.`);
    } finally {
      setActionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
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
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="mb-6 rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#0d0f1a] to-[#121524] p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Document Validation
            </h1>
            <p className="text-gray-300">
              Review uploaded documents for policy compliance
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40 lg:col-span-1">
          <div className="flex items-center gap-2 text-gray-300 mb-3">
            <Users className="h-4 w-4" /> Users
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-auto pr-1">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`text-left rounded-2xl border ${
                  selectedUserId === u.id
                    ? "border-yellow-600"
                    : "border-neutral-800"
                } bg-black/40 p-4 hover:border-neutral-700 transition-colors`}
              >
                <div className="text-white font-semibold">
                  {u.fname} {u.lname}
                </div>
                <div className="text-gray-600 text-sm">{u.email}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40 lg:col-span-2">
          {!selectedUserId ? (
            <div className="text-gray-600">
              Select a user to view their documents.
            </div>
          ) : loadingDocs ? (
            <div className="text-gray-600">Loading documents...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-neutral-800 bg-black/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold">{d.docType}</div>
                    <div
                      className={`text-xs ${
                        d.verified ? "text-emerald-400" : "text-yellow-400"
                      }`}
                    >
                      {d.verified ? "Verified" : "Pending"}
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    Uploaded: {new Date(d.uploadedAt).toLocaleString()}
                  </div>
                  {d.reviewNotes && (
                    <div className="text-gray-600 text-sm mt-1">
                      Notes: {d.reviewNotes}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      className="rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-black font-semibold px-3 py-2 flex items-center gap-2"
                      onClick={() => review(d.id, true)}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                    <button
                      className="rounded-xl bg-red-500/90 hover:bg-red-500 text-white font-semibold px-3 py-2 flex items-center gap-2"
                      onClick={() => review(d.id, false)}
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
