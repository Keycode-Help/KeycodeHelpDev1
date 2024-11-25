import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) {
      // If no token, do not attempt to fetch cart items.
      setCartItems([]);
      return;
    }

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

        // Only alert if user is authenticated, otherwise suppress the alert.
        if (user) {
          alert("Failed to fetch cart items. Please try again.");
        }
      });
  }, [token, user]);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
        alert("Failed to remove item. Please try again.");
      });
  };

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>VIN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.make} {item.model}
                  </td>
                  <td>{item.vin}</td>
                  <td>
                    <button onClick={() => handleRemove(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleCheckout} className="checkout-button">
            Checkout
          </button>
        </>
      )}
      <a href="/vehicle-keycode-request" className="continue-shopping-button">
        Request More Keycodes
      </a>
    </div>
  );
}

export default Cart;
