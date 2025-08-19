import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import { Shield, CheckCircle2, XCircle } from "lucide-react";

function SuperAdminDashboard() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes] = await Promise.all([
        api.get("/admin-approval/pending", { params: { superAdminEmail: user.email } }),
        api.get("/admin-approval/approved", { params: { superAdminEmail: user.email } }),
      ]);

      setPendingAdmins(pendingRes?.data || []);
      setApprovedAdmins(approvedRes?.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adminId, notes) => {
    try {
      await api.post("/admin-approval/approve", {
        superAdminEmail: user.email,
        adminId: String(adminId),
        approvalNotes: notes || "Approved by super admin",
      });
      alert("Admin account approved successfully!");
      fetchAdminData();
    } catch (error) {
      console.error("Error approving admin:", error);
      alert("Failed to approve admin");
    }
  };

  const handleReject = async (adminId, notes) => {
    try {
      await api.post("/admin-approval/reject", {
        superAdminEmail: user.email,
        adminId: String(adminId),
        rejectionNotes: notes || "Rejected by super admin",
      });
      alert("Admin account rejected successfully!");
      fetchAdminData();
    } catch (error) {
      console.error("Error rejecting admin:", error);
      alert("Failed to reject admin");
    }
  };

  const AdminCard = ({ admin, isPending = false }) => {
    const [notes, setNotes] = useState("");

    return (
      <div className={`glass-card rounded-2xl border border-[var(--border)] shadow-xl p-5 ${isPending ? "bg-[var(--surface)]" : "bg-[var(--surfaceDark)]"}`}>
        <div className="flex items-start gap-4">
          <div className={`mt-1 ${isPending ? "text-yellow-400" : "text-emerald-400"}`}>
            {isPending ? <Shield className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              {admin.fname} {admin.lname}
            </h3>
            <div className="mt-1 text-sm text-gray-300 space-y-1">
              <p><span className="text-gray-400">Email:</span> {admin.email}</p>
              <p><span className="text-gray-400">Phone:</span> {admin.phone || "—"}</p>
              <p><span className="text-gray-400">Company:</span> {admin.company || "—"}</p>
              <p>
                <span className="text-gray-400">Status:</span> {isPending ? "Pending Approval" : "Approved"}
              </p>
              {admin.adminApprovalNotes && (
                <p><span className="text-gray-400">Notes:</span> {admin.adminApprovalNotes}</p>
              )}
            </div>
          </div>
        </div>

        {isPending && (
          <div className="mt-4">
            <textarea
              placeholder="Add approval/rejection notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleApprove(admin.id, notes)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white px-4 py-2 font-medium transition"
              >
                <CheckCircle2 className="h-5 w-5" /> Approve
              </button>
              <button
                onClick={() => handleReject(admin.id, notes)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500/90 hover:bg-red-500 text-white px-4 py-2 font-medium transition"
              >
                <XCircle className="h-5 w-5" /> Reject
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <div className="text-center text-gray-300">Loading admin data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <div className="text-center text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="glare-overlay absolute inset-0 pointer-events-none" />
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 relative">
        <div className="mb-8 rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#0d0f1a] to-[#121524] p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Super Admin Dashboard</h1>
              <p className="text-gray-300">Manage admin approvals and oversee system operations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl border border-[var(--border)] p-5">
            <h2 className="text-white font-semibold text-lg mb-3">Pending Admin Approvals ({pendingAdmins.length})</h2>
            {pendingAdmins.length === 0 ? (
              <p className="text-gray-400">No pending admin approvals</p>
            ) : (
              <div className="grid gap-4">
                {pendingAdmins.map((admin) => (
                  <AdminCard key={admin.id} admin={admin} isPending={true} />
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl border border-[var(--border)] p-5">
            <h2 className="text-white font-semibold text-lg mb-3">Approved Admins ({approvedAdmins.length})</h2>
            {approvedAdmins.length === 0 ? (
              <p className="text-gray-400">No approved admins</p>
            ) : (
              <div className="grid gap-4">
                {approvedAdmins.map((admin) => (
                  <AdminCard key={admin.id} admin={admin} isPending={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
