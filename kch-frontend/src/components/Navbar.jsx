import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper, isBaseUser } from "../utils/roles";
import "../styles/navbar.css";

function Navbar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();
  const onClickLogout = () => {
      logout();
      navigate("/");
  }
  return (
    <div className="navbar">
      <Link to="/" className="navbar-logo">Keycode Help</Link>
      <ul className="navbar-links">
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

        {isBaseUser(userRole) && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/vehicle-keycode-request">Request Keycode</Link>
            </li>
            <li>
              <Link to="/subscriptions">Subscriptions</Link>
            </li>
            <li>
              <Link to="/user-dash">User Dashboard</Link>
            </li>
            <li>
              <Link to="/user-profile">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          </>
        )}

        {canSeeAdmin(userRole) && !isSuper(userRole) && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/registered-users">Registered Users</Link>
            </li>
            <li>
              <Link to="/admin/user-history">User History</Link>
            </li>
          </>
        )}

        {isSuper(userRole) && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/super-admin">Super Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/registered-users">Registered Users</Link>
            </li>
            <li>
              <Link to="/admin/user-history">User History</Link>
            </li>
          </>
        )}

        {userRole && (
          <li>
            <button id="logout" onClick={() => onClickLogout()}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
