import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/request";
import StatesDropDown from "../components/StatesDropDown";
import states from "../data/states";
import { ModalContent } from "../components/ModalContent";
import { useAuth } from "../context/AuthContext";
import ComplianceBanner from "../components/ComplianceBanner";
import { Icon } from "../components/IconProvider";

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

      const response = await api.get(`/auth/getUserProfile/${userId}`);
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

      await api.put("/auth/updateProfile", updateUserObject, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <Icon name="user" size={32} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              Update Profile
            </h1>
            <p className="text-gray-300">Manage your account information</p>
          </div>

          <ComplianceBanner className="mb-6" />

          {/* Delete Profile Button */}
          <div className="mb-6 text-center">
            <button
              onClick={() => handleDelete()}
              className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Icon name="trash2" size={16} />
              Delete Profile
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                State
              </label>
              <StatesDropDown
                selectedState={formData.state}
                options={states}
                onChange={handleStateChange}
              />
            </div>

            {/* Document Uploads */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
                Document Management
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-white">
                      Front ID
                    </label>
                    {!formData.frontId && formData.frontIdImage && (
                      <button
                        type="button"
                        onClick={() => openModal(formData.frontIdImage)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                      >
                        <Icon name="eye" size={14} />
                        View Current
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    name="frontId"
                    ref={frontIdRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleFrontIdReset}
                      className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      Reset
                    </button>
                  </div>
                  {errors.frontId && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                      <Icon name="alertCircle" size={16} />
                      {errors.frontId}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-white">
                      Back ID
                    </label>
                    {!formData.backId && formData.backIdImage && (
                      <button
                        type="button"
                        onClick={() => openModal(formData.backIdImage)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                      >
                        <Icon name="eye" size={14} />
                        View Current
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    name="backId"
                    ref={backIdRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleBackIdReset}
                      className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      Reset
                    </button>
                  </div>
                  {errors.backId && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                      <Icon name="alertCircle" size={16} />
                      {errors.backId}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-white">
                      Insurance Document
                    </label>
                    {!formData.insurance && formData.insuranceImage && (
                      <button
                        type="button"
                        onClick={() => openModal(formData.insuranceImage)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                      >
                        <Icon name="eye" size={14} />
                        View Current
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    name="insurance"
                    ref={insuranceRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleInsuranceReset}
                      className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      Reset
                    </button>
                  </div>
                  {errors.insurance && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                      <Icon name="alertCircle" size={16} />
                      {errors.insurance}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icon name="save" size={18} />
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {modalImage && (
        <ModalContent modalImage={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
};

export default UpdateUserProfile;
