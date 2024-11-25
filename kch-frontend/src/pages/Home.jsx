import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const handleRequestKeycode = () => {
    if (user) {
      navigate("/vehicle-keycode-request");
    } else {
      alert("Please log in to request a keycode.");
      navigate("/login");
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Unlock Your Vehicle Today</h1>
        <p>Get keycodes instantly with Auto Arcade</p>
        {userRole ? (
          <button className="hero-button" onClick={handleRequestKeycode}>
            Request Keycode
          </button>
        ) : (
          <>
            <button className="hero-button" onClick={() => navigate("/login")}>
              Login to Request Keycode
            </button>
            <button
              className="hero-button"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
