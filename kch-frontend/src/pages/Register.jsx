import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    fname: "", // First Name
    lname: "", // Last Name
    email: "", // Email Address
    phone: "", // Phone number (optional)
    password: "", // Password
  });

  const navigate = useNavigate();

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
      .post("http://localhost:8080/auth/register", formData)
      .then((response) => {
        alert(response.data); // Will display the appropriate message based on the backend response
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration failed", error);
        alert("Registration failed. Please try again.");
      });
  };

  return (
    <div className="container">
      <div className="form-section">
        <h1>Sign Up For An Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
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
            Register
          </button>
        </form>
        <p>
          Already a member?... <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
