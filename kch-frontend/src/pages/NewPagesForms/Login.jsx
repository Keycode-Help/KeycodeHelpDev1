import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, LockKeyhole } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Sign in to Continue
          </h1>
          <p className="text-gray-400 text-md md:text-lg">
            Professional keycode solutions for automotive security
          </p>
        </div>
        <form className="space-y-6">
          <div className="bg-gray-900/50 p-5 px-6 md:p-6 border border-gray-800 rounded-2xl hover:border-green-600 
          hover:border-2 transition duration-200 shadow-lg"
          >
            <label className="block text-sm md:text-base font-medium text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="block w-full pl-10 pr-3 py-2 bg-transparent border-0 text-white placeholder-gray-500 
                focus:outline-none text-sm md:text-base"
              />
            </div>
          </div>
          <div className="bg-gray-900/50 p-5 px-6 md:p-6 border border-gray-800 rounded-2xl hover:border-green-600 
          hover:border-2 transition duration-200 shadow-lg"
          >
            <label className="block text-sm md:text-base font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                <LockKeyhole className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="block w-full pl-10 pr-3 py-2 bg-transparent border-0 text-white placeholder-gray-500 
                focus:outline-none text-sm md:text-base"
              />
            </div>
          </div>
        </form>
        {/* <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p>
                    Don't have an account?... <a href="/register">Sign up</a>
                </p> */}
      </div>
    </div>
  );
}
