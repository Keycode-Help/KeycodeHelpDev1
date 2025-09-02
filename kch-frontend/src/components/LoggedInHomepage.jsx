import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper, isBaseUser } from "../utils/roles";
import {
  Home,
  DollarSign,
  Settings,
  Shield,
  BarChart3,
  Key,
  Database,
  Users,
  FileText,
  History,
  User,
  ShoppingCart,
  Shield as ShieldIcon,
} from "lucide-react";

const LoggedInHomepage = () => {
  const { user, userRole } = useAuth();

  // Get role-based navigation links
  const getNavigationLinks = () => {
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

  // Get role-based quick access cards
  const getQuickAccessCards = () => {
    if (isBaseUser(userRole)) {
      return [
        {
          title: "Request Keycode",
          description: "Submit a new keycode request",
          path: "/vehicle-keycode-request",
          icon: Key,
          color: "from-blue-500 to-blue-600",
        },
        {
          title: "My Dashboard",
          description: "View your account overview",
          path: "/user-dash",
          icon: BarChart3,
          color: "from-green-500 to-green-600",
        },
        {
          title: "My Profile",
          description: "Manage your account settings",
          path: "/user-profile",
          icon: User,
          color: "from-purple-500 to-purple-600",
        },
        {
          title: "KCH Database",
          description: "Access the keycode database",
          path: "/kch-db",
          icon: Database,
          color: "from-orange-500 to-orange-600",
        },
      ];
    }

    if (canSeeAdmin(userRole) && !isSuper(userRole)) {
      return [
        {
          title: "Admin Dashboard",
          description: "Manage system operations",
          path: "/admin",
          icon: Settings,
          color: "from-blue-500 to-blue-600",
        },
        {
          title: "User Management",
          description: "Manage registered users",
          path: "/admin/registered-users",
          icon: Users,
          color: "from-green-500 to-green-600",
        },
        {
          title: "Document Validation",
          description: "Review user documents",
          path: "/admin/document-validation",
          icon: FileText,
          color: "from-purple-500 to-purple-600",
        },
        {
          title: "KCH Database",
          description: "Access the keycode database",
          path: "/kch-db",
          icon: Database,
          color: "from-orange-500 to-orange-600",
        },
      ];
    }

    if (isSuper(userRole)) {
      return [
        {
          title: "Super Admin",
          description: "System administration panel",
          path: "/super-admin",
          icon: Shield,
          color: "from-red-500 to-red-600",
        },
        {
          title: "Admin Dashboard",
          description: "Admin management panel",
          path: "/admin",
          icon: Settings,
          color: "from-blue-500 to-blue-600",
        },
        {
          title: "User Management",
          description: "Manage all users",
          path: "/admin/registered-users",
          icon: Users,
          color: "from-green-500 to-green-600",
        },
        {
          title: "KCH Database",
          description: "Access the keycode database",
          path: "/kch-db",
          icon: Database,
          color: "from-orange-500 to-orange-600",
        },
      ];
    }

    return [];
  };

  const navigationLinks = getNavigationLinks();
  const quickAccessCards = getQuickAccessCards();

  const getRoleDisplayName = () => {
    if (isSuper(userRole)) return "Super Administrator";
    if (canSeeAdmin(userRole)) return "Administrator";
    if (isBaseUser(userRole)) return "User";
    return "User";
  };

  const getWelcomeMessage = () => {
    const role = getRoleDisplayName();
    const firstName = user?.fname || "User";
    return `Welcome back, ${firstName}! You're logged in as a ${role}.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-2xl mb-6 shadow-2xl">
            <Key className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            Welcome to Keycode Help
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {getWelcomeMessage()}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Quick Navigation
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-blue-500/20 text-white font-semibold rounded-xl hover:from-blue-500/20 hover:to-yellow-500/20 hover:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Quick Access
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.path}
                  to={card.path}
                  className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{card.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Role-specific Information */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Your Access Level
          </h2>
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-xl mb-4">
              <ShieldIcon className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-semibold text-white">
                {getRoleDisplayName()}
              </span>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {isSuper(userRole) &&
                "You have full system access including super admin controls, user management, and all administrative functions."}
              {canSeeAdmin(userRole) &&
                !isSuper(userRole) &&
                "You have administrative access to manage users, validate documents, and access admin dashboard features."}
              {isBaseUser(userRole) &&
                "You have access to keycode services, your personal dashboard, and account management features."}
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Need Help?
            </h3>
            <p className="text-gray-300 mb-6">
              Our support team is here to assist you with any questions or
              issues.
            </p>
            <Link
              to="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
            >
              <ShieldIcon className="h-5 w-5" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggedInHomepage;
