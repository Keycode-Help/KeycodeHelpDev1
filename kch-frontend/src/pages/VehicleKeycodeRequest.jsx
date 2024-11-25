import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function VehicleKeycodeRequest() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    vin: "",
  });
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/vehicle/request-keycode", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Vehicle request added to cart.");
        navigate("/cart");
      })
      .catch((error) => {
        console.error("Error requesting keycode:", error);
        alert("Failed to request keycode. Please try again.");
      });
  };

  return (
    <div className="container">
      <h1>Request a Keycode for Your Vehicle</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="Vehicle Make"
          required
        />
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Vehicle Model"
          required
        />
        <input
          type="text"
          name="vin"
          value={formData.vin}
          onChange={handleChange}
          placeholder="VIN"
          required
        />
        <button type="submit">Add to Cart</button>
      </form>
    </div>
  );
}

export default VehicleKeycodeRequest;
