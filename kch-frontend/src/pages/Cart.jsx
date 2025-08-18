import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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
  Package
} from "lucide-react";
import "../styles/cart.css";

// Initialize Stripe (you'll need to replace with your actual publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

// Checkout Form Component
function CheckoutForm({ cartTotal, cartItems, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent on your backend
      const { data: { clientSecret } } = await api.post('/api/payments/create-payment-intent', {
        amount: Math.round(cartTotal * 100), // Convert to cents
        items: cartItems
      });

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-section">
        <div className="section-header">
          <CreditCard className="section-icon" />
          <h3>Payment Information</h3>
        </div>
        
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: 'var(--text)',
                  '::placeholder': {
                    color: 'var(--textDim)',
                  },
                },
              },
            }}
          />
        </div>
        
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="pay-button"
      >
        {isProcessing ? (
          <>
            <div className="spinner"></div>
            Processing...
          </>
        ) : (
          <>
            <Lock size={16} />
            Pay ${cartTotal.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
}

// Cart Item Component
function CartItem({ item, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item.id);
    setIsRemoving(false);
  };

  const getItemIcon = () => {
    if (item.subscriptionTier) return <Crown size={24} />;
    if (item.make && item.model) return <Car size={24} />;
    return <Package size={24} />;
  };

  const getItemType = () => {
    if (item.subscriptionTier) return "Subscription";
    if (item.make && item.model) return "Vehicle Keycode";
    return "Item";
  };

  return (
    <div className={`cart-item ${isRemoving ? 'removing' : ''}`}>
      <div className="item-header">
        <div className="item-icon">
          {getItemIcon()}
        </div>
        <div className="item-info">
          <h4>{getItemType()}</h4>
          <p className="item-details">
            {item.subscriptionTier ? (
              `${item.subscriptionTier} Plan`
            ) : (
              `${item.make} ${item.model}`
            )}
          </p>
        </div>
        <button 
          onClick={handleRemove}
          className="remove-button"
          disabled={isRemoving}
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="item-pricing">
        <div className="price-breakdown">
          <span className="standard-price">${item.standardPrice}</span>
          <span className="final-price">${item.finalPrice}</span>
        </div>
        {item.standardPrice !== item.finalPrice && (
          <div className="discount-badge">
            Save ${(item.standardPrice - item.finalPrice).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}

// Subscription Card Component
function SubscriptionCard({ tier, price, features, perks, onAdd, isDisabled }) {
  const getTierIcon = () => {
    switch (tier) {
      case 'BASIC': return <Star size={24} />;
      case 'PROFESSIONAL': return <Zap size={24} />;
      case 'ENTERPRISE': return <Crown size={24} />;
      default: return <Star size={24} />;
    }
  };

  const getTierColor = () => {
    switch (tier) {
      case 'BASIC': return 'var(--warning)';
      case 'PROFESSIONAL': return 'var(--info)';
      case 'ENTERPRISE': return 'var(--primary)';
      default: return 'var(--textDim)';
    }
  };

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
            <li key={index}>
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
              <li key={index}>
                <Star size={16} />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button 
        onClick={() => onAdd(tier)}
        disabled={isDisabled}
        className="add-subscription-btn"
        style={{ backgroundColor: getTierColor() }}
      >
        Add to Cart
      </button>
    </div>
  );
}

// Main Cart Component
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0.0);
  const [subscription, setSubscription] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  
  const { user, isAuthenticated } = useAuth();

  const fetchCartItems = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await api.get("/cart/items");
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      if (user) {
        setSuccessMessage("Failed to fetch cart items. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCartTotal = () => {  
    let totalPrice = 0;
    if(cartItems.length > 0){
      totalPrice = cartItems.reduce((sum, item) => {
        const itemPrice = item.finalPrice || 0;
        return sum + itemPrice;
      }, 0);
    }
    
    if (subscription !== "NONE" && totalPrice > 0) {
      let discountRate = 0;
      if (subscription === "BASIC") {
        discountRate = 0.15;
      } else if (subscription === "PROFESSIONAL") {
        discountRate = 0.20;
      } else if (subscription === "ENTERPRISE") {
        discountRate = 0.25;
      }
      
      if (discountRate > 0) {
        const discount = totalPrice * discountRate;
        totalPrice = totalPrice - discount;
      }
    }
    
    totalPrice = Math.round(totalPrice * 100) / 100;
    setCartTotal(totalPrice);
  };

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      setSuccessMessage("Item removed from cart successfully!");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setSuccessMessage("Failed to remove item. Please try again.");
    }
  };

  const handleAddSubscription = async (tier) => {
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
  };

  const getUserSubscription = async () => {
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
  };

  const handleCheckoutSuccess = () => {
    setSuccessMessage("Payment successful! Your order has been placed.");
    setCartItems([]);
    setShowCheckout(false);
    // You can redirect to order confirmation page here
  };

  const handleCheckoutError = () => {
    setSuccessMessage("Payment failed. Please try again.");
  };

  useEffect(() => {
    calculateCartTotal();
  }, [cartItems, subscription]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
      getUserSubscription();
    } else {
      setCartItems([]);
      setSubscription("NONE");
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
            <div className="subscription-status">
              <h3>Subscription: {subscription}</h3>
              {subscription === "NONE" && (
                <p className="warning-text">
                  ⚠️ No active subscription - Higher keycode prices apply
                </p>
              )}
              {subscription !== "NONE" && (
                <p className="success-text">
                  ✅ {subscription} subscription active - {subscription === "BASIC" ? "15%" : subscription === "PROFESSIONAL" ? "20%" : "25%"} discount on keycodes
                </p>
              )}
            </div>
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
              <p>Start adding keycodes or subscriptions to get started!</p>
              <a href="/vehicle-keycode-request" className="btn btn-primary">
                Request Keycodes
              </a>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items-section">
                <h2>Cart Items ({cartItems.length})</h2>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="summary-header">
                  <h3>Order Summary</h3>
                </div>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  {subscription !== "NONE" && cartItems.length > 0 && (
                    <div className="summary-row discount">
                      <span>Subscription Discount:</span>
                      <span>-{subscription === "BASIC" ? "15%" : subscription === "PROFESSIONAL" ? "20%" : "25%"}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="summary-actions">
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="checkout-btn"
                    disabled={cartItems.length === 0}
                  >
                    <ArrowRight size={20} />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Subscription Plans */}
        <div className="subscription-section">
          <h2>Subscription Plans</h2>
          <p className="section-description">
            Choose a subscription plan to unlock discounts and premium features
          </p>
          
          <div className="subscription-grid">
            <SubscriptionCard
              tier="BASIC"
              price="9.99"
              features={[
                "15% off 1 keycode order per month",
                "Limited vehicle access (Ford, Nissan, Chevy only)",
                "Basic customer support (24-48h)",
                "Basic search functionality",
                "Standard processing time (3-24 hours)"
              ]}
              perks={[
                "Monthly usage reports",
                "Basic training resources",
                "Email support"
              ]}
              onAdd={handleAddSubscription}
              isDisabled={subscription !== "NONE"}
            />
            
            <SubscriptionCard
              tier="PROFESSIONAL"
              price="24.99"
              features={[
                "20% off all keycode purchases",
                "Premium keycode database access",
                "Priority customer support (4-8h)",
                "Advanced search and filtering",
                "Bulk keycode ordering (up to 20 codes)",
                "Extended vehicle coverage",
                "Priority processing (30min - 1 hour)"
              ]}
              perks={[
                "Real-time keycode availability",
                "Advanced search by make/model/year",
                "Phone & chat support",
                "Priority keycode processing",
                "Extended vehicle database coverage"
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
                "Multi-location management"
              ]}
              perks={[
                "Dedicated locksmith support team",
                "Advanced keycode analytics & reporting",
                "Priority emergency keycode requests",
                "Custom keycode training programs",
                "Volume keycode pricing discounts",
                "Exclusive vehicle database access"
              ]}
              onAdd={handleAddSubscription}
              isDisabled={subscription !== "NONE"}
            />
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="checkout-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Complete Your Purchase</h2>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="close-button"
                >
                  ×
                </button>
              </div>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  cartTotal={cartTotal}
                  cartItems={cartItems}
                  onSuccess={handleCheckoutSuccess}
                  onError={handleCheckoutError}
                />
              </Elements>
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
  onSuccess: PropTypes.func.isRequired
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

SubscriptionCard.propTypes = {
  tier: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  perks: PropTypes.array,
  onAdd: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
};

export default Cart;
