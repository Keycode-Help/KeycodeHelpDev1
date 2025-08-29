import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper, isBaseUser } from "../utils/roles";
import MobileNav from "./MobileNav";

function Navbar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const onClickLogout = () => {
    logout();
    navigate("/");
  };

  const NavLinks = () => (
    <>
      {!userRole && (
        <>
          <Link className="nav-link" to="/pricing">
            Keycode Pricing
          </Link>
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </>
      )}

      {isBaseUser(userRole) && (
        <>
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/pricing">
            Keycode Pricing
          </Link>
          <Link className="nav-link" to="/vehicle-keycode-request">
            Request Keycode
          </Link>
          <Link className="nav-link" to="/subscriptions">
            Subscriptions
          </Link>
          <Link className="nav-link" to="/kch-db">
            KCH Database
          </Link>
          <Link className="nav-link" to="/user-dash">
            User Dashboard
          </Link>
          <Link className="nav-link" to="/user-profile">
            Profile
          </Link>
          <Link className="nav-link" to="/cart">
            Cart
          </Link>
        </>
      )}

      {canSeeAdmin(userRole) && !isSuper(userRole) && (
        <>
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/pricing">
            Keycode Pricing
          </Link>
          <Link className="nav-link" to="/admin">
            Admin Dashboard
          </Link>
          <Link className="nav-link" to="/admin/registered-users">
            Registered Users
          </Link>
          <Link className="nav-link" to="/admin/document-validation">
            Document Validation
          </Link>
          <Link className="nav-link" to="/admin/user-history">
            User History
          </Link>
          <Link className="nav-link" to="/keycodes">
            Keycode Portals
          </Link>
          <Link className="nav-link" to="/kch-db">
            KCH Database
          </Link>
        </>
      )}

      {isSuper(userRole) && (
        <>
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/pricing">
            Keycode Pricing
          </Link>
          <Link className="nav-link" to="/super-admin">
            Super Admin Dashboard
          </Link>
          <Link className="nav-link" to="/admin">
            Admin Dashboard
          </Link>
          <Link className="nav-link" to="/admin/registered-users">
            Registered Users
          </Link>
          <Link className="nav-link" to="/admin/document-validation">
            Document Validation
          </Link>
          <Link className="nav-link" to="/admin/user-history">
            User History
          </Link>
          <Link className="nav-link" to="/keycodes">
            Keycode Portals
          </Link>
          <Link className="nav-link" to="/kch-db">
            KCH Database
          </Link>
        </>
      )}

      {userRole && (
        <button
          className="btn btn-sm btn-danger-outline"
          onClick={onClickLogout}
        >
          Logout
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Navigation - Always visible on mobile */}
      <MobileNav />

      {/* Desktop Navigation - Hidden on mobile, visible on desktop */}
      <nav className="desktop-navbar">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-white font-semibold tracking-wide">
            Keycode Help
          </Link>

          {/* Desktop menu */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              {/* Use custom nav-link class for consistent styling */}
              <style>{`.nav-link{color:#cbd5e1;padding:0.5rem 0.75rem;border-radius:9999px;transition:all .2s}.nav-link:hover{color:#fff;background:rgba(255,255,255,.06);box-shadow:0 0 0 1px rgba(148,163,184,.2) inset}`}</style>
              <NavLinks />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
