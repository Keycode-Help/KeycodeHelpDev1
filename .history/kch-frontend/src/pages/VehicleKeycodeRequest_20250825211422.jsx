import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/request";
import { useAuth } from "../context/AuthContext";
import "../styles/vehicleKeycodeRequest.css";
import MakeDropDown from "../components/MakeDropDown";
import ComplianceBanner from "../components/ComplianceBanner";
import ModelDropDown from "../components/ModelDropDown";
import YearDropDown from "../components/YearDropDown";
import {
  getVehicleMakes,
  getVehicleModels,
  getVehicleYears,
  getVehiclePrice,
  getVehicleCategory,
  requiresPin,
  isValidVehicleCombination,
} from "../data/vehicleDatabase";

function VehicleKeycodeRequest() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    frontId: null,
    backId: null,
    registration: null,
    licenseFront: null,
    licenseBack: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth(); // Keep user for optional member pricing display

  // Vehicle database state
  const [availableMakes, setAvailableMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  // Selected values
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMakePrice, setSelectedMakePrice] = useState(0.0);
  const [selectedMemberPrice, setSelectedMemberPrice] = useState(0.0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [requiresPinCode, setRequiresPinCode] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  // Initialize vehicle makes on component mount
  useEffect(() => {
    const makes = getVehicleMakes();
    setAvailableMakes(makes);
  }, []);

  // Update models when make changes
  useEffect(() => {
    if (selectedMake) {
      const models = getVehicleModels(selectedMake);
      setAvailableModels(models);
      setSelectedModel("");
      setSelectedYear("");
      setAvailableYears([]);
    } else {
      setAvailableModels([]);
      setSelectedModel("");
      setSelectedYear("");
      setAvailableYears([]);
    }
  }, [selectedMake]);

  // Update years when model changes
  useEffect(() => {
    if (selectedMake && selectedModel) {
      const years = getVehicleYears(selectedMake, selectedModel);
      setAvailableYears(years);
      setSelectedYear("");
    } else {
      setAvailableYears([]);
      setSelectedYear("");
    }
  }, [selectedMake, selectedModel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    const file = files[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, [name]: "File is required." }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only image files are allowed.",
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        [name]: "File size should not exceed 5MB.",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: null }));

    setFormData({
      ...formData,
      [name]: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMake || !selectedModel || !selectedYear || !formData.vin) {
      alert("Please fill in all required fields.");
      return;
    }

    // Additional validation for guest users - license photos required
    if (!user) {
      if (!formData.licenseFront || !formData.licenseBack) {
        alert(
          "As a guest user, you must provide both front and back photos of your driver's license for identity verification."
        );
        return;
      }
    }

    // Always try API call first for production safety
    const formDataObj = new FormData();
    formDataObj.append("make", selectedMake);
    formDataObj.append("model", selectedModel);
    formDataObj.append("year", selectedYear);
    formDataObj.append("vin", formData.vin);
    formDataObj.append("frontId", formData.frontId);
    formDataObj.append("backId", formData.backId);
    formDataObj.append("registration", formData.registration);

    // Add license photos for guest users
    if (!user) {
      formDataObj.append("licenseFront", formData.licenseFront);
      formDataObj.append("licenseBack", formData.licenseBack);
    }

    api
      .post("/vehicle/request-keycode-public", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("✅ API response:", response.data);

        // Store guest user info for cart access
        if (response.data.guestUserId) {
          localStorage.setItem(
            "guestUserInfo",
            JSON.stringify({
              guestUserId: response.data.guestUserId,
              cartId: response.data.cartId,
              timestamp: Date.now(),
            })
          );
        }

        navigate("/cart");
      })
      .catch((error) => {
        console.error("❌ API call failed:", error);

        // Fallback: Store minimal data locally (only for development)
        if (import.meta.env.DEV) {
          const vehicleData = {
            id: `temp-${Date.now()}`,
            make: selectedMake,
            model: selectedModel,
            year: selectedYear,
            vin: formData.vin,
            standardPrice: selectedMakePrice,
            finalPrice: selectedMakePrice,
            isTemporary: true,
            timestamp: Date.now(),
            note: "Backend unavailable - stored locally (DEV ONLY)",
          };

          localStorage.setItem(
            "tempVehicleRequest",
            JSON.stringify(vehicleData)
          );
          console.log(
            "✅ Fallback: Vehicle data stored in localStorage (DEV ONLY):",
            vehicleData
          );
        }

        // Show user-friendly message
        alert(
          "Backend service is temporarily unavailable. Please try again later or contact support."
        );
      });
  };

  const setMakePrice = (selectedMakeValue) => {
    if (selectedMakeValue) {
      const nonMemberPrice = getVehiclePrice(selectedMakeValue, false);
      const memberPrice = getVehiclePrice(selectedMakeValue, true);
      const category = getVehicleCategory(selectedMakeValue);
      const needsPin = requiresPin(selectedMakeValue);

      setSelectedMakePrice(nonMemberPrice);
      setSelectedMemberPrice(memberPrice);
      setSelectedCategory(category);
      setRequiresPinCode(needsPin);
    } else {
      setSelectedMakePrice(0);
      setSelectedMemberPrice(0);
      setSelectedCategory("");
      setRequiresPinCode(false);
    }
  };

  return (
    <div className="wrapper-vr">
      <div className="keycode-request-container">
        <h1>Request a Keycode for Your Vehicle</h1>
        <ComplianceBanner className="mt-3 mb-4" />
        {!user && (
          <div className="guest-notice">
            <p
              style={{
                color: "#f59e0b",
                fontSize: "0.9rem",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              ⚠️ <strong>Guest Users:</strong> Driver's license photos required
              for identity verification
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="keycode-form">
          <div className="form-group">
            <label htmlFor="make">Vehicle Make</label>
            <MakeDropDown
              selectedMake={selectedMake}
              options={availableMakes}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setMakePrice(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Vehicle Model</label>
            <ModelDropDown
              selectedModel={selectedModel}
              options={availableModels}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Vehicle Year</label>
            <YearDropDown
              selectedYear={selectedYear}
              options={availableYears}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedModel}
            />
          </div>

          {selectedMake && (
            <div className="pricing-info">
              <h3 style={{ color: "#00ff85", marginBottom: "15px" }}>
                Keycode Pricing
              </h3>

              <div className="price-row">
                <span className="price-label">Non-Member Price:</span>
                <span className="price-value">
                  ${selectedMakePrice.toFixed(2)}
                </span>
              </div>

              <div className="price-row">
                <span className="price-label">Member Price:</span>
                <span className="price-value member-price">
                  {selectedMemberPrice > 0
                    ? `$${selectedMemberPrice.toFixed(2)}`
                    : "Ask for pricing"}
                </span>
              </div>

              <div className="price-row">
                <span className="price-label">Category:</span>
                <span className="price-value">{selectedCategory}</span>
              </div>

              {requiresPinCode && (
                <div className="pin-notice">
                  <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                    ⚠️ PIN Code Required
                  </span>
                  <p
                    style={{
                      color: "#f59e0b",
                      fontSize: "0.9rem",
                      margin: "5px 0",
                    }}
                  >
                    This vehicle requires both keycode and PIN code
                  </p>
                </div>
              )}

              {!user && (
                <div className="member-benefit">
                  <p
                    style={{
                      color: "#10b981",
                      fontSize: "0.9rem",
                      margin: "10px 0",
                    }}
                  >
                    💡{" "}
                    <strong>Become a member to save on keycode pricing!</strong>
                  </p>
                </div>
              )}
            </div>
          )}

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
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="frontId">Upload Front ID:</label>
            <input
              type="file"
              id="frontId"
              name="frontId"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="form-control"
            />
            {errors.frontId && (
              <p className="error-message">{errors.frontId}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="backId">Upload Back ID:</label>
            <input
              type="file"
              id="backId"
              name="backId"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="form-control"
            />
            {errors.backId && <p className="error-message">{errors.backId}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="registration">Upload Registration:</label>
            <input
              type="file"
              id="registration"
              name="registration"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="form-control"
            />
            {errors.registration && (
              <p className="error-message">{errors.registration}</p>
            )}
          </div>

          {/* License Photo Requirements for Guest Users */}
          {!user && (
            <>
              <div className="license-notice">
                <h4 style={{ color: "#f59e0b", marginBottom: "10px" }}>
                  🔐 Identity Verification Required
                </h4>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    marginBottom: "15px",
                  }}
                >
                  As a guest user, you must provide your driver's license photos
                  for identity verification. This helps ensure security and
                  compliance with our service requirements.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="licenseFront">
                  Driver's License - Front Side{" "}
                  <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="file"
                  id="licenseFront"
                  name="licenseFront"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  className="form-control"
                />
                {errors.licenseFront && (
                  <p className="error-message">{errors.licenseFront}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="licenseBack">
                  Driver's License - Back Side{" "}
                  <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="file"
                  id="licenseBack"
                  name="licenseBack"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  className="form-control"
                />
                {errors.licenseBack && (
                  <p className="error-message">{errors.licenseBack}</p>
                )}
              </div>
            </>
          )}

          <button type="submit" className="submit-button">
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  );
}

export default VehicleKeycodeRequest;
