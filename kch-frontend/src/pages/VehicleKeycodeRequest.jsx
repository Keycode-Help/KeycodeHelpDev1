import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/vehicleKeycodeRequest.css";
import MakeDropDown from "../components/MakeDropDown";

function VehicleKeycodeRequest() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    vin: "",
    frontId: null,
    backId: null,
    registration: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { token } = useAuth();
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedMakePrice, setSelectedMakePrice] = useState(0.0);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

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

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        [name]: "File size should not exceed 5MB.",
      }));
      return;
    }

    // If validation passes, clear any existing errors for this field
    setErrors((prev) => ({ ...prev, [name]: null }));

    setFormData({
      ...formData,
      [name]: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("make", selectedMake);
    formDataObj.append("price", selectedMakePrice);
    formDataObj.append("model", formData.model);
    formDataObj.append("vin", formData.vin);
    formDataObj.append("frontId", formData.frontId);
    formDataObj.append("backId", formData.backId);
    formDataObj.append("registration", formData.registration);

    axios
      .post("http://localhost:8080/vehicle/request-keycode", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate("/cart");
      })
      .catch((error) => {
        console.error("Error requesting keycode:", error);
        alert(
          error.response?.data || "Failed to request keycode. Please try again."
        );
      });
  };

  const setMakePrice = (selectedMakeValue) => {
    console.log("Make ", selectedMakeValue); 
    console.log(makes);
    const selectedMakeItem = makes.find(make => (make.manufacturerName === selectedMakeValue));
    if(selectedMakeItem){
      setSelectedMakePrice(selectedMakeItem.keyCodePrice);
    }else{
      setSelectedMakePrice(0);
    }
    console.log(selectedMakeItem);
  }
  useEffect(() => {
    axios
    .get("http://localhost:8080/makes/getMakes")
    .then((response) => {
      setMakes(response.data);
    })
    .catch((error) => {
      console.error("Error fetching make:", error);
    });
  },[]);

  return (
    <div className="wrapper-vr">
      <div className="keycode-request-container">
        <h1>Request a Keycode for Your Vehicle</h1>
        <form onSubmit={handleSubmit} className="keycode-form">
          <div>
            {/* <label htmlFor="make">Vehicle Make</label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="Enter Vehicle Make"
              required
            /> */}
            <label>
            Make
            <MakeDropDown
              selectedMake={selectedMake}
              options={makes}
              onChange={(e) => {
                console.log(e.target.value);
                setSelectedMake(e.target.value);
                setMakePrice(e.target.value);
              }
            }
            />
          </label>
          </div>
          <div className="form-group">
            <label htmlFor="model">Price</label>
            <input
              type="text"
              id="model"
              name="model"
              value={selectedMakePrice}
            />
          </div>
          <div className="form-group">
            <label htmlFor="model">Vehicle Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Enter Vehicle Model"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="vin">Vehicle VIN</label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              placeholder="Enter Vehicle VIN"
              required
            />
          </div>
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
            Upload Registration:
            <input
              type="file"
              name="registration"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            {errors.registration && (
              <p className="error-message">{errors.registration}</p>
            )}
          </label>
          <button type="submit" className="submit-button">
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  );
}

export default VehicleKeycodeRequest;
