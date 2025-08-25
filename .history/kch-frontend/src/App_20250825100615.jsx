import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./utils/errorBoundary.jsx";

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

function App() {
  // App component with enhanced routing for production deployment
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div>
          <Router
            basename="/"
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
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
              <Route path="/subscriptions" element={<SubscriptionManager />} />
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
              <Route path="/admin/user-history" element={<UserHistoryPage />} />

              {/* Legacy route redirects */}
              <Route path="/subscription" element={<SubscriptionManager />} />
              <Route path="/membership" element={<SubscriptionManager />} />
              <Route path="/support" element={<Support />} />
              <Route path="/requirements" element={<Requirements />} />
              <Route path="/pricing" element={<PricelistPage />} />

              <Route path="*" element={<LandingPage />} />
            </Routes>
            <Analytics />
          </Router>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
