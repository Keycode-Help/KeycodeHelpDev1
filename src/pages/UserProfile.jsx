import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "../components/IconProvider";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    licenseNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    documents: {
      businessLicense: null,
      governmentId: null,
      certifications: [],
    },
    notifications: {
      email: true,
      sms: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (name === "certifications") {
        setFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [name]: [...prev.documents.certifications, ...files],
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [name]: files[0],
          },
        }));
      }
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updating user profile:", formData);
  };

  const removeFile = (docType, index = null) => {
    if (index !== null) {
      // Remove certification at index
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          certifications: prev.documents.certifications.filter(
            (_, i) => i !== index
          ),
        },
      }));
    } else {
      // Remove single document
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: null,
        },
      }));
    }
  };

  return (
    <div className="bg-dark text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-4"
          >
            <Icon name="chevronLeft" size={20} />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-4">Professional Profile</h1>
          <p className="text-white/70">
            Verify your credentials for VIN-to-KeyCode services
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bento-container">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Professional Information */}
            <div className="bento-item">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="userCheck" size={24} className="text-primary" />
                Professional Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/80">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                             focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/80">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                             focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/80">Business Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                             focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/80">
                    Professional License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                             focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Verification Address */}
            <div className="bento-item">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="mapPin" size={24} className="text-primary" />
                Business Address Verification
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white/80">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address?.street || ""}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                             focus:outline-none focus:border-primary"
                    placeholder="Enter your business street address"
                  />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-white/80">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address?.city || ""}
                      onChange={handleChange}
                      className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                               focus:outline-none focus:border-primary"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80">State/Province</label>
                    <select
                      name="address.state"
                      value={formData.address?.state || ""}
                      onChange={handleChange}
                      className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                               focus:outline-none focus:border-primary"
                    >
                      <option value="">Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      {/* Add all US states */}
                      <option value="AB">Alberta</option>
                      <option value="BC">British Columbia</option>
                      {/* Add all Canadian provinces */}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address?.zipCode || ""}
                      onChange={handleChange}
                      className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                               focus:outline-none focus:border-primary"
                      placeholder="ZIP/Postal Code"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80">Country</label>
                    <select
                      name="address.country"
                      value={formData.address?.country || ""}
                      onChange={handleChange}
                      className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                               focus:outline-none focus:border-primary"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="bento-item">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="fileText" size={24} className="text-success" />
                Document Verification
              </h2>
              <div className="space-y-6">
                {/* Business License Upload */}
                <div className="space-y-2">
                  <label className="text-white/80">Business License</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      name="businessLicense"
                      onChange={handleChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="businessLicense"
                    />
                    <label
                      htmlFor="businessLicense"
                      className="btn-primary bg-slate hover:bg-slate-light cursor-pointer"
                    >
                      <Icon name="upload" size={20} className="mr-2" />
                      Upload License
                    </label>
                    {formData.documents.businessLicense && (
                      <div className="flex items-center gap-2 text-success">
                        <Icon name="checkCircle" size={20} />
                        <span>{formData.documents.businessLicense.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile("businessLicense")}
                          className="text-white/60 hover:text-white"
                        >
                          <Icon name="x" size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Government ID Upload */}
                <div className="space-y-2">
                  <label className="text-white/80">Government ID</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      name="governmentId"
                      onChange={handleChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="governmentId"
                    />
                    <label
                      htmlFor="governmentId"
                      className="btn-primary bg-slate hover:bg-slate-light cursor-pointer"
                    >
                      <Icon name="upload" size={20} className="mr-2" />
                      Upload ID
                    </label>
                    {formData.documents.governmentId && (
                      <div className="flex items-center gap-2 text-success">
                        <Icon name="checkCircle" size={20} />
                        <span>{formData.documents.governmentId.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile("governmentId")}
                          className="text-white/60 hover:text-white"
                        >
                          <Icon name="x" size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Certifications */}
                <div className="space-y-2">
                  <label className="text-white/80">
                    Additional Certifications
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      name="certifications"
                      onChange={handleChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      className="hidden"
                      id="certifications"
                    />
                    <label
                      htmlFor="certifications"
                      className="btn-primary bg-slate hover:bg-slate-light cursor-pointer"
                    >
                      <Icon name="upload" size={20} className="mr-2" />
                      Upload Certifications
                    </label>
                  </div>
                  {formData.documents.certifications.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.documents.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-success"
                        >
                          <Icon name="checkCircle" size={20} />
                          <span>{cert.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile("certifications", index)}
                            className="text-white/60 hover:text-white"
                          >
                            <Icon name="x" size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Preferences */}
            <div className="bento-item">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="bell" size={24} className="text-cta" />
                Contact Preferences
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/80">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                             focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/80">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                             focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.email"
                    checked={formData.notifications.email}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate
                             checked:bg-primary focus:ring-primary"
                  />
                  <span className="text-white/80">
                    Receive email notifications
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.sms"
                    checked={formData.notifications.sms}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate
                             checked:bg-primary focus:ring-primary"
                  />
                  <span className="text-white/80">
                    Receive SMS notifications
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-primary bg-slate hover:bg-slate-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Icon name="save" size={20} />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
