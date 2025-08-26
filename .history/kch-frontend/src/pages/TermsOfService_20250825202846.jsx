import React from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Shield,
  Users,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import "../styles/policyPages.css";

const TermsOfService = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-page-container">
        <div className="policy-header">
          <div className="policy-header-icon">
            <FileText className="policy-icon" />
          </div>
          <h1>Terms of Service</h1>
          <p className="policy-subtitle">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Acceptance of Terms</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <CheckCircle className="policy-card-icon" />
                <h3>Agreement to Terms</h3>
              </div>
              <p>
                By accessing and using KeycodeHelp services, you agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use our services.
              </p>
              <p>
                These terms apply to all users of the service, including without
                limitation users who are browsers, vendors, customers,
                merchants, and/or contributors of content.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Description of Service</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>What We Provide</h3>
              </div>
              <p>
                KeycodeHelp provides vehicle keycode lookup and information
                services, including:
              </p>
              <ul>
                <li>Vehicle keycode retrieval and lookup</li>
                <li>Vehicle information and specifications</li>
                <li>Membership-based access to premium features</li>
                <li>Customer support and assistance</li>
                <li>Payment processing for services</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. User Accounts and Registration</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Users className="policy-card-icon" />
                <h3>Account Requirements</h3>
              </div>
              <ul>
                <li>You must be at least 18 years old to create an account</li>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>
                  You are responsible for all activities under your account
                </li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Acceptable Use Policy</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <CheckCircle className="policy-card-icon" />
                <h3>Permitted Uses</h3>
              </div>
              <ul>
                <li>Use services for legitimate vehicle information needs</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect intellectual property rights</li>
                <li>Maintain appropriate security measures</li>
              </ul>

              <div className="policy-card-header">
                <XCircle className="policy-card-icon" />
                <h3>Prohibited Uses</h3>
              </div>
              <ul>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Using services for illegal or fraudulent purposes</li>
                <li>Interfering with service availability or performance</li>
                <li>Sharing account credentials with unauthorized users</li>
                <li>
                  Reverse engineering or attempting to copy our technology
                </li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Payment Terms</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <DollarSign className="policy-card-icon" />
                <h3>Payment and Billing</h3>
              </div>
              <ul>
                <li>All fees are due immediately upon service purchase</li>
                <li>Payments are processed securely through Stripe</li>
                <li>Prices are subject to change with 30 days notice</li>
                <li>Failed payments may result in service suspension</li>
                <li>Taxes may apply based on your location</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Refund Policy</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <AlertTriangle className="policy-card-icon" />
                <h3>No Refunds for User Errors</h3>
              </div>
              <p>
                <strong>Important:</strong> KeycodeHelp does not provide refunds
                for:
              </p>
              <ul>
                <li>Mistakes in vehicle information input</li>
                <li>Incorrect data submissions</li>
                <li>User errors in form completion</li>
                <li>Duplicate submissions</li>
                <li>Changes of mind after purchase</li>
              </ul>

              <div className="policy-card-header">
                <CheckCircle className="policy-card-icon" />
                <h3>Refunds Only Available For:</h3>
              </div>
              <ul>
                <li>
                  <strong>No Keycode Available:</strong> If we cannot provide a
                  keycode for your vehicle
                </li>
                <li>
                  <strong>Service Failure:</strong> If our service is completely
                  unavailable
                </li>
                <li>
                  <strong>Technical Issues:</strong> If our system fails to
                  process your request
                </li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. Membership Cancellation Policy</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Clock className="policy-card-icon" />
                <h3>Early Cancellation Terms</h3>
              </div>
              <ul>
                <li>
                  <strong>Monthly Memberships:</strong> Cancel anytime, no
                  refund for partial months
                </li>
                <li>
                  <strong>Annual Memberships:</strong> Cancel anytime, prorated
                  refund for unused months
                </li>
                <li>
                  <strong>Processing Time:</strong> Cancellations take effect at
                  the end of current billing period
                </li>
                <li>
                  <strong>Access:</strong> Service access continues until the
                  end of paid period
                </li>
                <li>
                  <strong>Reactivation:</strong> Can reactivate anytime with
                  current pricing
                </li>
              </ul>
              <p>
                To cancel your membership, contact our support team or use the
                cancellation option in your account settings.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>8. Intellectual Property</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>Ownership Rights</h3>
              </div>
              <ul>
                <li>All content and technology remain our property</li>
                <li>
                  Vehicle data is provided under license from third parties
                </li>
                <li>You may not copy, modify, or distribute our content</li>
                <li>User-generated content remains your property</li>
                <li>We may use feedback to improve our services</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>9. Disclaimers and Limitations</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <AlertTriangle className="policy-card-icon" />
                <h3>Service Limitations</h3>
              </div>
              <ul>
                <li>Services are provided "as is" without warranties</li>
                <li>We do not guarantee 100% accuracy of vehicle data</li>
                <li>Service availability may vary based on demand</li>
                <li>
                  We are not responsible for third-party vehicle data accuracy
                </li>
                <li>Maximum liability limited to amount paid for services</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>10. Privacy and Data Protection</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>Data Handling</h3>
              </div>
              <p>
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect, use, and protect your
                personal information.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>11. Termination</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <XCircle className="policy-card-icon" />
                <h3>Account Termination</h3>
              </div>
              <ul>
                <li>
                  We may terminate accounts for Terms of Service violations
                </li>
                <li>You may terminate your account at any time</li>
                <li>Termination results in immediate loss of service access</li>
                <li>Some data may be retained for legal compliance</li>
                <li>Refunds follow our standard refund policy</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>12. Governing Law and Disputes</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <FileText className="policy-card-icon" />
                <h3>Legal Framework</h3>
              </div>
              <ul>
                <li>
                  These terms are governed by the laws of [Your State/Country]
                </li>
                <li>Disputes will be resolved through binding arbitration</li>
                <li>Class action lawsuits are not permitted</li>
                <li>Small claims court actions are allowed</li>
                <li>Changes to dispute resolution require written notice</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>13. Changes to Terms</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Clock className="policy-card-icon" />
                <h3>Terms Updates</h3>
              </div>
              <p>
                We reserve the right to modify these terms at any time. Material
                changes will be communicated through email or prominent website
                notice. Continued use after changes constitutes acceptance of
                updated terms.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>14. Contact Information</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Users className="policy-card-icon" />
                <h3>Questions About Terms</h3>
              </div>
              <p>
                If you have questions about these Terms of Service, please
                contact us:
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>Email: legal@keycodehelp.com</span>
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
