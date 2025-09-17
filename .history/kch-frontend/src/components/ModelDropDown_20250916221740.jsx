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
        <div className="absolute z-[9999] w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <div className="p-2">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-slate-400 text-sm">No models available</div>
            ) : (
              options.map((model) => (
                <button
                  key={model}
                  onClick={() => handleSelect(model)}
                  className="w-full flex items-center px-3 py-2 text-left text-white hover:bg-slate-700 rounded-lg transition-colors duration-200 focus:outline-none focus:bg-slate-700"
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
