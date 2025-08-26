import React from "react";
import { Clock, Calendar, DollarSign, AlertTriangle, CheckCircle, XCircle, Mail, Phone, Globe, Users, Shield, Info } from "lucide-react";
import "../styles/policyPages.css";

const MembershipCancellation = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-page-container">
        <div className="policy-header">
          <div className="policy-header-icon">
            <Clock className="policy-icon" />
          </div>
          <h1>Membership Cancellation Policy</h1>
          <p className="policy-subtitle">
            Clear guidelines for cancelling your KeycodeHelp membership
          </p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>Quick Overview</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Shield className="policy-card-icon" />
                <h3>Key Points</h3>
              </div>
              <ul>
                <li><strong>Cancel Anytime:</strong> No long-term contracts or cancellation fees</li>
                <li><strong>Monthly Plans:</strong> No refunds for partial months</li>
                <li><strong>Annual Plans:</strong> Prorated refunds for unused months</li>
                <li><strong>Immediate Effect:</strong> Cancellations take effect at end of billing period</li>
                <li><strong>Easy Process:</strong> Cancel through account settings or contact support</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>1. Cancellation Timeline</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Calendar className="policy-card-icon" />
                <h3>When Cancellation Takes Effect</h3>
              </div>
              <div className="timeline-info">
                <div className="timeline-item">
                  <h4>Immediate</h4>
                  <p>Your cancellation request is processed</p>
                </div>
                <div className="timeline-item">
                  <h4>End of Billing Period</h4>
                  <p>Service access continues until paid period ends</p>
                </div>
                <div className="timeline-item">
                  <h4>Next Billing Cycle</h4>
                  <p>No further charges are processed</p>
                </div>
              </div>
              <p className="note">
                <strong>Important:</strong> You maintain full access to all features until your current 
                billing period expires.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Monthly Membership Plans</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Calendar className="policy-card-icon" />
                <h3>Monthly Billing Cancellation</h3>
              </div>
              <div className="refund-scenario">
                <h4>📅 Monthly Plan Details</h4>
                <ul>
                  <li><strong>Billing Cycle:</strong> Monthly (30-day periods)</li>
                  <li><strong>Cancellation:</strong> Cancel anytime during the month</li>
                  <li><strong>Refund Policy:</strong> No refunds for partial months</li>
                  <li><strong>Service Access:</strong> Full access until month ends</li>
                  <li><strong>Next Charge:</strong> No charges after cancellation</li>
                </ul>
              </div>
              
              <div className="policy-note">
                <AlertTriangle className="note-icon" />
                <p>
                  <strong>Example:</strong> If you cancel on the 15th of a month, you'll have access 
                  until the end of that month, but no refund for the remaining 15 days.
                </p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Annual Membership Plans</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Calendar className="policy-card-icon" />
                <h3>Annual Billing Cancellation</h3>
              </div>
              <div className="refund-scenario">
                <h4>📅 Annual Plan Details</h4>
                <ul>
                  <li><strong>Billing Cycle:</strong> Annual (365-day periods)</li>
                  <li><strong>Cancellation:</strong> Cancel anytime during the year</li>
                  <li><strong>Refund Policy:</strong> Prorated refunds for unused months</li>
                  <li><strong>Service Access:</strong> Full access until cancellation date</li>
                  <li><strong>Refund Calculation:</strong> Based on remaining months</li>
                </ul>
              </div>
              
              <div className="policy-note">
                <CheckCircle className="note-icon" />
                <p>
                  <strong>Example:</strong> If you cancel after 6 months on an annual plan, you'll receive 
                  a refund for the remaining 6 months (50% of annual fee).
                </p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Refund Calculation</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <DollarSign className="policy-card-icon" />
                <h3>How Refunds Are Calculated</h3>
              </div>
              <div className="refund-scenario">
                <h4>💰 Monthly Plans</h4>
                <p><strong>No Refunds:</strong> Monthly plans are non-refundable once the month begins.</p>
              </div>
              
              <div className="refund-scenario">
                <h4>💰 Annual Plans</h4>
                <p><strong>Prorated Refunds:</strong> Calculate unused months and refund proportionally.</p>
                <ul>
                  <li>Refund = (Unused months ÷ Total months) × Annual fee</li>
                  <li>Processing fee: $5 deducted from refund amount</li>
                  <li>Minimum refund: $10 (after processing fee)</li>
                </ul>
              </div>
              
              <div className="refund-scenario">
                <h4>📊 Refund Examples</h4>
                <div className="refund-examples">
                  <div className="example">
                    <strong>3 months used:</strong> 9 months remaining = 75% refund
                  </div>
                  <div className="example">
                    <strong>6 months used:</strong> 6 months remaining = 50% refund
                  </div>
                  <div className="example">
                    <strong>9 months used:</strong> 3 months remaining = 25% refund
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. How to Cancel</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Users className="policy-card-icon" />
                <h3>Cancellation Methods</h3>
              </div>
              <div className="request-methods">
                <div className="method">
                  <h4>💻 Account Settings (Recommended)</h4>
                  <p>Log into your account and use the cancellation option in settings</p>
                  <p>Fastest and most convenient method</p>
                </div>
                
                <div className="method">
                  <h4>📧 Email Support</h4>
                  <p>Send cancellation request to: <strong>cancellations@keycodehelp.com</strong></p>
                  <p>Include your account email and reason for cancellation</p>
                </div>
                
                <div className="method">
                  <h4>📞 Phone Support</h4>
                  <p>Call: <strong>+1 (555) 123-4567</strong></p>
                  <p>Available: Monday-Friday, 9 AM - 6 PM EST</p>
                </div>
              </div>
              
              <div className="required-info">
                <h4>Required Information for Cancellation:</h4>
                <ul>
                  <li>Account email address</li>
                  <li>Full name on account</li>
                  <li>Reason for cancellation (optional but helpful)</li>
                  <li>Preferred contact method for confirmation</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. What Happens After Cancellation</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Clock className="policy-card-icon" />
                <h3>Post-Cancellation Process</h3>
              </div>
              <div className="refund-process">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Confirmation Email</h4>
                    <p>You'll receive immediate confirmation of your cancellation request</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Service Access Continues</h4>
                    <p>Full access to all features until current billing period ends</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Refund Processing</h4>
                    <p>Annual plan refunds processed within 5-10 business days</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Account Status</h4>
                    <p>Account becomes inactive but data is preserved for 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. Reactivation</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <CheckCircle className="policy-card-icon success" />
                <h3>Rejoining KeycodeHelp</h3>
              </div>
              <div className="refund-scenario">
                <h4>🔄 Reactivation Process</h4>
                <ul>
                  <li><strong>Anytime:</strong> You can reactivate your account at any time</li>
                  <li><strong>Current Pricing:</strong> New rates may apply (prices subject to change)</li>
                  <li><strong>Data Recovery:</strong> Your previous data may be restored</li>
                  <li><strong>New Payment:</strong> New payment method may be required</li>
                  <li><strong>No Penalties:</strong> No fees for reactivation</li>
                </ul>
              </div>
              
              <div className="policy-note">
                <Info className="note-icon" />
                <p>
                  <strong>Note:</strong> Reactivation is subject to current terms and pricing. 
                  Previous promotional rates may not be available.
                </p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>8. Special Circumstances</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <AlertTriangle className="policy-card-icon warning" />
                <h3>Exceptions to Standard Policy</h3>
              </div>
              <div className="refund-scenario">
                <h4>🚫 No Refunds For</h4>
                <ul>
                  <li>Service usage during the billing period</li>
                  <li>Change of mind after purchase</li>
                  <li>Technical issues on user's end</li>
                  <li>Incompatibility with user's systems</li>
                  <li>User errors or mistakes</li>
                </ul>
              </div>
              
              <div className="refund-scenario">
                <h4>✅ Special Refunds Available For</h4>
                <ul>
                  <li>Service outages exceeding 24 hours</li>
                  <li>Technical failures preventing service use</li>
                  <li>Billing errors or duplicate charges</li>
                  <li>Fraudulent charges</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>9. Contact Information</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Mail className="policy-card-icon" />
                <h3>Cancellation Support</h3>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>Cancellation Email: cancellations@keycodehelp.com</span>
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
                <strong>Response Time:</strong> We aim to process all cancellation requests within 24 hours 
                during business days.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>10. Policy Updates</h2>
            <div className="policy-card">
              <div className="policy-card-header">
                <Clock className="policy-card-icon" />
                <h3>Changes to Cancellation Policy</h3>
              </div>
              <p>
                KeycodeHelp reserves the right to modify this cancellation policy at any time. 
                Changes will be communicated through email notifications and website updates. 
                Your cancellation rights at the time of purchase will be honored.
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

export default MembershipCancellation;
