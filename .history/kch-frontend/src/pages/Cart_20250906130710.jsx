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

// Memoized Checkout Form Component for better performance
const CheckoutForm = memo(function CheckoutForm({
  cartTotal,
  cartItems,
  onSuccess,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Memoize the checkout handler to prevent unnecessary re-renders
  const handleStripeCheckout = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create Stripe checkout session on your backend
      const response = await api.post("/api/payments/create-checkout-session", {
        amount: Math.round(cartTotal * 100), // Convert to cents
        items: cartItems,
        success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`,
      });

      // Redirect to Stripe's hosted checkout page
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

  // Memoize the order summary to prevent unnecessary re-renders
  const orderSummary = useMemo(
    () => (
      <div className="order-summary">
        <h3>📋 Order Summary</h3>
        <div className="order-items">
          {cartItems.map((item, index) => (
            <div
              key={`${item.id || index}-${item.make}-${item.model}`}
              className="order-item"
            >
              <span className="item-name">
                {item.make && item.model
                  ? `${item.make} ${item.model}`
                  : "Vehicle Keycode"}
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
    ),
    [cartItems, cartTotal]
  );

  return (
    <div className="checkout-form">
      {orderSummary}

      {/* Stripe Checkout Button */}
      <div className="stripe-checkout-section">
        <div className="section-header">
          <CreditCard className="section-icon" />
          <h3>💳 Secure Payment via Stripe</h3>
        </div>

        <p className="checkout-description">
          Click the button below to complete your payment securely on Stripe's
          hosted checkout page.
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
    <div className={`cart-item ${isRemoving ? "removing" : ""}`}>
      <div className="item-header">
        <div className="item-icon">{getItemIcon()}</div>
        <div className="item-info">
          <h4>{getItemType()}</h4>
          <p className="item-details">
            {item.subscriptionTier
              ? `${item.subscriptionTier} Plan`
              : `${item.make} ${item.model}`}
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
      case "BASIC":
        return <Star size={24} />;
      case "PROFESSIONAL":
        return <Zap size={24} />;
      case "ENTERPRISE":
        return <Crown size={24} />;
      default:
        return <Star size={24} />;
    }
  };

  const getTierColor = () => {
    switch (tier) {
      case "BASIC":
        return "var(--warning)";
      case "PROFESSIONAL":
        return "var(--info)";
      case "ENTERPRISE":
        return "var(--primary)";
      default:
        return "var(--textDim)";
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-secondary/20 to-dark/20 border border-secondary/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
      style={{ borderColor: getTierColor() }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-12 h-12 flex items-center justify-center rounded-lg"
          style={{ color: getTierColor() }}
        >
          {getTierIcon()}
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white">{tier}</h4>
          <p className="text-primary font-bold text-lg">${price}/month</p>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="text-white font-semibold mb-2">Features:</h5>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-white/80">
              <CheckCircle size={16} className="text-success" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {perks && perks.length > 0 && (
        <div className="mb-4">
          <h5 className="text-white font-semibold mb-2">Perks:</h5>
          <ul className="space-y-2">
            {perks.map((perk, index) => (
              <li key={index} className="flex items-center gap-2 text-white/80">
                <Star size={16} className="text-accent" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => onAdd(tier)}
        disabled={isDisabled}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:from-primary-dark hover:to-primary hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
  const [guestUserInfo, setGuestUserInfo] = useState(null);

  const { user, isAuthenticated } = useAuth();

  // Check for guest user info from keycode request
  const checkGuestUserInfo = () => {
    const guestInfo = localStorage.getItem("guestUserInfo");
    if (guestInfo) {
      try {
        const guestData = JSON.parse(guestInfo);
        // Check if the guest info is still valid (within last 24 hours)
        const isExpired =
          Date.now() - guestData.timestamp > 24 * 60 * 60 * 1000;
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
  };

  const fetchCartItems = async () => {
    if (!isAuthenticated) {
      // Check for guest user info
      const guestInfo = checkGuestUserInfo();
      if (guestInfo) {
        try {
          console.log(
            "Fetching cart items for guest user:",
            guestInfo.guestUserId
          );
          // Fetch cart items for guest user from backend
          const response = await api.get(
            `/cart/items/public?guestUserId=${guestInfo.guestUserId}`
          );
          if (import.meta.env.DEV) {
            console.log("Guest cart response:", response.data);
          }
          if (Array.isArray(response.data)) {
            setCartItems(response.data);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error fetching guest user cart:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
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
    if (cartItems.length > 0) {
      totalPrice = cartItems.reduce((sum, item) => {
        // Handle both temporary vehicle data and regular cart items
        let itemPrice = 0;
        if (item.finalPrice !== undefined) {
          itemPrice = item.finalPrice;
        } else if (item.standardPrice !== undefined) {
          itemPrice = item.standardPrice;
        } else if (item.price !== undefined) {
          itemPrice = item.price;
        }
        return sum + itemPrice;
      }, 0);
    }

    if (subscription !== "NONE" && totalPrice > 0) {
      let discountRate = 0;
      if (subscription === "BASIC") {
        discountRate = 0.15;
      } else if (subscription === "PROFESSIONAL") {
        discountRate = 0.2;
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
      // Check if this is a temporary vehicle request
      const tempVehicle = localStorage.getItem("tempVehicleRequest");
      if (tempVehicle) {
        const vehicleData = JSON.parse(tempVehicle);
        if (vehicleData.id === itemId) {
          // Remove temporary vehicle request
          localStorage.removeItem("tempVehicleRequest");
          setCartItems([]);
          setSuccessMessage("Vehicle request removed successfully!");
          return;
        }
      }

      // Handle authenticated user cart item removal
      if (isAuthenticated) {
        await api.delete(`/cart/remove/${itemId}`);
        setCartItems(cartItems.filter((item) => item.id !== itemId));
        setSuccessMessage("Item removed from cart successfully!");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setSuccessMessage("Failed to remove item. Please try again.");
    }
  };

  // Clear temporary vehicle request (for unauthenticated users)
  const clearTemporaryVehicleRequest = () => {
    localStorage.removeItem("tempVehicleRequest");
    setCartItems([]);
    setSuccessMessage("Vehicle request cleared successfully!");
  };

  const handleAddSubscription = async (tier) => {
    try {
      await api.post("/cart/addSubscription", { tier });
      setSuccessMessage(
        `${tier} Subscription added to your cart successfully!`
      );
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
        setSuccessMessage(
          "Failed to fetch User Subscription. Please try again."
        );
      }
    }
  };

  const handleCheckoutSuccess = async (paymentIntent) => {
    try {
      // Process the successful payment on the backend
      await api.post("/api/payments/process-payment-success", {
        paymentIntentId: paymentIntent.id,
      });

      setSuccessMessage("Payment successful! Your order has been placed.");
      setCartItems([]);
      setShowCheckout(false);

      // Redirect to order confirmation or dashboard
      setTimeout(() => {
        window.location.href = "/dashboard"; // or wherever you want to redirect
      }, 2000);
    } catch (error) {
      console.error("Error processing payment success:", error);
      setSuccessMessage(
        "Payment successful but there was an issue processing your order. Please contact support."
      );
    }
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
      // For unauthenticated users, check for guest user info and fetch cart
      const guestInfo = checkGuestUserInfo();
      if (guestInfo) {
        setGuestUserInfo(guestInfo);
        fetchCartItems(); // This will fetch from backend for guest user
      } else {
        setGuestUserInfo(null);
        setCartItems([]);
        setCartTotal(0);
      }
      setSubscription("NONE");
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Additional useEffect to handle guest user info changes
  useEffect(() => {
    if (!isAuthenticated && guestUserInfo) {
      fetchCartItems();
    }
  }, [guestUserInfo]);

  // Listen for changes to localStorage (when guestUserInfo is set from keycode request)
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

    // Also check for initial guest user info
    const initialGuestInfo = checkGuestUserInfo();
    if (initialGuestInfo && !isAuthenticated) {
      setGuestUserInfo(initialGuestInfo);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <ShoppingCart size={24} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Your Cart</h1>
                <p className="text-white/70">Review and checkout your items</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
              <h3 className="text-white font-semibold mb-2">Subscription: {subscription}</h3>
              {subscription === "NONE" && (
                <p className="text-yellow-400 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  No active subscription - Higher keycode prices apply
                </p>
              )}
              {subscription !== "NONE" && (
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <span>✅</span>
                  {subscription} subscription active -{" "}
                  {subscription === "BASIC"
                    ? "15%"
                    : subscription === "PROFESSIONAL"
                    ? "20%"
                    : "25%"}{" "}
                  discount on keycodes
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <p className="text-green-400 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Cart Content */}
        <div className="space-y-8">
          {cartItems.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-12 text-center">
              <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={48} className="text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-white/70 mb-8">Start adding keycodes or subscriptions to get started!</p>
              <a
                href="/vehicle-keycode-request"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Request Keycodes
              </a>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                    <Package size={16} className="text-blue-400" />
                  </div>
                  Cart Items ({cartItems.length})
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>

                {/* Clear button for unauthenticated users with temporary vehicle requests */}
                {!isAuthenticated &&
                  cartItems.length > 0 &&
                  cartItems[0]?.isTemporary && (
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <p className="text-yellow-400 text-sm mb-4 flex items-center gap-2">
                        <span>⚠️</span>
                        This is a temporary vehicle request. You must
                        complete checkout or log in to save it permanently.
                      </p>
                      <button
                        onClick={clearTemporaryVehicleRequest}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-700 hover:to-orange-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                      >
                        Clear Vehicle Request
                      </button>
                    </div>
                  )}
              </div>

              {/* Cart Summary */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                      <CreditCard size={16} className="text-green-400" />
                    </div>
                    Order Summary
                  </h3>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/80">Subtotal:</span>
                    <span className="text-white font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  {subscription !== "NONE" && cartItems.length > 0 && (
                    <div className="flex justify-between items-center py-2 text-green-400">
                      <span>Subscription Discount:</span>
                      <span className="font-semibold">
                        -
                        {subscription === "BASIC"
                          ? "15%"
                          : subscription === "PROFESSIONAL"
                          ? "20%"
                          : "25%"}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold text-white">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                "Standard processing time (3-24 hours)",
              ]}
              perks={[
                "Monthly usage reports",
                "Basic training resources",
                "Email support",
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
        </div>

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
