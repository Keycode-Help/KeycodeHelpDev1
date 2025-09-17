import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ModelDropDown = ({
  selectedModel,
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

  const handleSelect = (model) => {
    onChange({ target: { value: model } });
    setIsOpen(false);
  };

  if (disabled) {
    return (
      <div className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-gray-400 opacity-50 cursor-not-allowed flex items-center justify-between">
        <span>Select Model</span>
        <ChevronDown className="w-5 h-5 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
      >
        <span className={selectedModel ? "text-white" : "text-gray-400"}>
          {selectedModel || "Select Model"}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="py-1">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No models available
              </div>
            ) : (
              options.map((model) => (
                <button
                  key={model}
                  onClick={() => handleSelect(model)}
                  className="w-full flex items-center px-3 py-2 text-left text-gray-900 hover:bg-blue-50 focus:outline-none focus:bg-blue-50"
                >
                  <span className="truncate">{model}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelDropDown;
