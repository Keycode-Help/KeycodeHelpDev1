import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper, isBaseUser } from "../utils/roles";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onClickLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const NavLinks = () => (
    <>
      {!userRole && (
        <>
          <Link
            className="nav-link"
            to="/register"
            onClick={() => setOpen(false)}
          >
            Sign Up
          </Link>
          <Link className="nav-link" to="/login" onClick={() => setOpen(false)}>
            Login
          </Link>
        </>
      )}

      {isBaseUser(userRole) && (
        <>
          <Link className="nav-link" to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link className="nav-link" to="/pricing" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link
            className="nav-link"
            to="/vehicle-keycode-request"
            onClick={() => setOpen(false)}
          >
            Request Keycode
          </Link>
          <Link
            className="nav-link"
            to="/subscriptions"
            onClick={() => setOpen(false)}
          >
            Subscriptions
          </Link>
          <Link
            className="nav-link"
            to="/user-dash"
            onClick={() => setOpen(false)}
          >
            User Dashboard
          </Link>
          <Link
            className="nav-link"
            to="/user-profile"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link className="nav-link" to="/cart" onClick={() => setOpen(false)}>
            Cart
          </Link>
        </>
      )}

      {canSeeAdmin(userRole) && !isSuper(userRole) && (
        <>
          <Link className="nav-link" to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link className="nav-link" to="/pricing" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link className="nav-link" to="/admin" onClick={() => setOpen(false)}>
            Admin Dashboard
          </Link>
          <Link
            className="nav-link"
            to="/admin/registered-users"
            onClick={() => setOpen(false)}
          >
            Registered Users
          </Link>
          <Link
            className="nav-link"
            to="/admin/document-validation"
            onClick={() => setOpen(false)}
          >
            Document Validation
          </Link>
          <Link
            className="nav-link"
            to="/admin/user-history"
            onClick={() => setOpen(false)}
          >
            User History
          </Link>
        </>
      )}

      {isSuper(userRole) && (
        <>
          <Link className="nav-link" to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link
            className="nav-link"
            to="/super-admin"
            onClick={() => setOpen(false)}
          >
            Super Admin Dashboard
          </Link>
          <Link className="nav-link" to="/admin" onClick={() => setOpen(false)}>
            Admin Dashboard
          </Link>
          <Link
            className="nav-link"
            to="/admin/registered-users"
            onClick={() => setOpen(false)}
          >
            Registered Users
          </Link>
          <Link
            className="nav-link"
            to="/admin/document-validation"
            onClick={() => setOpen(false)}
          >
            Document Validation
          </Link>
          <Link
            className="nav-link"
            to="/admin/user-history"
            onClick={() => setOpen(false)}
          >
            User History
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
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-white font-semibold tracking-wide">
          Keycode Help
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-1">
          <div className="flex items-center gap-1">
            {/* Use custom nav-link class for consistent styling */}
            <style>{`.nav-link{color:#cbd5e1;padding:0.5rem 0.75rem;border-radius:9999px;transition:all .2s}.nav-link:hover{color:#fff;background:rgba(255,255,255,.06);box-shadow:0 0 0 1px rgba(148,163,184,.2) inset}`}</style>
            <NavLinks />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-xl border border-neutral-800 p-2 text-gray-300"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-neutral-800 bg-black/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex flex-col gap-2">
            <style>{`.nav-link{color:#cbd5e1;padding:0.75rem 0.9rem;border-radius:0.75rem;transition:all .2s}.nav-link:hover{color:#fff;background:rgba(255,255,255,.06)}`}</style>
            <NavLinks />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
