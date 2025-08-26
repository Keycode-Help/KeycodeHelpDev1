import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Shield, Home, FileText, HelpCircle, DollarSign, LogOut, Key, ShoppingCart, History, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canSeeAdmin, isSuper, isBaseUser } from '../utils/roles';
import '../styles/mobile-nav.css';

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
      if (isOpen && !event.target.closest('.mobile-nav')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/pricing', label: 'Pricing', icon: DollarSign },
    { path: '/requirements', label: 'Requirements', icon: FileText },
    { path: '/support', label: 'Support', icon: HelpCircle },
    { path: '/about', label: 'About', icon: User },
  ];

  const userNavItems = user ? [
    { path: '/user-dash', label: 'Dashboard', icon: User },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/subscriptions', label: 'Subscriptions', icon: Shield },
  ] : [
    { path: '/login', label: 'Login', icon: User },
    { path: '/register', label: 'Register', icon: User },
  ];

  // Debug logging
  useEffect(() => {
    console.log('MobileNav rendered, isOpen:', isOpen);
    console.log('Window width:', window.innerWidth);
    console.log('MobileNav element:', document.querySelector('.mobile-nav'));
  }, [isOpen]);

  return (
    <nav className="mobile-nav" style={{ display: 'block' }}>
      {/* Mobile Header */}
      <div className="mobile-nav-header">
        <Link to="/" className="mobile-nav-brand" onClick={() => setIsOpen(false)}>
          <div className="mobile-nav-logo-placeholder">KCH</div>
          <span className="mobile-nav-title">KeycodeHelp</span>
        </Link>
        
        <button 
          className={`mobile-nav-toggler ${isOpen ? 'active' : ''}`}
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
      <div className={`mobile-nav-overlay ${isOpen ? 'show' : ''}`}>
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
                    className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
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
              {user ? 'Account' : 'Authentication'}
            </h3>
            <div className="mobile-nav-links">
              {userNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="mobile-nav-icon" size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {user && (
                <button
                  className="mobile-nav-link mobile-nav-logout"
                  onClick={handleLogout}
                >
                  <LogOut className="mobile-nav-icon" size={20} />
                  <span>Logout</span>
                </button>
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
