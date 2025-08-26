import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import "../styles/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3>KeycodeHelp</h3>
            <p>
              Professional vehicle keycode lookup services. Get accurate,
              reliable keycode information for your automotive needs.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <Globe className="social-icon" />
              </a>
              <a href="#" aria-label="Twitter">
                <Globe className="social-icon" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Globe className="social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>

              <li>
                <Link to="/support">Support</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="footer-section">
            <h4>Legal & Policies</h4>
            <ul className="footer-links">
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service">Terms of Usage</Link>
              </li>
              <li>
                <Link to="/tos">TOS</Link>
              </li>
              <li>
                <Link to="/refund-policy">Refund Policy</Link>
              </li>
              <li>
                <Link to="/membership-cancellation">Cancellation Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} KeyCode Help. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/pricing">Keycode Pricing</Link>
              <span className="separator">•</span>
              <Link to="/support">Support</Link>
              <span className="separator">•</span>
              <Link to="/requirements">Requirements</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
