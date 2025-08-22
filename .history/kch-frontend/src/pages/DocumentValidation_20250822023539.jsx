import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import { FileText, CheckCircle2, XCircle, Users } from "lucide-react";

export default function DocumentValidation() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    if (user) {
      api.get("/admin/users").then((res) => setUsers(res.data));
    }
  }, [user]);

  useEffect(() => {
    if (!selectedUserId) return;
    setLoadingDocs(true);
    api
      .get(`/compliance/documents/${selectedUserId}`)
      .then((res) => setDocuments(res.data))
      .finally(() => setLoadingDocs(false));
  }, [selectedUserId]);

  const review = (docId, verified) => {
    api
      .patch(`/compliance/documents/${docId}/review`, { verified, notes: "" })
      .then(() =>
        setDocuments((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, verified } : d))
        )
      );
  };

  // Show loading state if user is not authenticated
  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="mb-6 rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#0d0f1a] to-[#121524] p-6 shadow-2xl">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 mb-4">
                <FileText className="h-8 w-8 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Document Validation</h1>
              <p className="text-gray-300">Please log in to access document validation</p>
            </div>
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
                <div className="text-gray-400 text-sm">{u.email}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40 lg:col-span-2">
          {!selectedUserId ? (
            <div className="text-gray-400">
              Select a user to view their documents.
            </div>
          ) : loadingDocs ? (
            <div className="text-gray-400">Loading documents...</div>
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
                  <div className="text-gray-400 text-sm mt-1">
                    Uploaded: {new Date(d.uploadedAt).toLocaleString()}
                  </div>
                  {d.reviewNotes && (
                    <div className="text-gray-400 text-sm mt-1">
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
