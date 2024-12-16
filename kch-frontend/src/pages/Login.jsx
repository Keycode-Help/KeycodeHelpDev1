import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

function Login() {
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
      alert("Login successful!");

      // Redirect based on user role
      if (userRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="container-login">
      <div className="form-section-login">
        <h1>Login to Your Account</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="book-btn">
            Login
          </button>
        </form>
        <p>
          Don't have an account?... <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
