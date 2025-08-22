import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/request";

function Checkout() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  useEffect(() => {
    // Fetch cart items directly from the backend
    axios
      .get("http://localhost:8080/cart/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        alert("Failed to fetch cart items. Please try again.");
      });
  }, [token]);

  const handleCheckout = () => {
    axios
      .post(
        "http://localhost:8080/cart/checkout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert("Order placed successfully. A confirmation email has been sent.");
        setConfirmationNumber(response.data.confirmationNumber);
        setCartItems([]); // Clear cart after checkout
      })
      .catch((error) => {
        console.error("Error during checkout:", error);
        alert("There was an error during checkout. Please try again.");
      });
  };

  return (
    <div className="container checkout-page pt-20">
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <h2>Order Summary</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.make} {item.model} - VIN: {item.vin}
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout}>Confirm Purchase</button>
        </div>
      )}
      {confirmationNumber && (
        <div className="confirmation">
          <p>Confirmation Number: {confirmationNumber}</p>
        </div>
      )}
    </div>
  );
}

export default Checkout;
