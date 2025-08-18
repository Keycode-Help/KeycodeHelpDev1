import React from "react";

const ModelDropDown = ({ selectedModel, options, onChange, disabled = false }) => {
  return (
    <select 
      value={selectedModel} 
      onChange={onChange} 
      required 
      disabled={disabled}
      className="form-select"
    >
      <option key="-1" value="">
        Select Model
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default ModelDropDown;
