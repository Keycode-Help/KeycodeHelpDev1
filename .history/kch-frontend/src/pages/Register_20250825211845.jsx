import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/request";
import "../styles/register.css";
import StatesDropDown from "../components/StatesDropDown";
import states from "../data/states";

function Register() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    frontId: null,
    backId: null,
    businessDocument: null,
    coi: null,
  });

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

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
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

    api
      .post("/auth/register", formDataObj, {
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
    <div className="container-register">
      <div className="form-section">
        <h1 className="form-h1">Sign Up For An Account</h1>
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
            placeholder="Phone Number"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <label>
            State:
            <StatesDropDown
              selectedState={selectedState}
              options={states}
              onChange={(e) => setSelectedState(e.target.value)}
            />
          </label>
          <label>
            Upload Front ID:
            <input
              type="file"
              name="frontId"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            {errors.frontId && (
              <p className="error-message">{errors.frontId}</p>
            )}
          </label>
          <label>
            Upload Back ID:
            <input
              type="file"
              name="backId"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            {errors.backId && <p className="error-message">{errors.backId}</p>}
          </label>
          <label>
            Upload Documentation (e.g., registration or insurance):
            <input
              type="file"
              name="insurance"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            {errors.insurance && (
              <p className="error-message">{errors.insurance}</p>
            )}
          </label>
          <button type="submit" className="book-btn">
            Register
          </button>
        </form>
        <p>
          Already a member? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
