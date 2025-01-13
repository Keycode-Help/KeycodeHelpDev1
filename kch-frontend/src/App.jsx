import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import VehicleKeycodeRequest from "./pages/VehicleKeycodeRequest";
import AdminDashboard from "./pages/AdminDashboard";
import SubscriptionPage from "./pages/SubscriptionPage";
import UserHistoryPage from "./pages/UserHistoryPage";
import RegisteredUsersPage from "./pages/RegisteredUsers"; // Import the new page
import UpdateUserProfile from "./pages/UpdateUserProfile";
import "./styles/app.css";

function App() {
  return (
    <AuthProvider>
      <div>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/vehicle-keycode-request"
              element={<VehicleKeycodeRequest />}
            />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/profile" element={<UpdateUserProfile/>}/>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/admin/registered-users"
              element={<RegisteredUsersPage />} // Add the route for the new page
            />
            <Route path="/admin/user-history" element={<UserHistoryPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
