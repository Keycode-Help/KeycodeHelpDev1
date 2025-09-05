import React, { useEffect, useState } from "react";
import api from "../services/request";
import { ModalContent } from "../components/ModalContent";
import {
  Users,
  ShieldOff,
  FileText,
  StickyNote,
  Phone,
  Calendar,
  Ban,
  CheckCircle,
  Shield,
  AlertCircle,
} from "lucide-react";

function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [modalImage, setModalImage] = useState(null);

  // Fetch users
  useEffect(() => {
    api
      .get("/admin/users")
      .then((response) => {
        console.log("Users data:", response.data);
        setUsers(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleValidateUser = (id) => {
    if (
      !confirm(
        "Are you sure you want to approve this user's registration? This will grant them full platform access."
      )
    ) {
      return;
    }

    api
      .patch(`/admin/validate-user/${id}`)
      .then(() => {
        alert(
          "User registration approved successfully! They now have full platform access."
        );
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isValidatedUser: true } : u))
        );
        // Update selected user if it's the same one
        if (selectedUser?.id === id) {
          setSelectedUser({ ...selectedUser, isValidatedUser: true });
        }
      })
      .catch((error) => {
        console.error("Validation error:", error);
        alert("Failed to approve user registration. Please try again.");
      });
  };

  const handleSendNotification = () => {
    if (!notificationMessage.trim()) {
      alert("Please enter a message to send.");
      return;
    }
    const formData = new FormData();
    formData.append("message", notificationMessage);
    api
      .post(`/admin/notify-user/${selectedUser.id}`, formData)
      .then(() => {
        alert("Notification sent successfully.");
        setNotificationMessage("");
      })
      .catch(() => alert("Failed to send notification."));
  };

  const handleRevokeUser = (id) => {
    if (!confirm("Revoke this user's access?")) return;
    api
      .patch(`/admin/users/${id}/revoke`)
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isActive: false } : u))
        );
        if (selectedUser?.id === id)
          setSelectedUser({ ...selectedUser, isActive: false });
      })
      .catch(() => alert("Failed to revoke user."));
  };

  const handleSaveNotes = (id, notes) => {
    const formData = new FormData();
    formData.append("notes", notes);
    api
      .patch(`/admin/users/${id}/notes`, formData)
      .then(() => alert("Notes updated."))
      .catch(() => alert("Failed to update notes."));
  };

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="mb-6 rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#0d0f1a] to-[#121524] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Registered Users
              </h1>
              <p className="text-gray-300">
                Manage validation, restrictions, and communication
              </p>
            </div>
          </div>
          {/* Validation Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {users.filter((u) => u.isValidatedUser).length}
              </div>
              <div className="text-xs text-gray-400">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {users.filter((u) => !u.isValidatedUser).length}
              </div>
              <div className="text-xs text-gray-400">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">
                {users.length}
              </div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users list */}
        <section className="rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className={`rounded-2xl border ${
                  user.isActive ? "border-neutral-800" : "border-red-800"
                } bg-black/40 p-4 hover:border-neutral-700 transition-colors`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold">
                      {user.fname} {user.lname}
                    </div>
                    {!user.isActive && (
                      <span className="text-xs text-red-400">Inactive</span>
                    )}
                  </div>
                  <div className="text-gray-300 text-sm">{user.email}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {user.isValidatedUser ? (
                      <div className="flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        <span>Approved</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <span>Pending Review</span>
                      </div>
                    )}
                  </div>
                  {user.trialEndsAt && (
                    <div className="text-gray-400 text-xs mt-1">
                      Trial ends: {new Date(user.trialEndsAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Validation Button */}
                {!user.isValidatedUser && user.isActive && (
                  <div className="mt-3 pt-3 border-t border-neutral-700">
                    <button
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleValidateUser(user.id);
                      }}
                    >
                      <Shield className="h-4 w-4" />
                      Approve
                    </button>
                  </div>
                )}

                {/* Debug info - remove this later */}
                <div className="mt-2 text-xs text-gray-500">
                  Debug: isValidatedUser={String(user.isValidatedUser)},
                  isActive={String(user.isActive)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Selection details */}
        <section className="rounded-3xl border border-neutral-800 bg-black/30 p-5 backdrop-blur supports-[backdrop-filter]:bg-black/40">
          {!selectedUser ? (
            <div className="text-gray-400">Select a user to view details</div>
          ) : (
            <div className="space-y-3">
              <div className="text-white text-lg font-semibold">
                {selectedUser.fname} {selectedUser.lname}
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <Phone className="h-4 w-4" /> {selectedUser.phone || "N/A"}
              </div>
              <div className="text-gray-300">Email: {selectedUser.email}</div>
              <div className="text-gray-300">State: {selectedUser.state}</div>
              <div className="text-gray-300">
                Industry: {selectedUser.industry || "N/A"}
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Trial:{" "}
                  {selectedUser.trialEndsAt
                    ? `ends ${new Date(
                        selectedUser.trialEndsAt
                      ).toLocaleString()}`
                    : "-"}
                </span>
              </div>
              {/* Validation Status */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-neutral-700">
                {selectedUser.isValidatedUser ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Registration Approved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Pending Admin Review</span>
                  </div>
                )}
              </div>
              {/* Notes */}
              <div>
                <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                  <StickyNote className="h-4 w-4" /> Admin Notes
                </label>
                <textarea
                  className="w-full rounded-xl bg-black/30 border border-neutral-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={4}
                  defaultValue={selectedUser.adminApprovalNotes || ""}
                  onBlur={(e) =>
                    handleSaveNotes(selectedUser.id, e.target.value)
                  }
                  placeholder="Add notes (visible to admins only)"
                />
              </div>
              {/* Restrictions - placeholder, can be extended */}
              <div>
                <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4" /> Restrictions
                </label>
                <div className="text-gray-400 text-sm">
                  Use notes to track any restrictions for now.
                </div>
              </div>
              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-neutral-700">
                {!selectedUser.isValidatedUser && selectedUser.isActive && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">
                      Review the user's documents and information above, then
                      approve their registration.
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                      onClick={() => handleValidateUser(selectedUser.id)}
                    >
                      <Shield className="h-5 w-5" />
                      Approve Registration
                    </button>
                  </div>
                )}
                {selectedUser.isValidatedUser && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>User registration has been approved</span>
                  </div>
                )}
                {selectedUser.isActive && (
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 hover:border-red-600/50 font-semibold rounded-xl transition-all duration-200"
                    onClick={() => handleRevokeUser(selectedUser.id)}
                  >
                    <Ban className="h-4 w-4" /> Revoke Access
                  </button>
                )}
              </div>
              {/* ID images */}
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedUser.frontId && (
                  <img
                    src={selectedUser.frontId}
                    alt="Front ID"
                    className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                    onClick={() => openModal(selectedUser.frontId)}
                  />
                )}
                {selectedUser.backId && (
                  <img
                    src={selectedUser.backId}
                    alt="Back ID"
                    className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                    onClick={() => openModal(selectedUser.backId)}
                  />
                )}
                {selectedUser.insurance && (
                  <img
                    src={selectedUser.insurance}
                    alt="Insurance"
                    className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                    onClick={() => openModal(selectedUser.insurance)}
                  />
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {modalImage && (
        <ModalContent modalImage={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
}

export default RegisteredUsers;
