import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LandingPageVariant2 from "./pages/LandingPageVariant2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/LandingPageVariant2" element={<LandingPageVariant2 />} />
      </Routes>
    </Router>
  );
}

export default App;
