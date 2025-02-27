import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginForm } from "../../data/authpage"
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const seeHidePassword = showPassword ? "text" : "password";

  const navigate = useNavigate();
  const { login, userRole } = useAuth(); // Fetch the userRole from the context after login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);

      // Redirect based on user role
      if (userRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. " + error.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mt-20 mb-6"> {/* Sign-in Header */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Sign-in to Continue
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Professional keycode solutions for automotive security
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          { loginForm.map((form) =>(
            <div key={form.id} className="bg-gray-900/50 p-5 md:p-6 md:py-5 border border-gray-800 rounded-2xl 
            hover:border-green-600 hover:border-2 transition duration-200 shadow-lg"
            > {/* Email, Password */}
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
          <div className="flex items-center justify-between">{/* Remember me, Forget Password -> Needs to be implement. */}
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-gray-600" />
              <label className="text-gray-400 text-sm font-medium ml-2">Remember me</label>
            </div>
            <a href="" className="text-sm text-blue-500 hover:text-green-500 
            transition-colors duration-100"
            >
              Forget Password?
            </a>
          </div>
          <button type="submit" className="group relative w-full bg-green-600 hover:bg-green-500 text-white 
          font-semibold p-4 rounded-2xl transition-colors duration-200" 
          > {/* Sign-in Button */}
            Sign-in
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white inline-block ml-1 group-hover:translate-x-2 
            transition-transform" 
            />
          </button>
          <p className="text-center text-gray-400 text-sm">{/* Sign-up */}
            <span className="font-medium">Don&apos;t have an account?{" "}</span>
            <a href="/register" className="text-blue-500 hover:text-green-500 transition-colors 
            duration-100 ml-1"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
