import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin } from "../utils/roles";
import api from "../services/request";
import toast from "react-hot-toast";
import {
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  User,
  Car,
  RefreshCw,
} from "lucide-react";

function NastfCompliance() {
  const { user, userRole } = useAuth();
  const [complianceData, setComplianceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [filter, setFilter] = useState("all"); // all, urgent, overdue
  const [downloading, setDownloading] = useState(new Set());

  // Check admin access
  useEffect(() => {
    if (userRole) {
      // Debug current authentication state
      console.log("🔍 NastfCompliance - Current auth state:", {
        userRole,
        userEmail: user?.email,
        isSuper: userRole === "SUPER_ADMIN",
        canSeeAdminResult: canSeeAdmin(userRole),
        jwtToken: localStorage.getItem("auth_token")?.substring(0, 50) + "...",
        cookies: document.cookie,
      });

      const hasAccess = canSeeAdmin(userRole);
      setHasAdminAccess(hasAccess);

      if (!hasAccess) {
        setError(
          `Access denied. Current role: ${userRole}. Required: ADMIN or SUPER_ADMIN.`
        );
      }
    }
  }, [userRole, user?.email]);

  // Fetch compliance data
  const fetchComplianceData = async () => {
    if (!hasAdminAccess) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Fetching NASTF compliance data...");
      // Test with simpler endpoint first
      const response = await api.get("/admin/nastf-compliance-test");
      setComplianceData(response.data);
      console.log("✅ NASTF compliance data fetched:", response.data);
    } catch (error) {
      console.error("❌ Error fetching compliance data:", error);
      setError(
        `Failed to fetch compliance data: ${
          error.response?.data || error.message
        }`
      );
      toast.error("Failed to load NASTF compliance data");
    } finally {
      setIsLoading(false);
    }
  };

  // Download documents for D1 form
  const downloadDocuments = async (vehicleId, vin) => {
    if (downloading.has(vehicleId)) return;

    setDownloading((prev) => new Set(prev).add(vehicleId));

    try {
      console.log(`🔄 Downloading documents for vehicle ${vehicleId}...`);
      const response = await api.get(
        `/admin/nastf-compliance/${vehicleId}/documents`
      );

      const { documents, vehicleInfo } = response.data;

      // Create and download D1 form data as JSON
      const d1FormData = {
        nastfD1Form: {
          vehicleInfo: {
            vin: vehicleInfo.vin,
            make: vehicleInfo.make,
            model: vehicleInfo.model,
            year: vehicleInfo.year,
            keycode: vehicleInfo.keycode,
            confirmationNumber: vehicleInfo.confirmationNumber,
            orderDate: vehicleInfo.createdAt,
          },
          customerInfo: vehicleInfo.user,
          documents: {
            frontIdAvailable: !!documents.frontId,
            backIdAvailable: !!documents.backId,
            registrationAvailable: !!documents.registration,
          },
          complianceInfo: {
            downloadedAt: new Date().toISOString(),
            downloadedBy: user?.email,
            purpose: "NASTF D1 Form Compliance",
          },
        },
      };

      // Download JSON file
      const jsonBlob = new Blob([JSON.stringify(d1FormData, null, 2)], {
        type: "application/json",
      });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement("a");
      jsonLink.href = jsonUrl;
      jsonLink.download = `NASTF_D1_${vin}_${vehicleInfo.confirmationNumber}.json`;
      jsonLink.click();
      URL.revokeObjectURL(jsonUrl);

      // Download individual documents if available
      if (documents.frontId) {
        const frontBlob = new Blob(
          [Uint8Array.from(atob(documents.frontId), (c) => c.charCodeAt(0))],
          { type: "image/jpeg" }
        );
        const frontUrl = URL.createObjectURL(frontBlob);
        const frontLink = document.createElement("a");
        frontLink.href = frontUrl;
        frontLink.download = `${vin}_front_id.jpg`;
        frontLink.click();
        URL.revokeObjectURL(frontUrl);
      }

      if (documents.backId) {
        const backBlob = new Blob(
          [Uint8Array.from(atob(documents.backId), (c) => c.charCodeAt(0))],
          { type: "image/jpeg" }
        );
        const backUrl = URL.createObjectURL(backBlob);
        const backLink = document.createElement("a");
        backLink.href = backUrl;
        backLink.download = `${vin}_back_id.jpg`;
        backLink.click();
        URL.revokeObjectURL(backUrl);
      }

      if (documents.registration) {
        const regBlob = new Blob(
          [
            Uint8Array.from(atob(documents.registration), (c) =>
              c.charCodeAt(0)
            ),
          ],
          { type: "image/jpeg" }
        );
        const regUrl = URL.createObjectURL(regBlob);
        const regLink = document.createElement("a");
        regLink.href = regUrl;
        regLink.download = `${vin}_registration.jpg`;
        regLink.click();
        URL.revokeObjectURL(regUrl);
      }

      toast.success(`Documents downloaded for VIN: ${vin}`);
      console.log("✅ Documents downloaded successfully");
    } catch (error) {
      console.error("❌ Error downloading documents:", error);
      toast.error("Failed to download documents");
    } finally {
      setDownloading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(vehicleId);
        return newSet;
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (hasAdminAccess) {
      fetchComplianceData();
    }
  }, [hasAdminAccess, filter]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!hasAdminAccess) return;

    const interval = setInterval(() => {
      fetchComplianceData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [hasAdminAccess, filter]);

  // Show access denied if user doesn't have admin privileges
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              Access Denied
            </h2>
            <p className="text-red-300">
              {error ||
                "You don't have permission to access NASTF compliance data."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (item) => {
    if (item.isOverdue) return "text-red-400 bg-red-500/10 border-red-500/30";
    if (item.isUrgent)
      return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    if (item.daysRemaining <= 1)
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
    return "text-green-400 bg-green-500/10 border-green-500/30";
  };

  const getUrgencyText = (item) => {
    if (item.isOverdue) return "OVERDUE";
    if (item.isUrgent) return "URGENT";
    if (item.daysRemaining <= 1) return "DUE SOON";
    return "ON TIME";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            NASTF Compliance Dashboard
          </h1>
          <p className="text-white/70 text-center mb-6">
            Monitor keycode orders requiring D1 form completion within 4 days
          </p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-white/70 hover:bg-slate-600"
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter("urgent")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "urgent"
                    ? "bg-orange-600 text-white"
                    : "bg-slate-700 text-white/70 hover:bg-slate-600"
                }`}
              >
                Urgent (Day 3-4)
              </button>
            </div>

            <button
              onClick={fetchComplianceData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80 text-lg">Loading compliance data...</p>
          </div>
        ) : complianceData.length > 0 ? (
          <div className="space-y-4">
            {complianceData.map((item) => (
              <div
                key={`${item.transactionId}-${item.vehicleId}`}
                className={`border rounded-xl p-6 ${getUrgencyColor(item)}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(
                          item
                        )}`}
                      >
                        {getUrgencyText(item)}
                      </div>
                      <span className="text-white font-semibold">
                        {item.daysRemaining} days remaining
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-white/60 mb-1">VIN</div>
                        <div className="text-white font-mono">{item.vin}</div>
                      </div>
                      <div>
                        <div className="text-white/60 mb-1">Vehicle</div>
                        <div className="text-white">
                          {item.year} {item.make} {item.model}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 mb-1">Customer</div>
                        <div className="text-white">{item.userName}</div>
                        <div className="text-white/70 text-xs">
                          {item.userEmail}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 mb-1">Order Date</div>
                        <div className="text-white">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Confirmation: {item.confirmationNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        Status: {item.status}
                      </span>
                      {item.keycode && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Keycode: {item.keycode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Document Status & Download */}
                  <div className="lg:w-64">
                    <div className="text-white/60 text-xs mb-2">
                      Available Documents:
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.hasFrontId
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        Front ID
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.hasBackId
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        Back ID
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.hasRegistration
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        Registration
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        downloadDocuments(item.vehicleId, item.vin)
                      }
                      disabled={downloading.has(item.vehicleId)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloading.has(item.vehicleId) ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download D1 Docs
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-white/80 text-lg mb-2">
              {filter === "urgent"
                ? "No urgent NASTF compliance items"
                : "All keycode orders are compliant"}
            </p>
            <p className="text-white/60 text-sm">
              {filter === "urgent"
                ? "No orders are within 1 day of the 4-day NASTF deadline"
                : "No keycode orders require immediate D1 form completion"}
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-slate-800/50 border border-slate-600 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            NASTF D1 Form Requirements
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-white font-medium mb-2">
                Compliance Timeline:
              </h4>
              <ul className="space-y-1 text-white/70">
                <li>
                  • D1 forms must be completed within 4 days of keycode order
                </li>
                <li>• Orders become urgent on day 3 (24 hours remaining)</li>
                <li>• Overdue orders require immediate attention</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">
                Required Documents:
              </h4>
              <ul className="space-y-1 text-white/70">
                <li>• Customer photo ID (front and back)</li>
                <li>• Vehicle registration document</li>
                <li>• Order confirmation and vehicle details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NastfCompliance;
