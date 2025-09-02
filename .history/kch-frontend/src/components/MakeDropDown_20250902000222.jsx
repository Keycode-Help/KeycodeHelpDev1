import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getVehicleLogo } from "../utils/vehicleLogos";

const MakeDropDown = ({ selectedMake, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (make) => {
    onChange({ target: { value: make } });
    setIsOpen(false);
  };

  const selectedMakeData = options.find(option => option === selectedMake);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {selectedMake && (
            <img
              src={getVehicleLogo(selectedMake)}
              alt={selectedMake}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <span className={selectedMake ? "text-white" : "text-gray-400"}>
            {selectedMake || "Select Make"}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          <div className="p-2">
            {options.map((make) => (
              <button
                key={make}
                onClick={() => handleSelect(make)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
              >
                <img
                  src={getVehicleLogo(make)}
                  alt={make}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span>{make}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeDropDown;
