import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/superAdminDashboard.css";

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
      
      // Fetch pending admin approvals
      const pendingResponse = await fetch(
        `http://localhost:8080/admin-approval/pending?superAdminEmail=${encodeURIComponent(user.email)}`
      );
      
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingAdmins(pendingData || []);
      }

      // Fetch approved admins
      const approvedResponse = await fetch(
        `http://localhost:8080/admin-approval/approved?superAdminEmail=${encodeURIComponent(user.email)}`
      );
      
      if (approvedResponse.ok) {
        const approvedData = await approvedResponse.json();
        setApprovedAdmins(approvedData || []);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adminId, notes) => {
    try {
      const response = await fetch("http://localhost:8080/admin-approval/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          superAdminEmail: user.email,
          adminId: adminId.toString(),
          approvalNotes: notes || "Approved by super admin",
        }),
      });

      if (response.ok) {
        alert("Admin account approved successfully!");
        fetchAdminData(); // Refresh the data
      } else {
        const errorData = await response.json();
        alert("Failed to approve admin: " + errorData.error);
      }
    } catch (error) {
      console.error("Error approving admin:", error);
      alert("Error approving admin account");
    }
  };

  const handleReject = async (adminId, notes) => {
    try {
      const response = await fetch("http://localhost:8080/admin-approval/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          superAdminEmail: user.email,
          adminId: adminId.toString(),
          rejectionNotes: notes || "Rejected by super admin",
        }),
      });

      if (response.ok) {
        alert("Admin account rejected successfully!");
        fetchAdminData(); // Refresh the data
      } else {
        const errorData = await response.json();
        alert("Failed to reject admin: " + errorData.error);
      }
    } catch (error) {
      console.error("Error rejecting admin:", error);
      alert("Error rejecting admin account");
    }
  };

  const AdminCard = ({ admin, isPending = false }) => {
    const [notes, setNotes] = useState("");

    return (
      <div className={`admin-card ${isPending ? "pending" : "approved"}`}>
        <div className="admin-info">
          <h3>{admin.fname} {admin.lname}</h3>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Phone:</strong> {admin.phone}</p>
          <p><strong>Company:</strong> {admin.company}</p>
          <p><strong>Status:</strong> {isPending ? "Pending Approval" : "Approved"}</p>
          {admin.adminApprovalNotes && (
            <p><strong>Notes:</strong> {admin.adminApprovalNotes}</p>
          )}
        </div>
        
        {isPending && (
          <div className="admin-actions">
            <textarea
              placeholder="Add approval/rejection notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-input"
            />
            <div className="action-buttons">
              <button
                onClick={() => handleApprove(admin.id, notes)}
                className="approve-btn"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(admin.id, notes)}
                className="reject-btn"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="super-admin-dashboard">
        <div className="loading">Loading admin data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="super-admin-dashboard">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="super-admin-dashboard">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Manage admin account approvals and system administration</p>
      </div>

      <div className="dashboard-content">
        <div className="section">
          <h2>Pending Admin Approvals ({pendingAdmins.length})</h2>
          {pendingAdmins.length === 0 ? (
            <p className="no-data">No pending admin approvals</p>
          ) : (
            <div className="admin-grid">
              {pendingAdmins.map((admin) => (
                <AdminCard key={admin.id} admin={admin} isPending={true} />
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h2>Approved Admins ({approvedAdmins.length})</h2>
          {approvedAdmins.length === 0 ? (
            <p className="no-data">No approved admins</p>
          ) : (
            <div className="admin-grid">
              {approvedAdmins.map((admin) => (
                <AdminCard key={admin.id} admin={admin} isPending={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
