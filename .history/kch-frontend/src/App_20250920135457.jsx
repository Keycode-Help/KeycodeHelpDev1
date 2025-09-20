import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// Only import Analytics in production to prevent dev issues
const Analytics = process.env.NODE_ENV === "production" 
  ? require("@vercel/analytics/react").Analytics 
  : () => null;
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import Footer from "./components/Footer";
import TrialExpirationHandler from "./components/TrialExpirationHandler";
import TrialBanner from "./components/TrialBanner";
import OfflineIndicator from "./components/OfflineIndicator";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useTrialStatus } from "./hooks/useTrialStatus";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import ErrorBoundary from "./utils/errorBoundary.jsx";
// import "./styles/mobile-responsive.css"; // Removed - using Tailwind only
import { initMobileResponsiveness } from "./utils/mobileResponsivenessTest";
import {
  initZFoldOptimizations,
  addZFoldCSSVariables,
} from "./utils/zFoldDetection";
import { syncActions, clearOldCache } from "./utils/offlineQueue";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import VehicleKeycodeRequest from "./pages/VehicleKeycodeRequest";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SubscriptionManager from "./pages/SubscriptionManager";
import UserHistoryPage from "./pages/UserHistoryPage";
import RegisteredUsersPage from "./pages/RegisteredUsers"; // Import the new page
import UserManagement from "./pages/UserManagement";
import DocumentValidation from "./pages/DocumentValidation";
import Requirements from "./pages/Requirements";
import UserDash from "./pages/UserDash";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import UpdateUserProfile from "./pages/UpdateUserProfile";
import ChangePassword from "./pages/ChangePassword";
import OfflinePage from "./pages/OfflinePage";
import LandingPage from "./pages/LandingPage";
import Support from "./pages/Support";
import PricelistPage from "./pages/PricelistPage";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import TOS from "./pages/TOS";
import RefundPolicy from "./pages/RefundPolicy";
import MembershipCancellation from "./pages/MembershipCancellation";
import KeycodePortals from "./pages/KeycodePortals";
import KchDatabase from "./pages/KchDatabase";
import NastfCompliance from "./pages/NastfCompliance";
import AdminActivityLogs from "./pages/AdminActivityLogs";

// Component to handle conditional navigation rendering
function AppContent() {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useAuth();
  const { shouldShowTrialNotice } = useTrialStatus();
  const { isOnline } = useConnectionStatus();

  // Check if current page should hide the sidebar
  const isHomepage = location.pathname === "/";
  const isAuthPage = [
    "/login",
    "/register",
    "/admin-login",
    "/admin-register",
    "/reset-password",
  ].includes(location.pathname);

  // Sidebar should be hidden on homepage, auth pages, or when not authenticated
  const shouldHideSidebar = isHomepage || isAuthPage || !isAuthenticated;

  // Show loading state while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show top navbar for non-authenticated users or when sidebar is hidden */}
      {(!isAuthenticated || shouldHideSidebar) && <TopNavbar />}

      {/* Show sidebar for authenticated users (except on homepage and auth pages) */}
      {isAuthenticated && !shouldHideSidebar && <Sidebar />}

      {/* Show trial banner for authenticated users with trial access */}
      {isAuthenticated && <TrialBanner />}

      {/* Show trial expiration handler for authenticated users */}
      {isAuthenticated && <TrialExpirationHandler />}

      {/* Show offline indicator */}
      <OfflineIndicator />

      <div
        className={`min-h-screen bg-gradient-to-br from-dark via-secondary to-dark transition-all duration-300 ${
          isAuthenticated && !shouldHideSidebar
            ? "ml-16 lg:ml-64 w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)]"
            : ""
        } ${isAuthenticated && shouldShowTrialNotice() ? "pt-16" : ""}`}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route
            path="/vehicle-keycode-request"
            element={<VehicleKeycodeRequest />}
          />
          <Route path="/subscriptions" element={<SubscriptionManager />} />
          <Route path="/profile" element={<UpdateUserProfile />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/user-dash" element={<UserDash />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route
            path="/admin/registered-users"
            element={<RegisteredUsersPage />} // Add the route for the new page
          />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route
            path="/admin/document-validation"
            element={<DocumentValidation />}
          />
          <Route path="/admin/user-history" element={<UserHistoryPage />} />
          <Route path="/admin/nastf-compliance" element={<NastfCompliance />} />
          <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />
          <Route path="/keycodes" element={<KeycodePortals />} />
          <Route path="/kch-db" element={<KchDatabase />} />

          {/* Legacy route redirects */}
          <Route path="/subscription" element={<SubscriptionManager />} />
          <Route path="/membership" element={<SubscriptionManager />} />
          <Route path="/support" element={<Support />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/pricing" element={<PricelistPage />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Legal & Policy Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/tos" element={<TOS />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route
            path="/membership-cancellation"
            element={<MembershipCancellation />}
          />
          <Route path="/offline" element={<OfflinePage />} />

          <Route path="*" element={<LandingPage />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

function App() {
  // Initialize mobile responsiveness and Z Fold optimizations
  useEffect(() => {
    initMobileResponsiveness();
    addZFoldCSSVariables();
    initZFoldOptimizations();
  }, []);

  // Register Service Worker for offline functionality
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  // Sync offline actions when connection is restored
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Connection restored, syncing offline actions...");
      syncActions();
      clearOldCache();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  // App component with enhanced routing for production deployment
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <div>
            <Router
              basename="/"
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <AppContent />
              {/* Analytics is conditionally loaded based on environment */}
              <Analytics />
            </Router>
          </div>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
