import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingPageVariant2 from "./pages/LandingPageVariant2";
import VehicleUpdate from "./pages/VehicleUpdate";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/LandingPageVariant2" element={<LandingPageVariant2 />} />
        <Route
          path="/vehicle-update/:userId/:vehicleId"
          element={<VehicleUpdate />}
        />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
