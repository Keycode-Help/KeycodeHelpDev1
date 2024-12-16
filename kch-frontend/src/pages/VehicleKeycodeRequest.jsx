import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/vehicleKeycodeRequest.css"; // Import the CSS file

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
    <div className="wrapper-vr">
      <div className="keycode-request-container">
        <h1>Request a Keycode for Your Vehicle</h1>
        <form onSubmit={handleSubmit} className="keycode-form">
          <div className="form-group">
            <label htmlFor="make">Vehicle Make</label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="Enter Vehicle Make"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="model">Vehicle Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Enter Vehicle Model"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="vin">Vehicle VIN</label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              placeholder="Enter Vehicle VIN"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  );
}

export default VehicleKeycodeRequest;
