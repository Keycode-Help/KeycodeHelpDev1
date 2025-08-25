import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, ShoppingCart, Home } from "lucide-react";
import "../styles/paymentCancel.css";

function PaymentCancel() {
  const navigate = useNavigate();

  const handleReturnToCart = () => {
    navigate("/cart");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="payment-cancel-wrapper">
      <div className="payment-cancel-container">
        {/* Cancel Header */}
        <div className="cancel-header">
          <div className="cancel-icon">
            <XCircle size={64} />
          </div>
          <h1>❌ Payment Cancelled</h1>
          <p className="cancel-message">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        {/* What Happened */}
        <div className="what-happened">
          <h2>📋 What Happened?</h2>
          <div className="explanation">
            <p>
              You cancelled the payment process before it was completed. This can happen when:
            </p>
            <ul>
              <li>You closed the payment window</li>
              <li>You clicked the "Cancel" button</li>
              <li>There was a technical issue</li>
              <li>You decided not to proceed with the payment</li>
            </ul>
            <p>
              <strong>Good news:</strong> No money was charged to your account, and your cart items are still available.
            </p>
          </div>
        </div>

        {/* Your Options */}
        <div className="your-options">
          <h2>🔄 Your Options</h2>
          <div className="options-grid">
            <div className="option-card">
              <div className="option-icon">
                <ShoppingCart size={32} />
              </div>
              <h3>Return to Cart</h3>
              <p>Go back to your cart to review your items and try payment again.</p>
              <button onClick={handleReturnToCart} className="option-btn">
                Return to Cart
              </button>
            </div>
            
            <div className="option-card">
              <div className="option-icon">
                <Home size={32} />
              </div>
              <h3>Go to Homepage</h3>
              <p>Return to the homepage to browse other services or start over.</p>
              <button onClick={handleGoHome} className="option-btn">
                Go Home
              </button>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="need-help">
          <h2>❓ Need Help?</h2>
          <p>
            If you experienced technical issues or have questions about the payment process, 
            our support team is here to help.
          </p>
          <div className="help-actions">
            <a href="mailto:support@keycode.help" className="help-link">
              Contact Support
            </a>
            <span className="help-divider">or</span>
            <a href="tel:+1-800-KEYCODE" className="help-link">
              Call Us
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleReturnToCart} className="btn btn-primary">
            <ArrowLeft size={20} />
            Return to Cart
          </button>
          <button onClick={handleGoHome} className="btn btn-secondary">
            <Home size={20} />
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
