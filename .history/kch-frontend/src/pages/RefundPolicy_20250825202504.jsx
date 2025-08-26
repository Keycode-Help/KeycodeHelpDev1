import React from "react";
import { AlertTriangle, CheckCircle, XCircle, DollarSign, Clock, Shield, Info, Mail, Phone, Globe } from "lucide-react";
import "../styles/policyPages.css";

const RefundPolicy = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-page-container">
        <div className="policy-header">
          <div className="policy-header-icon">
            <DollarSign className="policy-icon" />
          </div>
          <h1>Refund Policy</h1>
          <p className="policy-subtitle">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>Important Notice</h2>
            <div className="policy-card warning-card">
              <div className="policy-card-header">
                <AlertTriangle className="policy-card-icon warning" />
                <h3>No Refunds for User Errors</h3>
              </div>
              <p className="warning-text">
                <strong>KeycodeHelp does not provide refunds for mistakes, incorrect inputs, or user errors.</strong>
                Please review your information carefully before submitting your request.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>1. No Refund Scenarios</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <XCircle className="policy-card-icon error" />
                <h3>User Errors - No Refunds</h3>
              </div>
              <p>
                The following situations will <strong>NOT</strong> qualify for refunds:
              </p>
              <ul>
                <li><strong>Vehicle Information Mistakes:</strong> Incorrect make, model, year, or VIN</li>
                <li><strong>Data Entry Errors:</strong> Typos, wrong numbers, or incomplete information</li>
                <li><strong>Form Submission Errors:</strong> Submitting wrong forms or duplicate requests</li>
                <li><strong>User Confusion:</strong> Not understanding the service or process</li>
                <li><strong>Change of Mind:</strong> Deciding you don't need the service after purchase</li>
                <li><strong>Technical User Issues:</strong> Browser problems, slow internet, or device issues</li>
                <li><strong>Incorrect Vehicle Selection:</strong> Choosing wrong vehicle from search results</li>
                <li><strong>Duplicate Submissions:</strong> Accidentally submitting the same request multiple times</li>
              </ul>
              <div className="policy-note">
                <Info className="note-icon" />
                <p>
                  <strong>Why No Refunds for User Errors?</strong> Once a keycode request is processed, 
                  our system incurs costs and resources. User errors are preventable and not the responsibility 
                  of KeycodeHelp.
                </p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Refund Eligibility</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <CheckCircle className="policy-card-icon success" />
                <h3>When Refunds Are Available</h3>
              </div>
              <p>
                Refunds are only provided in the following specific circumstances:
              </p>
              
              <div className="refund-scenario">
                <h4>🚫 No Keycode Available</h4>
                <p>
                  <strong>Full Refund:</strong> If we cannot provide a keycode for your vehicle after 
                  processing your request, you will receive a full refund.
                </p>
                <ul>
                  <li>Vehicle not found in our database</li>
                  <li>Keycode information unavailable for your specific model</li>
                  <li>Vehicle outside our coverage area</li>
                </ul>
              </div>

              <div className="refund-scenario">
                <h4>🔧 Service Failure</h4>
                <p>
                  <strong>Full Refund:</strong> If our service is completely unavailable or fails to process 
                  your request due to technical issues on our end.
                </p>
                <ul>
                  <li>System downtime exceeding 24 hours</li>
                  <li>Complete service failure preventing request processing</li>
                  <li>Database errors preventing keycode retrieval</li>
                </ul>
              </div>

              <div className="refund-scenario">
                <h4>💳 Payment Processing Issues</h4>
                <p>
                  <strong>Full Refund:</strong> If payment is processed but service is not provided due to 
                  technical errors on our end.
                </p>
                <ul>
                  <li>Double charges due to system errors</li>
                  <li>Payment processed but request not received</li>
                  <li>System crashes during processing</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Refund Process</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Clock className="policy-card-icon" />
                <h3>How Refunds Are Processed</h3>
              </div>
              <div className="refund-process">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Submit Refund Request</h4>
                    <p>Contact our support team with your order details and reason for refund</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Review Process</h4>
                    <p>Our team reviews your request within 2-3 business days</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Refund Decision</h4>
                    <p>You will be notified of approval or denial with explanation</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Processing</h4>
                    <p>Approved refunds are processed within 5-10 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Refund Timeline</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Clock className="policy-card-icon" />
                <h3>Processing Times</h3>
              </div>
              <div className="timeline-info">
                <div className="timeline-item">
                  <h4>Review Period</h4>
                  <p><strong>2-3 business days</strong> for initial review</p>
                </div>
                <div className="timeline-item">
                  <h4>Refund Processing</h4>
                  <p><strong>5-10 business days</strong> for payment processing</p>
                </div>
                <div className="timeline-item">
                  <h4>Bank Processing</h4>
                  <p><strong>3-5 business days</strong> for funds to appear in your account</p>
                </div>
              </div>
              <p className="note">
                <strong>Total Time:</strong> 10-18 business days from approval to funds availability
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. How to Request a Refund</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Mail className="policy-card-icon" />
                <h3>Refund Request Process</h3>
              </div>
              <div className="request-methods">
                <div className="method">
                  <h4>📧 Email Support</h4>
                  <p>Send detailed request to: <strong>refunds@keycodehelp.com</strong></p>
                  <p>Include: Order number, reason, and supporting details</p>
                </div>
                
                <div className="method">
                  <h4>📞 Phone Support</h4>
                  <p>Call: <strong>+1 (555) 123-4567</strong></p>
                  <p>Available: Monday-Friday, 9 AM - 6 PM EST</p>
                </div>
                
                <div className="method">
                  <h4>💬 Live Chat</h4>
                  <p>Use our website chat feature during business hours</p>
                  <p>Fastest response time for urgent issues</p>
                </div>
              </div>
              
              <div className="required-info">
                <h4>Required Information for Refund Requests:</h4>
                <ul>
                  <li>Order/Transaction ID</li>
                  <li>Date of purchase</li>
                  <li>Vehicle information submitted</li>
                  <li>Detailed reason for refund request</li>
                  <li>Any error messages or screenshots</li>
                  <li>Your contact information</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Prevention Tips</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>Avoiding User Errors</h3>
              </div>
              <div className="prevention-tips">
                <div className="tip">
                  <h4>✅ Double-Check Information</h4>
                  <ul>
                    <li>Verify vehicle make, model, and year</li>
                    <li>Ensure VIN is correct and complete</li>
                    <li>Review all form fields before submission</li>
                  </ul>
                </div>
                
                <div className="tip">
                  <h4>✅ Use Official Sources</h4>
                  <ul>
                    <li>Get vehicle info from registration documents</li>
                    <li>Use manufacturer specifications</li>
                    <li>Avoid relying on memory or estimates</li>
                  </ul>
                </div>
                
                <div className="tip">
                  <h4>✅ Understand the Service</h4>
                  <ul>
                    <li>Read service descriptions carefully</li>
                    <li>Know what you're purchasing</li>
                    <li>Ask questions before buying</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. Contact Information</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Mail className="policy-card-icon" />
                <h3>Refund Support</h3>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>Refund Email: refunds@keycodehelp.com</span>
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
                <strong>Response Time:</strong> We aim to respond to all refund requests within 24 hours 
                during business days.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>8. Policy Updates</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Clock className="policy-card-icon" />
                <h3>Changes to Refund Policy</h3>
              </div>
              <p>
                KeycodeHelp reserves the right to modify this refund policy at any time. Changes will be 
                communicated through email notifications and website updates. Continued use of our services 
                after policy changes constitutes acceptance of the updated terms.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
