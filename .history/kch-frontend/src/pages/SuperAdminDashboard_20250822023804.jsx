import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Mail,
} from "lucide-react";

function SuperAdminDashboard() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [actionLog, setActionLog] = useState([]);
  const [codeForm, setCodeForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes] = await Promise.all([
        api.get("/admin-approval/pending", {
          params: { superAdminEmail: user.email },
        }),
        api.get("/admin-approval/approved", {
          params: { superAdminEmail: user.email },
        }),
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
      setActionLog((l) => [
        { t: Date.now(), msg: `Approved admin ID ${adminId}` },
        ...l,
      ]);
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
      setActionLog((l) => [
        { t: Date.now(), msg: `Rejected admin ID ${adminId}` },
        ...l,
      ]);
      fetchAdminData();
    } catch (error) {
      console.error("Error rejecting admin:", error);
      alert("Failed to reject admin");
    }
  };

  const toggleSelected = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkApprove = async () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    for (const id of ids) {
      try {
        await api.post("/admin-approval/approve", {
          superAdminEmail: user.email,
          adminId: String(id),
          approvalNotes: "Bulk approved",
        });
      } catch {}
    }
    setActionLog((l) => [
      { t: Date.now(), msg: `Bulk approved ${ids.length} admins` },
      ...l,
    ]);
    setSelected(new Set());
    fetchAdminData();
  };

  const bulkReject = async () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    for (const id of ids) {
      try {
        await api.post("/admin-approval/reject", {
          superAdminEmail: user.email,
          adminId: String(id),
          rejectionNotes: "Bulk rejected",
        });
      } catch {}
    }
    setActionLog((l) => [
      { t: Date.now(), msg: `Bulk rejected ${ids.length} admins` },
      ...l,
    ]);
    setSelected(new Set());
    fetchAdminData();
  };

  const requestAdminCode = async (e) => {
    e?.preventDefault?.();
    try {
      const { email, firstName, lastName } = codeForm;
      const res = await api.post("/admin-registration-code/request", {
        email: email?.trim(),
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
      });
      alert(res?.data?.message || "Code requested");
      setActionLog((l) => [
        { t: Date.now(), msg: `Sent admin code to ${email}` },
        ...l,
      ]);
      setCodeForm({ email: "", firstName: "", lastName: "" });
    } catch {
      alert("Failed to send admin code");
    }
  };

  const handleRevoke = async (adminId, notes) => {
    return handleReject(adminId, notes || "Revoked by super admin");
  };

  const createSuperAdmin = async (e) => {
    e?.preventDefault?.();
    try {
      const { email, password, fname, lname, phone } = createForm;
      await api.post("/super-admin/create", null, {
        params: {
          email: email?.trim(),
          password: password,
          fname: fname?.trim() || "Super",
          lname: lname?.trim() || "Admin",
          phone: phone?.trim() || "",
        },
      });
      alert("Super admin created successfully.");
      setActionLog((l) => [
        { t: Date.now(), msg: `Created super admin ${email}` },
        ...l,
      ]);
      setCreateForm({
        email: "",
        password: "",
        fname: "",
        lname: "",
        phone: "",
      });
    } catch (err) {
      alert(
        "Failed to create super admin. Only approved super admins can perform this action."
      );
    }
  };

  const AdminCard = ({ admin, isPending = false }) => {
    const [notes, setNotes] = useState("");

    return (
      <div
        className={`glass-card rounded-2xl border border-[var(--border)] shadow-xl p-5 ${
          isPending ? "bg-[var(--surface)]" : "bg-[var(--surfaceDark)]"
        }`}
      >
        <div className="flex items-start gap-4">
          {isPending && (
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-yellow-500"
              checked={selected.has(admin.id)}
              onChange={() => toggleSelected(admin.id)}
            />
          )}
          <div
            className={`mt-1 ${
              isPending ? "text-yellow-400" : "text-emerald-400"
            }`}
          >
            {isPending ? (
              <Shield className="h-6 w-6" />
            ) : (
              <CheckCircle2 className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              {admin.fname} {admin.lname}
            </h3>
            <div className="mt-1 text-sm text-gray-300 space-y-1">
              <p>
                <span className="text-gray-400">Email:</span> {admin.email}
              </p>
              <p>
                <span className="text-gray-400">Phone:</span>{" "}
                {admin.phone || "—"}
              </p>
              <p>
                <span className="text-gray-400">Company:</span>{" "}
                {admin.company || "—"}
              </p>
              <p>
                <span className="text-gray-400">Status:</span>{" "}
                {isPending ? "Pending Approval" : "Approved"}
              </p>
              {admin.adminApprovalNotes && (
                <p>
                  <span className="text-gray-400">Notes:</span>{" "}
                  {admin.adminApprovalNotes}
                </p>
              )}
            </div>
          </div>
        </div>

        {isPending ? (
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
        ) : (
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => handleRevoke(admin.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500/90 hover:bg-red-500 text-white px-4 py-2 font-medium transition"
            >
              <Trash2 className="h-5 w-5" /> Revoke Admin
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <div className="text-center">
          <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 mb-4 inline-block">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Please log in to access the super admin dashboard
          </p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-300">
                Manage admin approvals and oversee system operations
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl border border-[var(--border)] p-4 flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admins by name, email, company"
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="glass-card rounded-2xl border border-[var(--border)] p-4 flex items-center gap-3">
            <button
              onClick={bulkApprove}
              disabled={!selected.size}
              className={`rounded-xl px-4 py-2 font-medium transition ${
                selected.size
                  ? "bg-emerald-500/90 hover:bg-emerald-500 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Bulk Approve ({selected.size})
            </button>
            <button
              onClick={bulkReject}
              disabled={!selected.size}
              className={`rounded-xl px-4 py-2 font-medium transition ${
                selected.size
                  ? "bg-red-500/90 hover:bg-red-500 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Bulk Reject
            </button>
          </div>
          <form
            onSubmit={requestAdminCode}
            className="glass-card rounded-2xl border border-[var(--border)] p-4 grid grid-cols-1 md:grid-cols-4 gap-2 items-center"
          >
            <div className="flex items-center gap-2 md:col-span-4">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-white font-medium">
                Send Admin Registration Code
              </span>
            </div>
            <input
              value={codeForm.email}
              onChange={(e) =>
                setCodeForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="Email"
              className="rounded-lg bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              value={codeForm.firstName}
              onChange={(e) =>
                setCodeForm((f) => ({ ...f, firstName: e.target.value }))
              }
              placeholder="First name"
              className="rounded-lg bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              value={codeForm.lastName}
              onChange={(e) =>
                setCodeForm((f) => ({ ...f, lastName: e.target.value }))
              }
              placeholder="Last name"
              className="rounded-lg bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-yellow-500/90 hover:bg-yellow-500 text-black font-semibold px-4 py-2"
            >
              Send Code
            </button>
          </form>

          <form
            onSubmit={createSuperAdmin}
            className="glass-card rounded-2xl border border-[var(--border)] p-4 grid grid-cols-1 md:grid-cols-6 gap-2 items-center"
          >
            <div className="md:col-span-6 text-white font-medium">
              Create Super Admin
            </div>
            <input
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="Email"
              className="rounded-lg bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              type="password"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="Temp Password"
              className="rounded-lg bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              value={createForm.fname}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, fname: e.target.value }))
              }
              placeholder="First name"
              className="rounded-lg bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              value={createForm.lname}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, lname: e.target.value }))
              }
              placeholder="Last name"
              className="rounded-lg bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              value={createForm.phone}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="Phone (optional)"
              className="rounded-lg bg-black/30 border border-[var(--border)] text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white font-semibold px-4 py-2"
            >
              Create
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl border border-[var(--border)] p-5">
            <h2 className="text-white font-semibold text-lg mb-3">
              Pending Admin Approvals ({pendingAdmins.length})
            </h2>
            {pendingAdmins.filter((f) => {
              const q = searchQuery.toLowerCase();
              if (!q) return true;
              const s =
                `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
              return s.includes(q);
            }).length === 0 ? (
              <p className="text-gray-400">No pending admin approvals</p>
            ) : (
              <div className="grid gap-4">
                {pendingAdmins
                  .filter((f) => {
                    const q = searchQuery.toLowerCase();
                    if (!q) return true;
                    const s =
                      `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
                    return s.includes(q);
                  })
                  .map((admin) => (
                    <AdminCard key={admin.id} admin={admin} isPending={true} />
                  ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl border border-[var(--border)] p-5">
            <h2 className="text-white font-semibold text-lg mb-3">
              Approved Admins ({approvedAdmins.length})
            </h2>
            {approvedAdmins.filter((f) => {
              const q = searchQuery.toLowerCase();
              if (!q) return true;
              const s =
                `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
              return s.includes(q);
            }).length === 0 ? (
              <p className="text-gray-400">No approved admins</p>
            ) : (
              <div className="grid gap-4">
                {approvedAdmins
                  .filter((f) => {
                    const q = searchQuery.toLowerCase();
                    if (!q) return true;
                    const s =
                      `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
                    return s.includes(q);
                  })
                  .map((admin) => (
                    <AdminCard key={admin.id} admin={admin} isPending={false} />
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 glass-card rounded-3xl border border-[var(--border)] p-5">
          <h2 className="text-white font-semibold text-lg mb-3">
            Recent Actions
          </h2>
          {actionLog.length === 0 ? (
            <p className="text-gray-400">No actions yet</p>
          ) : (
            <ul className="text-sm text-gray-300 space-y-1">
              {actionLog.map((e) => (
                <li key={e.t} className="flex items-center gap-2">
                  <span className="text-gray-500">
                    {new Date(e.t).toLocaleTimeString()}
                  </span>
                  <span>{e.msg}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
