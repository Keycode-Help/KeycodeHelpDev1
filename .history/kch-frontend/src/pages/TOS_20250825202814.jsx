import React from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Users,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import "../styles/policyPages.css";

const TOS = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-page-container">
        <div className="policy-header">
          <div className="policy-header-icon">
            <FileText className="policy-icon" />
          </div>
          <h1>Terms of Service</h1>
          <p className="policy-subtitle">
            Simple, clear terms for using KeycodeHelp
          </p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>Quick Summary</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>What You Need to Know</h3>
              </div>
              <p>
                By using KeycodeHelp, you agree to these simple terms. We
                provide vehicle keycode services and expect you to use them
                responsibly.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>✅ What You Can Do</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <CheckCircle className="policy-card-icon success" />
                <h3>Permitted Uses</h3>
              </div>
              <ul>
                <li>Look up vehicle keycodes for legitimate needs</li>
                <li>
                  Use our service for personal or business vehicle information
                </li>
                <li>Contact support when you need help</li>
                <li>Cancel your membership anytime</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>❌ What You Cannot Do</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <XCircle className="policy-card-icon error" />
                <h3>Prohibited Actions</h3>
              </div>
              <ul>
                <li>Share your account with others</li>
                <li>Use our service for illegal purposes</li>
                <li>Try to hack or break our systems</li>
                <li>Submit fake or incorrect vehicle information</li>
                <li>Resell or redistribute our data</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>💰 Payment & Refunds</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <AlertTriangle className="policy-card-icon warning" />
                <h3>Important Refund Policy</h3>
              </div>
              <p>
                <strong>No refunds for user mistakes:</strong> If you enter
                wrong vehicle information, submit duplicate requests, or change
                your mind, we cannot provide refunds.
              </p>
              <p>
                <strong>Refunds only for:</strong> Service failures, no keycode
                available, or technical issues on our end.
              </p>
              <p>
                <strong>Membership cancellation:</strong> Cancel anytime.
                Monthly plans: no partial refunds. Annual plans: prorated
                refunds for unused months.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>🔒 Your Privacy</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>Data Protection</h3>
              </div>
              <ul>
                <li>We never sell your personal information</li>
                <li>Your data is encrypted and secure</li>
                <li>We only share data when required by law</li>
                <li>You can request deletion of your data</li>
                <li>Read our full Privacy Policy for details</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>⚖️ Legal Stuff</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <FileText className="policy-card-icon" />
                <h3>Legal Terms</h3>
              </div>
              <ul>
                <li>You must be 18+ to use our service</li>
                <li>We provide services "as is" - no guarantees</li>
                <li>Our liability is limited to what you paid</li>
                <li>These terms can change with notice</li>
                <li>Disputes resolved through arbitration</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>📞 Need Help?</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Users className="policy-card-icon" />
                <h3>Contact Us</h3>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>Email: support@keycodehelp.com</span>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>Phone: +1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <Globe className="contact-icon" />
                  <span>Website: https://keycodehelp.com</span>
                </div>
              </div>
              <p>
                Questions about these terms? We're here to help! Contact us
                anytime.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>📋 Full Terms Available</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <FileText className="policy-card-icon" />
                <h3>Complete Legal Document</h3>
              </div>
              <p>
                This is a simplified version of our Terms of Service. For the
                complete legal document with all details and legal language,
                please read our full Terms of Service.
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TOS;
