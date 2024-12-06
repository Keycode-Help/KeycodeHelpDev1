import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage"; // Import the LandingPage component
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import VehicleKeycodeRequest from "./pages/VehicleKeycodeRequest";
import AdminDashboard from "./pages/AdminDashboard";
import "./styles/LandingPage.css";


// ConditionalNavbar component
const ConditionalNavbar = () => {
  const location = useLocation();

  // Exclude Navbar from specific paths
  const excludeNavbarPaths = ["/landingpage"];
  if (excludeNavbarPaths.includes(location.pathname.toLowerCase())) {
    return null;
  }

  return <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <div className="default-theme">
        <Router>
          <ConditionalNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/vehicle-keycode-request" element={<VehicleKeycodeRequest />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/landingpage" element={<LandingPage />} />
            <Route path="*" element={<Home />} /> {/* Add a catch-all route */}
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
