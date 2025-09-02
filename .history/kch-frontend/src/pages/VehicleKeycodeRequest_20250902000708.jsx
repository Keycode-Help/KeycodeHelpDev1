import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/request";
import { useAuth } from "../context/AuthContext";
import MakeDropDown from "../components/MakeDropDown";
import ComplianceBanner from "../components/ComplianceBanner";
import ModelDropDown from "../components/ModelDropDown";
import YearDropDown from "../components/YearDropDown";
import { Icon } from "../components/IconProvider";
import {
  getVehicleMakes,
  getVehicleModels,
  getVehicleYears,
  getVehiclePrice,
  getVehicleCategory,
  requiresPin,
  isValidVehicleCombination,
  getVehicleLogo,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <Icon name="key" size={32} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              Request a Keycode
            </h1>
            <p className="text-gray-300">
              Get your vehicle keycode quickly and securely
            </p>
          </div>

          <ComplianceBanner className="mb-6" />

          {!user && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Icon
                  name="alertTriangle"
                  size={20}
                  className="text-yellow-400 flex-shrink-0"
                />
                <p className="text-yellow-400 text-sm">
                  <strong>Guest Users:</strong> Driver's license photos required
                  for identity verification
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Selection */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Vehicle Make <span className="text-red-400">*</span>
                </label>
                <MakeDropDown
                  selectedMake={selectedMake}
                  options={availableMakes}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    setMakePrice(e.target.value);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Vehicle Model <span className="text-red-400">*</span>
                </label>
                <ModelDropDown
                  selectedModel={selectedModel}
                  options={availableModels}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedMake}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Vehicle Year <span className="text-red-400">*</span>
                </label>
                <YearDropDown
                  selectedYear={selectedYear}
                  options={availableYears}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={!selectedModel}
                />
              </div>
            </div>

            {selectedMake && (
              <div className="bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-3">
                  <Icon name="dollarSign" size={20} />
                  <div className="flex items-center gap-2">
                    {selectedMake && (
                      <img
                        src={getVehicleLogo(selectedMake)}
                        alt={selectedMake}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <span>Keycode Pricing</span>
                  </div>
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">
                        Non-Member Price:
                      </span>
                      <span className="text-2xl font-bold text-white">
                        ${selectedMakePrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      Standard pricing
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-300 font-medium">
                        Member Price:
                      </span>
                      <span className="text-2xl font-bold text-green-400">
                        {selectedMemberPrice > 0
                          ? `$${selectedMemberPrice.toFixed(2)}`
                          : "Ask for pricing"}
                      </span>
                    </div>
                    <p className="text-green-400 text-sm mt-1">
                      Includes PIN code
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-slate-800/50 border border-slate-600 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Category:</span>
                    <span className="text-blue-400 font-semibold">
                      {selectedCategory}
                    </span>
                  </div>
                </div>

                {requiresPinCode && (
                  <div className="mt-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        name="alertTriangle"
                        size={20}
                        className="text-yellow-400"
                      />
                      <span className="text-yellow-400 font-semibold">
                        PIN Code Required
                      </span>
                    </div>
                    <p className="text-yellow-400 text-sm">
                      This vehicle requires both keycode and PIN code
                    </p>
                  </div>
                )}

                {!user && (
                  <div className="mt-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <Icon
                        name="lightbulb"
                        size={20}
                        className="text-green-400"
                      />
                      <p className="text-green-400 text-sm">
                        <strong>
                          Become a member to save on keycode pricing!
                        </strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIN Input */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Vehicle VIN <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="vin"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="Enter Vehicle VIN"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Document Uploads */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
                Required Documents
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Front ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    id="frontId"
                    name="frontId"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.frontId && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                      <Icon name="alertCircle" size={16} />
                      {errors.frontId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Back ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    id="backId"
                    name="backId"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.backId && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                      <Icon name="alertCircle" size={16} />
                      {errors.backId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Vehicle Registration <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  id="registration"
                  name="registration"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {errors.registration && (
                  <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                    <Icon name="alertCircle" size={16} />
                    {errors.registration}
                  </p>
                )}
              </div>
            </div>

            {/* License Photo Requirements for Guest Users */}
            {!user && (
              <>
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Icon
                      name="shield"
                      size={24}
                      className="text-yellow-400 flex-shrink-0 mt-1"
                    />
                    <div>
                      <h4 className="text-yellow-400 font-semibold mb-2">
                        Identity Verification Required
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        As a guest user, you must provide your driver's license
                        photos for identity verification. This helps ensure
                        security and compliance with our service requirements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Driver's License - Front Side{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="file"
                      id="licenseFront"
                      name="licenseFront"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {errors.licenseFront && (
                      <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                        <Icon name="alertCircle" size={16} />
                        {errors.licenseFront}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Driver's License - Back Side{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="file"
                      id="licenseBack"
                      name="licenseBack"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {errors.licenseBack && (
                      <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                        <Icon name="alertCircle" size={16} />
                        {errors.licenseBack}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icon name="shoppingCart" size={18} />
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VehicleKeycodeRequest;
