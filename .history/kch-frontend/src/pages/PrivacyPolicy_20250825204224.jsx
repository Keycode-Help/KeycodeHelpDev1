import React from "react";
import { Shield, Lock, Eye, Database, Users, Globe, Mail, Phone } from "lucide-react";
import "../styles/policyPages.css";

const PrivacyPolicy = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-page-container">
        <div className="policy-header">
          <div className="policy-header-icon">
            <Shield className="policy-icon" />
          </div>
          <h1>Privacy Policy</h1>
          <p className="policy-subtitle">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Eye className="policy-card-icon" />
                <h3>Personal Information</h3>
              </div>
              <ul>
                <li>Name and contact information (email, phone number)</li>
                <li>Vehicle information (make, model, year, VIN)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Account credentials and login information</li>
                <li>Communication history and support requests</li>
              </ul>
            </div>

            <div className="policy-card">
              <div className="policy-card-header">
                <Database className="policy-card-icon" />
                <h3>Technical Information</h3>
              </div>
              <ul>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and analytics data</li>
                <li>Cookies and session information</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Users className="policy-card-icon" />
                <h3>Service Provision</h3>
              </div>
              <ul>
                <li>Process keycode requests and provide vehicle information</li>
                <li>Manage your account and subscription</li>
                <li>Process payments and maintain billing records</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important service notifications</li>
              </ul>
            </div>

            <div className="policy-card">
              <div className="policy-card-header">
                <Globe className="policy-card-icon" />
                <h3>Improvement & Analytics</h3>
              </div>
              <ul>
                <li>Analyze usage patterns to improve our services</li>
                <li>Develop new features and functionality</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Information Sharing</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Lock className="policy-card-icon" />
                <h3>We Do Not Sell Your Data</h3>
              </div>
              <p>
                KeycodeHelp does not sell, trade, or rent your personal information to third parties.
              </p>
              <h4>Limited Sharing Only For:</h4>
              <ul>
                <li><strong>Service Providers:</strong> Payment processors (Stripe), hosting services, and analytics tools</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of company sale or merger (with notice)</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Data Security</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>Protection Measures</h3>
              </div>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Secure payment processing through Stripe</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
                <li>Secure hosting infrastructure</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Data Retention</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Database className="policy-card-icon" />
                <h3>How Long We Keep Your Data</h3>
              </div>
              <ul>
                <li><strong>Account Data:</strong> Retained while your account is active</li>
                <li><strong>Transaction Records:</strong> Kept for 7 years for tax and legal purposes</li>
                <li><strong>Support Communications:</strong> Retained for 2 years after resolution</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized after 1 year</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Your Rights</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Users className="policy-card-icon" />
                <h3>Control Your Information</h3>
              </div>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your data (with limitations)</li>
                <li><strong>Portability:</strong> Export your data in a standard format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. Cookies and Tracking</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Globe className="policy-card-icon" />
                <h3>How We Use Cookies</h3>
              </div>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
                <li><strong>Security Cookies:</strong> Protect against fraud and abuse</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>8. International Data Transfers</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Globe className="policy-card-icon" />
                <h3>Global Service Provision</h3>
              </div>
              <p>
                KeycodeHelp operates globally and may transfer your data to countries outside your residence.
                We ensure appropriate safeguards are in place for international data transfers.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>9. Children's Privacy</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Users className="policy-card-icon" />
                <h3>Age Requirements</h3>
              </div>
              <p>
                Our services are not intended for children under 18 years of age. We do not knowingly collect
                personal information from children under 18. If you believe we have collected such information,
                please contact us immediately.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>10. Changes to This Policy</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>Policy Updates</h3>
              </div>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes
                through email or prominent notice on our website. Your continued use of our services after
                changes become effective constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>11. Contact Information</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Mail className="policy-card-icon" />
                <h3>Get in Touch</h3>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>Email: privacy@keycodehelp.com</span>
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
                If you have questions about this Privacy Policy or our data practices, please contact us.
                We're committed to protecting your privacy and will respond to your inquiries promptly.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
