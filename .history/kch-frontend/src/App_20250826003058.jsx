import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TrialExpirationHandler from "./components/TrialExpirationHandler";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./utils/errorBoundary.jsx";
import "./styles/mobile-responsive.css";
import { initMobileResponsiveness } from "./utils/mobileResponsivenessTest";

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

function App() {
  // Initialize mobile responsiveness
  useEffect(() => {
    initMobileResponsiveness();
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
              <TrialExpirationHandler />
              <Navbar />
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
                <Route
                  path="/subscriptions"
                  element={<SubscriptionManager />}
                />
                <Route path="/profile" element={<UpdateUserProfile />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/user-dash" element={<UserDash />} />
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
                <Route
                  path="/admin/user-history"
                  element={<UserHistoryPage />}
                />

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
              <Analytics />
            </Router>
          </div>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
