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
      
      if (import.meta.env.DEV) {
        console.log("Fetching admin data for user:", user);
        console.log("User role:", user?.role);
        console.log("User email:", user?.email);
      }
      
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
      if (import.meta.env.DEV) {
        console.log("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          user: user
        });
      }
      setError(`Failed to fetch admin data: ${error.response?.status} ${error.response?.statusText}`);
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
        className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 ${
          isPending
            ? "border-l-4 border-l-yellow-500"
            : "border-l-4 border-l-emerald-500"
        }`}
      >
        <div className="flex items-start gap-4">
          {isPending && (
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-yellow-500 rounded"
              checked={selected.has(admin.id)}
              onChange={() => toggleSelected(admin.id)}
            />
          )}
          <div className="flex-shrink-0">
            <div
              className={`rounded-xl p-3 ${
                isPending ? "bg-yellow-500/20" : "bg-emerald-500/20"
              }`}
            >
              {isPending ? (
                <Shield className="h-6 w-6 text-yellow-400" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {admin.fname} {admin.lname}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">Email:</span>
                <span className="text-white truncate">{admin.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">Phone:</span>
                <span className="text-white">{admin.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <span className="text-gray-400 w-16">Company:</span>
                <span className="text-white">{admin.company || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-16">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isPending
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {isPending ? "Pending" : "Approved"}
                </span>
              </div>
            </div>
            {admin.adminApprovalNotes && (
              <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-300">
                  <span className="text-gray-400 font-medium">Notes:</span>{" "}
                  {admin.adminApprovalNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {isPending ? (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Approval Notes
              </label>
              <textarea
                placeholder="Add approval or rejection notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(admin.id, notes)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-3 font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
              >
                <CheckCircle2 className="h-5 w-5" /> Approve
              </button>
              <button
                onClick={() => handleReject(admin.id, notes)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
              >
                <XCircle className="h-5 w-5" /> Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <button
              onClick={() => handleRevoke(admin.id)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
            >
              <Trash2 className="h-5 w-5" /> Revoke Admin Access
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="relative z-10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-600/20 to-yellow-500/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-500 p-4 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                    Super Admin Dashboard
                  </h1>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Manage admin approvals and oversee system operations with
                    comprehensive control
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Search Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-xl bg-blue-500/20 p-3">
                      <Search className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      Search Admins
                    </h3>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, company..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Actions Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-xl bg-yellow-500/20 p-3">
                      <CheckCircle2 className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">Bulk Actions</h3>
                    <p className="text-gray-400 text-sm">
                      Selected: {selected.size} items
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={bulkApprove}
                    disabled={!selected.size}
                    className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all duration-200 ${
                      selected.size
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
                        : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Approve ({selected.size})
                  </button>
                  <button
                    onClick={bulkReject}
                    disabled={!selected.size}
                    className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all duration-200 ${
                      selected.size
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
                        : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
              {/* Send Admin Code Card */}
              <form
                onSubmit={requestAdminCode}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="rounded-xl bg-yellow-500/20 p-3">
                      <Mail className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      Send Admin Code
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Send registration code to new admin
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <input
                    value={codeForm.email}
                    onChange={(e) =>
                      setCodeForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="Email address"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      value={codeForm.firstName}
                      onChange={(e) =>
                        setCodeForm((f) => ({
                          ...f,
                          firstName: e.target.value,
                        }))
                      }
                      placeholder="First name"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      required
                    />
                    <input
                      value={codeForm.lastName}
                      onChange={(e) =>
                        setCodeForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      placeholder="Last name"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 hover:-translate-y-0.5"
                  >
                    Send Registration Code
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Create Super Admin Section */}
          <div className="mb-12">
            <form
              onSubmit={createSuperAdmin}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-shrink-0">
                  <div className="rounded-xl bg-emerald-500/20 p-3">
                    <Shield className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-xl">
                    Create Super Admin
                  </h3>
                  <p className="text-gray-400">
                    Create a new super admin account with full system access
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-white font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="admin@example.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="Enter password"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    First Name
                  </label>
                  <input
                    value={createForm.fname}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, fname: e.target.value }))
                    }
                    placeholder="John"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    value={createForm.lname}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, lname: e.target.value }))
                    }
                    placeholder="Doe"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    value={createForm.phone}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
                  >
                    Create Super Admin
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Admin Management Section */}
          <div className="mb-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Pending Approvals */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="rounded-xl bg-yellow-500/20 p-3">
                      <Shield className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-semibold text-xl">
                      Pending Approvals
                    </h2>
                    <p className="text-gray-400">
                      {
                        pendingAdmins.filter((f) => {
                          const q = searchQuery.toLowerCase();
                          if (!q) return true;
                          const s =
                            `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
                          return s.includes(q);
                        }).length
                      }{" "}
                      admin(s) awaiting approval
                    </p>
                  </div>
                </div>
                {pendingAdmins.filter((f) => {
                  const q = searchQuery.toLowerCase();
                  if (!q) return true;
                  const s =
                    `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
                  return s.includes(q);
                }).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="rounded-full bg-yellow-500/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-yellow-400" />
                    </div>
                    <p className="text-gray-400 text-lg">
                      No pending admin approvals
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      All admin requests have been processed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAdmins
                      .filter((f) => {
                        const q = searchQuery.toLowerCase();
                        if (!q) return true;
                        const s =
                          `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
                        return s.includes(q);
                      })
                      .map((admin) => (
                        <AdminCard
                          key={admin.id}
                          admin={admin}
                          isPending={true}
                        />
                      ))}
                  </div>
                )}
              </div>

              {/* Approved Admins */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="rounded-xl bg-emerald-500/20 p-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-semibold text-xl">
                      Approved Admins
                    </h2>
                    <p className="text-gray-400">
                      {
                        approvedAdmins.filter((f) => {
                          const q = searchQuery.toLowerCase();
                          if (!q) return true;
                          const s =
                            `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
                          return s.includes(q);
                        }).length
                      }{" "}
                      admin(s) with active access
                    </p>
                  </div>
                </div>
                {approvedAdmins.filter((f) => {
                  const q = searchQuery.toLowerCase();
                  if (!q) return true;
                  const s =
                    `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
                  return s.includes(q);
                }).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="rounded-full bg-emerald-500/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <p className="text-gray-400 text-lg">No approved admins</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Approved admins will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedAdmins
                      .filter((f) => {
                        const q = searchQuery.toLowerCase();
                        if (!q) return true;
                        const s =
                          `${f.fname} ${f.lname} ${f.email} ${f.company}`.toLowerCase();
                        return s.includes(q);
                      })
                      .map((admin) => (
                        <AdminCard
                          key={admin.id}
                          admin={admin}
                          isPending={false}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Actions Section */}
          <div className="mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="rounded-xl bg-blue-500/20 p-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-semibold text-xl">
                    Recent Actions
                  </h2>
                  <p className="text-gray-400">
                    Track all administrative activities and changes
                  </p>
                </div>
              </div>
              {actionLog.length === 0 ? (
                <div className="text-center py-12">
                  <div className="rounded-full bg-blue-500/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-gray-400 text-lg">No actions yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Administrative actions will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {actionLog.map((e) => (
                    <div
                      key={e.t}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{e.msg}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(e.t).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
