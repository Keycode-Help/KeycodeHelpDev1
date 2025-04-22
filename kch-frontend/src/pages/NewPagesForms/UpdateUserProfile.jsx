import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import states from "../../data/states.js";
import { ModalContent } from "../../components/ModalContent.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import InputTextBox from "./components/KeycodeRequest/InputTextBox.jsx";
import StatesDropDownProfile from "../NewPagesForms/components/UpdateProfile/StatesDropDownProfile.jsx";
import {ArrowRight, ChevronDown, Trash2} from "lucide-react";
import UploadFileUpdateForm from "./components/UpdateProfile/UploadFileUpdateForm.jsx";

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
  const {logout} = useAuth();

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
        `http://localhost:8080/auth/getUserProfile/${userId}`
      );
      const userData = response.data;

      if(userData) {
        setDisplayInitials(userData.fname[0] + userData.lname[0]);
      }

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

  const handleDelete = async() => {
    //alert("Delete Profile clicked");
    try{
      await axios.put("http://localhost:8080/keycode-user/delete");
      alert("User Profile deleted successfully.");
      logout();
      navigate("/login")      
    }catch(error){
      console.error("Delete user profile failed:", error);
      alert(
        error.response?.data || "Delete user profile failed. Please try again."
      );
    }
  }
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Frontend Utilities
  const [statesMenuOpen, setStatesMenuOpen] = useState(false);
  const [displayInitials, setDisplayInitials] = useState("");

  return (
    // <div className="container-register">
    //   <div className="form-section">
    //     <h1>Update Profile</h1>
    //     <a onClick={() => handleDelete()}>Delete Profile</a>
    //     <form onSubmit={handleUpdate}>
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
    //         type="tel"
    //         name="phone"
    //         value={formData.phone}
    //         onChange={handleChange}
    //         placeholder="Phone Number"
    //       />
    //       <label>
    //         State:
    //         <StatesDropDown
    //           selectedState={formData.state}
    //           options={states}
    //           onChange={handleStateChange}
    //         />
    //       </label>
    //       <label>
    //         Front ID:
    //         {!formData.frontId && (
    //           <label
    //             className="view-style"
    //             style={{ cursor: "pointer", marginLeft: "23em" }}
    //             onClick={() => openModal(formData.frontIdImage)}
    //           >
    //             View
    //           </label>
    //         )}
    //         <input
    //           type="file"
    //           name="frontId"
    //           ref={frontIdRef}
    //           onChange={handleFileChange}
    //           accept="image/*"
    //         />
    //         <button type="button" onClick={handleFrontIdReset}>
    //           Reset
    //         </button>
    //         {errors.frontId && (
    //           <p className="error-message">{errors.frontId}</p>
    //         )}
    //       </label>
    //       <label>
    //         Back ID:
    //         {!formData.backId && (
    //           <label
    //             className="view-style"
    //             style={{ cursor: "pointer", marginLeft: "23em" }}
    //             onClick={() => openModal(formData.backIdImage)}
    //           >
    //             View
    //           </label>
    //         )}
    //         <input
    //           type="file"
    //           name="backId"
    //           ref={backIdRef}
    //           onChange={handleFileChange}
    //           accept="image/*"
    //         />
    //         <button type="button" onClick={handleBackIdReset}>
    //           Reset
    //         </button>
    //         {errors.backId && <p className="error-message">{errors.backId}</p>}
    //       </label>
    //       <label>
    //         Insurance Document:
    //         {!formData.insurance && (
    //           <label
    //             className="view-style"
    //             style={{ cursor: "pointer", marginLeft: "17em" }}
    //             onClick={() => openModal(formData.insuranceImage)}
    //           >
    //             View
    //           </label>
    //         )}
    //         <input
    //           type="file"
    //           name="insurance"
    //           ref={insuranceRef}
    //           onChange={handleFileChange}
    //           accept="image/*"
    //         />
    //         <button type="button" onClick={handleInsuranceReset}>
    //           Reset
    //         </button>
    //         {errors.insurance && (
    //           <p className="error-message">{errors.insurance}</p>
    //         )}
    //       </label>
    //       <button type="submit" className="book-btn">
    //         Update Profile
    //       </button>
    //     </form>
    //   </div>
    //
    //   {modalImage && (
    //     <ModalContent
    //       modalImage={modalImage}
    //       closeModal={closeModal}
    //     />
    //   )}
    // </div>
    <div className="min-h-screen bg-black px-4 overflow-y-hidden">
      <section className="relative py-12 md:py-24 mb-12">
        <div className="mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            <span className="text-green-400">Profile</span> Manager
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-4">
            Manage your account and update information
          </p>
        </div>

        <div className="mx-auto max-w-xl p-5 md:p-6 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] shadow-lg shadow-[#1A1A1A]">
          {/* Avatar */}
          <div className="flex items-center justify-center mb-6 md:mb-9">
            <div className="size-32 md:size-48 relative overflow-hidden rounded-full bg-[#060606]">
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-green-400 text-5xl md:text-6xl font-bold">
                  {displayInitials}
                </div>
              </div>
            </div>
          </div>
          {/* Update Form */}
          <form className="flex flex-col gap-3 md:gap-4" onSubmit={handleUpdate}>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">First Name</label>
              <InputTextBox
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">Last Name</label>
              <InputTextBox
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-[#111111] border border-[#1A1A1A] rounded-lg p-3 text-white focus:outline-none hover:border-green-500 transition-colors duration-200"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-100 mb-2">State</label>
              <StatesDropDownProfile
                selectedState={formData.state}
                options={states}
                onChange={handleStateChange}
                onClick={() => setStatesMenuOpen(!statesMenuOpen)}
              />
              <div className="absolute inset-y-0 right-0 pr-2 pt-7 flex items-center pointer-events-none">
                <ChevronDown className={`h-5 w-5 md:h-6 md:w-6 text-gray-500 transition-transform duration-150 ${statesMenuOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-100">Front ID</label>
                {!formData.frontId && (
                  <label
                    className="block text-xs text-green-600 hover:text-green-400 cursor-pointer"
                    onClick={() => openModal(formData.frontIdImage)}
                  >
                    View Current
                  </label>
                )}
              </div>
              <UploadFileUpdateForm
                name="frontId"
                fileRef={frontIdRef}
                onChange={handleFileChange}
                accept="image/*"
                value={formData.frontId}
                reset={handleFrontIdReset}
              />
              {errors.frontId && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.frontId}</p>
              )}
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-100">Back ID</label>
                {!formData.backId && (
                  <label
                    className="block text-xs text-green-600 hover:text-green-400 cursor-pointer"
                    onClick={() => openModal(formData.backIdImage)}
                  >
                    View Current
                  </label>
                )}
              </div>
              <UploadFileUpdateForm
                name="backId"
                fileRef={backIdRef}
                onChange={handleFileChange}
                accept="image/*"
                value={formData.backId}
                reset={handleBackIdReset}
              />
              {errors.backId && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.backId}</p>
              )}
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-100">Insurance Document</label>
                {!formData.insurance && (
                  <label
                    className="block text-xs text-green-600 hover:text-green-400 cursor-pointer"
                    onClick={() => openModal(formData.insuranceImage)}
                  >
                    View Current
                  </label>
                )}
              </div>
              <UploadFileUpdateForm
                name="insurance"
                fileRef={insuranceRef}
                onChange={handleFileChange}
                accept="image/*"
                value={formData.insurance}
                reset={handleInsuranceReset}
              />
              {errors.insurance && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.insurance}</p>
              )}
            </div>
            <button type="submit" className="mt-4 group relative w-full p-3 md:p-4 bg-green-600 hover:bg-green-500 text-white
            font-semibold transition-colors duration-200">
              Update Profile
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white inline-block ml-1 group-hover:translate-x-2
              transition-transform" />
            </button>
          </form>

          {/* Delete Account */}
          <button
            className="mt-4 relative w-full p-3 md:p-4 bg-[#0A0A0A] border-2 border-red-600 hover:border-red-400 text-white font-semibold
            hover:bg-[#0A0A0A] transition-colors duration-200 group flex items-center justify-center"
            onClick={handleDelete}
          >
            <span className="text-red-600 group-hover:text-red-400 transition-colors duration-200">Delete Account</span>
            <Trash2 className="h-4 w-4 md:h-5 md:w-5 text-red-600 group-hover:text-red-400 transition-colors duration-200 inline-block ml-1" />
          </button>
        </div>
      </section>

      {modalImage && (
        <ModalContent
          modalImage={modalImage}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default UpdateUserProfile;
