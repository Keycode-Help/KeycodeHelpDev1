import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import {
  ShoppingCart,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Trash2,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Lock,
  Car,
  Package,
} from "lucide-react";
import "../styles/cart.css";

// Memoized Checkout Form Component
const CheckoutForm = memo(function CheckoutForm({ cartTotal, cartItems, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleStripeCheckout = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await api.post("/api/payments/create-checkout-session", {
        amount: Math.round(cartTotal * 100),
        items: cartItems,
        success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No checkout URL received from backend");
      }
    } catch (error) {
      console.error("❌ Stripe checkout error:", error);
      setError("Failed to create checkout session. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [cartTotal, cartItems]);

  const orderSummary = useMemo(() => (
    <div className="order-summary">
      <h3>📋 Order Summary</h3>
      <div className="order-items">
        {cartItems.map((item, index) => (
          <div key={`${item.id || index}-${item.make}-${item.model}`} className="order-item">
            <span className="item-name">
              {item.make && item.model ? `${item.make} ${item.model}` : "Vehicle Keycode"}
            </span>
            <span className="item-price">
              ${item.finalPrice || item.standardPrice || item.price}
            </span>
          </div>
        ))}
      </div>
      <div className="order-total">
        <strong>Total: ${cartTotal.toFixed(2)}</strong>
      </div>
    </div>
  ), [cartItems, cartTotal]);

  return (
    <div className="checkout-form">
      {orderSummary}
      <div className="stripe-checkout-section">
        <div className="section-header">
          <CreditCard className="section-icon" />
          <h3>💳 Secure Payment via Stripe</h3>
        </div>
        <p className="checkout-description">
          Click the button below to complete your payment securely on Stripe's hosted checkout page.
        </p>
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        <button
          onClick={handleStripeCheckout}
          disabled={isProcessing}
          className="stripe-checkout-button"
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              Creating Checkout Session...
            </>
          ) : (
            <>
              <Lock size={16} />
              Pay ${cartTotal.toFixed(2)} via Stripe Checkout
            </>
          )}
        </button>
      </div>
    </div>
  );
});

// Memoized Cart Item Component
const CartItem = memo(function CartItem({ item, onRemove }) {
  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);

  return (
    <div className="cart-item">
      <div className="item-info">
        <div className="item-details">
          <h4>{item.make && item.model ? `${item.make} ${item.model}` : "Vehicle Keycode"}</h4>
          {item.vin && <p className="item-vin">VIN: {item.vin}</p>}
          {item.year && <p className="item-year">Year: {item.year}</p>}
        </div>
        <div className="item-pricing">
          <div className="price-comparison">
            <span className="standard-price">Standard: ${item.standardPrice}</span>
            <span className="final-price">Final: ${item.finalPrice || item.standardPrice}</span>
          </div>
          <div className="discount-info">
            {item.finalPrice < item.standardPrice && (
              <span className="discount-badge">
                Save ${(item.standardPrice - item.finalPrice).toFixed(2)}!
              </span>
            )}
          </div>
        </div>
      </div>
      <button onClick={handleRemove} className="remove-item-btn">
        <Trash2 size={16} />
        Remove
      </button>
    </div>
  );
});

