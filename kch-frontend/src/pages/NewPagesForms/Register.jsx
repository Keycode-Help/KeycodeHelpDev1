import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";;
import StatesDropDown from "./components/RegisterPage/StatesDropDown.jsx";
import states from "../../data/states";
import { registerForm } from "./components/authpage.js";
import { 
  ChevronDown, 
  Eye, 
  EyeOff, 
  MapPin, 
  ArrowRight, 
  Upload,
  FileText, 
} from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    frontId: null,
    backId: null,
    insurance: null,
  });

  const [selectedState, setSelectedState] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Format file size
  const formatFileSize = (size) => {
    if (size <= 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

    if (file.size > 5 * 1024 * 1024) {
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

  const filesExistCheck = (frontId, backId, insurance) => {
    let hasErrors = false;

    if (!frontId) {
      setErrors(prev => ({ ...prev, frontId: "Front ID is required" }));
      hasErrors = true;
    }

    if (!backId) {
      setErrors(prev => ({ ...prev, backId: "Back ID is required" }));
      hasErrors = true;
    }

    if (!insurance) {
      setErrors(prev => ({ ...prev, insurance: "Documentation is required" }));
      hasErrors = true;
    }

    return hasErrors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Checks if user have the required files.
    if (filesExistCheck(formData.frontId, formData.backId, formData.insurance)) {
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("fname", formData.fname);
    formDataObj.append("lname", formData.lname);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("password", formData.password);
    formDataObj.append("state", selectedState); // Add selected state
    formDataObj.append("frontId", formData.frontId);
    formDataObj.append("backId", formData.backId);
    formDataObj.append("insurance", formData.insurance);

    axios
      .post("http://localhost:8080/auth/register", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration failed", error);
        alert(error.response?.data || "Registration failed. Please try again.");
      });
  };

  // Frontend utilities
  const [showPassword, setShowPassword] = useState(false);
  const seeHidePassword = showPassword ? "text" : "password";
  const [statesIsOpen, setStatesIsOpen] = useState(false);

  const frontIdRef = useRef(null);
  const backIdRef = useRef(null);
  const insuranceRef = useRef(null);


  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md mt-20 mb-10">
        <div className="text-center mb-6"> 
        {/* Register Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Create An
            <span className="text-green-400"> Account</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Find your automotive security solutions with KeyCode
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>  
          { registerForm.map((form) =>(
            <div key={form.id} className="bg-[#0A0A0A] p-5 md:p-6 md:py-5 border border-[#1A1A1A] rounded-2xl
            hover:border-green-600 transition duration-200 shadow-lg">
            {/* First Name, Last Name, Email, Phone, Password */}
              <label className="block text-sm font-medium text-gray-100 mb-1">
                {form.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <form.icon className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
                </div>
                <input
                  type={form.id === 'password' ? seeHidePassword : form.type}
                  name={form.name}
                  value={formData[form.name]}
                  onChange={handleChange}
                  placeholder={form.placeholder}
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-transparent border-0 text-white placeholder-gray-500
                  focus:outline-none text-sm md:text-base"
                />
                {form.id === 'password' && ( // Show/Hide Password
                  <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-6 w-6 md:h-7 md:w-7 text-gray-500 hover:text-green-600 cursor-pointer 
                        transition-colors duration-100"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-6 w-6 md:h-7 md:w-7 text-gray-500 hover:text-green-600 cursor-pointer 
                        transition-colors duration-100"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="bg-[#0A0A0A] p-5 md:p-6 md:py-5 border border-[#1A1A1A] rounded-2xl hover:border-green-600
          transition duration-200 shadow-lg">
          {/* State */}
            <label className="block text-sm font-medium text-gray-100 mb-2">
              State
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
              </div>
              <StatesDropDown
                selectedState={selectedState}
                options={states}
                onClick={() => setStatesIsOpen(!statesIsOpen)}
                onChange={(e) => setSelectedState(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-1 flex items-center pointer-events-none">
                <ChevronDown className={`h-5 w-5 md:h-6 md:w-6 text-gray-500 transition-transform duration-150 ${statesIsOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] p-5 md:p-6 md:py-5 border border-[#1A1A1A] rounded-2xl hover:border-green-600
          transition duration-200 shadow-lg group">
          {/* Front Identification */}
            <label className="flex items-center justify-between text-sm font-medium text-gray-100 mb-2">
              Front Indentification
              <span className="text-green-600 text-xs group-hover:text-green-500 transition-colors duration-100">Required</span>
            </label>
            <div 
              className="border-2 border-dashed border-[#303030] rounded-lg p-4 cursor-pointer
              hover:border-green-600 transition duration-200 mb-2 group/uploadArea" 
              onClick={() => frontIdRef.current?.click()}
            >
              <input
                type="file"
                name="frontId"
                ref={frontIdRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {!formData.frontId ? (
                <div className="flex items-center justify-center py-2">
                  <Upload className="h-7 w-7 md:h-8 md:w-8 text-gray-500 group-hover/uploadArea:text-green-500 
                  transition duration-200" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 text-gray-500 group-hover/uploadArea:text-green-500
                    transition duration-200" />
                    <div>
                      <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200 
                      text-sm font-medium truncate max-w-[230px]">
                        {formData.frontId.name}
                      </p>
                      <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200 
                      text-xs">
                        {formatFileSize(formData.frontId.size)}
                      </p>
                    </div>
                  </div>
                  <Upload className="h-5 w-5 md:h-6 md:w-6 text-gray-500 group-hover/uploadArea:text-green-500 
                  transition duration-200" />
                </div>
              )}
            </div>
            {errors.frontId && (
              <p className="text-red-500 text-center text-sm">{errors.frontId}</p>
            )}
          </div>

          <div className="bg-[#0A0A0A] p-5 md:p-6 md:py-5 border border-[#1A1A1A] rounded-2xl hover:border-green-600
          transition duration-200 shadow-lg group">
          {/* Back Identification */}
            <label className="flex items-center justify-between text-sm font-medium text-gray-100 mb-2">
              Back Identification
              <span className="text-green-600 text-xs group-hover:text-green-500 transition-colors duration-100">Required</span>
            </label>
            <div 
              className="border-2 border-dashed border-[#303030] rounded-lg p-4 cursor-pointer
              hover:border-green-600 transition duration-200 mb-2 group/uploadArea" 
              onClick={() => backIdRef.current?.click()}
            >
              <input
                type="file"
                name="backId"
                ref={backIdRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {!formData.backId ? (
                <div className="flex items-center justify-center py-2">
                  <Upload className="h-7 w-7 md:h-8 md:w-8 text-gray-500 group-hover/uploadArea:text-green-500 
                  transition duration-200" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 text-gray-500 group-hover/uploadArea:text-green-500
                    transition duration-200" />
                    <div>
                      <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200 
                      text-sm font-medium truncate max-w-[230px]">
                        {formData.backId.name}
                      </p>
                      <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200 
                      text-xs">
                        {formatFileSize(formData.backId.size)}
                      </p>
                    </div>
                  </div>
                  <Upload className="h-5 w-5 md:h-6 md:w-6 text-gray-500 group-hover/uploadArea:text-green-500 
                  transition duration-200" />
                </div>
              )}
            </div>
            {errors.backId && (
              <p className="text-red-500 text-center text-sm">{errors.backId}</p>
            )}
          </div>

          <div className="bg-[#0A0A0A] p-5 md:p-6 md:py-5 border border-[#1A1A1A] rounded-2xl hover:border-green-600
          transition duration-200 shadow-lg group">
          {/* Insurance */}
            <label className="flex items-center justify-between text-sm font-medium text-gray-100 mb-2">
              <div>
                Upload Documentation
                <br /> 
                <span className="text-xs text-gray-500">Registration, Insurance, etc.</span>
              </div>
              <span className="text-green-600 text-xs group-hover:text-green-500 transition-colors duration-100">Required</span>
            </label>
            <div 
              className="border-2 border-dashed border-[#303030] rounded-lg p-4 cursor-pointer
              hover:border-green-600 transition duration-200 mb-2 group/uploadArea" 
              onClick={() => insuranceRef.current?.click()}
            >
              <input
                type="file"
                name="insurance"
                ref={insuranceRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {!formData.insurance ? (
                <div className="flex items-center justify-center py-2">
                  <Upload className="h-7 w-7 md:h-8 md:w-8 text-gray-500 group-hover/uploadArea:text-green-500 
                  transition duration-200" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 text-gray-500 group-hover/uploadArea:text-green-500
                    transition duration-200" />
                    <div>
                      <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200 
                      text-sm font-medium truncate max-w-[230px]">
                        {formData.insurance.name}
                      </p>
                      <p className="text-gray-400 group-hover/uploadArea:text-green-500 transition duration-200 
                      text-xs">
                        {formatFileSize(formData.insurance.size)}
                      </p>
                    </div>
                  </div>
                  <Upload className="h-5 w-5 md:h-6 md:w-6 text-gray-500 group-hover/uploadArea:text-green-500 
                  transition duration-200" />
                </div>
              )}
            </div>
            {errors.insurance && (
              <p className="text-red-500 text-center text-sm">{errors.insurance}</p>
            )}
          </div>

          <div className="flex items-center"> 
          {/* Terms of Service */}
            <input type="checkbox" className="h-4 w-4 text-gray-600" required />
            <div className="ml-2">
              <label className="text-gray-400 text-sm font-medium">
                I agree to the{" "}
                <span>
                  <a href="" className="text-green-600 hover:text-green-400 transition-colors duration-100">Terms of Service</a>
                </span>
                {" "}and{" "}
                <span>
                  <a href="" className="text-green-600 hover:text-green-400 transition-colors duration-100">Privacy Policy</a>
                </span>
              </label>
            </div>
          </div>

          <button type="submit" className="group relative w-full bg-green-600 hover:bg-green-500 text-white 
          font-semibold p-4 rounded-2xl transition-colors duration-200" > 
          {/* Sign-up Button */}
            Sign-up
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white inline-block ml-1 group-hover:translate-x-2 
            transition-transform" 
            />
          </button>
          <p className="text-center text-gray-400 text-sm">{/* Sign-up */}
            <span className="font-medium">Already have an account?{" "}</span>
            <a href="/login" className="text-green-600 hover:text-green-400 transition-colors
            duration-100 ml-1">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;