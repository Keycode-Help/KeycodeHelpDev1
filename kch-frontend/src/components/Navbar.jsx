import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { userRole, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-logo">Auto Arcade</div>
      <ul>
        {!userRole && (
          <>
            <li>
              <Link to="/register">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}

        {userRole === "BASEUSER" && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/vehicle-keycode-request">Request Keycode</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          </>
        )}

        {userRole === "ADMIN" && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
          </>
        )}

        {userRole && (
          <li>
            <button id="logout" onClick={logout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
