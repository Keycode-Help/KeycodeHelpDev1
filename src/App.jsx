import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingPageVariant2 from "./pages/LandingPageVariant2";
import VehicleUpdate from "./pages/VehicleUpdate";
import UserProfile from "./pages/UserProfile";
import VehicleTracker from "./components/VehicleTracker/VehicleTracker";

function App() {
  return (
    <div className="bg-dark min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/vehicle-update" replace />} />
        <Route path="/vehicle-update" element={<VehicleUpdate />} />
        <Route path="/vehicle-update/:userId/:vehicleId" element={<VehicleUpdate />} />
        <Route path="/vehicle-tracker" element={<VehicleTracker />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/LandingPageVariant2" element={<LandingPageVariant2 />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </div>
  );
}

export default App;
