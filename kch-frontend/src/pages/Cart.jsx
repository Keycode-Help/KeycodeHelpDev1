import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/cart.css"; // Import the cart.css file

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const { token, user } = useAuth();

  //Added by Nithya - To set cart total
  const [cartTotal, setCartTotal] = useState(0.0);
  const [subscription, setSubscription] = useState("");
  const [isSubscriptionAdded, setIsSubscriptionAdded] = useState(false);

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
        //calculateCartTotal();
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        if (user) {
          alert("Failed to fetch cart items. Please try again.");
        }
      });
  };

  const calculateCartTotal = () => {  
    let totalPrice = 0;
      if(cartItems.length > 0){
        totalPrice = cartItems.reduce((sum, item) => {
          // Check if finalPrice exists and is a valid number
          const itemPrice = item.finalPrice || 0; // Default to 0 if finalPrice is undefined
          return sum + itemPrice;
      },0);
      }else{
        totalPrice = 0;
      }
      totalPrice = Math.round(totalPrice * 100) / 100;
      setCartTotal(totalPrice);
  }

  useEffect(() => {
    calculateCartTotal();
  },[cartItems]);
  useEffect(() => {
    if (!token) {
      setCartItems([]);
      return;
    }
    fetchCartItems();
  }, [token, user]);

  const validateCartHasSubscription = () => {
    //Check whether the cart has a subscription
    const hasSubscription = cartItems.some((cartItem) => cartItem.subscriptionTier != null);
    setIsSubscriptionAdded(hasSubscription);
  }
  const handleCheckout = () => {
    //Check whether the cart has a subscription
    validateCartHasSubscription();
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
        //If the cart has a subscription, get the user subscription to display in the cart
        if(isSubscriptionAdded){
          getUserSubscription();
        }
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
        fetchCartItems();
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
        setIsSubscriptionAdded(true);
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

  const getUserSubscription = () => {
    axios.get("http://localhost:8080/keycode-user/subscription",{
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      //alert(JSON.stringify(response.data));
      if(response.data){
        setSubscription(response.data.tier);
      }else{
        setSubscription("NONE");
      }
      
    }).catch((error) => {
      console.error("Error fetching User Subscription:", error);
      if (user) {
        alert("Failed to fetch User Subscription. Please try again.");
      }
    });
  };

  useEffect(() => {
    getUserSubscription();
  }, []);

  return (
    <div className="wrapper-cart">
      <div className="cart-container">
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <h2>Your Cart</h2>
        <h2>Subscription : {subscription}</h2>
        </div>
        
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
                    {/* Changed by Nithya*/}
                      {/* {item.make} {item.model} (VIN: {item.vin}) */}
                     
                      <>Make: {item.make}</>
                      <br/>
                      <>Model: {item.model}</>
                      <br/>
                      <>VIN: {item.vin}</>
                      <br/>
                      <>Standard Price: ${item.standardPrice}</>
                      <br/>
                      <>Final Price: ${item.finalPrice}</>
                    </>
                    
                  ) : item.subscriptionTier ? (
                    <>Subscription Tier: {item.subscriptionTier}
                    <br/>
                    {/* <>Price: ${item.subscriptionTier === "BASE" ? 9.99 : 49.99}</> */}
                    <>Price: ${item.finalPrice}</>
                    </>
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
        <div style={{marginTop:'2em'}}>
          <h2>Cart Total: ${cartTotal}</h2>
        </div>
        <div className="cart-actions">
          <button onClick={handleCheckout} className="checkout-button" disabled={cartItems.length === 0}>
            Checkout
          </button>
          <button
            onClick={() => handleAddSubscription("BASE")} 
            className="add-subscription-button"
            disabled = {subscription != "NONE"}
          >
            Add Base Subscription
          </button>
          <button
            onClick={() => handleAddSubscription("PREMIUM")}
            className="add-subscription-button"
            disabled = {subscription != "NONE"}
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
