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

import "./styles/dark-theme.css";

function App() {
  return (
    <AuthProvider>
      <div className="dark-theme">
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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Home />} /> {/* Add a catch-all route */}
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
