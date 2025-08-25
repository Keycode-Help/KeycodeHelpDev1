import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Receipt } from "lucide-react";
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
            description: "Keycode request processed successfully"
          }
        ]
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
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h1>🎉 Payment Successful!</h1>
          <p className="success-message">
            Your keycode request has been processed and payment completed successfully.
          </p>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="order-details">
            <h2>📋 Order Confirmation</h2>
            <div className="order-info">
              <div className="info-row">
                <span className="label">Session ID:</span>
                <span className="value">{orderDetails.sessionId}</span>
              </div>
              <div className="info-row">
                <span className="label">Status:</span>
                <span className="value status-success">{orderDetails.status}</span>
              </div>
              <div className="info-row">
                <span className="label">Amount Paid:</span>
                <span className="value amount">${orderDetails.amount}</span>
              </div>
            </div>

            <div className="order-items">
              <h3>Items Ordered:</h3>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="order-item">
                  <Receipt size={20} />
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-description">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="next-steps">
          <h2>🚀 What Happens Next?</h2>
          <div className="steps-list">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Payment Confirmed</h4>
                <p>Your payment has been processed and confirmed by Stripe.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Keycode Processing</h4>
                <p>Our team will process your keycode request within 24-48 hours.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Email Notification</h4>
                <p>You'll receive an email with your keycode and instructions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleContinueShopping} className="btn btn-primary">
            <ArrowRight size={20} />
            Request Another Keycode
          </button>
          <button onClick={handleGoHome} className="btn btn-secondary">
            <Home size={20} />
            Go to Homepage
          </button>
        </div>

        {/* Support Info */}
        <div className="support-info">
          <p>
            Need help? Contact our support team at{" "}
            <a href="mailto:support@keycode.help">support@keycode.help</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
