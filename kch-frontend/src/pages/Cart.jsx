import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/cart.css"; // Import the cart.css file

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const { token, user } = useAuth();

  const fetchCartItems = () => {
    axios
      .get("http://localhost:8080/cart/items", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          setCartItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        if (user) {
          alert("Failed to fetch cart items. Please try again.");
        }
      });
  };

  useEffect(() => {
    if (!token) {
      setCartItems([]);
      return;
    }
    fetchCartItems();
  }, [token, user]);

  const handleCheckout = () => {
    axios
      .post(
        "http://localhost:8080/cart/checkout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Order placed successfully. A confirmation email has been sent.");
        setCartItems([]);
      })
      .catch((error) => {
        console.error("Error during checkout:", error);
        alert("Failed to complete checkout. Please try again.");
      });
  };

  const handleRemove = (itemId) => {
    axios
      .delete(`http://localhost:8080/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
        alert("Failed to remove item. Please try again.");
      });
  };

  const handleAddSubscription = (tier) => {
    const subscription = { tier };

    axios
      .post("http://localhost:8080/cart/addSubscription", subscription, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert(`${tier} Subscription added to your cart successfully.`);
        fetchCartItems(); // Refresh the cart items
      })
      .catch((error) => {
        console.error("Error adding subscription:", error);
        if (error.response && error.response.data) {
          alert(error.response.data); // Display the server error message
        } else {
          alert("Failed to add subscription. Please try again.");
        }
      });
  };

  return (
    <div className="wrapper-cart">
      <div className="cart-container">
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is currently empty.</p>
        ) : (
          <div className="cart-grid">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <h3>
                  {item.make && item.model && item.vin
                    ? "Vehicle"
                    : item.subscriptionTier
                    ? "Subscription"
                    : "Unknown"}
                </h3>
                <p>
                  {item.make && item.model && item.vin ? (
                    <>
                      {item.make} {item.model} (VIN: {item.vin})
                    </>
                  ) : item.subscriptionTier ? (
                    <>Subscription Tier: {item.subscriptionTier}</>
                  ) : (
                    "N/A"
                  )}
                </p>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="cart-actions">
          <button onClick={handleCheckout} className="checkout-button">
            Checkout
          </button>
          <button
            onClick={() => handleAddSubscription("BASE")}
            className="add-subscription-button"
          >
            Add Base Subscription
          </button>
          <button
            onClick={() => handleAddSubscription("PREMIUM")}
            className="add-subscription-button"
          >
            Add Premium Subscription
          </button>
          <a
            href="/vehicle-keycode-request"
            className="continue-shopping-button"
          >
            Request More Keycodes
          </a>
        </div>
      </div>
    </div>
  );
}

export default Cart;
