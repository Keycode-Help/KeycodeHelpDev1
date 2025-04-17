import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import MakeDropDown from "./components/KeycodeRequest/MakeDropDown.jsx";
import makepriceslist from "../../data/makepriceslist.js";
import {ChevronDown} from "lucide-react";
import InputTextBox from "./components/KeycodeRequest/InputTextBox.jsx";
import UploadFileForm from "./components/KeycodeRequest/UploadFileForm.jsx";
import { ArrowRight } from "lucide-react";
import carMakes from "../../data/makepriceslist.js";

function VehicleKeycodeRequest() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    vin: "",
    frontId: null,
    backId: null,
    registration: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { token } = useAuth();
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedMakePrice, setSelectedMakePrice] = useState(0.0);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    // File validation: Check type and size
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

    // If validation passes, clear any existing errors for this field
    setErrors((prev) => ({ ...prev, [name]: null }));

    setFormData({
      ...formData,
      [name]: file,
    });
  };
  const filesExistCheck = (frontId, backId, registration) => {
    let hasErrors = false;

    if (!frontId) {
      setErrors(prev => ({ ...prev, frontId: "Front ID is required" }));
      hasErrors = true;
    }

    if (!backId) {
      setErrors(prev => ({ ...prev, backId: "Back ID is required" }));
      hasErrors = true;
    }

    if (!registration) {
      setErrors(prev => ({ ...prev, registration: "Registration is required" }));
      hasErrors = true;
    }

    return hasErrors;
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    // Checks if user have the required files.
    if (filesExistCheck(formData.frontId, formData.backId, formData.registration)) {
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("make", selectedMake);
    formDataObj.append("price", selectedMakePrice);
    formDataObj.append("model", formData.model);
    formDataObj.append("vin", formData.vin);
    formDataObj.append("frontId", formData.frontId);
    formDataObj.append("backId", formData.backId);
    formDataObj.append("registration", formData.registration);

    axios
      .post("http://localhost:8080/vehicle/request-keycode", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate("/cart");
      })
      .catch((error) => {
        console.error("Error requesting keycode:", error);
        alert(
          error.response?.data || "Failed to request keycode. Please try again."
        );
      });
  };

  const setMakePrice = (selectedMakeValue) => {
    console.log("Make ", selectedMakeValue); 
    console.log(makes);
    const selectedMakeItem = makes.find(make => (make.manufacturerName === selectedMakeValue));
    if(selectedMakeItem){
      setSelectedMakePrice(selectedMakeItem.keyCodePrice);
    }else{
      setSelectedMakePrice(0);
    }
    console.log(selectedMakeItem);
  }
  useEffect(() => {
    axios
    .get("http://localhost:8080/makes/getMakes")
    .then((response) => {
      setMakes(response.data);
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error fetching make:", error);
    });
  },[]);

  // Page Stylization utilities
  const [makeIsOpen, setMakeIsOpen] = useState(false);
  const makeManufacturerPrice = (selectedMake) => {
    const brand = makepriceslist.find(make => make.manufacturerName === selectedMake)
    return brand.nonMemberPrice
  }

  const frontIdRef = useRef(null);
  const backIdRef = useRef(null);
  const registrationRef = useRef(null);

  return (
    <div className="min-h-screen bg-black overflow-y-hidden ">
      {/* Header and Request Form */}
      <section className="relative py-12 md:py-24 px-4 mb-12">
        <div className="mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Request a <span className="text-green-400">Keycode</span>
            <br/>
            for Your Vehicle
          </h1>
        </div>

        {/* Request Form */}
        <div className="mx-auto max-w-xl p-5 md:p-6 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] shadow-lg shadow-[#1A1A1A]">
          <form className="flex flex-col gap-3 md:gap-4" onSubmit={handleSubmit}>
            {/* Make */}
            <div className="relative" onClick={() => setMakeIsOpen(!makeIsOpen)}>
              <label className="block text-sm font-medium text-gray-100 mb-2">Make</label>
              <MakeDropDown
                selectedMake={selectedMake}
                options={makepriceslist}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setMakePrice(e.target.value);
                }}
              />
              <div className="absolute inset-y-0 right-0 pr-2 pt-7 flex items-center pointer-events-none">
                <ChevronDown className={`h-5 w-5 md:h-6 md:w-6 text-gray-500 transition-transform duration-150 ${makeIsOpen ? "rotate-180" : ""}`} />
              </div>
            </div>

            {/* Price */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">Price</label>
              <div className="w-full bg-[#111111] border border-[#1A1A1A] rounded-lg p-3 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Selected Brand</div>
                    {selectedMake ? (
                      <div className="text-white text-sm md:text-base font-medium">{selectedMake}'s Keycode</div>
                    ) : (
                      <div className="text-gray-100 text-sm md:text-base font-bold italic">Please select a Car Make</div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-gray-400">Service Fee</div>
                    <div className="text-2xl font-semibold text-green-500">
                      {selectedMake ?
                        `$${makeManufacturerPrice(selectedMake)}`
                        :
                        "$0"
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Model */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">Vehicle Model</label>
              <InputTextBox
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Enter Vehicle Model"
              />
            </div>

            {/* Vehicle VIN */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">Vehicle VIN</label>
              <InputTextBox
                id="vin"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="Enter Vehicle VIN"
              />
            </div>

            {/* Upload Front ID */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">Upload Front ID</label>
              <UploadFileForm
                fileRef={frontIdRef}
                name="frontId"
                onChange={handleFileChange}
                accept="image/*"
                value={formData.frontId}
              />
              {errors.frontId && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.frontId}</p>
              )}
            </div>

            {/* Upload Back ID */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">Upload Back ID</label>
              <UploadFileForm
                fileRef={backIdRef}
                name="backId"
                onChange={handleFileChange}
                accept="image/*"
                value={formData.backId}
              />
              {errors.backId && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.backId}</p>
              )}
            </div>

            {/* Upload Registration */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">Upload Registration</label>
              <UploadFileForm
                fileRef={registrationRef}
                name="registration"
                onChange={handleFileChange}
                accept="image/*"
                value={formData.registration}
              />
              {errors.registration && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.registration}</p>
              )}
            </div>
            <button type="submit" className="mt-4 group relative w-full p-3 md:p-4 bg-green-600 hover:bg-green-500 text-white
            font-semibold transition-colors duration-200">
              Add to Cart
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white inline-block ml-1 group-hover:translate-x-2
              transition-transform" />
            </button>
          </form>
        </div>
      </section>

      {/* Car Makes & Keycode Prices Table */}
      <section className="relative py-12 md:py-24 px-4 mb-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-12">Pricing</h2>
          <div className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden shadow-xl shadow-[#1A1A1A]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-green-400">
                    <th className="p-5 md:p-6 font-bold border-b border-[#1A1A1A]">Make</th>
                    <th className="p-5 md:p-6 font-bold border-b border-[#1A1A1A]">Non-Member Price</th>
                    <th className="p-5 md:p-6 font-bold border-b border-[#1A1A1A]">Member Price</th>
                  </tr>
                </thead>
                <tbody>
                  {carMakes.map((make, index) => (
                    <tr
                      key={make.manufacturerName}
                      className={`border-b border-[#1A1A1A] ${ index % 2 === 0 ? 'bg-[#0A0A0A]' : 'bg-black'}`}
                    >
                      <td className="p-5 md:p-6 font-medium text-white">{make.manufacturerName}</td>
                      <td className="p-5 md:p-6 font-medium text-white">${make.nonMemberPrice}</td>
                      <td className="p-5 md:p-6 font-medium text-white">
                        {make.memberPrice === "Ask" ? "Ask" : `$${make.memberPrice}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-10">
            *Prices may vary depending on vehicle year or data source availability.
          </p>
          <p className="text-xs sm:text-sm font-bold text-gray-400">
            Other models available — just ask.
          </p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="relative py-12 md:py-24 px-4 mb-12">

      </section>
    </div>
  );
}

export default VehicleKeycodeRequest;