// Memoized Subscription Card Component
const SubscriptionCard = memo(function SubscriptionCard({ tier, price, features, perks, onAdd, isDisabled }) {
  const getTierIcon = useCallback(() => {
    switch (tier) {
      case "BASIC":
        return <Star size={24} />;
      case "PROFESSIONAL":
        return <Zap size={24} />;
      case "ENTERPRISE":
        return <Crown size={24} />;
      default:
        return <Package size={24} />;
    }
  }, [tier]);

  const getTierColor = useCallback(() => {
    switch (tier) {
      case "BASIC":
        return "var(--success)";
      case "PROFESSIONAL":
        return "var(--info)";
      case "ENTERPRISE":
        return "var(--primary)";
      default:
        return "var(--textDim)";
    }
  }, [tier]);

  const handleAdd = useCallback(() => {
    onAdd(tier);
  }, [tier, onAdd]);

  return (
    <div className="subscription-card" style={{ borderColor: getTierColor() }}>
      <div className="card-header">
        <div className="tier-icon" style={{ color: getTierColor() }}>
          {getTierIcon()}
        </div>
        <div className="tier-info">
          <h4>{tier}</h4>
          <p className="tier-price">${price}/month</p>
        </div>
      </div>
      <div className="card-features">
        <h5>Features:</h5>
        <ul>
          {features.map((feature, index) => (
            <li key={`${tier}-feature-${index}`}>
              <CheckCircle size={16} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {perks && perks.length > 0 && (
        <div className="card-perks">
          <h5>Perks:</h5>
          <ul>
            {perks.map((perk, index) => (
              <li key={`${tier}-perk-${index}`}>
                <Star size={16} />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleAdd}
        disabled={isDisabled}
        className="add-subscription-btn"
        style={{ backgroundColor: getTierColor() }}
      >
        Add to Cart
      </button>
    </div>
  );
});

// Main Cart Component with Performance Optimizations
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0.0);
  const [subscription, setSubscription] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [guestUserInfo, setGuestUserInfo] = useState(null);

  const { user, isAuthenticated } = useAuth();

  // Memoized guest user info checker
  const checkGuestUserInfo = useCallback(() => {
    const guestInfo = localStorage.getItem("guestUserInfo");
    if (guestInfo) {
      try {
        const guestData = JSON.parse(guestInfo);
        const isExpired = Date.now() - guestData.timestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
          localStorage.removeItem("guestUserInfo");
          return null;
        }
        return guestData;
      } catch (error) {
        console.error("Error parsing guest user info:", error);
        localStorage.removeItem("guestUserInfo");
        return null;
      }
    }
    return null;
  }, []);

  // Memoized cart items fetcher
  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated) {
      const guestInfo = checkGuestUserInfo();
      if (guestInfo) {
        try {
          const response = await api.get(`/cart/items/public?guestUserId=${guestInfo.guestUserId}`);
          if (response.data && Array.isArray(response.data)) {
            setCartItems(response.data);
          }
        } catch (error) {
          console.error("Error fetching guest user cart:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } else {
      try {
        const response = await api.get("/cart/items");
        if (response.data && Array.isArray(response.data)) {
          setCartItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
      }
    }
  }, [isAuthenticated, checkGuestUserInfo]);

  // Memoized cart total calculator
  const calculateCartTotal = useCallback(() => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.finalPrice || item.standardPrice || item.price || 0;
      return sum + price;
    }, 0);
    setCartTotal(total);
  }, [cartItems]);

  // Memoized item remover
  const handleRemoveItem = useCallback(async (itemId) => {
    try {
      if (isAuthenticated) {
        await api.delete(`/cart/items/${itemId}`);
      }
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      setSuccessMessage("Item removed successfully!");
    } catch (error) {
      console.error("Error removing item:", error);
      setSuccessMessage("Failed to remove item. Please try again.");
    }
  }, [isAuthenticated]);

  // Memoized subscription handler
  const handleAddSubscription = useCallback(async (tier) => {
    try {
      await api.post("/cart/addSubscription", { tier });
      setSuccessMessage(`${tier} Subscription added to your cart successfully!`);
      fetchCartItems();
    } catch (error) {
      console.error("Error adding subscription:", error);
      if (error.response && error.response.data) {
        setSuccessMessage(error.response.data);
      } else {
        setSuccessMessage("Failed to add subscription. Please try again.");
      }
    }
  }, [fetchCartItems]);

  // Memoized subscription fetcher
  const getUserSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setSubscription("NONE");
      return;
    }

    try {
      const response = await api.get("/keycode-user/subscription");
      if (response.data && response.data.tier) {
        setSubscription(response.data.tier);
      } else {
        setSubscription("NONE");
      }
    } catch (error) {
      console.error("Error fetching User Subscription:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setSubscription("NONE");
      } else if (user) {
        setSuccessMessage("Failed to fetch User Subscription. Please try again.");
      }
    }
  }, [isAuthenticated, user]);

  // Memoized checkout handlers
  const handleCheckoutSuccess = useCallback(async (paymentIntent) => {
    try {
      await api.post("/api/payments/process-payment-success", {
        paymentIntentId: paymentIntent.id,
      });
      setSuccessMessage("Payment successful! Your order has been placed.");
      setCartItems([]);
      setShowCheckout(false);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      console.error("Error processing payment success:", error);
      setSuccessMessage("Payment successful but there was an issue processing your order. Please contact support.");
    }
  }, []);

  const handleCheckoutError = useCallback(() => {
    setSuccessMessage("Payment failed. Please try again.");
  }, []);

  // Optimized useEffect hooks
  useEffect(() => {
    calculateCartTotal();
  }, [calculateCartTotal]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
      getUserSubscription();
    } else {
      const guestInfo = checkGuestUserInfo();
      if (guestInfo) {
        setGuestUserInfo(guestInfo);
        fetchCartItems();
      } else {
        setGuestUserInfo(null);
        setCartItems([]);
        setCartTotal(0);
      }
      setSubscription("NONE");
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchCartItems, getUserSubscription, checkGuestUserInfo]);

  useEffect(() => {
    if (!isAuthenticated && guestUserInfo) {
      fetchCartItems();
    }
  }, [guestUserInfo, fetchCartItems, isAuthenticated]);

  // Storage event listener with cleanup
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "guestUserInfo") {
        if (e.newValue) {
          try {
            const newGuestInfo = JSON.parse(e.newValue);
            setGuestUserInfo(newGuestInfo);
          } catch (error) {
            console.error("Error parsing new guest user info:", error);
          }
        } else {
          setGuestUserInfo(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const initialGuestInfo = checkGuestUserInfo();
    if (initialGuestInfo && !isAuthenticated) {
      setGuestUserInfo(initialGuestInfo);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated, checkGuestUserInfo]);

  // Success message timer
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Memoized subscription status display
  const subscriptionStatus = useMemo(() => (
    <div className="subscription-status">
      <h3>Subscription: {subscription}</h3>
      {subscription === "NONE" && (
        <p className="warning-text">
          ⚠️ No active subscription - Higher keycode prices apply
        </p>
      )}
      {subscription !== "NONE" && (
        <p className="success-text">
          ✅ {subscription} subscription active -{" "}
          {subscription === "BASIC" ? "15%" : subscription === "PROFESSIONAL" ? "20%" : "25%"}{" "}
          discount on keycodes
        </p>
      )}
    </div>
  ), [subscription]);

  // Memoized subscription cards
  const subscriptionCards = useMemo(() => (
    <div className="subscription-cards">
      <SubscriptionCard
        tier="BASIC"
        price="29.99"
        features={[
          "15% off all keycode purchases",
          "Premium keycode database access",
          "Priority customer support (4-8h)",
          "Advanced search and filtering",
          "Bulk keycode ordering (up to 20 codes)",
          "Extended vehicle coverage",
          "Priority processing (30min - 1 hour)",
        ]}
        perks={[
          "Real-time keycode availability",
          "Advanced search by make/model/year",
          "Phone & chat support",
          "Priority keycode processing",
          "Extended vehicle database coverage",
        ]}
        onAdd={handleAddSubscription}
        isDisabled={subscription !== "NONE"}
      />
      <SubscriptionCard
        tier="PROFESSIONAL"
        price="59.99"
        features={[
          "20% off all keycode purchases",
          "Premium keycode database access",
          "Priority customer support (4-8h)",
          "Advanced search and filtering",
          "Bulk keycode ordering (up to 20 codes)",
          "Extended vehicle coverage",
          "Priority processing (30min - 1 hour)",
        ]}
        perks={[
          "Real-time keycode availability",
          "Advanced search by make/model/year",
          "Phone & chat support",
          "Priority keycode processing",
          "Extended vehicle database coverage",
        ]}
        onAdd={handleAddSubscription}
        isDisabled={subscription !== "NONE"}
      />
      <SubscriptionCard
        tier="ENTERPRISE"
        price="99.99"
        features={[
          "25% off all keycode purchases",
          "Complete keycode database access",
          "24/7 premium customer support",
          "Advanced search and filtering",
          "Unlimited bulk ordering",
          "All vehicle makes & models",
          "Instant processing (15-30 minutes)",
          "Multi-location management",
        ]}
        perks={[
          "Dedicated locksmith support team",
          "Advanced keycode analytics & reporting",
          "Priority emergency keycode requests",
          "Custom keycode training programs",
          "Volume keycode pricing discounts",
          "Exclusive vehicle database access",
        ]}
        onAdd={handleAddSubscription}
        isDisabled={subscription !== "NONE"}
      />
    </div>
  ), [handleAddSubscription, subscription]);

  if (isLoading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <div className="header-left">
            <ShoppingCart size={32} />
            <h1>Your Cart</h1>
          </div>
          <div className="header-right">
            {subscriptionStatus}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <CheckCircle size={20} />
            {successMessage}
          </div>
        )}

        {/* Cart Content */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={64} />
              <h2>Your cart is empty</h2>
              <p>Add some keycode requests to get started!</p>
              <button
                onClick={() => window.location.href = "/vehicle-keycode-request"}
                className="btn btn-primary"
              >
                <ArrowRight size={20} />
                Request Keycode
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items">
                <h2>Cart Items ({cartItems.length})</h2>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
                ))}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <h3>Cart Summary</h3>
                <div className="summary-row">
                  <span>Items:</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="checkout-btn"
                  disabled={cartItems.length === 0}
                >
                  <CreditCard size={20} />
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Subscription Section */}
        {cartItems.length === 0 && (
          <div className="subscription-section">
            <h2>🚀 Upgrade Your Experience</h2>
            <p>Get exclusive discounts and premium features with our subscription plans!</p>
            {subscriptionCards}
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="checkout-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>🔒 Complete Your Purchase via Stripe</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="close-button"
                >
                  ×
                </button>
              </div>
              <CheckoutForm
                cartTotal={cartTotal}
                cartItems={cartItems}
                onSuccess={handleCheckoutSuccess}
                onError={handleCheckoutError}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// PropTypes
CheckoutForm.propTypes = {
  cartTotal: PropTypes.number.isRequired,
  cartItems: PropTypes.array.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

SubscriptionCard.propTypes = {
  tier: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  perks: PropTypes.array,
  onAdd: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default Cart;
