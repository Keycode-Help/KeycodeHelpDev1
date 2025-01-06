import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "../components/IconProvider";

export default function VehicleUpdate() {
  const { userId, vehicleId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    vin: "",
    make: "",
    model: "",
    year: "",
    notes: "",
    status: "pending",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your API call here
    console.log("Updating vehicle:", formData);
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
          <h1 className="text-4xl font-bold mb-4">Update Vehicle Request</h1>
          <p className="text-white/70">
            Update the vehicle information and request status
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bento-container">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Information */}
            <div className="bento-item">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="car" size={24} className="text-primary" />
                Vehicle Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/80">VIN Number</label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                                                 focus:outline-none focus:border-primary"
                    placeholder="Enter 17-digit VIN"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/80">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                                                 focus:outline-none focus:border-primary"
                    placeholder="Vehicle make"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/80">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                                                 focus:outline-none focus:border-primary"
                    placeholder="Vehicle model"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/80">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                                                 focus:outline-none focus:border-primary"
                    placeholder="Vehicle year"
                  />
                </div>
              </div>
            </div>

            {/* Request Status */}
            <div className="bento-item">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Icon name="clipboardList" size={24} className="text-success" />
                Request Status
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white/80">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                                                 focus:outline-none focus:border-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-white/80">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                                                 focus:outline-none focus:border-primary"
                    placeholder="Add any additional notes or comments"
                  />
                </div>
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
