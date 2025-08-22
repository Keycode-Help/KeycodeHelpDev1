import React from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

function SubscriptionPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#161b22',
    borderRadius: '12px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.4)'
  };
  
  const handleAddSubscription = (tier) => {
    const subscription = {
      tier: tier,
    };

    api
      .post("/cart/addSubscription", subscription, {
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
    <div className="wrapper-sub pt-20">
      <div style={containerStyle} className="subscription-page">
        <h1 style={{marginBottom: '1rem'}}>Select a Subscription</h1>
        <div className="subscription-options">
          <div className="subscription-option">
            <h2>Base Subscription</h2>
            <button
              className="sub-button"
              onClick={() => handleAddSubscription("BASE")}
            >
              Add Base Subscription to Cart
            </button>
          </div>
          <div className="subscription-option">
            <h2>Premium Subscription</h2>
            <button
              className="sub-button"
              onClick={() => handleAddSubscription("PREMIUM")}
            >
              Add Premium Subscription to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
