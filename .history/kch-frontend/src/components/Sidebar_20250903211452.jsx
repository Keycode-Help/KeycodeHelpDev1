import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper, isBaseUser } from "../utils/roles";
import {
  Menu,
  X,
  Home,
  DollarSign,
  Key,
  Shield,
  User,
  ShoppingCart,
  Settings,
  FileText,
  History,
  Database,
  ChevronDown,
  ChevronRight,
  Users,
  UserCheck,
  UserPlus,
  BarChart3,
  Bell,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const { userRole, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth < 1024) {
        setIsCollapsed(true); // Auto-collapse on mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const isActive = (path) => location.pathname === path;

  const getNavItems = () => {
    if (!userRole) {
      return {
        Public: [
          { path: "/pricing", label: "Pricing", icon: DollarSign },
          { path: "/register", label: "Sign Up", icon: UserPlus },
          { path: "/login", label: "Login", icon: User },
        ],
      };
    }

    if (isBaseUser(userRole)) {
      return {
        Dashboard: [
          { path: "/", label: "Home", icon: Home },
          { path: "/user-dash", label: "Dashboard", icon: BarChart3 },
        ],
        Services: [
          { path: "/pricing", label: "Pricing", icon: DollarSign },
          {
            path: "/vehicle-keycode-request",
            label: "Request Keycode",
            icon: Key,
          },
          { path: "/subscriptions", label: "Subscriptions", icon: Shield },
        ],
        Account: [
          { path: "/user-profile", label: "Profile", icon: User },
          { path: "/cart", label: "Cart", icon: ShoppingCart },
        ],
        Database: [{ path: "/kch-db", label: "KCH Database", icon: Database }],
      };
    }

    if (canSeeAdmin(userRole) && !isSuper(userRole)) {
      return {
        Dashboard: [
          { path: "/", label: "Home", icon: Home },
          { path: "/admin", label: "Admin Dashboard", icon: Settings },
        ],
        "User Management": [
          {
            path: "/admin/registered-users",
            label: "Registered Users",
            icon: Users,
          },
          {
            path: "/admin/document-validation",
            label: "Document Validation",
            icon: FileText,
          },
          { path: "/admin/user-history", label: "User History", icon: History },
        ],
        Services: [
          { path: "/pricing", label: "Pricing", icon: DollarSign },
          { path: "/keycodes", label: "Keycode Portals", icon: Key },
          { path: "/kch-db", label: "KCH Database", icon: Database },
        ],
      };
    }

    if (isSuper(userRole)) {
      return {
        Dashboard: [
          { path: "/", label: "Home", icon: Home },
          { path: "/super-admin", label: "Super Admin", icon: Shield },
          { path: "/admin", label: "Admin Dashboard", icon: Settings },
        ],
        "User Management": [
          {
            path: "/admin/registered-users",
            label: "Registered Users",
            icon: Users,
          },
          {
            path: "/admin/document-validation",
            label: "Document Validation",
            icon: FileText,
          },
          { path: "/admin/user-history", label: "User History", icon: History },
        ],
        Services: [
          { path: "/pricing", label: "Pricing", icon: DollarSign },
          { path: "/keycodes", label: "Keycode Portals", icon: Key },
          { path: "/kch-db", label: "KCH Database", icon: Database },
        ],
      };
    }

    return {};
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 shadow-2xl z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobile && !isCollapsed ? "w-64" : ""}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/assets/images/logos/MainLogoGold.png" 
                alt="Keycode Help Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                Keycode Help
              </span>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5 text-white" />
            ) : (
              <X className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-400/30 scrollbar-track-transparent hover:scrollbar-thumb-slate-400/50">
          {Object.entries(navItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                {!isCollapsed && (
                  <>
                    {expandedCategories.has(category) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span>{category}</span>
                  </>
                )}
                {isCollapsed && (
                  <div className="w-1 h-1 bg-slate-400 rounded-full" />
                )}
              </button>

              {/* Category Items */}
              {!isCollapsed && expandedCategories.has(category) && (
                <div className="mt-2 space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeSidebar}
                        className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-all duration-200 hover:translate-x-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                          isActive(item.path)
                            ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400"
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Collapsed State - Show Icons Only */}
              {isCollapsed && (
                <div className="mt-2 space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeSidebar}
                        className={`flex items-center justify-center p-2 mx-2 rounded-lg transition-all duration-200 hover:translate-x-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                          isActive(item.path)
                            ? "bg-blue-600/20 text-blue-400"
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                        title={item.label}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {userRole && (
          <div className="border-t border-slate-700 p-4">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      {isMobile && isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 p-3 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700 hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>
      )}
    </>
  );
}

export default Sidebar;
