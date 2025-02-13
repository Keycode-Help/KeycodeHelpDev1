import React, { useState, useEffect } from 'react';
import { Icon } from "../IconProvider";

const VehicleTracker = () => {
  const [selectedRequest, setSelectedRequest] = useState('');
  const [vehicleRequests, setVehicleRequests] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Simulated API data - replace with actual API call
    const mockData = [
      { id: 1, vehicleInfo: '2019 Toyota Camry', status: 'pending' },
      { id: 2, vehicleInfo: '2020 Honda Civic', status: 'in progress' },
      { id: 3, vehicleInfo: '2018 Ford F-150', status: 'complete' },
    ];
    setVehicleRequests(mockData);
  }, []);

  const handleRequestChange = (event) => {
    const request = vehicleRequests.find(req => req.id === event.target.value);
    setSelectedRequest(event.target.value);
    if (request) {
      const status = request.status.toLowerCase();
      if (status === 'pending') setActiveStep(0);
      else if (status === 'in progress') setActiveStep(1);
      else if (status === 'complete' || status === 'fulfilled') setActiveStep(2);
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Selector */}
      <div className="space-y-2">
        <label className="text-white/80">Select Vehicle Request</label>
        <select
          value={selectedRequest}
          onChange={handleRequestChange}
          className="w-full bg-slate/50 border border-slate rounded-md px-4 py-2
                    focus:outline-none focus:border-primary"
        >
          <option value="">Select a request</option>
          {vehicleRequests.map((request) => (
            <option key={request.id} value={request.id}>
              {request.vehicleInfo}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        {['Pending', 'In Progress', 'Complete'].map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${index <= activeStep ? 'bg-primary text-white' : 'bg-slate text-white/50'}
              ${index < activeStep ? 'bg-success' : ''}
            `}>
              <Icon 
                name={index === 0 ? 'clock' : index === 1 ? 'refresh' : 'checkCircle'} 
                size={16} 
              />
            </div>
            <div className={`
              mt-2 text-sm
              ${index <= activeStep ? 'text-white' : 'text-white/50'}
            `}>
              {step}
            </div>
            {index < 2 && (
              <div className={`
                h-0.5 w-full mt-4
                ${index < activeStep ? 'bg-success' : 'bg-slate'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Current Status */}
      {selectedRequest && (
        <div className="text-center text-white/70 mt-4">
          Current Status: {vehicleRequests.find(req => req.id === selectedRequest)?.status}
        </div>
      )}
    </div>
  );
};

export default VehicleTracker; 