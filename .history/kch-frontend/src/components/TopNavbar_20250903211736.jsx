import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper, isBaseUser } from "../utils/roles";
import {
  Home,
  DollarSign,
  Info,
  FileText,
  LogIn,
  UserPlus,
  BarChart3,
  Settings,
  Shield,
  User,
  LogOut,
} from "lucide-react";

const TopNavbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, userRole, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get role-based navigation links for authenticated users
  const getAuthenticatedLinks = () => {
    const baseLinks = [
      { path: "/", label: "Home", icon: Home },
      { path: "/pricing", label: "Services & Pricing", icon: DollarSign },
    ];

    if (isBaseUser(userRole)) {
      return [
        ...baseLinks,
        { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
      ];
    }

    if (canSeeAdmin(userRole) && !isSuper(userRole)) {
      return [
        ...baseLinks,
        { path: "/admin", label: "Admin Dashboard", icon: Settings },
      ];
    }

    if (isSuper(userRole)) {
      return [
        ...baseLinks,
        { path: "/super-admin", label: "Super Admin Dashboard", icon: Shield },
      ];
    }

    return baseLinks;
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
                    {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/assets/images/logos/MainLogoGold.png" 
              alt="Keycode Help Logo" 
              className="h-8 object-contain"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              // Show role-based navigation for authenticated users
              getAuthenticatedLinks().map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })
            ) : (
              // Show standard navigation for non-authenticated users
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/")
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>

                <Link
                  to="/pricing"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/pricing")
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </Link>

                <Link
                  to="/about"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/about")
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                  }`}
                >
                  <Info className="h-4 w-4" />
                  About Us
                </Link>

                <Link
                  to="/requirements"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/requirements")
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Requirements
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              // Show user info and logout for authenticated users
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user?.firstName || user?.email || "User"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              // Show login/register for non-authenticated users
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-yellow-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white hover:bg-slate-700/50 p-2 rounded-lg transition-all duration-200"
              aria-label={
                isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
              }
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 py-4">
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                // Show role-based navigation for authenticated users
                getAuthenticatedLinks().map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })
              ) : (
                // Show standard navigation for non-authenticated users
                <>
                  <Link
                    to="/"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/")
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>

                  <Link
                    to="/pricing"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/pricing")
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    Pricing
                  </Link>

                  <Link
                    to="/about"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/about")
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                    }`}
                  >
                    <Info className="h-4 w-4" />
                    About Us
                  </Link>

                  <Link
                    to="/requirements"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/requirements")
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-300 hover:text-blue-400 hover:bg-slate-700/50"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Requirements
                  </Link>
                </>
              )}

              {/* Auth section for mobile */}
              {isAuthenticated ? (
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300">
                    <User className="h-4 w-4" />
                    <span>{user?.firstName || user?.email || "User"}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
