import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingPageVariant2 from "./pages/LandingPageVariant2";

// Add future flags to suppress warnings
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <Router {...router}>
      <Routes>
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/LandingPageVariant2" element={<LandingPageVariant2 />} />
      </Routes>
    </Router>
  );
}

export default App;
