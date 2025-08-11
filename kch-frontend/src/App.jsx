import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import VehicleKeycodeRequest from "./pages/VehicleKeycodeRequest";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SubscriptionPage from "./pages/SubscriptionPage";
import UserHistoryPage from "./pages/UserHistoryPage";
import RegisteredUsersPage from "./pages/RegisteredUsers"; // Import the new page
import UserDash from "./pages/UserDash";
import MembershipPage from "./pages/Membership"; // Non-linked decorated Subscription page
import UserProfile from "./pages/UserProfile";
import UpdateUserProfile from "./pages/UpdateUserProfile";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <AuthProvider>
      <div>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/vehicle-keycode-request"
              element={<VehicleKeycodeRequest />}
            />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/profile" element={<UpdateUserProfile />} />


            {/* <Route path="/profile" element={<UserProfile />} /> */}
            <Route path="/user-dash" element={<UserDash />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route
              path="/admin/registered-users"
              element={<RegisteredUsersPage />} // Add the route for the new page
            />
            <Route path="/admin/user-history" element={<UserHistoryPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
