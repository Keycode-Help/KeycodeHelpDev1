import React, { useState, useEffect } from "react";
import api from "../services/request";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin } from "../utils/roles";

function UserHistoryPage() {
  const { user, userRole } = useAuth();
  const [email, setEmail] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  // Check admin access
  useEffect(() => {
    if (userRole) {
      // Temporary workaround: Check if this is the known super admin email
      const userEmail = user?.email;
      const isKnownSuperAdmin = userEmail === "5epmgllc@gmail.com";

      let effectiveRole = userRole;

      if (isKnownSuperAdmin && (userRole === "BASEUSER" || !userRole)) {
        console.log(
          "🔧 Known super admin detected with incorrect role, updating..."
        );
        effectiveRole = "SUPER_ADMIN";
        console.warn(
          "⚠️  Temporary role assignment - please run the update script to fix this permanently"
        );
      }

      const hasAccess = canSeeAdmin(effectiveRole);
      setHasAdminAccess(hasAccess);
      console.log("UserHistoryPage - Admin access check:", {
        userRole,
        effectiveRole,
        hasAccess,
        userEmail,
        isKnownSuperAdmin,
      });

      if (!hasAccess) {
        setError("Access denied. You don't have admin privileges.");
      }
    } else {
      console.log("UserHistoryPage - No user role available yet");
    }
  }, [userRole, user?.email]);

  const fetchHistory = () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log("🔍 Fetching user history for:", email);
    console.log("🔍 Current user role:", userRole);
    console.log("🔍 Has admin access:", hasAdminAccess);

    api
      .get(`/admin/user-history?email=${encodeURIComponent(email)}`)
      .then((response) => {
        setHistory(response.data);
        console.log("✅ User history fetched successfully:", {
          email: email,
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          length: response.data?.length,
          data: response.data,
        });

        // Show informative message if user exists but has no transactions
        if (Array.isArray(response.data) && response.data.length === 0) {
          setError(
            `User "${email}" found, but has no transaction history yet.`
          );
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching user history:", error);
        console.error("❌ Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });

        // Handle specific error cases
        if (
          error.response?.status === 400 &&
          error.response?.data === "User not found"
        ) {
          setError(`User with email "${email}" does not exist in the system.`);
        } else if (error.response?.status === 403) {
          setError(
            "Access denied. You don't have permission to view user history."
          );
        } else {
          setError(
            `Failed to fetch user history: ${
              error.response?.data?.message ||
              error.response?.data ||
              error.message
            }`
          );
        }
      })
      .finally(() => setIsLoading(false));
  };

  // Show access denied if user doesn't have admin privileges
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-600 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Access Denied
            </h1>
            <p className="text-white/70 text-lg mb-6">
              You don't have admin privileges to access this page.
            </p>
            <div className="text-white/50 text-sm">
              Current role: {userRole || "Not authenticated"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            User History
          </h1>
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter User Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchHistory()}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={fetchHistory}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Fetching..." : "Fetch History"}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Helper section */}
            {!isLoading && history.length === 0 && !error && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <h4 className="text-blue-300 font-semibold mb-2">💡 Tip:</h4>
                <p className="text-blue-200 text-sm mb-2">
                  To find users with transaction history, you can:
                </p>
                <ul className="text-blue-200/80 text-sm space-y-1 ml-4">
                  <li>• Check the User Management page for active users</li>
                  <li>• Look for users who have completed purchases</li>
                  <li>• Try searching for your own email: {user?.email}</li>
                </ul>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/80 text-lg">Loading...</p>
            </div>
          ) : history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-slate-800/50 border border-slate-600 rounded-xl overflow-hidden">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      Confirmation Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-t border-slate-600 hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-white/80">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.status === "completed"
                              ? "bg-green-500/10 text-green-400 border border-green-500/30"
                              : transaction.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-500/10 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {transaction.confirmationNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : email ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-white/80 text-lg mb-2">
                No transaction history found
              </p>
              <p className="text-white/60 text-sm">
                {email
                  ? `for "${email}"`
                  : "Enter an email address and click 'Fetch History' to search"}
              </p>
              <div className="mt-6 p-4 bg-slate-700/30 rounded-xl text-left max-w-md mx-auto">
                <h4 className="text-white font-semibold mb-2">
                  Possible reasons:
                </h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• User has no completed transactions</li>
                  <li>• User has only pending/failed transactions</li>
                  <li>• Check if the email address is correct</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-white/80 text-lg">
                Enter a user email address above to search for their transaction
                history
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserHistoryPage;
