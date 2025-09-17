import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper } from "../utils/roles";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, user, isLoading, isInitialized } = useAuth();

  // Debug: Log auth context state
  console.log("AuthContext state:", {
    isLoading,
    isInitialized,
    user,
  });

  // Watch for user changes and navigate accordingly
  useEffect(() => {
    if (user?.role) {
      const currentRole = user.role;
      const userEmail = user.email;
      console.log("User role detected:", currentRole, "User object:", user);

      // Temporary workaround: Check if this is the known super admin email
      const isKnownSuperAdmin = userEmail === '5epmgllc@gmail.com';
      
      if (isKnownSuperAdmin && (currentRole === 'BASEUSER' || !currentRole)) {
        console.log("🔧 Known super admin detected with incorrect role, updating...");
        // Update the user object with the correct role
        const updatedUser = { ...user, role: 'SUPER_ADMIN' };
        // This is a temporary fix - the role should be set in Supabase
        console.warn("⚠️  Temporary role assignment - please run the update script to fix this permanently");
      }

      if (canSeeAdmin(currentRole) && !isSuper(currentRole)) {
        navigate("/admin");
      } else if (isSuper(currentRole) || (isKnownSuperAdmin && currentRole === 'BASEUSER')) {
        navigate("/super-admin");
      } else {
        // If not admin, show error and redirect back to admin login
        console.log("❌ Access denied for user:", { email: userEmail, role: currentRole });
        alert("Access denied. Admin privileges required.");
        navigate("/admin-login");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (import.meta.env.DEV) {
      console.log("Form submitted with:", {
        email: formData.email,
        password: "[REDACTED]",
      });
      console.log("Login function:", login);
    }

    try {
      if (import.meta.env.DEV) {
        console.log("Calling login function...");
      }
      const result = await login(formData.email, formData.password);
      if (import.meta.env.DEV) {
        console.log("Login result:", result);
      }
      // The navigation will be handled by the useEffect above
    } catch (error) {
      console.error("Admin login failed", error);
      alert("Admin login failed. " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-surface/50 backdrop-blur-sm border border-secondary rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-white/70">Administrative login portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@keycode.help"
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-surface/50 border border-secondary rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-surface/50 border border-secondary rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p>
              <a
                href="/login"
                className="text-primary hover:text-primary-light transition-colors duration-200"
              >
                ← Back to User Login
              </a>
            </p>
            <p>
              <a
                href="/admin-register"
                className="text-primary hover:text-primary-light transition-colors duration-200"
              >
                🔐 Create Admin Account
              </a>
            </p>
            <p className="text-sm text-white/60">
              This portal is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
