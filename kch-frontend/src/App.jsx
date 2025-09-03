import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import Footer from "./components/Footer";
import TrialExpirationHandler from "./components/TrialExpirationHandler";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from "./utils/errorBoundary.jsx";
import "./styles/mobile-responsive.css";
import { initMobileResponsiveness } from "./utils/mobileResponsivenessTest";
import {
  initZFoldOptimizations,
  addZFoldCSSVariables,
} from "./utils/zFoldDetection";

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
import DocumentValidation from "./pages/DocumentValidation";
import Requirements from "./pages/Requirements";
import UserDash from "./pages/UserDash";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import UpdateUserProfile from "./pages/UpdateUserProfile";
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

// Component to handle conditional navigation rendering
function AppContent() {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useAuth();
  const isHomepage = location.pathname === "/";

  // Show loading state while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show top navbar for non-authenticated users */}
      {!isAuthenticated && <TopNavbar />}

      {/* Show sidebar for authenticated users (except on homepage) */}
      {isAuthenticated && !isHomepage && <Sidebar />}

      {/* Show top navbar for authenticated users on homepage */}
      {isAuthenticated && isHomepage && <TopNavbar />}

      <div
        className={
          isAuthenticated && !isHomepage
            ? "min-h-screen transition-all duration-300 ml-16 lg:ml-64 w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)]"
            : ""
        }
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
          <Route path="/user-dash" element={<UserDash />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route
            path="/admin/registered-users"
            element={<RegisteredUsersPage />} // Add the route for the new page
          />
          <Route
            path="/admin/document-validation"
            element={<DocumentValidation />}
          />
          <Route path="/admin/user-history" element={<UserHistoryPage />} />
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
              <Analytics />
            </Router>
            <TrialExpirationHandler />
          </div>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
