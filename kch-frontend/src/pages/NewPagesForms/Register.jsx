import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";;
import StatesDropDown from "./components/StatesDropDown";
import states from "../../data/states";
import { registerForm } from "../../data/authpage";
import { ChevronDown, Eye, EyeOff, MapPin, ArrowRight } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const seeHidePassword = showPassword ? "text" : "password";

  const [selectedState, setSelectedState] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();

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

  return (
    <div className="min-h-screen bg-black flex  items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6"> {/* Register Header */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Create an Account
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Find your Automotive Security solutions with KeyCode
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>  
          { registerForm.map((form) =>(
            <div key={form.id} className="bg-gray-900/50 p-5 md:p-6 md:py-5 border border-gray-800 rounded-2xl 
            hover:border-green-600 hover:border-2 transition duration-200 shadow-lg"
            > {/* First Name, Last Name, Email, Phone, Password */}
              <label className="block text-sm font-medium text-gray-300 mb-1">
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
          <div className="bg-gray-900/50 p-5 md:p-6 md:py-5 border border-gray-800 rounded-2xl hover:border-green-600 
          hover:border-2 transition duration-200 shadow-lg"
          > {/* State*/}
            <label className="block text-sm font-medium text-gray-300 mb-2">
              State
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
              </div>
              <StatesDropDown
                selectedState={selectedState}
                options={states}
                onChange={(e) => setSelectedState(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-1 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 p-5 md:p-6 md:py-5 border border-gray-800 rounded-2xl hover:border-green-600
          hover:border-2 transition duration-200 shadow-lg group"
          > {/* Front Identification */}
            <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
              Front Indentification
              <span className="text-blue-500 text-xs group-hover:text-green-500 transition-colors duration-100">Required</span>
            </label>
            <div className="border-2 border-dashed border-gray-800 rounded-lg p-4 cursor-pointer hover:border-green-600
            transition duration-200 mb-2"
            >
              <input
                type="file"
                name="frontId"
                onChange={handleFileChange}
                accept="image/*"
                required
                className="w-full py-2 bg-transparent border-0 text-white placeholder-gray-500
                focus:outline-none text-sm md:text-base"
              />
            </div>
            {errors.frontId && (
              <p className="text-red-500 text-center text-sm">{errors.frontId}</p>
            )}
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-gray-600" required />
            <div className="ml-2">
              <label className="text-gray-400 text-sm font-medium">
                I agree to the{" "}
                <span>
                  <a href="" className="text-blue-500 hover:text-green-500 transition-colors duration-100">Terms of Service</a>
                </span>
                {" "}and{" "}
                <span>
                <a href="" className="text-blue-500 hover:text-green-500 transition-colors duration-100">Privacy Policy</a>
                </span>
              </label>
            </div>
          </div>
          <button type="submit" className="group relative w-full bg-green-600 hover:bg-green-500 text-white 
          font-semibold p-4 rounded-2xl transition-colors duration-200" 
          > {/* Sign-up Button */}
            Sign-up
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white inline-block ml-1 group-hover:translate-x-2 
            transition-transform" 
            />
          </button>
          <p className="text-center text-gray-400 text-sm">{/* Sign-up */}
            <span className="font-medium">Already have an account?{" "}</span>
            <a href="/login" className="text-blue-500 hover:text-green-500 transition-colors 
            duration-100 ml-1"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
    
    
    
    // <div className="container-register">
    //   <div className="form-section">
    //     <h1 className="form-h1">Sign Up For An Account</h1>
    //     <form onSubmit={handleSubmit}>
    //       <input
    //         type="text"
    //         name="fname"
    //         value={formData.fname}
    //         onChange={handleChange}
    //         placeholder="First Name"
    //         required
    //       />
    //       <input
    //         type="text"
    //         name="lname"
    //         value={formData.lname}
    //         onChange={handleChange}
    //         placeholder="Last Name"
    //         required
    //       />
    //       <input
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleChange}
    //         placeholder="Email Address"
    //         required
    //       />
    //       <input
    //         type="tel"
    //         name="phone"
    //         value={formData.phone}
    //         onChange={handleChange}
    //         placeholder="Phone Number"
    //       />
    //       <input
    //         type="password"
    //         name="password"
    //         value={formData.password}
    //         onChange={handleChange}
    //         placeholder="Password"
    //         required
    //       />
    //       <label>
    //         State:
    //         <StatesDropDown
    //           selectedState={selectedState}
    //           options={states}
    //           onChange={(e) => setSelectedState(e.target.value)}
    //         />
    //       </label>
    //       <label>
    //         Upload Front ID:
    //         <input
    //           type="file"
    //           name="frontId"
    //           onChange={handleFileChange}
    //           accept="image/*"
    //           required
    //         />
    //         {errors.frontId && (
    //           <p className="error-message">{errors.frontId}</p>
    //         )}
    //       </label>
    //       <label>
    //         Upload Back ID:
    //         <input
    //           type="file"
    //           name="backId"
    //           onChange={handleFileChange}
    //           accept="image/*"
    //           required
    //         />
    //         {errors.backId && <p className="error-message">{errors.backId}</p>}
    //       </label>
    //       <label>
    //         Upload Documentation (e.g., registration or insurance):
    //         <input
    //           type="file"
    //           name="insurance"
    //           onChange={handleFileChange}
    //           accept="image/*"
    //           required
    //         />
    //         {errors.insurance && (
    //           <p className="error-message">{errors.insurance}</p>
    //         )}
    //       </label>
    //       <button type="submit" className="book-btn">
    //         Register
    //       </button>
    //     </form>
    //     <p>
    //       Already a member? <a href="/login">Sign in</a>
    //     </p>
    //   </div>
    // </div>
  );
}

export default Register;