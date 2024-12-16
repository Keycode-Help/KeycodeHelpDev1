import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SubscriptionPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleAddSubscription = (tier) => {
    const subscription = {
      tier: tier,
    };

    axios
      .post("http://localhost:8080/cart/addSubscription", subscription, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert(`${tier} Subscription added to your cart successfully.`);
        navigate("/cart");
      })
      .catch((error) => {
        console.error("Error adding subscription:", error);
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data === "User already has an active subscription."
        ) {
          alert(
            "This account already has a subscription associated with it. Only one subscription per account."
          );
        } else {
          alert("Failed to add subscription. Please try again.");
        }
      });
  };

  return (
    <div className="wrapper-sub">
      <div className="container subscription-page">
        <h1>Select a Subscription</h1>
        <div className="subscription-options">
          <div className="subscription-option">
            <h2>Base Subscription</h2>
            <button onClick={() => handleAddSubscription("BASE")}>
              Add Base Subscription to Cart
            </button>
          </div>
          <div className="subscription-option">
            <h2>Premium Subscription</h2>
            <button onClick={() => handleAddSubscription("PREMIUM")}>
              Add Premium Subscription to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
