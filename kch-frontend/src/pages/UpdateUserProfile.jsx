import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/updateProfile.css";
import axios from "axios";

function UpdateUserProfile(){

      const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        phone: "",
        frontId: null,
        backId: null,
        insurance: null,
        frontIdImage:null,
        backIdImage:null,
        insuranceImage:null,
      });
    
      const [errors, setErrors] = useState({});
      const [modalImage, setModalImage] = useState(null);
      const frontIdRef = useRef(null);
      const backIdRef = useRef(null);
      const insuranceRef = useRef(null);
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
        
        // File validation: Check type and size
        const file = files[0];

        if (!file.type.startsWith("image/")) {
          setErrors((prev) => ({
            ...prev,
            [name]: "Only image files are allowed.",
          }));
          return;
        }
    
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          setErrors((prev) => ({
            ...prev,
            [name]: "File size should not exceed 5MB.",
          }));
          return;
        }
    
        // If validation passes, clear any existing errors for this field
        setErrors((prev) => ({ ...prev, [name]: null }));
    
        if(name === 'frontId'){
            setFormData({
                ...formData,
                ['frontIdFileName']:'',
            })
        }

        if(name === 'backId'){
            setFormData({
                ...formData,
                ['backIdFileName']:'',
            })
        }

        if(name === 'insurance'){
            setFormData({
                ...formData,
                ['insuranceFileName']:'',
            })
        }
       
        setFormData({
          ...formData,
          [name]: file,
        });

        
      };

      const handleFrontIdReset = () => {
        frontIdRef.current.value='';
        setFormData({
            ...formData,
            ['frontId']:null,
        })
      }
      const handleBackIdReset = () => {
        backIdRef.current.value='';
        setFormData({
            ...formData,
            ['backId']:null,
        })
      }
      const handleInsuranceReset = () => {
        insuranceRef.current.value='';
        setFormData({
            ...formData,
            ['insurance']:null,
        })
      }
      //load the user profile data
      const fetchUserProfile = async() => {

        //Get the user id
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;
        
        //Get User Profile Details
        axios.get(`http://localhost:8080/auth/getUserProfile/${userId}`)
        .then((response) => {
          const userData = response.data;
          const fname = userData.fname;
          const lname = userData.lname;
          const phone = userData.phone;
          const frontIdFileName = userData.frontIdFileName;
          const backIdFileName = userData.backIdFileName;
          const insuranceFileName = userData.insuranceFileName;
          const frontIdImage = userData.frontIdImage;
          const backIdImage = userData.backIdImage;
          const insuranceImage = userData.insuranceImage;
          setFormData({
            fname : fname || '',
            lname : lname || '',
            phone : phone || '',
            frontIdFileName : frontIdFileName || '',
            backIdFileName : backIdFileName || '',
            insuranceFileName : insuranceFileName || '',
            frontIdImage : frontIdImage,
            backIdImage : backIdImage,
            insuranceImage : insuranceImage,
          })
        })
        .catch((error) => {
            console.error("Failed to Load User Profile", error);
            alert(error.response?.data || "Failed to Load User Profile. Please try again.");
          });
      }

      const openModal = (imageSrc) => {
        //alert(imageSrc);
        setModalImage(imageSrc);
      };
    
      const closeModal = () => {
        setModalImage(null);
      };

      const handleUpdate = (e) => {
        e.preventDefault();

        const updateUserObject = new FormData();
        updateUserObject.append("fname", formData.fname);
        updateUserObject.append("lname", formData.lname);
        updateUserObject.append("phone", formData.phone);
        updateUserObject.append("frontId", formData.frontId);
        updateUserObject.append("backId", formData.backId);
        updateUserObject.append("insurance", formData.insurance);

         // Convert FormData to a plain object
        //const formDataEntries = Object.fromEntries(updateUserObject.entries());

        // Alert the form data
        //alert(JSON.stringify(formDataEntries));

        axios
      .put("http://localhost:8080/auth/updateProfile", updateUserObject, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
       alert("User Details Updated Sussessfully");
       navigate("/");
      })
      .catch((error) => {
        console.error("Update User Profile failed", error);
        alert(error.response?.data || "Update User Profile failed. Please try again.");
      });
      }
      useEffect(() => {
        fetchUserProfile();
      },[])

    return(<div className="container-register">
        <div className="form-section">
          <h1 style={{marginTop:'1px'}}>Profile</h1>
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
              <label onClick={() => openModal(formData.frontIdImage)}>{!formData.frontId && <p>{formData.frontIdFileName}</p>}</label>
              <input
                type="file"
                name="frontId"
                ref={frontIdRef}
                onChange={handleFileChange}
                accept="image/*"
              />
              <button className="remove-button" type="button" onClick={() => handleFrontIdReset()}>Reset</button>
              {errors.frontId && (
                <p className="error-message">{errors.frontId}</p>
              )}
            </label>
            <label>
              Back ID:
              <label onClick={() => openModal(formData.backIdImage)}>{!formData.backId && <p>{formData.backIdFileName}</p>}</label>
              <input
                type="file"
                name="backId"
                ref={backIdRef}
                onChange={handleFileChange}
                accept="image/*"
              />
              <button className="remove-button" type="button" onClick={() => handleBackIdReset()}>Reset</button>
              {errors.backId && <p className="error-message">{errors.backId}</p>}
            </label>
            <label>
              Insurance Document:
              <label onClick={() => openModal(formData.insuranceImage)}>{!formData.insurance && <p>{formData.insuranceFileName}</p>}</label>
              <input
                type="file"
                name="insurance"
                ref={insuranceRef}
                onChange={handleFileChange}
                accept="image/*"
              />
               <button className="remove-button" type="button" onClick={() => handleInsuranceReset()}>Reset</button>
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

      </div>)
};

export default UpdateUserProfile;