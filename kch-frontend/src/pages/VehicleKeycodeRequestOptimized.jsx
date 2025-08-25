import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
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

// Memoized form field component for better performance
const FormField = memo(function FormField({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  const handleChange = useCallback((e) => {
    onChange(e);
  }, [onChange]);

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );
});

// Memoized file upload component
const FileUpload = memo(function FileUpload({ label, name, onChange, accept = "image/*", required = false }) {
  const handleFileChange = useCallback((e) => {
    onChange(e);
  }, [onChange]);

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        type="file"
        id={name}
        name={name}
        onChange={handleFileChange}
        accept={accept}
        required={required}
        className="file-input"
      />
    </div>
  );
});

// Main optimized component
function VehicleKeycodeRequest() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    frontId: null,
    backId: null,
    registration: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Memoized vehicle makes
  const vehicleMakes = useMemo(() => getVehicleMakes(), []);

  // Initialize vehicle makes on component mount
  useEffect(() => {
    setAvailableMakes(vehicleMakes);
  }, [vehicleMakes]);

  // Update models when make changes - optimized with useCallback
  const updateModels = useCallback((make) => {
    if (make) {
      const models = getVehicleModels(make);
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
  }, []);

  // Update years when model changes - optimized with useCallback
  const updateYears = useCallback((make, model) => {
    if (make && model) {
      const years = getVehicleYears(make, model);
      setAvailableYears(years);
      setSelectedYear("");
    } else {
      setAvailableYears([]);
      setSelectedYear("");
    }
  }, []);

  // Update pricing when selection changes - optimized with useCallback
  const updatePricing = useCallback((make, model, year) => {
    if (make && model && year) {
      const standardPrice = getVehiclePrice(make, model, year);
      const category = getVehicleCategory(make, model, year);
      const needsPin = requiresPin(make, model, year);
      const isValid = isValidVehicleCombination(make, model, year);

      if (isValid) {
        setSelectedMakePrice(standardPrice);
        setSelectedCategory(category);
        setRequiresPinCode(needsPin);

        // Calculate member price if user is authenticated
        if (user && user.subscription) {
          let discount = 0;
          switch (user.subscription.tier) {
            case "BASIC":
              discount = 0.15; // 15% off
              break;
            case "PROFESSIONAL":
              discount = 0.20; // 20% off
              break;
            case "ENTERPRISE":
              discount = 0.25; // 25% off
              break;
            default:
              discount = 0;
          }
          const memberPrice = standardPrice * (1 - discount);
          setSelectedMemberPrice(memberPrice);
        } else {
          setSelectedMemberPrice(standardPrice);
        }
      } else {
        setSelectedMakePrice(0);
        setSelectedMemberPrice(0);
        setSelectedCategory("");
        setRequiresPinCode(false);
      }
    }
  }, [user]);

  // Optimized useEffect for make changes
  useEffect(() => {
    updateModels(selectedMake);
  }, [selectedMake, updateModels]);

  // Optimized useEffect for model changes
  useEffect(() => {
    updateYears(selectedMake, selectedModel);
  }, [selectedMake, selectedModel, updateYears]);

  // Optimized useEffect for pricing updates
  useEffect(() => {
    updatePricing(selectedMake, selectedModel, selectedYear);
  }, [selectedMake, selectedModel, selectedYear, updatePricing]);

  // Memoized form change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Update selected values for dropdowns
    if (name === "make") {
      setSelectedMake(value);
    } else if (name === "model") {
      setSelectedModel(value);
    } else if (name === "year") {
      setSelectedYear(value);
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [errors]);

  // Memoized file change handler
  const handleFileChange = useCallback((e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) {
      setErrors(prev => ({ ...prev, [name]: "File is required." }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, [name]: "File size must be less than 5MB." }));
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [name]: "Please upload a valid image file (JPEG, PNG, GIF)." }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: file,
    }));

    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [errors]);

  // Memoized form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.make) newErrors.make = "Make is required.";
    if (!formData.model) newErrors.model = "Model is required.";
    if (!formData.year) newErrors.year = "Year is required.";
    if (!formData.vin) newErrors.vin = "VIN is required.";
    if (!formData.frontId) newErrors.frontId = "Front ID photo is required.";
    if (!formData.backId) newErrors.backId = "Back ID photo is required.";
    if (!formData.registration) newErrors.registration = "Registration document is required.";

    // VIN validation
    if (formData.vin && formData.vin.length !== 17) {
      newErrors.vin = "VIN must be exactly 17 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Memoized form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("make", formData.make);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("vin", formData.vin);
      formDataToSend.append("frontId", formData.frontId);
      formDataToSend.append("backId", formData.backId);
      formDataToSend.append("registration", formData.registration);

      const response = await api.post("/vehicle/request-keycode-public", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Store guest user info for cart access
        const guestInfo = {
          guestUserId: response.data.guestUserId,
          cartId: response.data.cartId,
          timestamp: Date.now(),
        };
        localStorage.setItem("guestUserInfo", JSON.stringify(guestInfo));

        // Navigate to cart
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error submitting keycode request:", error);
      setErrors({ submit: "Failed to submit request. Please try again." });
    }
  }, [formData, validateForm, navigate]);

  // Memoized pricing display
  const pricingDisplay = useMemo(() => {
    if (selectedMakePrice > 0) {
      return (
        <div className="pricing-info">
          <h3>💰 Pricing Information</h3>
          <div className="price-breakdown">
            <div className="price-row">
              <span>Standard Price:</span>
              <span className="standard-price">${selectedMakePrice.toFixed(2)}</span>
            </div>
            {user && user.subscription && selectedMemberPrice < selectedMakePrice && (
              <div className="price-row">
                <span>Member Price ({user.subscription.tier}):</span>
                <span className="member-price">${selectedMemberPrice.toFixed(2)}</span>
              </div>
            )}
            {selectedCategory && (
              <div className="category-info">
                <span>Category:</span>
                <span>{selectedCategory}</span>
              </div>
            )}
            {requiresPinCode && (
              <div className="pin-warning">
                ⚠️ This vehicle requires a PIN code for keycode generation.
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  }, [selectedMakePrice, selectedMemberPrice, selectedCategory, requiresPinCode, user]);

  return (
    <div className="vehicle-keycode-request-wrapper">
      <div className="vehicle-keycode-request-container">
        <ComplianceBanner />
        
        <div className="request-header">
          <h1>🚗 Vehicle Keycode Request</h1>
          <p>Submit your vehicle information to get a professional keycode</p>
        </div>

        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-section">
            <h2>📋 Vehicle Information</h2>
            
            <div className="form-row">
              <MakeDropDown
                value={formData.make}
                onChange={handleChange}
                makes={availableMakes}
                name="make"
                required
              />
              <ModelDropDown
                value={formData.model}
                onChange={handleChange}
                models={availableModels}
                name="model"
                required
                disabled={!formData.make}
              />
            </div>

            <div className="form-row">
              <YearDropDown
                value={formData.year}
                onChange={handleChange}
                years={availableYears}
                name="year"
                required
                disabled={!formData.model}
              />
              <FormField
                label="VIN (17 characters)"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                required
                placeholder="Enter 17-character VIN"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>📸 Required Documents</h2>
            <p className="section-description">
              Please upload clear photos of your identification and vehicle registration.
            </p>
            
            <div className="form-row">
              <FileUpload
                label="Front of ID"
                name="frontId"
                onChange={handleFileChange}
                required
              />
              <FileUpload
                label="Back of ID"
                name="backId"
                onChange={handleFileChange}
                required
              />
            </div>
            
            <div className="form-row">
              <FileUpload
                label="Vehicle Registration"
                name="registration"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                required
              />
            </div>
          </div>

          {pricingDisplay}

          {errors.submit && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              🚀 Submit Keycode Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleKeycodeRequest;
