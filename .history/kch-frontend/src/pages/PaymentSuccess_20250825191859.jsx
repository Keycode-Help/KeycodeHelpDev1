import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  Home,
  Receipt,
  Download,
  Mail,
  Clock,
  Shield,
} from "lucide-react";
import "../styles/paymentSuccess.css";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // In a real app, you would verify the session with your backend
      console.log("Payment successful! Session ID:", sessionId);

      // For now, we'll show a success message
      // In production, you'd call your backend to verify the payment
      setOrderDetails({
        sessionId: sessionId,
        status: "succeeded",
        amount: "85.00", // This would come from your backend verification
        items: [
          {
            name: "Vehicle Keycode",
            description: "Keycode request processed successfully",
          },
        ],
      });
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleContinueShopping = () => {
    navigate("/vehicle-keycode-request");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="payment-success-loading">
        <div className="loading-spinner"></div>
        <p>Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="payment-success-wrapper">
      <div className="payment-success-container">
        {/* Success Header with Enhanced Visual Impact */}
        <div className="success-header">
          <div className="success-icon-container">
            <div className="success-icon-ring">
              <CheckCircle size={80} />
            </div>
            <div className="success-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
            </div>
          </div>
          <h1 className="success-title">
            <span className="title-main">Payment Successful!</span>
            <span className="title-emoji">🎉</span>
          </h1>
          <p className="success-message">
            Your keycode request has been processed and payment completed
            successfully.
          </p>
          <div className="success-badge">
            <Shield size={16} />
            <span>Secure Payment Confirmed</span>
          </div>
        </div>

        {/* Order Details with Better Structure */}
        {orderDetails && (
          <div className="order-details">
            <div className="section-header">
              <Receipt size={24} />
              <h2>Order Confirmation</h2>
            </div>

            <div className="order-summary">
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Session ID</span>
                  <span className="summary-value session-id">
                    {orderDetails.sessionId}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Status</span>
                  <span className="summary-value status-success">
                    <CheckCircle size={16} />
                    {orderDetails.status}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Amount Paid</span>
                  <span className="summary-value amount">
                    ${orderDetails.amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="order-items">
              <h3>Items Ordered</h3>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="order-item-card">
                  <div className="item-icon">
                    <Receipt size={20} />
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-description">{item.description}</span>
                  </div>
                  <div className="item-status">
                    <CheckCircle size={16} />
                    <span>Processed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Next Steps with Icons and Better Layout */}
        <div className="next-steps">
          <div className="section-header">
            <Clock size={24} />
            <h2>What Happens Next?</h2>
          </div>

          <div className="steps-timeline">
            <div className="step-item">
              <div className="step-marker">
                <div className="step-number">1</div>
                <div className="step-line"></div>
              </div>
              <div className="step-content">
                <div className="step-icon">
                  <CheckCircle size={20} />
                </div>
                <div className="step-text">
                  <h4>Payment Confirmed</h4>
                  <p>
                    Your payment has been processed and confirmed by Stripe.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="step-marker">
                <div className="step-number">2</div>
                <div className="step-line"></div>
              </div>
              <div className="step-content">
                <div className="step-icon">
                  <Clock size={20} />
                </div>
                <div className="step-text">
                  <h4>Keycode Processing</h4>
                  <p>
                    Our team will process your keycode request within 24-48
                    hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="step-marker">
                <div className="step-number">3</div>
              </div>
              <div className="step-content">
                <div className="step-icon">
                  <Mail size={20} />
                </div>
                <div className="step-text">
                  <h4>Email Notification</h4>
                  <p>
                    You'll receive an email with your keycode and instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons with Enhanced Styling */}
        <div className="action-buttons">
          <button onClick={handleContinueShopping} className="btn btn-primary">
            <ArrowRight size={20} />
            <span>Request Another Keycode</span>
          </button>
          <button onClick={handleGoHome} className="btn btn-secondary">
            <Home size={20} />
            <span>Go to Homepage</span>
          </button>
        </div>

        {/* Enhanced Support Info */}
        <div className="support-info">
          <div className="support-header">
            <Shield size={20} />
            <h3>Need Help?</h3>
          </div>
          <p>
            Our support team is here to help. Contact us at{" "}
            <a href="mailto:support@keycode.help" className="support-link">
              support@keycode.help
            </a>
          </p>
          <div className="support-features">
            <div className="support-feature">
              <Clock size={16} />
              <span>24/7 Support</span>
            </div>
            <div className="support-feature">
              <Mail size={16} />
              <span>Email Response</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
