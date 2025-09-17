import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const YearDropDown = ({
  selectedYear,
  options,
  onChange,
  disabled = false,
}) => {
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

  const handleSelect = (year) => {
    onChange({ target: { value: year } });
    setIsOpen(false);
  };

  if (disabled) {
    return (
      <div className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-gray-400 opacity-50 cursor-not-allowed flex items-center justify-between">
        <span>Select Year</span>
        <ChevronDown className="w-5 h-5 text-gray-600" />
      </div>
    );
  }

  // Sort years in descending order (newest first)
  const sortedOptions = [...options].sort((a, b) => b - a);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
      >
        <span className={selectedYear ? "text-white" : "text-gray-400"}>
          {selectedYear || "Select Year"}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-[9999] w-full mt-2 bg-slate-900 border border-slate-400 rounded-xl shadow-2xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <div className="p-1">
            {sortedOptions.length === 0 ? (
              <div className="px-2 py-2 text-slate-400 text-sm">
                No years available
              </div>
            ) : (
              sortedOptions.map((year) => (
                <button
                  key={year}
                  onClick={() => handleSelect(year)}
                  className="w-full flex items-center px-2 py-2 text-left text-white hover:bg-slate-700/80 rounded-lg transition-colors duration-200 focus:outline-none focus:bg-slate-700/80 text-sm"
                >
                  <span className="truncate">{year}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearDropDown;
