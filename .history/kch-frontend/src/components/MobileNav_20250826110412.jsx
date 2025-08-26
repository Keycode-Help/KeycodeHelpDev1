import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Shield,
  Home,
  FileText,
  HelpCircle,
  DollarSign,
  LogOut,
  Key,
  ShoppingCart,
  History,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper, isBaseUser } from "../utils/roles";
import "../styles/mobile-nav.css";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".mobile-nav")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isOpen);
    setIsOpen(!isOpen);
    console.log('New state will be:', !isOpen);
  };

  // Debug logging
  useEffect(() => {
    console.log('MobileNav state changed - isOpen:', isOpen);
    console.log('MobileNav element:', document.querySelector('.mobile-nav'));
    console.log('Overlay element:', document.querySelector('.mobile-nav-overlay'));
    console.log('Content element:', document.querySelector('.mobile-nav-content'));
  }, [isOpen]);

  // Guest user navigation items (always visible)
  const guestNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/pricing", label: "Pricing", icon: DollarSign },
    { path: "/requirements", label: "Requirements", icon: FileText },
    { path: "/support", label: "Support", icon: HelpCircle },
    { path: "/about", label: "About", icon: User },
  ];

  // Base user navigation items (logged in users)
  const baseUserNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/pricing", label: "Pricing", icon: DollarSign },
    { path: "/vehicle-keycode-request", label: "Request Keycode", icon: Key },
    { path: "/subscriptions", label: "Subscriptions", icon: Shield },
    { path: "/user-dash", label: "Dashboard", icon: User },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/cart", label: "Cart", icon: ShoppingCart },
  ];

  // Admin user navigation items
  const adminNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/pricing", label: "Pricing", icon: DollarSign },
    { path: "/admin", label: "Admin Dashboard", icon: Settings },
    { path: "/admin/registered-users", label: "Registered Users", icon: User },
    {
      path: "/admin/document-validation",
      label: "Document Validation",
      icon: FileText,
    },
    { path: "/admin/user-history", label: "User History", icon: History },
  ];

  // Super admin navigation items
  const superAdminNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/pricing", label: "Pricing", icon: DollarSign },
    { path: "/super-admin", label: "Super Admin Dashboard", icon: Settings },
    { path: "/admin", label: "Admin Dashboard", icon: Settings },
    { path: "/admin/registered-users", label: "Registered Users", icon: User },
    {
      path: "/admin/document-validation",
      label: "Document Validation",
      icon: FileText,
    },
    { path: "/admin/user-history", label: "User History", icon: History },
  ];

  // Determine which navigation items to show based on user role
  const getNavItems = () => {
    if (!user) {
      return guestNavItems;
    }

    if (isSuper(user.role)) {
      return superAdminNavItems;
    }

    if (canSeeAdmin(user.role)) {
      return adminNavItems;
    }

    if (isBaseUser(user.role)) {
      return baseUserNavItems;
    }

    return guestNavItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="mobile-nav" style={{ display: "block" }}>
      {/* Mobile Header */}
      <div className="mobile-nav-header">
        <Link
          to="/"
          className="mobile-nav-brand"
          onClick={() => setIsOpen(false)}
        >
          <div className="mobile-nav-logo-placeholder">
            <div className="logo-k">K</div>
          </div>
          <span className="mobile-nav-title">KEYCODE HELP</span>
        </Link>

        <button
          className={`mobile-nav-toggler ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-nav-overlay ${isOpen ? "show" : ""}`}>
        <div className="mobile-nav-content">
          {/* Main Navigation */}
          <div className="mobile-nav-section">
            <h3 className="mobile-nav-section-title">Main Menu</h3>
            <div className="mobile-nav-links">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-nav-link ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="mobile-nav-icon" size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Navigation */}
          <div className="mobile-nav-section">
            <h3 className="mobile-nav-section-title">
              {user ? "Account" : "Authentication"}
            </h3>
            <div className="mobile-nav-links">
              {!user ? (
                // Guest user authentication links
                <>
                  <Link
                    to="/login"
                    className="mobile-nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="mobile-nav-icon" size={20} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="mobile-nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="mobile-nav-icon" size={20} />
                    <span>Register</span>
                  </Link>
                </>
              ) : (
                // Logged in user account actions
                <>
                  <Link
                    to="/profile"
                    className="mobile-nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="mobile-nav-icon" size={20} />
                    <span>Profile</span>
                  </Link>
                  <button
                    className="mobile-nav-link mobile-nav-logout"
                    onClick={handleLogout}
                  >
                    <LogOut className="mobile-nav-icon" size={20} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Legal Links */}
          <div className="mobile-nav-section">
            <h3 className="mobile-nav-section-title">Legal</h3>
            <div className="mobile-nav-links">
              <Link
                to="/privacy-policy"
                className="mobile-nav-link"
                onClick={() => setIsOpen(false)}
              >
                <span>Privacy Policy</span>
              </Link>
              <Link
                to="/terms-of-service"
                className="mobile-nav-link"
                onClick={() => setIsOpen(false)}
              >
                <span>Terms of Service</span>
              </Link>
              <Link
                to="/refund-policy"
                className="mobile-nav-link"
                onClick={() => setIsOpen(false)}
              >
                <span>Refund Policy</span>
              </Link>
            </div>
          </div>

          {/* User Info (if logged in) */}
          {user && (
            <div className="mobile-nav-user-info">
              <div className="mobile-nav-user-avatar">
                <User size={24} />
              </div>
              <div className="mobile-nav-user-details">
                <div className="mobile-nav-user-name">
                  {user.fname} {user.lname}
                </div>
                <div className="mobile-nav-user-email">{user.email}</div>
                <div className="mobile-nav-user-role">{user.role}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
