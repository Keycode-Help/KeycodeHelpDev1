import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import navbarLogo from "../assets/images/Revised versions corrected/Archive/SVG/LogoWhiteText.svg";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onClickLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLinks = ({ className = "" }) => (
    <>
      {!userRole && (
        <>
          <li>
            <Link
              to="/register"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/vehicle-keycode-request"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Request Keycodes
            </Link>
          </li>
        </>
      )}

      {userRole === "BASEUSER" && (
        <>
          <li>
            <Link
              to="/"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/vehicle-keycode-request"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Request Keycode
            </Link>
          </li>
          <li>
            <Link
              to="/membership"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Membership
            </Link>
          </li>
          <li>
            <Link
              to="/user-dash"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              User Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Profile
            </Link>
          </li>
        </>
      )}

      {userRole === "ADMIN" && (
        <>
          <li>
            <Link
              to="/admin"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Admin Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/registered-users"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Registered Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/order-history"
              className={`text-white hover:text-[#4ae66c] transition-colors duration-300 ${className}`}
            >
              Order History
            </Link>
          </li>
        </>
      )}

      {userRole && (
        <li>
          <button
            id="logout"
            onClick={() => onClickLogout()}
            className={`px-4 py-2 bg-[#4ae66c] text-white rounded hover:bg-[#3cbf58] transition duration-300 ${className}`}
          >
            Logout
          </button>
        </li>
      )}
    </>
  );

  NavLinks.propTypes = {
    className: PropTypes.string,
  };

  NavLinks.defaultProps = {
    className: "",
  };

  return (
    <div className="relative">
      <nav className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-black text-white shadow-md">
        <Link to="/" className="flex items-center">
          <img
            src={navbarLogo}
            alt="Keycode Help Logo"
            className="h-8 sm:h-10 lg:h-12 xl:h-14"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="xl:hidden p-2 rounded-md hover:bg-gray-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu */}
        <ul className="hidden xl:flex items-center gap-3 2xl:gap-4">
          <NavLinks />
        </ul>

        {/* Mobile menu */}
        <div
          className={`xl:hidden fixed inset-0 z-50 bg-black bg-opacity-95 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Close button */}
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-800 focus:outline-none"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center justify-center h-full">
            <ul className="space-y-4 sm:space-y-6 text-center">
              <NavLinks className="text-base sm:text-lg" />
            </ul>
          </div>
        </div>
      </nav>

      <div className="bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#4ae66c] to-transparent animate-shine" />
    </div>
  );
}

export default Navbar;
