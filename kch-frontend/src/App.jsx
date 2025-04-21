import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/NewPagesForms/Login";
import Register from "./pages/NewPagesForms/Register";
import Cart from "./pages/Cart";
import VehicleKeycodeRequest from "./pages/NewPagesForms/VehicleKeycodeRequest.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import RegisteredUsersPage from "./pages/RegisteredUsers"; // Import the new page
import UserDash from "./pages/UserDash";
import MembershipPage from "./pages/Membership";
import UserProfile from "./pages/UserProfile";
import UpdateUserProfile from "./pages/UpdateUserProfile";
import LandingPage from "./pages/LandingPage";

const Layout = ({ children }) => {
  const location = useLocation();
  const pagesWithoutNavbar = ["/landingpage"];
  const isNavbarHidden = pagesWithoutNavbar.includes(location.pathname);
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isNavbarHidden && <Navbar />}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/vehicle-keycode-request"
              element={<VehicleKeycodeRequest />}
            />
            <Route path="/profile" element={<UpdateUserProfile />} />
            <Route path="/landingpage" element={<LandingPage />} />
            {/* <Route path="/profile" element={<UserProfile />} /> */}
            <Route path="/user-dash" element={<UserDash />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/admin/registered-users"
              element={<RegisteredUsersPage />} // Add the route for the new page
            />
            <Route path="/admin/order-history" element={<OrderHistoryPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
