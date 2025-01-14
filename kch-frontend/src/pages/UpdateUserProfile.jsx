import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/updateProfile.css";
import axios from "axios";

const UpdateUserProfile = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    frontId: null,
    backId: null,
    insurance: null,
    frontIdImage: null,
    backIdImage: null,
    insuranceImage: null,
  });

  const [errors, setErrors] = useState({});
  const [modalImage, setModalImage] = useState(null);
  const frontIdRef = useRef(null);
  const backIdRef = useRef(null);
  const insuranceRef = useRef(null);
  const navigate = useNavigate();
  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    // File validation: Check type and size
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

    // Clear any existing errors for this field
    setErrors((prev) => ({ ...prev, [name]: null }));

    setFormData({
      ...formData,
      [name]: file,
    });
  };

  // Reset front ID file
  const handleFrontIdReset = () => {
    frontIdRef.current.value = "";
    setFormData((prev) => ({
      ...prev,
      frontId: null,
    }));
  };

  // Reset back ID file
  const handleBackIdReset = () => {
    backIdRef.current.value = "";
    setFormData((prev) => ({
      ...prev,
      backId: null,
    }));
  };

  // Reset insurance document file
  const handleInsuranceReset = () => {
    insuranceRef.current.value = "";
    setFormData((prev) => ({
      ...prev,
      insurance: null,
    }));
  };

  // Load user profile data
  const fetchUserProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) {
        alert("User not found. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/auth/getUserProfile/${userId}`
      );
      const userData = response.data;

      setFormData({
        fname: userData.fname || "",
        lname: userData.lname || "",
        phone: userData.phone || "",
        frontIdImage: userData.frontIdImage || null,
        backIdImage: userData.backIdImage || null,
        insuranceImage: userData.insuranceImage || null,
      });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      alert(
        error.response?.data || "Failed to load user profile. Please try again."
      );
    }
  };

  // Open modal for image preview
  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  // Close modal
  const closeModal = () => {
    setModalImage(null);
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updateUserObject = new FormData();
      updateUserObject.append("fname", formData.fname);
      updateUserObject.append("lname", formData.lname);
      updateUserObject.append("phone", formData.phone);
      updateUserObject.append("frontId", formData.frontId);
      updateUserObject.append("backId", formData.backId);
      updateUserObject.append("insurance", formData.insurance);

      await axios.put(
        "http://localhost:8080/auth/updateProfile",
        updateUserObject,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("User details updated successfully.");
      navigate("/");
    } catch (error) {
      console.error("Update user profile failed:", error);
      alert(
        error.response?.data || "Update user profile failed. Please try again."
      );
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="container-register">
      <div className="form-section">
        <h1>Profile</h1>
        <form onSubmit={handleUpdate}>
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
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <label>
            Front ID:
            {!formData.frontId && (
              <label
                className="view-style"
                style={{ cursor: "pointer", marginLeft: "23em" }}
                onClick={() => {
                  openModal(formData.frontIdImage);
                }}
              >
                View
              </label>
            )}
            <input
              type="file"
              name="frontId"
              ref={frontIdRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <button type="button" onClick={handleFrontIdReset}>
              Reset
            </button>
            {errors.frontId && (
              <p className="error-message">{errors.frontId}</p>
            )}
          </label>
          <label>
            Back ID:
            {!formData.backId && (
              <label
                className="view-style"
                style={{ cursor: "pointer", marginLeft: "23em" }}
                onClick={() => {
                  openModal(formData.backIdImage);
                }}
              >
                View
              </label>
            )}
            <input
              type="file"
              name="backId"
              ref={backIdRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <button type="button" onClick={handleBackIdReset}>
              Reset
            </button>
            {errors.backId && <p className="error-message">{errors.backId}</p>}
          </label>
          <label>
            Insurance Document:
            {!formData.insurance && (
              <label
                className="view-style"
                style={{ cursor: "pointer", marginLeft: "17em" }}
                onClick={() => {
                  openModal(formData.insuranceImage);
                }}
              >
                View
              </label>
            )}
            <input
              type="file"
              name="insurance"
              ref={insuranceRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <button type="button" onClick={handleInsuranceReset}>
              Reset
            </button>
            {errors.insurance && (
              <p className="error-message">{errors.insurance}</p>
            )}
          </label>
          <button type="submit" className="book-btn">
            Update Profile
          </button>
        </form>
      </div>

      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <img src={modalImage} alt="Enlarged View" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUserProfile;
