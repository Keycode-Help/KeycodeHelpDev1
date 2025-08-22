import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/updateProfile.css";
import api from "../services/request";
import StatesDropDown from "../components/StatesDropDown";
import states from "../data/states";
import { ModalContent } from "../components/ModalContent";
import { useAuth } from "../context/AuthContext";
import ComplianceBanner from "../components/ComplianceBanner";

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
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [modalImage, setModalImage] = useState(null);
  const frontIdRef = useRef(null);
  const backIdRef = useRef(null);
  const insuranceRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const handleStateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      state: e.target.value,
    }));
  };

  const handleFrontIdReset = () => {
    frontIdRef.current.value = "";
    setFormData((prev) => ({
      ...prev,
      frontId: null,
    }));
  };

  const handleBackIdReset = () => {
    backIdRef.current.value = "";
    setFormData((prev) => ({
      ...prev,
      backId: null,
    }));
  };

  const handleInsuranceReset = () => {
    insuranceRef.current.value = "";
    setFormData((prev) => ({
      ...prev,
      insurance: null,
    }));
  };

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
        `/auth/getUserProfile/${userId}`
      );
      const userData = response.data;

      setFormData({
        fname: userData.fname || "",
        lname: userData.lname || "",
        phone: userData.phone || "",
        frontIdImage: userData.frontIdImage || null,
        backIdImage: userData.backIdImage || null,
        insuranceImage: userData.insuranceImage || null,
        state: userData.state || "",
      });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      alert(
        error.response?.data || "Failed to load user profile. Please try again."
      );
    }
  };

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updateUserObject = new FormData();
      updateUserObject.append("fname", formData.fname);
      updateUserObject.append("lname", formData.lname);
      updateUserObject.append("phone", formData.phone);
      updateUserObject.append("state", formData.state);
      updateUserObject.append("frontId", formData.frontId);
      updateUserObject.append("backId", formData.backId);
      updateUserObject.append("insurance", formData.insurance);

      await axios.put(
        "/auth/updateProfile",
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

  const handleDelete = async () => {
    //alert("Delete Profile clicked");
    try {
              await api.put("/keycode-user/delete");
      alert("User Profile deleted successfully.");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Delete user profile failed:", error);
      alert(
        error.response?.data || "Delete user profile failed. Please try again."
      );
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="container-register">
      <div className="form-section">
        <h1>Update Profile</h1>
        <ComplianceBanner className="mt-2 mb-3" />
        <a onClick={() => handleDelete()}>Delete Profile</a>
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
            State:
            <StatesDropDown
              selectedState={formData.state}
              options={states}
              onChange={handleStateChange}
            />
          </label>
          <label>
            Front ID:
            {!formData.frontId && (
              <label
                className="view-style"
                style={{ cursor: "pointer", marginLeft: "23em" }}
                onClick={() => openModal(formData.frontIdImage)}
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
                onClick={() => openModal(formData.backIdImage)}
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
                onClick={() => openModal(formData.insuranceImage)}
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
        <ModalContent modalImage={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
};

export default UpdateUserProfile;
