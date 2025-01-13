import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/userProfile.css";

function UserProfile() {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    frontId: null,
    backId: null,
    insurance: null,
  });

  useEffect(() => {
    // Fetch the user's current profile data
    axios
      .get("http://localhost:8080/keycode-user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { fname, lname, phone } = response.data;
        setFormData({ ...formData, fname, lname, phone });
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("fname", formData.fname);
    formDataObj.append("lname", formData.lname);
    formDataObj.append("phone", formData.phone);
    if (formData.frontId) formDataObj.append("frontId", formData.frontId);
    if (formData.backId) formDataObj.append("backId", formData.backId);
    if (formData.insurance) formDataObj.append("insurance", formData.insurance);

    axios
      .put("http://localhost:8080/keycode-user/profile", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      });
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <label>First Name</label>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleInputChange}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleInputChange}
            required
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          <label>Front ID</label>
          <input
            type="file"
            name="frontId"
            onChange={handleFileChange}
            accept="image/*"
          />

          <label>Back ID</label>
          <input
            type="file"
            name="backId"
            onChange={handleFileChange}
            accept="image/*"
          />

          <label>Insurance</label>
          <input
            type="file"
            name="insurance"
            onChange={handleFileChange}
            accept="image/*"
          />

          <button type="submit" className="profile-submit-button">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
